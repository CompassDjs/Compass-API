import { randomBytes, createCipheriv, createDecipheriv } from "crypto";

const secret = process.env.CRYPTO_SECRET!;

export function encrypt(text: string): string {
  const iv = randomBytes(16);
  const cipher = createCipheriv("AES-256-GCM", secret, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + encrypted;
}

export function decrypt(text: string): string {
  const iv = Buffer.from(text.substring(0, 32), "hex");
  const encrypted = text.substring(32);
  const decipher = createDecipheriv("AES-256-GCM", secret, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
