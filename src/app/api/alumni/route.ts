import { NextResponse } from 'next/server';
import { getAllAlumni, RuAlumnus, RU_DEPARTMENTS } from '@/lib/ruAcademicData';

let inMemoryAlumni: RuAlumnus[] = RU_DEPARTMENTS.flatMap((d) => d.sampleAlumni);

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      alumni: inMemoryAlumni,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.name || !body.departmentBn || !body.currentRole) {
      return NextResponse.json(
        { success: false, error: 'নাম, বিভাগ ও বর্তমান পদবী আবশ্যক।' },
        { status: 400 }
      );
    }

    const newAlumnus: RuAlumnus = {
      id: body.id || `alm-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: body.name,
      departmentId: body.departmentId || 'dept-general',
      departmentBn: body.departmentBn,
      session: body.session || 'অ্যালামনাই',
      rollNumber: body.rollNumber || '',
      currentRole: body.currentRole,
      currentOrganization: body.currentOrganization || '',
      location: body.location || 'বাংলাদেশ',
      phone: body.phone || '',
      email: body.email || '',
      facebookUrl: body.facebookUrl || '',
      whatsappNumber: body.whatsappNumber || '',
      linkedInUrl: body.linkedInUrl || '',
      imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      achievementBn: body.achievementBn || '',
      bioBn: body.bioBn || '',
    };

    const existingIndex = inMemoryAlumni.findIndex((a) => a.id === newAlumnus.id);
    if (existingIndex >= 0) {
      inMemoryAlumni[existingIndex] = newAlumnus;
    } else {
      inMemoryAlumni = [newAlumnus, ...inMemoryAlumni];
    }

    return NextResponse.json({
      success: true,
      message: 'অ্যালামনাই প্রোফাইল সফলভাবে সংরক্ষিত হয়েছে!',
      alumnus: newAlumnus,
      alumni: inMemoryAlumni,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID আবশ্যক' }, { status: 400 });
    }

    inMemoryAlumni = inMemoryAlumni.filter((a) => a.id !== id);

    return NextResponse.json({
      success: true,
      message: 'অ্যালামনাই সফলভাবে মুছে ফেলা হয়েছে',
      alumni: inMemoryAlumni,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
