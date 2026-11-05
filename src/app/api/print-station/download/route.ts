import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { getPrintJobs } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const token = searchParams.get('token');
    const name = searchParams.get('name') || 'ru_insiders_document.pdf';

    if (!id && !token) {
      return NextResponse.json({ success: false, message: 'Missing Job ID or Token' }, { status: 400 });
    }

    const jobs = await getPrintJobs();
    const job = jobs.find((j) => (id && j.id === id) || (token && j.token === token));
    const targetFileName = job?.fileName || name;

    // 1. TIER 1: Base64 Data URL (Universal, works everywhere including serverless & local)
    if (job?.fileDataUrl && job.fileDataUrl.startsWith('data:')) {
      const matches = job.fileDataUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const contentType = matches[1] || 'application/pdf';
        const buffer = Buffer.from(matches[2], 'base64');

        return new Response(buffer, {
          status: 200,
          headers: {
            'Content-Type': contentType,
            'Content-Disposition': `attachment; filename="${encodeURIComponent(targetFileName)}"`,
            'Content-Length': buffer.length.toString(),
            'Cache-Control': 'no-store',
          },
        });
      }
    }

    // 2. TIER 2: Remote Cloud Storage URL (Supabase Storage bucket / CDN)
    if (job?.fileDataUrl && job.fileDataUrl.startsWith('http')) {
      try {
        const remoteRes = await fetch(job.fileDataUrl);
        if (remoteRes.ok) {
          const arrayBuf = await remoteRes.arrayBuffer();
          const buffer = Buffer.from(arrayBuf);
          const contentType = remoteRes.headers.get('content-type') || 'application/pdf';

          return new Response(buffer, {
            status: 200,
            headers: {
              'Content-Type': contentType,
              'Content-Disposition': `attachment; filename="${encodeURIComponent(targetFileName)}"`,
              'Content-Length': buffer.length.toString(),
              'Cache-Control': 'no-store',
            },
          });
        }
      } catch (err) {
        console.error('Failed to proxy remote file from cloud:', err);
      }
    }

    // 3. TIER 3: Local Server Filesystem (/uploads/)
    if (job?.fileDataUrl && job.fileDataUrl.startsWith('/uploads/')) {
      const filename = path.basename(job.fileDataUrl);
      const possiblePaths = [
        path.join(process.cwd(), 'public', 'uploads', filename),
        path.join(process.cwd(), 'data', 'uploads', filename),
        path.join(os.tmpdir(), 'ru_insiders_uploads', filename),
      ];

      for (const filePath of possiblePaths) {
        if (fs.existsSync(filePath)) {
          const fileBuffer = await fs.promises.readFile(filePath);
          const ext = path.extname(filename).toLowerCase();
          let contentType = 'application/pdf';
          if (ext === '.png') contentType = 'image/png';
          else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
          else if (ext === '.webp') contentType = 'image/webp';

          return new Response(fileBuffer, {
            status: 200,
            headers: {
              'Content-Type': contentType,
              'Content-Disposition': `attachment; filename="${encodeURIComponent(targetFileName)}"`,
              'Cache-Control': 'no-store',
              'Content-Length': fileBuffer.length.toString(),
            },
          });
        }
      }
    }

    // 4. Fallback Ticket if no document bytes could be located
    const jobToken = job ? job.token : 'NO-TOKEN';
    const customer = job ? `${job.customerName} (${job.customerPhone})` : 'Walk-in Student';
    const specs = job ? `${job.pageCount} Pages • ${job.copies} Copies • ${job.printType.toUpperCase()} • ${job.paperType}` : 'Standard Print Order';

    const fallbackContent = `%PDF-1.4
1 0 obj
<< /Title (RU Insiders Print Ticket: ${jobToken}) /Creator (RU Insiders Print Station) >>
endobj
2 0 obj
<< /Type /Catalog /Pages 3 0 R >>
endobj
3 0 obj
<< /Type /Pages /Kids [4 0 R] /Count 1 >>
endobj
4 0 obj
<< /Type /Page /Parent 3 0 R /MediaBox [0 0 595 842] /Contents 5 0 R >>
endobj
5 0 obj
<< /Length 260 >>
stream
BT
/F1 20 Tf
50 780 Td
(RU INSIDERS PRINT STATION - DISPATCH TICKET) Tj
/F1 12 Tf
50 740 Td
(Token: ${jobToken} | File: ${targetFileName}) Tj
50 715 Td
(Customer: ${customer}) Tj
50 690 Td
(Print Specifications: ${specs}) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000098 00000 n 
0000000147 00000 n 
0000000206 00000 n 
0000000293 00000 n 
trailer
<< /Size 6 /Root 2 0 R >>
startxref
580
%%EOF`;

    return new NextResponse(fallbackContent, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(targetFileName)}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error: any) {
    console.error('Download print job error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
