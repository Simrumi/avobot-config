import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function verifySignature(raw: string, signature: string | null): boolean {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const expected = createHmac("sha256", secret).update(raw).digest("hex");
  try {
    const a = Buffer.from(expected, "hex");
    const b = Buffer.from(signature, "hex");
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

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
  const sig = req.headers.get("svix-signature") ?? req.headers.get("resend-signature");
  if (!verifySignature(raw, sig)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  const evt = JSON.parse(raw) as ResendEvent;
  const refId = evt.data?.headers?.["X-Entity-Ref-ID"] ?? evt.data?.headers?.["x-entity-ref-id"];
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
