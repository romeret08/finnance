import { NextResponse } from 'next/server';

const clientId = process.env.GOOGLE_CLIENT_ID;
const base = process.env.NEXT_PUBLIC_BASE_URL;

export function GET() {
  if (!clientId || !base) {
    return NextResponse.json({ error: 'OAuth not configured' }, { status: 500 });
  }
  const redirectUri = `${base}/api/oauth/google/callback`;
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'openid email profile');
  url.searchParams.set('prompt', 'select_account');
  return NextResponse.redirect(url.toString());
}
