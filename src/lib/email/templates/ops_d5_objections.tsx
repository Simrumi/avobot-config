import { Heading, Text } from "@react-email/components";
import EmailLayout from "./_Layout";
import type { Lead } from "@/lib/supabase";

const bookingUrl = () => process.env.NEXT_PUBLIC_BOOKING_URL ?? "https://hustlr.com/audit";

export const subject = (_l: Lead) => `"We're too small for AI" — read this`;

export default function OpsD5Objections({ lead }: { lead: Lead }) {
  return (
    <EmailLayout leadId={lead.id} preview="The three objections that hold small ops teams back — and why they're wrong.">
      <Heading style={{ fontSize: 28, fontWeight: 900, margin: "0 0 16px" }}>
        The three things people tell me before they book.
      </Heading>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        <strong>&quot;We&apos;re too small.&quot;</strong> Smaller teams benefit more. One agent carries half a seat&apos;s load. Our smallest client is 2 people.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        <strong>&quot;AI will get it wrong.&quot;</strong> Agents run with guardrails. The ambiguous 5% goes to a human. The rule-based 95% gets done correctly, 24/7.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        <strong>&quot;We can&apos;t afford it.&quot;</strong> Most ops agents pay back in month one. The audit itself is free — you find out before you commit.
      </Text>
      <Text style={{ margin: "24px 0" }}>
        <a href={bookingUrl()} style={{ backgroundColor: "#E8524A", color: "#fff", padding: "14px 24px", fontWeight: 700, textDecoration: "none", borderRadius: 4, display: "inline-block" }}>
          Book the free audit
        </a>
      </Text>
    </EmailLayout>
  );
}
