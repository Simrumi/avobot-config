import { Heading, Section, Text } from "@react-email/components";
import EmailLayout from "./_Layout";
import type { Lead } from "@/lib/supabase";

const bookingUrl = () => process.env.NEXT_PUBLIC_BOOKING_URL ?? "https://hustlr.com/audit";
const firstName = (l: Lead) => l.name.split(/\s+/)[0] || l.name;

export const subject = (l: Lead) => `${firstName(l)}, here's where AI wins you 20 hrs/week`;

export default function OpsD0Result({ lead }: { lead: Lead }) {
  return (
    <EmailLayout leadId={lead.id} preview="Your personalised AI audit — 3 specific automations.">
      <Heading style={{ fontSize: 28, fontWeight: 900, margin: "0 0 16px", letterSpacing: -0.5 }}>
        {firstName(lead)}, here&apos;s what I found.
      </Heading>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        Based on your quiz answers, your ops load is almost certainly bleeding you 15–25 hours a week. Here are the three automations I&apos;d start with for a business your size:
      </Text>
      <Section style={{ backgroundColor: "#fff", padding: 16, borderRadius: 4, margin: "16px 0" }}>
        <Text style={{ margin: 0, fontWeight: 700 }}>1. Invoice-matching agent</Text>
        <Text style={{ margin: "4px 0 12px", color: "#555" }}>Auto-match POs to invoices, flag discrepancies. Kills your month-end chase.</Text>
        <Text style={{ margin: 0, fontWeight: 700 }}>2. Data-entry agent</Text>
        <Text style={{ margin: "4px 0 12px", color: "#555" }}>Reads PDFs, forms, emails → populates your ERP / sheet / accounting tool.</Text>
        <Text style={{ margin: 0, fontWeight: 700 }}>3. Status-update agent</Text>
        <Text style={{ margin: "4px 0", color: "#555" }}>Pings your team / clients automatically when things move. Kills the &quot;any update?&quot; pings.</Text>
      </Section>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        Want me to walk you through how to actually build these? Grab 30 mins — I&apos;ll show you the exact setup and the rough ROI.
      </Text>
      <Text style={{ margin: "24px 0" }}>
        <a href={bookingUrl()} style={{ backgroundColor: "#E8524A", color: "#fff", padding: "14px 24px", fontWeight: 700, textDecoration: "none", borderRadius: 4, display: "inline-block" }}>
          Book the free audit call
        </a>
      </Text>
      <Text style={{ fontSize: 14, color: "#666", lineHeight: 1.6 }}>— Jeremy @ hustlr</Text>
    </EmailLayout>
  );
}
