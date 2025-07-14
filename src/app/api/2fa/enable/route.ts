import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { findUserById, updateUser } from '@/lib/userStore';
import { generateSecret } from '@/lib/totp';

export async function POST(req: NextRequest) {
  const sessionCookie = req.cookies.get('session')?.value;
  const session = verifySession(sessionCookie);
  if (!session) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }
  const user = await findUserById(session.id);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  if (user.totpSecret) {
    return NextResponse.json({ error: '2FA already enabled' }, { status: 400 });
  }
  user.totpSecret = generateSecret();
  await updateUser(user);
  return NextResponse.json({ secret: user.totpSecret });
}
