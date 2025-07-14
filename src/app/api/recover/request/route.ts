import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { findUserByEmail, updateUser } from '@/lib/userStore';

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  const user = await findUserByEmail(email);
  if (user) {
    const token = crypto.randomBytes(20).toString('hex');
    user.resetToken = token;
    await updateUser(user);
    console.log(`Password reset token for ${email}: ${token}`);
  }
  return NextResponse.json({ success: true });
}
