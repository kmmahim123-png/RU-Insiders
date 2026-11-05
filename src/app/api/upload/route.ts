import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import os from 'os';
import path from 'path';

// Whitelist of allowed extensions for images, documents, and apparel showcase videos
const ALLOWED_EXTENSIONS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.pdf',
  '.mp4',
  '.webm',
  '.mov',
  '.m4v',
]);

function validateMagicBytes(buffer: Buffer, ext: string): boolean {
  if (buffer.length < 4) return false;

  // PNG: 89 50 4E 47
  if (ext === '.png') {
    return buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
  }
  // JPEG / JPG: FF D8 FF
  if (ext === '.jpg' || ext === '.jpeg') {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  // WEBP: RIFF at 0..3 and WEBP at 8..11
  if (ext === '.webp') {
    if (buffer.length < 12) return false;
    const riff = buffer.toString('ascii', 0, 4);
    const webp = buffer.toString('ascii', 8, 12);
    return riff === 'RIFF' && webp === 'WEBP';
  }
  // PDF: %PDF-
  if (ext === '.pdf') {
    return buffer.toString('ascii', 0, 4) === '%PDF';
  }
  // MP4 / M4V / MOV: ftyp box typically at index 4..8 or standard media container
  if (ext === '.mp4' || ext === '.m4v' || ext === '.mov') {
    if (buffer.length < 8) return false;
    const brand = buffer.toString('ascii', 4, 8);
    // Common MP4/MOV signatures: ftyp, moov, mdat, wide, skip
    return ['ftyp', 'moov', 'mdat', 'wide', 'skip'].includes(brand);
  }
  // WebM: EBML header (1A 45 DF A3)
  if (ext === '.webm') {
    return (
      buffer[0] === 0x1a &&
      buffer[1] === 0x45 &&
      buffer[2] === 0xdf &&
      buffer[3] === 0xa3
    );
  }

  return false;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file provided' }, { status: 400 });
    }

    const MAX_FILE_SIZE = 60 * 1024 * 1024; // 60MB to comfortably support product videos
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: 'File size exceeds maximum 60MB limit.' },
        { status: 400 }
      );
    }

    const originalName = file.name || 'upload.mp4';
    const ext = path.extname(originalName).toLowerCase();

    // 1. Strict extension validation
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Forbidden file extension '${ext}'. Allowed formats: Images (.jpg, .png, .webp), PDF (.pdf), Videos (.mp4, .webm, .mov).` 
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 2. Validate magic bytes against MIME extension spoofing
    if (!validateMagicBytes(buffer, ext)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'File content does not match expected format signature.' 
        },
        { status: 400 }
      );
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const dataUploadsDir = path.join(process.cwd(), 'data', 'uploads');
    const tmpUploadsDir = path.join(os.tmpdir(), 'ru_insiders_uploads');

    // Create target directories safely
    try {
      if (!fs.existsSync(uploadsDir)) await fs.promises.mkdir(uploadsDir, { recursive: true });
    } catch {}
    try {
      if (!fs.existsSync(dataUploadsDir)) await fs.promises.mkdir(dataUploadsDir, { recursive: true });
    } catch {}
    try {
      if (!fs.existsSync(tmpUploadsDir)) await fs.promises.mkdir(tmpUploadsDir, { recursive: true });
    } catch {}

    const baseName = path.basename(originalName, ext);
    const safeBase = baseName.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 30) || 'media';
    const uniqueName = `${Date.now()}-${safeBase}${ext}`;

    let successWrites = 0;

    // Asynchronously write to available storage tiers
    try {
      await fs.promises.writeFile(path.join(uploadsDir, uniqueName), buffer);
      successWrites++;
    } catch (e) {
      // Expected in serverless read-only environment
    }

    try {
      await fs.promises.writeFile(path.join(dataUploadsDir, uniqueName), buffer);
      successWrites++;
    } catch (e) {
      // Expected in serverless read-only environment
    }

    try {
      await fs.promises.writeFile(path.join(tmpUploadsDir, uniqueName), buffer);
      successWrites++;
    } catch (e) {
      console.warn('Could not write to temporary upload directory:', e);
    }

    if (successWrites === 0) {
      return NextResponse.json(
        { success: false, message: 'Server storage unavailable. Could not persist uploaded media.' },
        { status: 500 }
      );
    }

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
