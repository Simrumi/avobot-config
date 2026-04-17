import { NextResponse } from "next/server";
import { supabase, type ScheduledEmail } from "@/lib/supabase";
import { sendScheduledEmail } from "@/lib/drip/send";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

export async function POST(req: Request) {
  const auth = req.headers.get("authorization") ?? "";
  const expected = `Bearer ${process.env.CRON_SECRET ?? ""}`;
  if (!process.env.CRON_SECRET || auth !== expected) return unauthorized();

  const started = Date.now();
  let processed = 0;
  let sent = 0;
  let failed = 0;
  let skipped = 0;

  const { data: candidates } = await supabase
    .from("scheduled_emails")
    .select("id")
    .eq("status", "pending")
    .lte("send_at", new Date().toISOString())
    .lt("attempts", 3)
    .order("send_at", { ascending: true })
    .limit(50);

  for (const c of candidates ?? []) {
    const { data: claimed } = await supabase
      .from("scheduled_emails")
      .update({ status: "in_flight" })
      .eq("id", c.id)
      .eq("status", "pending")
      .select("*")
      .maybeSingle();

    if (!claimed) continue;

    const row = claimed as ScheduledEmail;
    const nextAttempts = row.attempts + 1;
    await supabase
      .from("scheduled_emails")
      .update({ attempts: nextAttempts })
      .eq("id", row.id);

    processed++;
    const outcome = await sendScheduledEmail({ ...row, attempts: nextAttempts });
    if (outcome === "sent") sent++;
    else if (outcome === "skipped") skipped++;
    else failed++;
  }

  const body = { processed, sent, failed, skipped, duration_ms: Date.now() - started };
  console.log(JSON.stringify({ job: "send-drip", ...body }));
  return NextResponse.json(body);
}
