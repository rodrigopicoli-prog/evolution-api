import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';

@Injectable()
export class CryptoService {
  private readonly key = createHash('sha256').update(process.env.MAIL_SECRET_KEY || 'changeme').digest();

  encrypt(value: string): string {
    const iv = randomBytes(16);
    const cipher = createCipheriv('aes-256-cbc', this.key, iv);
    const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  }

  decrypt(payload: string): string {
    const [ivHex, encryptedHex] = payload.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encrypted = Buffer.from(encryptedHex, 'hex');
    const decipher = createDecipheriv('aes-256-cbc', this.key, iv);
    const output = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return output.toString('utf8');
  }
}
