import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createSession } from '@/lib/auth';
import { decodeJwt } from '@/lib/jwt';
import { createUser, findUserByEmail } from '@/lib/userStore';

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const base = process.env.NEXT_PUBLIC_BASE_URL;

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  if (!clientId || !clientSecret || !base) {
    return NextResponse.json({ error: 'OAuth not configured' }, { status: 500 });
  }
  if (!code) {
    return NextResponse.redirect('/?error=oauth');
  }
  const redirectUri = `${base}/api/oauth/google/callback`;
  const params = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  });
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });
  const tokenJson = await tokenRes.json();
  const idToken = tokenJson.id_token;
  if (!idToken) {
    return NextResponse.redirect('/?error=oauth');
  }
  const profile = decodeJwt(idToken) as { email?: string; name?: string };
  const email = profile.email;
  if (!email) {
    return NextResponse.redirect('/?error=oauth');
  }
  let user = await findUserByEmail(email);
  if (!user) {
    user = {
      id: crypto.randomUUID(),
      email,
      name: profile.name,
      provider: 'google',
    };
    await createUser(user);
  }
  const session = createSession(user.id);
  const res = NextResponse.redirect('/');
  res.cookies.set('session', session, { httpOnly: true, path: '/' });
  return res;
}
