"use server";

import { supabase } from "@/lib/supabase";
import { QuizInputSchema, type QuizInput } from "./schema";
import {
  deriveSegment,
  deriveUrgency,
  deriveTeamTier,
} from "@/lib/drip/segment";
import { buildDripRows } from "@/lib/drip/schedule";
import type { Segment } from "@/types/quiz";

export type SubmitQuizResult = {
  leadId: string;
  segment: Segment;
};

export async function submitQuiz(input: QuizInput): Promise<SubmitQuizResult> {
  const parsed = QuizInputSchema.parse(input);

  const segment = deriveSegment(parsed);
  const urgency = deriveUrgency(parsed);
  const team_tier = deriveTeamTier(parsed);

  // Determine unsubscribe state up front so we can skip drip seeding for unsubscribed leads.
  const pre = await supabase
    .from("leads")
    .select("id,unsubscribed_at")
    .eq("email", parsed.capture.email)
    .maybeSingle();

  const isUnsubscribed = !!pre.data?.unsubscribed_at;

  const { data: upserted, error: upErr } = await supabase
    .from("leads")
    .upsert(
      {
        name: parsed.capture.name,
        email: parsed.capture.email,
        whatsapp: parsed.capture.whatsapp || null,
        company: parsed.capture.company || null,
        country: parsed.capture.country,
        segment,
        urgency,
        team_tier,
        answers: parsed,
      },
      { onConflict: "email" }
    )
    .select("id")
    .single();
  if (upErr || !upserted) throw new Error(upErr?.message ?? "upsert failed");
  const leadId = upserted.id;

  if (!isUnsubscribed) {
    await supabase
      .from("scheduled_emails")
      .update({ status: "skipped" })
      .eq("lead_id", leadId)
      .eq("status", "pending");

    const rows = buildDripRows({ leadId, segment, now: new Date() });
    const { error: seedErr } = await supabase
      .from("scheduled_emails")
      .upsert(rows, { onConflict: "lead_id,template_key", ignoreDuplicates: true });
    if (seedErr) throw new Error(seedErr.message);
  }

  return { leadId, segment };
}
