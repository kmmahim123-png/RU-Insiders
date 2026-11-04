import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { pin } = await request.json();
    const expectedPin = process.env.ADMIN_DEFAULT_PIN || '1953';

    if (!pin || pin.toString().trim() !== expectedPin.toString().trim()) {
      return NextResponse.json(
        { success: false, message: 'Invalid Admin PIN credentials.' },
        { status: 401 }
      );
    }

    // Set secure auth response
    const response = NextResponse.json({
      success: true,
      message: 'Authenticated successfully as RU Insiders Admin.',
      token: expectedPin,
    });

    response.cookies.set('ru_admin_token', expectedPin, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Authentication failed' },
      { status: 500 }
    );
  }
}
