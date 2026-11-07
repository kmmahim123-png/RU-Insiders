import { NextResponse } from 'next/server';

interface ClubAppRecord {
  id: string;
  clubId: string;
  clubNameBn: string;
  studentName: string;
  department: string;
  session: string;
  rollNumber: string;
  phone: string;
  email: string;
  bloodGroup: string;
  whyJoin: string;
  appliedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

// In-memory fallback if no DB configured
let inMemoryApps: ClubAppRecord[] = [
  {
    id: 'app-sample-1',
    clubId: 'club-rucs',
    clubNameBn: 'রাজশাহী ইউনিভার্সিটি ক্যারিয়ার ক্লাব (RUCS)',
    studentName: 'মো. তানভীর রহমান',
    department: 'কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং (CSE)',
    session: '২০২২-২০২৩',
    rollNumber: '2210543118',
    phone: '০১৭৮৮-১২৩৪৫৬',
    email: 'tanvir.cse22@gmail.com',
    bloodGroup: 'B+',
    whyJoin: 'আমি বহুজাতিক কোম্পানিতে ক্যারিয়ার গড়ার লক্ষ্যে কমিউনিকেশন ও লিডারশিপ দক্ষতা বাড়াতে আগ্রহী।',
    appliedAt: '৭ নভেম্বর, ২০২৬',
    status: 'pending'
  },
  {
    id: 'app-sample-2',
    clubId: 'club-badhan',
    clubNameBn: 'বাঁধন (Badhan) — রাজশাহী বিশ্ববিদ্যালয় জোন',
    studentName: 'সাদিয়া জান্নাত মীম',
    department: 'আইন বিভাগ (Law)',
    session: '২০২৩-২০২৪',
    rollNumber: '2310123045',
    phone: '০১৯২২-৫৫৬৬৭৭',
    email: 'sadia.law23@gmail.com',
    bloodGroup: 'O+',
    whyJoin: 'স্বেচ্ছায় রক্তদান ও মুমূর্ষু মানুষের জীবন রক্ষায় অবদান রাখতে চাই।',
    appliedAt: '৬ নভেম্বর, ২০২৬',
    status: 'approved'
  }
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      applications: inMemoryApps,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.studentName || !body.phone || !body.clubId) {
      return NextResponse.json(
        { success: false, error: 'নাম, মোবাইল নম্বর ও ক্লাব নির্বাচন বাধ্যতামূলক।' },
        { status: 400 }
      );
    }

    const newRecord: ClubAppRecord = {
      id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      clubId: body.clubId,
      clubNameBn: body.clubNameBn || 'রাজশাহী বিশ্ববিদ্যালয় ক্লাব',
      studentName: body.studentName,
      department: body.department || 'সাধারণ শিক্ষার্থী',
      session: body.session || '২০২৪-২০২৫',
      rollNumber: body.rollNumber || 'প্রযোজ্য নয়',
      phone: body.phone,
      email: body.email || '',
      bloodGroup: body.bloodGroup || 'অজানা',
      whyJoin: body.whyJoin || 'ক্লাবের কার্যক্রমে যুক্ত হতে আগ্রহী।',
      appliedAt: new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' }),
      status: 'pending'
    };

    inMemoryApps = [newRecord, ...inMemoryApps];

    return NextResponse.json({
      success: true,
      message: 'ক্লাবে যুক্ত হওয়ার আবেদনটি সফলভাবে জমা হয়েছে!',
      application: newRecord,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;
    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'ID ও status প্রয়োজন' }, { status: 400 });
    }

    inMemoryApps = inMemoryApps.map((a) => (a.id === id ? { ...a, status } : a));

    return NextResponse.json({
      success: true,
      message: 'আবেদনের স্ট্যাটাস আপডেট হয়েছে',
      applications: inMemoryApps,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
