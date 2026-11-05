import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Dynamic image server for runtime uploads
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    if (!filename) {
      return new NextResponse('Filename missing', { status: 400 });
    }

    // Sanitize to prevent path traversal
    const safeFilename = path.basename(filename);

    // Look in public/uploads first, then data/uploads, then /tmp/uploads
    let targetPath = path.join(process.cwd(), 'public', 'uploads', safeFilename);

    if (!fs.existsSync(targetPath)) {
      targetPath = path.join(process.cwd(), 'data', 'uploads', safeFilename);
    }
    if (!fs.existsSync(targetPath)) {
      targetPath = path.join('/tmp', 'uploads', safeFilename);
    }

    if (!fs.existsSync(targetPath)) {
      return new NextResponse('File not found', { status: 404 });
    }

    const buffer = fs.readFileSync(targetPath);
    const ext = path.extname(safeFilename).toLowerCase();

    let contentType = 'image/jpeg';
    if (ext === '.png') contentType = 'image/png';
    else if (ext === '.webp') contentType = 'image/webp';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.svg') contentType = 'image/svg+xml';
    else if (ext === '.mp4') contentType = 'video/mp4';
    else if (ext === '.webm') contentType = 'video/webm';
    else if (ext === '.mov') contentType = 'video/quicktime';
    else if (ext === '.pdf') contentType = 'application/pdf';

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error('Error serving upload file:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
