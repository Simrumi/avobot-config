import { Heading, Text } from "@react-email/components";
import EmailLayout from "./_Layout";
import type { Lead } from "@/lib/supabase";

const bookingUrl = () => process.env.NEXT_PUBLIC_BOOKING_URL ?? "https://hustlr.com/audit";

export const subject = (_l: Lead) => `"Won't AI email feel robotic?" — read this`;

export default function SalesD5Objections({ lead }: { lead: Lead }) {
  return (
    <EmailLayout leadId={lead.id} preview="The three objections I hear before every sales audit — and why they're wrong.">
      <Heading style={{ fontSize: 28, fontWeight: 900, margin: "0 0 16px" }}>
        The three things people tell me before they book.
      </Heading>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        <strong>&quot;Won&apos;t AI email feel robotic?&quot;</strong> The agent writes in your voice from your past emails. Prospects can&apos;t tell. Replies prove it.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        <strong>&quot;We&apos;ll lose the relationship if a bot follows up.&quot;</strong> The bot handles the touches a human was never going to make anyway. Relationships form on the call — which you still take.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        <strong>&quot;Our sales cycle is too complex.&quot;</strong> Complex cycles benefit more — the agent carries the context the rep keeps dropping. The more nuanced your process, the more value the agent adds.
      </Text>
      <Text style={{ margin: "24px 0" }}>
        <a href={bookingUrl()} style={{ backgroundColor: "#E8524A", color: "#fff", padding: "14px 24px", fontWeight: 700, textDecoration: "none", borderRadius: 4, display: "inline-block" }}>
          Book the free audit
        </a>
      </Text>
    </EmailLayout>
  );
}
