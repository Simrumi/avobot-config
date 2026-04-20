import { Heading, Text } from "@react-email/components";
import EmailLayout from "./_Layout";
import type { Lead } from "@/lib/supabase";

const bookingUrl = () => process.env.NEXT_PUBLIC_BOOKING_URL ?? "https://hustlr.com/audit";

export const subject = (_l: Lead) => `3x faster onboarding — here's what this Singapore consultancy did`;

export default function TeamD3Proof({ lead }: { lead: Lead }) {
  return (
    <EmailLayout leadId={lead.id} preview="Real numbers from a consultancy that fixed new-hire ramp time with one agent.">
      <Heading style={{ fontSize: 28, fontWeight: 900, margin: "0 0 16px" }}>
        3x faster onboarding — one agent.
      </Heading>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        A Singapore consultancy was losing 6–8 weeks getting every new hire up to speed. Tribal knowledge, ad-hoc Slack threads, senior staff constantly pulled off client work to answer the same questions.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        We built one onboarding agent. It walks new hires through their first 30 days — step by step, context included, the relevant docs surfaced at the right moment. It answers FAQs in plain language drawn from their actual internal knowledge base.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        Result: new hires are productive in week 1 instead of month 2. Senior staff got their time back. The onboarding experience is now consistent regardless of who hired them.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        And a KL creative studio cut &quot;status?&quot; pings by 60% with a separate handoff agent — clients and PMs always know exactly where work stands without asking.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        You&apos;ve got at least one of these hiding in your team&apos;s workflow. The audit call finds it.
      </Text>
      <Text style={{ margin: "24px 0" }}>
        <a href={bookingUrl()} style={{ backgroundColor: "#E8524A", color: "#fff", padding: "14px 24px", fontWeight: 700, textDecoration: "none", borderRadius: 4, display: "inline-block" }}>
          Find yours — book the call
        </a>
      </Text>
    </EmailLayout>
  );
}
