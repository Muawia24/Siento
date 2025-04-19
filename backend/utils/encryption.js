import CryptoJS from "crypto-js";
import dotenv from 'dotenv';

dotenv.config();

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '765784654645';

if (!ENCRYPTION_KEY) {
  throw new Error("ENCRYPTION_KEY is not defined in environment variables.");
}

export function encryptData(text) {
  if (!text) {
    throw new Error("Text to encrypt is required.");
  }
  return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
}

export function decryptData(encryptedText) {
  if (!encryptedText) {
    throw new Error("Encrypted text is required.");
  }
  const decrypted = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY);
  return CryptoJS.enc.Utf8.stringify(decrypted);
}

export default { encryptData, decryptData };
