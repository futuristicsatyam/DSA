import * as bcrypt from "bcrypt";

export async function hashValue(value: string) {
  return bcrypt.hash(value, 12);
}

export async function compareHash(value: string, hash: string | null | undefined) {
  if (!hash) return false;
  return bcrypt.compare(value, hash);
}
