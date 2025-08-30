// src/lib/password.ts
import bcrypt from "bcryptjs";

export function hashPassword(plain: string) {
  // cost 12 is a good default
  return bcrypt.hash(plain, 12);
}

export function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}
