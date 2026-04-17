import { describe, it, expect, afterEach } from "vitest";
import type { QuizInput } from "./schema";

const hasEnv = !!process.env.SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;

const uniqueEmail = (suffix: string) =>
  `test+${Date.now()}.${suffix}@hustlr-test.local`;

const validInput = (email: string): QuizInput => ({
  q1: "ops",
  q2: ["sops"],
  q3: "daily",
  q4: "burn_out",
  q5: "2-5",
  capture: { name: "Test User", email, country: "MY" },
});

describe.skipIf(!hasEnv)("submitQuiz (integration)", () => {
  it("rejects invalid input", async () => {
    const { submitQuiz } = await import("./actions");
    const bad = { ...validInput("x@y.com"), q1: "nope" } as unknown as QuizInput;
    await expect(submitQuiz(bad)).rejects.toThrow();
  });

  it("inserts a lead and 5 scheduled_emails on first submit", async () => {
    const { submitQuiz } = await import("./actions");
    const { supabase } = await import("@/lib/supabase");
    const email = uniqueEmail("first");
    try {
      const { leadId, segment } = await submitQuiz(validInput(email));
      expect(segment).toBe("ops");

      const { data: lead } = await supabase.from("leads").select("*").eq("id", leadId).single();
      expect(lead?.email).toBe(email);
      expect(lead?.urgency).toBe("high");

      const { data: rows } = await supabase
        .from("scheduled_emails")
        .select("template_key,status")
        .eq("lead_id", leadId);
      expect(rows?.length).toBe(5);
      expect(rows?.every((r) => r.status === "pending")).toBe(true);
    } finally {
      await supabase.from("leads").delete().eq("email", email);
    }
  });

  it("reseeds a drip when the same email resubmits and is not unsubscribed", async () => {
    const { submitQuiz } = await import("./actions");
    const { supabase } = await import("@/lib/supabase");
    const email = uniqueEmail("resub");
    try {
      const first = await submitQuiz(validInput(email));
      const second = await submitQuiz(validInput(email));
      expect(second.leadId).toBe(first.leadId);

      const { data: rows } = await supabase
        .from("scheduled_emails")
        .select("status")
        .eq("lead_id", first.leadId);
      const pending = rows?.filter((r) => r.status === "pending").length ?? 0;
      const skipped = rows?.filter((r) => r.status === "skipped").length ?? 0;
      expect(pending).toBe(5);
      expect(skipped).toBe(5);
    } finally {
      await supabase.from("leads").delete().eq("email", email);
    }
  });

  it("does NOT reseed a drip for an unsubscribed lead", async () => {
    const { submitQuiz } = await import("./actions");
    const { supabase } = await import("@/lib/supabase");
    const email = uniqueEmail("unsub");
    try {
      const { leadId } = await submitQuiz(validInput(email));
      await supabase.from("leads").update({ unsubscribed_at: new Date().toISOString() }).eq("id", leadId);
      await supabase.from("scheduled_emails").delete().eq("lead_id", leadId);

      await submitQuiz(validInput(email));

      const { data: rows } = await supabase
        .from("scheduled_emails")
        .select("id")
        .eq("lead_id", leadId);
      expect(rows?.length).toBe(0);
    } finally {
      await supabase.from("leads").delete().eq("email", email);
    }
  });
});
