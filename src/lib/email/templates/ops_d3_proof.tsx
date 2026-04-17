import { Heading, Text } from "@react-email/components";
import EmailLayout from "./_Layout";
import type { Lead } from "@/lib/supabase";

const bookingUrl = () => process.env.NEXT_PUBLIC_BOOKING_URL ?? "https://hustlr.com/audit";

export const subject = (_l: Lead) => `A Shah Alam SME saved RM38K/mo — here's what they did`;

export default function OpsD3Proof({ lead }: { lead: Lead }) {
  return (
    <EmailLayout leadId={lead.id} preview="Real numbers from a logistics SME that nuked manual reconciliation.">
      <Heading style={{ fontSize: 28, fontWeight: 900, margin: "0 0 16px" }}>
        RM38K/mo — one agent.
      </Heading>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        A logistics SME in Shah Alam was spending 3 full days a week on invoice-matching. Three people, rotating, every single week.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        We built one agent. It reads incoming invoices from email attachments, matches them against the POs in their ERP, flags the ~5% with discrepancies for a human, and auto-approves the rest.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        Result: 22 hours/week back across the team. Measured over 90 days, that&apos;s RM38K/month saved — not counting the fact that the team now actually takes lunch.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        You&apos;ve got at least one of these hiding in your ops stack. The audit call finds it.
      </Text>
      <Text style={{ margin: "24px 0" }}>
        <a href={bookingUrl()} style={{ backgroundColor: "#E8524A", color: "#fff", padding: "14px 24px", fontWeight: 700, textDecoration: "none", borderRadius: 4, display: "inline-block" }}>
          Find yours — book the call
        </a>
      </Text>
    </EmailLayout>
  );
}
