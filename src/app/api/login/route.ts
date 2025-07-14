import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { findUserByEmail } from '@/lib/userStore';
import { createSession } from '@/lib/auth';
import { verifyTOTP } from '@/lib/totp';

export async function POST(req: NextRequest) {
  const { email, password, token } = await req.json();
  const user = await findUserByEmail(email);
  if (!user?.passwordHash) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  const hash = crypto
    .pbkdf2Sync(password, 'salt', 1000, 64, 'sha512')
    .toString('hex');
  if (hash !== user.passwordHash) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  if (user.totpSecret) {
    if (!token || !verifyTOTP(user.totpSecret, token)) {
      return NextResponse.json({ error: 'Invalid 2FA token' }, { status: 401 });
    }
  }
  const session = createSession(user.id);
  const res = NextResponse.json({ success: true });
  res.cookies.set('session', session, { httpOnly: true, path: '/' });
  return res;
}
