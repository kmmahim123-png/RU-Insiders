import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import os from 'os';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    if (!filename) {
      return new NextResponse('Filename missing', { status: 400 });
    }

    // Sanitize filename to prevent path traversal
    const safeFilename = path.basename(filename);

    // Look in public/uploads first, then data/uploads, then os.tmpdir()/ru_insiders_uploads
    let targetPath = path.join(process.cwd(), 'public', 'uploads', safeFilename);

    if (!fs.existsSync(targetPath)) {
      targetPath = path.join(process.cwd(), 'data', 'uploads', safeFilename);
    }
    if (!fs.existsSync(targetPath)) {
      targetPath = path.join(os.tmpdir(), 'ru_insiders_uploads', safeFilename);
    }

    if (!fs.existsSync(targetPath)) {
      return new NextResponse('File not found', { status: 404 });
    }

    const ext = path.extname(safeFilename).toLowerCase();
    const stat = await fs.promises.stat(targetPath);
    const fileSize = stat.size;

    let contentType = 'application/octet-stream';
    if (ext === '.png') contentType = 'image/png';
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.webp') contentType = 'image/webp';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.pdf') contentType = 'application/pdf';
    else if (ext === '.mp4' || ext === '.m4v') contentType = 'video/mp4';
    else if (ext === '.webm') contentType = 'video/webm';
    else if (ext === '.mov') contentType = 'video/quicktime';

    // HTTP 206 Partial Content / Range Requests for instant Video Streaming
    const range = request.headers.get('range');
    const isVideo = ext === '.mp4' || ext === '.webm' || ext === '.mov' || ext === '.m4v';

    if (isVideo && range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize || end >= fileSize) {
        return new NextResponse(null, {
          status: 416,
          headers: { 'Content-Range': `bytes */${fileSize}` },
        });
      }

      const chunkSize = end - start + 1;
      const fileHandle = await fs.promises.open(targetPath, 'r');
      const buffer = Buffer.alloc(chunkSize);
      await fileHandle.read(buffer, 0, chunkSize, start);
      await fileHandle.close();

      return new Response(buffer, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize.toString(),
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    // Normal full read for images, documents, and non-range requests
    const fullBuffer = await fs.promises.readFile(targetPath);

    return new Response(fullBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': fullBuffer.length.toString(),
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error: any) {
    console.error('Error serving upload file:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
