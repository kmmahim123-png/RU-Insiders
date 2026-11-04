import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file provided' }, { status: 400 });
    }

    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json({ success: false, message: 'File size exceeds 15MB limit' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const dataUploadsDir = path.join(process.cwd(), 'data', 'uploads');

    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
    if (!fs.existsSync(dataUploadsDir)) fs.mkdirSync(dataUploadsDir, { recursive: true });

    const originalName = file.name || 'image.png';
    const ext = (path.extname(originalName) || '.png').toLowerCase();
    const baseName = path.basename(originalName, ext);
    const safeBase = baseName.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 30) || 'image';
    const uniqueName = `${Date.now()}-${safeBase}${ext}`;

    // Write to both public/uploads and data/uploads
    fs.writeFileSync(path.join(uploadsDir, uniqueName), buffer);
    fs.writeFileSync(path.join(dataUploadsDir, uniqueName), buffer);

    const publicUrl = `/uploads/${uniqueName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: uniqueName,
      originalName,
      size: file.size,
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'File upload failed' },
      { status: 500 }
    );
  }
}
