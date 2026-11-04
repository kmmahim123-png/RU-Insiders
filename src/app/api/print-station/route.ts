import { NextResponse } from 'next/server';
import { INITIAL_PRINT_JOBS } from '@/lib/store';
import { PrintJob } from '@/lib/types';
import { generateToken } from '@/lib/utils';

let printJobsCache: PrintJob[] = [...INITIAL_PRINT_JOBS];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const phone = searchParams.get('phone');
  const adminPin = request.headers.get('x-admin-pin');
  const expectedPin = process.env.ADMIN_DEFAULT_PIN || '1953';

  // Admin access
  if (adminPin === expectedPin) {
    return NextResponse.json({
      success: true,
      jobs: printJobsCache,
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
  const job = printJobsCache.find(
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
}

export async function POST(request: Request) {
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

    // Pricing calculation
    let ratePerPage = isColor ? 15 : 2.5;
    if (isArtPaper) ratePerPage += 10;
    if (body.doubleSided) ratePerPage = ratePerPage * 0.9; // 10% discount for duplex

    const totalAmount = Math.ceil(pages * copies * ratePerPage);
    const costAmount = Math.ceil(totalAmount * 0.4); // Estimated ink + paper raw cost

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

    printJobsCache.unshift(newJob);

    return NextResponse.json({
      success: true,
      message: 'Print job queued successfully.',
      job: newJob,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to submit print job' },
      { status: 500 }
    );
  }
}
