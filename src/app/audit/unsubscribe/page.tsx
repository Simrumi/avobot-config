import { supabase } from "@/lib/supabase";
import { verifyLeadToken } from "@/lib/email/unsubscribe";

type SP = { lead?: string; t?: string };

export default async function UnsubscribePage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const leadId = sp.lead ?? "";
  const token = sp.t ?? "";
  const valid = !!leadId && !!token && verifyLeadToken(leadId, token);

  let result: "unsubscribed" | "already" | "invalid" = "invalid";
  if (valid) {
    const { data } = await supabase.from("leads").select("unsubscribed_at").eq("id", leadId).maybeSingle();
    if (data?.unsubscribed_at) {
      result = "already";
    } else if (data) {
      await supabase.from("leads").update({ unsubscribed_at: new Date().toISOString() }).eq("id", leadId);
      await supabase.from("scheduled_emails").update({ status: "skipped" }).eq("lead_id", leadId).eq("status", "pending");
      result = "unsubscribed";
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FBF8F4] px-6">
      <div className="max-w-md text-center">
        {result === "unsubscribed" && (
          <>
            <h1 className="text-3xl font-black mb-4">You&apos;re out.</h1>
            <p className="text-black/70">We&apos;ve stopped the emails. Sorry it wasn&apos;t a fit.</p>
          </>
        )}
        {result === "already" && (
          <>
            <h1 className="text-3xl font-black mb-4">Already unsubscribed.</h1>
            <p className="text-black/70">You&apos;re not on the list. Nothing to do.</p>
          </>
        )}
        {result === "invalid" && (
          <>
            <h1 className="text-3xl font-black mb-4">Link expired.</h1>
            <p className="text-black/70">
              That unsubscribe link isn&apos;t valid. Reply to any of our emails and
              we&apos;ll remove you manually.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
