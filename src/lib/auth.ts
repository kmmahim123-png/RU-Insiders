import crypto from 'crypto';
import { NextRequest } from 'next/server';

const EXPECTED_PIN = process.env.ADMIN_DEFAULT_PIN || '1953';
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'ru-insiders-secret-key-2026';

// In-memory brute force tracker: IP -> { attempts: number, lockUntil: number }
const loginAttempts = new Map<string, { attempts: number; lockUntil: number }>();

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Check if client IP is currently locked out from admin login attempts
 */
export function checkRateLimit(ip: string): { allowed: boolean; remainingAttempts: number; retryAfterSec?: number } {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (record) {
    if (record.lockUntil > now) {
      const retryAfterSec = Math.ceil((record.lockUntil - now) / 1000);
      return { allowed: false, remainingAttempts: 0, retryAfterSec };
    }
    // Lock expired, reset
    if (record.lockUntil <= now && record.attempts >= MAX_ATTEMPTS) {
      loginAttempts.delete(ip);
    }
  }

  const currentAttempts = loginAttempts.get(ip)?.attempts || 0;
  return {
    allowed: true,
    remainingAttempts: Math.max(0, MAX_ATTEMPTS - currentAttempts),
  };
}

/**
 * Record a failed admin authentication attempt
 */
export function recordFailedAttempt(ip: string): { remainingAttempts: number; locked: boolean } {
  const now = Date.now();
  const record = loginAttempts.get(ip) || { attempts: 0, lockUntil: 0 };
  record.attempts += 1;

  if (record.attempts >= MAX_ATTEMPTS) {
    record.lockUntil = now + LOCKOUT_MS;
    loginAttempts.set(ip, record);
    return { remainingAttempts: 0, locked: true };
  }

  loginAttempts.set(ip, record);
  return { remainingAttempts: MAX_ATTEMPTS - record.attempts, locked: false };
}

/**
 * Reset failed attempts upon successful login
 */
export function resetLoginAttempts(ip: string): void {
  loginAttempts.delete(ip);
}

/**
 * Constant-time comparison between two strings to prevent timing attacks
 */
export function constantTimeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a.trim());
    const bufB = Buffer.from(b.trim());
    if (bufA.length !== bufB.length) {
      // Run comparison against self to maintain constant time
      crypto.timingSafeEqual(bufA, bufA);
      return false;
    }
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

/**
 * Verify whether an admin PIN is correct
 */
export function verifyAdminPin(providedPin: string): boolean {
  if (!providedPin) return false;
  return constantTimeCompare(providedPin, EXPECTED_PIN);
}

/**
 * Create a cryptographically signed session token:
 * format: "timestamp:signature"
 */
export function createAdminSessionToken(): string {
  const timestamp = Date.now().toString();
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(`${EXPECTED_PIN}:${timestamp}`)
    .digest('hex');
  return `${timestamp}:${signature}`;
}

/**
 * Validate a signed session token
 */
export function verifyAdminSessionToken(token: string): boolean {
  if (!token || typeof token !== 'string') return false;

  // Allow raw PIN if it strictly matches (backward compatibility for direct header API calls)
  if (constantTimeCompare(token, EXPECTED_PIN)) {
    return true;
  }

  const parts = token.split(':');
  if (parts.length !== 2) return false;

  const [timestamp, signature] = parts;
  const tokenTime = parseInt(timestamp, 10);
  if (isNaN(tokenTime)) return false;

  // Expire session tokens after 7 days
  const maxAgeMs = 7 * 24 * 60 * 60 * 1000;
  if (Date.now() - tokenTime > maxAgeMs) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(`${EXPECTED_PIN}:${timestamp}`)
    .digest('hex');

  return constantTimeCompare(signature, expectedSignature);
}

/**
 * Helper to get client IP from NextRequest
 */
export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1'
  );
}

/**
 * Unified request authenticator: checks header 'x-admin-pin', 'authorization', or cookie 'ru_admin_token'
 */
export function verifyAdminAuth(request: NextRequest): boolean {
  const pinHeader = request.headers.get('x-admin-pin');
  if (pinHeader && verifyAdminPin(pinHeader)) {
    return true;
  }

  const cookieToken = request.cookies.get('ru_admin_token')?.value;
  if (cookieToken && verifyAdminSessionToken(cookieToken)) {
    return true;
  }

  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const bearer = authHeader.substring(7);
    if (verifyAdminSessionToken(bearer)) {
      return true;
    }
  }

  return false;
}
