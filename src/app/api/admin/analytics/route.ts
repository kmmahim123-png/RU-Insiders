import { NextRequest, NextResponse } from 'next/server';
import { readDb } from '@/lib/db';
import { calculateRevenueSummary } from '@/lib/store';
import { verifyAdminAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    if (!verifyAdminAuth(request)) {
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
