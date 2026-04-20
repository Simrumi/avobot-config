import { Heading, Text } from "@react-email/components";
import EmailLayout from "./_Layout";
import type { Lead } from "@/lib/supabase";

const bookingUrl = () => process.env.NEXT_PUBLIC_BOOKING_URL ?? "https://hustlr.com/audit";

export const subject = (_l: Lead) => `"What if the AI answers wrong?" — read this`;

export default function ServiceD5Objections({ lead }: { lead: Lead }) {
  return (
    <EmailLayout leadId={lead.id} preview="The three objections I hear before every service audit — and why they're wrong.">
      <Heading style={{ fontSize: 28, fontWeight: 900, margin: "0 0 16px" }}>
        The three things people tell me before they book.
      </Heading>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        <strong>&quot;What if the AI answers wrong?&quot;</strong> The agent only resolves confidently. When confidence is low, it drafts and hands to a human. Wrong answers are vanishingly rare in practice.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        <strong>&quot;Our product is too niche.&quot;</strong> Niche is an advantage — the agent reads your own docs and tickets, not the public internet. The more specific your domain, the better it performs.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        <strong>&quot;Will customers hate it?&quot;</strong> Customers hate waiting. They don&apos;t care who answers — only that it&apos;s fast and correct. A 45-second response beats an 8-minute one every time.
      </Text>
      <Text style={{ margin: "24px 0" }}>
        <a href={bookingUrl()} style={{ backgroundColor: "#E8524A", color: "#fff", padding: "14px 24px", fontWeight: 700, textDecoration: "none", borderRadius: 4, display: "inline-block" }}>
          Book the free audit
        </a>
      </Text>
    </EmailLayout>
  );
}
