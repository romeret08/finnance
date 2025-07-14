import { NextRequest, NextResponse } from 'next/server';
import { verifySession, createSession } from '@/lib/auth';
import { findUserById } from '@/lib/userStore';
import { verifyTOTP } from '@/lib/totp';

export async function POST(req: NextRequest) {
  const { token } = await req.json();
  const sessionCookie = req.cookies.get('session')?.value;
  const session = verifySession(sessionCookie);
  if (!session) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }
  const user = await findUserById(session.id);
  if (!user?.totpSecret) {
    return NextResponse.json({ error: '2FA not enabled' }, { status: 400 });
  }
  if (!verifyTOTP(user.totpSecret, token)) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
  const newSession = createSession(user.id);
  const res = NextResponse.json({ success: true });
  res.cookies.set('session', newSession, { httpOnly: true, path: '/' });
  return res;
}
