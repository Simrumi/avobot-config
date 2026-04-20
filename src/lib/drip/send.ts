import { Resend } from "resend";
import { supabase, type Lead, type ScheduledEmail } from "@/lib/supabase";
import { getTemplate } from "@/lib/email/templates";
import { renderEmail } from "@/lib/email/render";

function resend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is required");
  return new Resend(key);
}

function fromAddress(): string {
  const f = process.env.RESEND_FROM_EMAIL;
  if (!f) throw new Error("RESEND_FROM_EMAIL is required");
  return f;
}

export type SendOutcome = "sent" | "failed" | "retried" | "skipped";

export async function sendScheduledEmail(row: ScheduledEmail): Promise<SendOutcome> {
  const { data: leadRow, error: leadErr } = await supabase
    .from("leads")
    .select("*")
    .eq("id", row.lead_id)
    .single();

  if (leadErr || !leadRow) {
    await supabase.from("scheduled_emails").update({ status: "failed", error: leadErr?.message ?? "lead not found" }).eq("id", row.id);
    return "failed";
  }

  const lead = leadRow as Lead;

  if (lead.unsubscribed_at) {
    await supabase.from("scheduled_emails").update({ status: "skipped" }).eq("id", row.id);
    return "skipped";
  }

  const tpl = getTemplate(row.template_key);
  if (!tpl) {
    await supabase.from("scheduled_emails").update({ status: "failed", error: `unknown template_key ${row.template_key}` }).eq("id", row.id);
    return "failed";
  }

  try {
    const el = tpl.component({ lead });
    const { html, text } = await renderEmail(el);
    const subject = tpl.subject(lead);

    const sendRes = await resend().emails.send({
      from: fromAddress(),
      to: lead.email,
      replyTo: "hello@hustlr.com",
      subject,
      html,
      text,
      headers: { "X-Entity-Ref-ID": row.id },
    });

    if (sendRes.error) throw new Error(sendRes.error.message);

    await supabase
      .from("scheduled_emails")
      .update({ status: "sent", sent_at: new Date().toISOString() })
      .eq("id", row.id);
    return "sent";
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    const terminal = row.attempts >= 3;
    await supabase
      .from("scheduled_emails")
      .update({ status: terminal ? "failed" : "pending", error: message })
      .eq("id", row.id);
    return terminal ? "failed" : "retried";
  }
}
