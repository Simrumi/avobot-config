import { Heading, Section, Text } from "@react-email/components";
import EmailLayout from "./_Layout";
import type { Lead } from "@/lib/supabase";

const bookingUrl = () => process.env.NEXT_PUBLIC_BOOKING_URL ?? "https://hustlr.com/audit";
const firstName = (l: Lead) => l.name.split(/\s+/)[0] || l.name;

export const subject = (l: Lead) => `${firstName(l)}, here's where AI wins you 20 hrs/week`;

export default function TeamD0Result({ lead }: { lead: Lead }) {
  return (
    <EmailLayout leadId={lead.id} preview="Your personalised AI audit — 3 specific automations for your team.">
      <Heading style={{ fontSize: 28, fontWeight: 900, margin: "0 0 16px", letterSpacing: -0.5 }}>
        {firstName(lead)}, here&apos;s what I found.
      </Heading>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        Your team isn&apos;t slow — your handoffs are. The work moves fast inside any one person&apos;s head. It dies every time it crosses between them. Based on your quiz answers, that gap is almost certainly costing you 15–25 hours a week across the team.
      </Text>
      <Section style={{ backgroundColor: "#fff", padding: 16, borderRadius: 4, margin: "16px 0" }}>
        <Text style={{ margin: 0, fontWeight: 700 }}>1. Handoff briefing agent</Text>
        <Text style={{ margin: "4px 0 12px", color: "#555" }}>When step 1 finishes, automatically briefs the next person — full context, files attached, checklist pre-populated.</Text>
        <Text style={{ margin: 0, fontWeight: 700 }}>2. Onboarding agent</Text>
        <Text style={{ margin: "4px 0 12px", color: "#555" }}>Gets new hires productive in week 1 instead of month 2. Walks them through your process without pulling anyone off their work.</Text>
        <Text style={{ margin: 0, fontWeight: 700 }}>3. Status-nudge agent</Text>
        <Text style={{ margin: "4px 0", color: "#555" }}>Kills the &quot;any update?&quot; pings. When something stalls, the agent nudges — so you don&apos;t have to.</Text>
      </Section>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        Want me to walk you through how to build these for your specific stack? Grab 30 mins — I&apos;ll show you the exact setup and the rough ROI.
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
