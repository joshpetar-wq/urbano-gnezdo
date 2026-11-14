import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "ug_admin";
const MAX_AGE = 60 * 60 * 24 * 14; // 14 days

export function adminPassword(): string | null {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  // Local development only
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) return "admin";
  return null;
}

function secret(): string {
  return process.env.SESSION_SECRET || adminPassword() || "not-configured";
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

export function checkPassword(input: string): boolean {
  const pw = adminPassword();
  if (!pw) return false;
  const a = Buffer.from(sign(input));
  const b = Buffer.from(sign(pw));
  return a.length === b.length && timingSafeEqual(a, b);
}

export function createSessionValue(): string {
  const exp = String(Math.floor(Date.now() / 1000) + MAX_AGE);
  return `${exp}.${sign(exp)}`;
}

export function verifySessionValue(value: string | undefined): boolean {
  if (!value || !adminPassword()) return false;
  const [exp, sig] = value.split(".");
  if (!exp || !sig) return false;
  if (Number(exp) < Date.now() / 1000) return false;
  const expected = Buffer.from(sign(exp));
  const given = Buffer.from(sig);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifySessionValue(store.get(SESSION_COOKIE)?.value);
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) throw new Error("Не сте најавени. Најавете се повторно.");
}

export const sessionMaxAge = MAX_AGE;
