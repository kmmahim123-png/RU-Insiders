import { NextRequest, NextResponse } from 'next/server';
import { getPrintJobs, addPrintJob, updatePrintJobStatus, deletePrintJob } from '@/lib/db';
import { PrintJob } from '@/lib/types';
import { generateToken } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const phone = searchParams.get('phone');
    const adminPin = request.headers.get('x-admin-pin') || request.cookies.get('ru_admin_token')?.value;
    const expectedPin = process.env.ADMIN_DEFAULT_PIN || '1953';

    const jobs = await getPrintJobs();

    // Admin access returns all jobs
    if (adminPin === expectedPin) {
      return NextResponse.json({
        success: true,
        jobs,
      });
    }

    // Customer verification
    if (!token || !phone) {
      return NextResponse.json(
        { success: false, message: 'Both Pickup Token and Phone number are required.' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.trim().replace(/[^0-9]/g, '');
    const job = jobs.find(
      (j) =>
        j.token.toLowerCase() === token.trim().toLowerCase() &&
        j.customerPhone.replace(/[^0-9]/g, '') === cleanPhone
    );

    if (!job) {
      return NextResponse.json(
        { success: false, message: 'Print job not found with the provided credentials.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      job,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error fetching print jobs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.customerName || !body.customerPhone || !body.fileName) {
      return NextResponse.json(
        { success: false, message: 'Name, phone number, and file details are required.' },
        { status: 400 }
      );
    }

    const pages = Math.max(1, Number(body.pageCount) || 1);
    const copies = Math.max(1, Number(body.copies) || 1);
    const isColor = body.printType === 'color';
    const isArtPaper = body.paperType === 'art_paper_matte';

    let ratePerPage = isColor ? 15 : 2.5;
    if (isArtPaper) ratePerPage += 10;
    if (body.doubleSided) ratePerPage = ratePerPage * 0.9;

    const totalAmount = Math.ceil(pages * copies * ratePerPage);
    const costAmount = Math.ceil(totalAmount * 0.4);

    const newJob: PrintJob = {
      id: `prnt-${Date.now()}`,
      token: generateToken('RU-PRNT'),
      customerName: body.customerName.trim(),
      customerPhone: body.customerPhone.trim(),
      customerNotes: body.customerNotes?.trim() || '',
      fileName: body.fileName.trim(),
      fileSizeMb: Number(body.fileSizeMb || 2.5),
      fileDataUrl: body.fileDataUrl || '',
      pageCount: pages,
      printType: isColor ? 'color' : 'bw',
      paperType: body.paperType || 'standard_80gsm',
      doubleSided: Boolean(body.doubleSided),
      copies,
      pricePerPage: ratePerPage,
      totalAmount,
      costAmount,
      status: 'queued',
      paymentStatus: body.paymentStatus || 'unpaid',
      createdAt: new Date().toISOString(),
    };

    await addPrintJob(newJob);

    return NextResponse.json({
      success: true,
      message: 'Print job queued successfully and saved to database.',
      job: newJob,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to submit print job' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const adminPin = request.headers.get('x-admin-pin') || request.cookies.get('ru_admin_token')?.value;
    const expectedPin = process.env.ADMIN_DEFAULT_PIN || '1953';

    if (adminPin !== expectedPin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin privileges required.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, status, paymentStatus } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, message: 'Job ID and status required.' }, { status: 400 });
    }

    const updated = await updatePrintJobStatus(id, status, paymentStatus);

    return NextResponse.json({
      success: true,
      message: 'Print job updated in database.',
      job: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update print job' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const adminPin = request.headers.get('x-admin-pin') || request.cookies.get('ru_admin_token')?.value;
    const expectedPin = process.env.ADMIN_DEFAULT_PIN || '1953';

    if (adminPin !== expectedPin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin privileges required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Job ID required.' }, { status: 400 });
    }

    await deletePrintJob(id);

    return NextResponse.json({
      success: true,
      message: 'Print job deleted from database.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete print job' },
      { status: 500 }
    );
  }
}
