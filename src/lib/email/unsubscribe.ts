import { createHmac, timingSafeEqual } from "node:crypto";

function secret(): string {
  const s = process.env.CRON_SECRET;
  if (!s) throw new Error("CRON_SECRET is required");
  return s;
}

export function signLeadToken(leadId: string): string {
  return createHmac("sha256", secret()).update(leadId).digest("hex");
}

export function verifyLeadToken(leadId: string, token: string): boolean {
  try {
    const expected = signLeadToken(leadId);
    // Ensure token is exactly the expected length (64 hex chars for sha256)
    if (token !== expected) return false;
    const a = Buffer.from(expected, "hex");
    const b = Buffer.from(token, "hex");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
