import { supabase } from "@/lib/supabase";
import { verifyLeadToken } from "@/lib/email/unsubscribe";
import { confirmUnsubscribe } from "./actions";

type SP = { lead?: string; t?: string; done?: string };

type ViewState = "confirm" | "already" | "invalid" | "unsubscribed";

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const leadId = sp.lead ?? "";
  const token = sp.t ?? "";
  const valid = !!leadId && !!token && verifyLeadToken(leadId, token);

  let state: ViewState = "invalid";
  if (sp.done === "1" && valid) {
    state = "unsubscribed";
  } else if (valid) {
    const { data } = await supabase
      .from("leads")
      .select("unsubscribed_at")
      .eq("id", leadId)
      .maybeSingle();
    if (!data) {
      state = "invalid";
    } else if (data.unsubscribed_at) {
      state = "already";
    } else {
      state = "confirm";
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FBF8F4] px-6">
      <div className="max-w-md text-center">
        {state === "confirm" && (
          <>
            <h1 className="text-3xl font-black mb-4">Unsubscribe?</h1>
            <p className="text-black/70 mb-6">
              One more click and we&apos;ll stop the emails.
            </p>
            <form action={confirmUnsubscribe}>
              <input type="hidden" name="lead" value={leadId} />
              <input type="hidden" name="t" value={token} />
              <button
                type="submit"
                className="bg-[#E8524A] text-white px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-[#d14a43] transition-colors rounded"
              >
                Confirm unsubscribe
              </button>
            </form>
          </>
        )}
        {state === "unsubscribed" && (
          <>
            <h1 className="text-3xl font-black mb-4">You&apos;re out.</h1>
            <p className="text-black/70">
              We&apos;ve stopped the emails. Sorry it wasn&apos;t a fit.
            </p>
          </>
        )}
        {state === "already" && (
          <>
            <h1 className="text-3xl font-black mb-4">Already unsubscribed.</h1>
            <p className="text-black/70">
              You&apos;re not on the list. Nothing to do.
            </p>
          </>
        )}
        {state === "invalid" && (
          <>
            <h1 className="text-3xl font-black mb-4">Link expired.</h1>
            <p className="text-black/70">
              That unsubscribe link isn&apos;t valid. Reply to any of our emails
              and we&apos;ll remove you manually.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
