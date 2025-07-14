import crypto from 'crypto';

const SESSION_SECRET = process.env.SESSION_SECRET || 'change-me';

function sign(value: string): string {
  return crypto.createHmac('sha256', SESSION_SECRET).update(value).digest('hex');
}

export function createSession(userId: string): string {
  const payload = JSON.stringify({ id: userId, iat: Date.now() });
  const signature = sign(payload);
  return Buffer.from(payload).toString('base64') + '.' + signature;
}

export function verifySession(cookie?: string): { id: string; iat: number } | null {
  if (!cookie) return null;
  const [payloadB64, sig] = cookie.split('.');
  if (!payloadB64 || !sig) return null;
  const payload = Buffer.from(payloadB64, 'base64').toString();
  if (sign(payload) !== sig) return null;
  return JSON.parse(payload);
}
