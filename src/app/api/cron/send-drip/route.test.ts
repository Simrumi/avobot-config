import { describe, it, expect, beforeAll } from "vitest";

beforeAll(() => {
  process.env.CRON_SECRET = "test-secret";
});

const hasEnv = !!process.env.SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;

function req(auth?: string) {
  const headers = new Headers();
  if (auth) headers.set("authorization", auth);
  return new Request("http://localhost/api/cron/send-drip", {
    method: "POST",
    headers,
  });
}

describe.skipIf(!hasEnv)("POST /api/cron/send-drip", () => {
  it("rejects without auth", async () => {
    const { POST } = await import("./route");
    const res = await POST(req());
    expect(res.status).toBe(401);
  });

  it("rejects wrong secret", async () => {
    const { POST } = await import("./route");
    const res = await POST(req("Bearer nope"));
    expect(res.status).toBe(401);
  });

  it("accepts correct secret and returns a summary", async () => {
    const { POST } = await import("./route");
    const res = await POST(req("Bearer test-secret"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("processed");
    expect(body).toHaveProperty("sent");
    expect(body).toHaveProperty("failed");
    expect(body).toHaveProperty("skipped");
    expect(body).toHaveProperty("duration_ms");
  });
});
