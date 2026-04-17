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

  const existing = await supabase
    .from("leads")
    .select("id,unsubscribed_at")
    .eq("email", parsed.capture.email)
    .maybeSingle();

  let leadId: string;
  let isUnsubscribed = false;

  if (existing.data) {
    leadId = existing.data.id;
    isUnsubscribed = !!existing.data.unsubscribed_at;
    const { error: updErr } = await supabase
      .from("leads")
      .update({
        name: parsed.capture.name,
        whatsapp: parsed.capture.whatsapp || null,
        company: parsed.capture.company || null,
        country: parsed.capture.country,
        segment,
        urgency,
        team_tier,
        answers: parsed,
      })
      .eq("id", leadId);
    if (updErr) throw new Error(updErr.message);
  } else {
    const { data: ins, error: insErr } = await supabase
      .from("leads")
      .insert({
        name: parsed.capture.name,
        email: parsed.capture.email,
        whatsapp: parsed.capture.whatsapp || null,
        company: parsed.capture.company || null,
        country: parsed.capture.country,
        segment,
        urgency,
        team_tier,
        answers: parsed,
      })
      .select("id")
      .single();
    if (insErr || !ins) throw new Error(insErr?.message ?? "insert failed");
    leadId = ins.id;
  }

  if (!isUnsubscribed) {
    await supabase
      .from("scheduled_emails")
      .update({ status: "skipped" })
      .eq("lead_id", leadId)
      .eq("status", "pending");

    const rows = buildDripRows({ leadId, segment, now: new Date() });
    const { error: seedErr } = await supabase.from("scheduled_emails").insert(rows);
    if (seedErr) throw new Error(seedErr.message);
  }

  return { leadId, segment };
}
