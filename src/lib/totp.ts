import crypto from 'crypto';

export function generateSecret(): string {
  return crypto.randomBytes(20).toString('hex');
}

function generateTOTP(secret: string, window = 0): string {
  const time = Math.floor(Date.now() / 30000) + window;
  const key = Buffer.from(secret, 'hex');
  const msg = Buffer.alloc(8);
  msg.writeUInt32BE(0, 0);
  msg.writeUInt32BE(time, 4);
  const hmac = crypto.createHmac('sha1', key).update(msg).digest();
  const offset = hmac[19] & 0xf;
  const code = (hmac.readUInt32BE(offset) & 0x7fffffff) % 1000000;
  return code.toString().padStart(6, '0');
}

export function verifyTOTP(secret: string, token: string): boolean {
  for (let i = -1; i <= 1; i++) {
    if (generateTOTP(secret, i) === token) return true;
  }
  return false;
}
