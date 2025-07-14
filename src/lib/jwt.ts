export function decodeJwt(token: string): Record<string, unknown> {
  const payload = token.split('.')[1];
  const data = Buffer.from(payload, 'base64').toString();
  return JSON.parse(data) as Record<string, unknown>;
}
