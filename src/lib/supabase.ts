import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
}

export const supabase = createClient(url, key, {
  auth: { persistSession: false },
});

export type Lead = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  whatsapp: string | null;
  company: string | null;
  country: "MY" | "SG" | "OTHER";
  segment: "ops" | "team" | "sales" | "service";
  urgency: "low" | "med" | "high";
  team_tier: "solo" | "2-5" | "6-20" | "20+";
  answers: unknown;
  unsubscribed_at: string | null;
  utm: unknown | null;
};

export type ScheduledEmail = {
  id: string;
  lead_id: string;
  template_key: string;
  send_at: string;
  sent_at: string | null;
  status: "pending" | "in_flight" | "sent" | "failed" | "skipped";
  error: string | null;
  attempts: number;
};
