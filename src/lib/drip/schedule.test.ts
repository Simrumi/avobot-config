import { describe, it, expect } from "vitest";
import { buildDripRows } from "./schedule";

describe("buildDripRows", () => {
  const now = new Date("2026-04-17T00:00:00.000Z");
  const leadId = "lead-1";

  it("returns 5 rows for a given segment", () => {
    const rows = buildDripRows({ leadId, segment: "ops", now });
    expect(rows).toHaveLength(5);
  });

  it("uses correct template_keys for the segment", () => {
    const rows = buildDripRows({ leadId, segment: "sales", now });
    expect(rows.map((r) => r.template_key)).toEqual([
      "sales_d0_result",
      "sales_d1_mechanism",
      "sales_d3_proof",
      "sales_d5_objections",
      "sales_d9_last_call",
    ]);
  });

  it("schedules D0 at now, and D1/D3/D5/D9 at the correct offsets", () => {
    const rows = buildDripRows({ leadId, segment: "ops", now });
    expect(rows[0].send_at).toEqual(now.toISOString());
    expect(rows[1].send_at).toEqual(new Date("2026-04-18T00:00:00.000Z").toISOString());
    expect(rows[2].send_at).toEqual(new Date("2026-04-20T00:00:00.000Z").toISOString());
    expect(rows[3].send_at).toEqual(new Date("2026-04-22T00:00:00.000Z").toISOString());
    expect(rows[4].send_at).toEqual(new Date("2026-04-26T00:00:00.000Z").toISOString());
  });

  it("all rows reference the given leadId with status 'pending'", () => {
    const rows = buildDripRows({ leadId, segment: "team", now });
    for (const r of rows) {
      expect(r.lead_id).toBe(leadId);
      expect(r.status).toBe("pending");
      expect(r.attempts).toBe(0);
    }
  });
});
