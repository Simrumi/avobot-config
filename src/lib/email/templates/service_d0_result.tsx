import { Heading, Section, Text } from "@react-email/components";
import EmailLayout from "./_Layout";
import type { Lead } from "@/lib/supabase";

const bookingUrl = () => process.env.NEXT_PUBLIC_BOOKING_URL ?? "https://hustlr.com/audit";
const firstName = (l: Lead) => l.name.split(/\s+/)[0] || l.name;

export const subject = (l: Lead) => `${firstName(l)}, here's where AI wins you 20 hrs/week`;

export default function ServiceD0Result({ lead }: { lead: Lead }) {
  return (
    <EmailLayout leadId={lead.id} preview="Your personalised AI audit — 3 specific automations for your support queue.">
      <Heading style={{ fontSize: 28, fontWeight: 900, margin: "0 0 16px", letterSpacing: -0.5 }}>
        {firstName(lead)}, here&apos;s what I found.
      </Heading>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        You&apos;re not answering questions — you&apos;re answering the same ones. 80% of what your support team types today is something they typed last week. Based on your quiz answers, that repetition is almost certainly costing you 15–25 hours a week.
      </Text>
      <Section style={{ backgroundColor: "#fff", padding: 16, borderRadius: 4, margin: "16px 0" }}>
        <Text style={{ margin: 0, fontWeight: 700 }}>1. Tier-1 resolution agent</Text>
        <Text style={{ margin: "4px 0 12px", color: "#555" }}>Handles the questions you answer the same way every time — trained on your actual tickets and docs. 73% deflection rate in practice.</Text>
        <Text style={{ margin: 0, fontWeight: 700 }}>2. First-touch agent</Text>
        <Text style={{ margin: "4px 0 12px", color: "#555" }}>Responds to every inbound ticket in under a minute. Ends the queue anxiety. Customers stop wondering if anyone&apos;s there.</Text>
        <Text style={{ margin: 0, fontWeight: 700 }}>3. Escalation triage agent</Text>
        <Text style={{ margin: "4px 0", color: "#555" }}>When an issue genuinely needs a human, it hands off with full context pre-written. Your team picks up mid-resolution, not from scratch.</Text>
      </Section>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        Want me to walk you through how to build these for your support stack? Grab 30 mins — I&apos;ll show you the exact setup and the rough ROI.
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
