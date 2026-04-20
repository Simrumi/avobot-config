import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
  }
  _client = createClient(url, key, { auth: { persistSession: false } });
  return _client;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getClient();
    const value = Reflect.get(client, prop, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
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
