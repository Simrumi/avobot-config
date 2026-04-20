import { describe, it, expect, beforeEach } from "vitest";
import { signLeadToken, verifyLeadToken } from "./unsubscribe";

beforeEach(() => {
  process.env.CRON_SECRET = "test-secret-12345";
});

describe("unsubscribe token", () => {
  it("verifies a freshly signed token", () => {
    const token = signLeadToken("lead-abc");
    expect(verifyLeadToken("lead-abc", token)).toBe(true);
  });

  it("rejects a tampered token", () => {
    const token = signLeadToken("lead-abc");
    expect(verifyLeadToken("lead-abc", token + "x")).toBe(false);
  });

  it("rejects a token signed for a different lead", () => {
    const token = signLeadToken("lead-abc");
    expect(verifyLeadToken("lead-xyz", token)).toBe(false);
  });

  it("rejects when CRON_SECRET changes", () => {
    const token = signLeadToken("lead-abc");
    process.env.CRON_SECRET = "different-secret";
    expect(verifyLeadToken("lead-abc", token)).toBe(false);
  });
});
