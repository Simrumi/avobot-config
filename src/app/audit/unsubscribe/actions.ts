"use server";

import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { verifyLeadToken } from "@/lib/email/unsubscribe";

export async function confirmUnsubscribe(formData: FormData) {
  const leadId = String(formData.get("lead") ?? "");
  const token = String(formData.get("t") ?? "");
  if (!leadId || !token || !verifyLeadToken(leadId, token)) {
    redirect(`/audit/unsubscribe?lead=${leadId}&t=${token}`);
  }

  const { data } = await supabase
    .from("leads")
    .select("unsubscribed_at")
    .eq("id", leadId)
    .maybeSingle();
  if (!data) {
    redirect(`/audit/unsubscribe?lead=${leadId}&t=${token}`);
  }
  if (!data.unsubscribed_at) {
    await supabase
      .from("leads")
      .update({ unsubscribed_at: new Date().toISOString() })
      .eq("id", leadId);
    await supabase
      .from("scheduled_emails")
      .update({ status: "skipped" })
      .eq("lead_id", leadId)
      .eq("status", "pending");
  }

  redirect(`/audit/unsubscribe?lead=${leadId}&t=${token}&done=1`);
}
