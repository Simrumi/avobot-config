import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ResendEvent = {
  type: string;
  created_at?: string;
  data?: {
    email_id?: string;
    to?: string | string[];
    headers?: Record<string, string>;
  };
};

export async function POST(req: Request) {
  const raw = await req.text();
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "not configured" }, { status: 500 });
  }

  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");
  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  let evt: ResendEvent;
  try {
    const wh = new Webhook(secret);
    evt = wh.verify(raw, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ResendEvent;
  } catch {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  const refId =
    evt.data?.headers?.["X-Entity-Ref-ID"] ??
    evt.data?.headers?.["x-entity-ref-id"];
  const eventType = evt.type.replace(/^email\./, "");

  if (!refId) return NextResponse.json({ ok: true });

  const { data: row } = await supabase
    .from("scheduled_emails")
    .select("lead_id,template_key")
    .eq("id", refId)
    .maybeSingle();

  if (!row) return NextResponse.json({ ok: true });

  await supabase.from("email_events").insert({
    lead_id: row.lead_id,
    template_key: row.template_key,
    event_type: eventType,
    payload: evt,
  });

  return NextResponse.json({ ok: true });
}
