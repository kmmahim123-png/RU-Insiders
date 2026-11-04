import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const name = searchParams.get('name') || 'ru_insiders_document.pdf';

  if (!id) {
    return NextResponse.json({ success: false, message: 'Missing Job ID' }, { status: 400 });
  }

  // Generate a clean mock PDF byte stream or response for printing
  const samplePdfContent = `%PDF-1.4
1 0 obj
<< /Title (RU Insiders Print Order: ${name}) /Creator (RU Insiders Print Station) >>
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
<< /Length 120 >>
stream
BT
/F1 24 Tf
100 700 Td
(RU INSIDERS PRINT STATION - RAJSHAHI UNIVERSITY) Tj
/F1 14 Tf
100 660 Td
(Document: ${name}) Tj
100 630 Td
(Ready for operator printing desk.) Tj
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
465
%%EOF`;

  return new NextResponse(samplePdfContent, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(name)}"`,
      'Cache-Control': 'no-store',
    },
  });
}
