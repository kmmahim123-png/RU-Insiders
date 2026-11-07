import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getSupabaseClient } from '@/lib/supabase';

const SUBSCRIBERS_FILE = path.join(process.cwd(), 'data', 'subscribers.json');

function ensureSubscribersFile() {
  const dir = path.dirname(SUBSCRIBERS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(SUBSCRIBERS_FILE)) {
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

function readSubscribers(): any[] {
  ensureSubscribersFile();
  try {
    const raw = fs.readFileSync(SUBSCRIBERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeSubscribers(data: any[]) {
  ensureSubscribersFile();
  fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// GET: Retrieve subscriber count or list (admin)
export async function GET(req: NextRequest) {
  try {
    const subscribers = readSubscribers();
    return NextResponse.json({
      success: true,
      totalSubscribers: subscribers.length,
      subscribers,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to read subscribers' },
      { status: 500 }
    );
  }
}

// POST: Add new subscriber (browser push / email / phone)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, browserPermission, pushEndpoint, source } = body;

    const newSub = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name?.trim() || 'সম্মানিত পাঠক',
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      browserPermission: browserPermission || 'granted',
      pushEndpoint: pushEndpoint || null,
      source: source || 'web_signup',
      createdAt: new Date().toISOString(),
    };

    const subscribers = readSubscribers();

    // Check if duplicate email or phone exists
    const existingIdx = subscribers.findIndex(
      (s) =>
        (email && s.email && s.email.toLowerCase() === email.toLowerCase()) ||
        (phone && s.phone && s.phone === phone)
    );

    if (existingIdx >= 0) {
      subscribers[existingIdx] = {
        ...subscribers[existingIdx],
        ...newSub,
        updatedAt: new Date().toISOString(),
      };
    } else {
      subscribers.unshift(newSub);
    }

    writeSubscribers(subscribers);

    // Also persist to Supabase if table exists
    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        await supabase.from('subscribers').upsert({
          id: newSub.id,
          name: newSub.name,
          email: newSub.email,
          phone: newSub.phone,
          browser_permission: newSub.browserPermission,
          created_at: newSub.createdAt,
        });
      }
    } catch (e) {
      // Non-fatal if Supabase table is not yet created
    }

    return NextResponse.json({
      success: true,
      message: 'নোটিফিকেশন সাবস্ক্রিপশন সফলভাবে সম্পন্ন হয়েছে!',
      subscriber: newSub,
      totalSubscribers: subscribers.length,
    });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { success: false, error: 'সাবস্ক্রিপশন করতে সমস্যা হয়েছে।' },
      { status: 500 }
    );
  }
}
