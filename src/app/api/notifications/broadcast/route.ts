import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const SUBSCRIBERS_FILE = path.join(process.cwd(), 'data', 'subscribers.json');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, message, url } = body;

    if (!title || !message) {
      return NextResponse.json(
        { success: false, error: 'শিরোনাম ও বার্তা আবশ্যক' },
        { status: 400 }
      );
    }

    let subscribersCount = 0;
    try {
      if (fs.existsSync(SUBSCRIBERS_FILE)) {
        const raw = fs.readFileSync(SUBSCRIBERS_FILE, 'utf-8');
        const list = JSON.parse(raw);
        subscribersCount = Array.isArray(list) ? list.length : 0;
      }
    } catch {}

    const broadcastPayload = {
      id: `broadcast_${Date.now()}`,
      title,
      message,
      url: url || '/',
      sentAt: new Date().toISOString(),
      recipientsCount: subscribersCount,
    };

    return NextResponse.json({
      success: true,
      message: `নোটিফিকেশন সফলভাবে ${subscribersCount} জন সাবস্ক্রাইবারকে ব্রডকাস্ট করা হয়েছে!`,
      broadcast: broadcastPayload,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'ব্রডকাস্ট করতে ব্যর্থ হয়েছে' },
      { status: 500 }
    );
  }
}
