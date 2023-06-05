import * as CryptoJS from 'crypto-js';
import { env } from '@/env.mjs';

export function encrypt(data: string): string {
  return CryptoJS.AES.encrypt(data, env.CRYPTO_SECRET).toString()
}

export function decrypt(data: string): string {
  let decrypted: string;
  try {
    const bytes = CryptoJS.AES.decrypt(data, env.CRYPTO_SECRET);
    decrypted = bytes.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    throw new Error("There was an error in the decrypt");
  }

  return decrypted;
}
