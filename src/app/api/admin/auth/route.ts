import { NextRequest, NextResponse } from 'next/server';
import { 
  verifyAdminPin, 
  createAdminSessionToken, 
  checkRateLimit, 
  recordFailedAttempt, 
  resetLoginAttempts, 
  getClientIp 
} from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit(ip);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Too many failed attempts. Access locked for security. Please retry in ${rateCheck.retryAfterSec || 900} seconds.` 
        },
        { status: 429 }
      );
    }

    const { pin } = await request.json();

    if (!pin || !verifyAdminPin(pin.toString())) {
      const failStatus = recordFailedAttempt(ip);
      const remainingMsg = failStatus.locked
        ? 'Maximum attempts exceeded. Account locked for 15 minutes.'
        : `${failStatus.remainingAttempts} attempts remaining before temporary lockout.`;

      return NextResponse.json(
        { 
          success: false, 
          message: `Invalid Admin PIN credentials. ${remainingMsg}` 
        },
        { status: 401 }
      );
    }

    // PIN is correct - reset rate limits and generate signed session token
    resetLoginAttempts(ip);
    const sessionToken = createAdminSessionToken();

    const response = NextResponse.json({
      success: true,
      message: 'Authenticated successfully as RU Insiders Admin.',
      token: sessionToken,
    });

    response.cookies.set('ru_admin_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
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
