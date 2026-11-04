import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_ORDERS, INITIAL_PRINT_JOBS, INITIAL_PRODUCTS, calculateRevenueSummary } from '@/lib/store';

export async function GET(request: NextRequest) {
  const adminPin = request.headers.get('x-admin-pin') || request.cookies.get('ru_admin_token')?.value;
  const expectedPin = process.env.ADMIN_DEFAULT_PIN || '1953';

  if (adminPin !== expectedPin) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized: Admin role check required.' },
      { status: 401 }
    );
  }

  const summary = calculateRevenueSummary(INITIAL_ORDERS, INITIAL_PRINT_JOBS, INITIAL_PRODUCTS);

  return NextResponse.json({
    success: true,
    summary,
  });
}
