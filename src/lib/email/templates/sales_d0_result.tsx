import { Heading, Section, Text } from "@react-email/components";
import EmailLayout from "./_Layout";
import type { Lead } from "@/lib/supabase";

const bookingUrl = () => process.env.NEXT_PUBLIC_BOOKING_URL ?? "https://hustlr.com/audit";
const firstName = (l: Lead) => l.name.split(/\s+/)[0] || l.name;

export const subject = (l: Lead) => `${firstName(l)}, here's where AI wins you 20 hrs/week`;

export default function SalesD0Result({ lead }: { lead: Lead }) {
  return (
    <EmailLayout leadId={lead.id} preview="Your personalised AI audit — 3 specific automations for your sales funnel.">
      <Heading style={{ fontSize: 28, fontWeight: 900, margin: "0 0 16px", letterSpacing: -0.5 }}>
        {firstName(lead)}, here&apos;s what I found.
      </Heading>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        Your leads aren&apos;t cold — they&apos;re forgotten. Inbound shows up hot. It goes cold in your inbox while you were on another call. Based on your quiz answers, that follow-up gap is almost certainly costing you deals every single week.
      </Text>
      <Section style={{ backgroundColor: "#fff", padding: 16, borderRadius: 4, margin: "16px 0" }}>
        <Text style={{ margin: 0, fontWeight: 700 }}>1. Lead follow-up agent</Text>
        <Text style={{ margin: "4px 0 12px", color: "#555" }}>Qualifies new leads, sends a contextual first response in minutes, books the call when they&apos;re warm — without you touching the inbox.</Text>
        <Text style={{ margin: 0, fontWeight: 700 }}>2. Lead-revival agent</Text>
        <Text style={{ margin: "4px 0 12px", color: "#555" }}>Surfaces stalled deals worth re-engaging. Recovers the pipeline you thought was dead.</Text>
        <Text style={{ margin: 0, fontWeight: 700 }}>3. CRM hygiene agent</Text>
        <Text style={{ margin: "4px 0", color: "#555" }}>Keeps your pipeline accurate without manual data entry. Every contact, every touch point, logged automatically.</Text>
      </Section>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        Want me to walk you through how to build these for your funnel? Grab 30 mins — I&apos;ll show you the exact setup and the rough ROI.
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
