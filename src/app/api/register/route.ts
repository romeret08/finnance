import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createUser, findUserByEmail } from '@/lib/userStore';

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const existing = await findUserByEmail(email);
  if (existing) {
    return NextResponse.json({ error: 'User exists' }, { status: 400 });
  }
  const passwordHash = crypto
    .pbkdf2Sync(password, 'salt', 1000, 64, 'sha512')
    .toString('hex');
  await createUser({ id: crypto.randomUUID(), email, passwordHash, name });
  return NextResponse.json({ success: true });
}
