import { NextRequest, NextResponse } from 'next/server';
import { readDb } from '@/lib/db';
import { calculateRevenueSummary } from '@/lib/store';

export async function GET(request: NextRequest) {
  try {
    const adminPin = request.headers.get('x-admin-pin') || request.cookies.get('ru_admin_token')?.value;
    const expectedPin = process.env.ADMIN_DEFAULT_PIN || '1953';

    if (adminPin !== expectedPin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin role check required.' },
        { status: 401 }
      );
    }

    const db = await readDb();
    const summary = calculateRevenueSummary(db.orders, db.printJobs, db.products);

    return NextResponse.json({
      success: true,
      summary,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error computing analytics' },
      { status: 500 }
    );
  }
}
