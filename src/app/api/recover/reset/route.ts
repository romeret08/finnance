import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { findUserByResetToken, updateUser } from '@/lib/userStore';

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();
  const user = await findUserByResetToken(token);
  if (!user) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
  }
  user.passwordHash = crypto
    .pbkdf2Sync(password, 'salt', 1000, 64, 'sha512')
    .toString('hex');
  delete user.resetToken;
  await updateUser(user);
  return NextResponse.json({ success: true });
}
