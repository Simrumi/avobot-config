import { Heading, Text } from "@react-email/components";
import EmailLayout from "./_Layout";
import type { Lead } from "@/lib/supabase";

const bookingUrl = () => process.env.NEXT_PUBLIC_BOOKING_URL ?? "https://hustlr.com/audit";

export const subject = (_l: Lead) => `Why hiring more staff won't fix your handoffs`;

export default function TeamD1Mechanism({ lead }: { lead: Lead }) {
  return (
    <EmailLayout leadId={lead.id} preview="The reason a coordinator didn't fix this — and what actually does.">
      <Heading style={{ fontSize: 28, fontWeight: 900, margin: "0 0 16px", letterSpacing: -0.5 }}>
        Why hiring didn&apos;t fix it.
      </Heading>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        Team coordination problems get the same three &quot;fixes&quot; — and all three leave the handoff still running through a human neck.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        <strong>Hiring a project manager</strong> just puts a human middleman on the broken handoff. They become another person work has to pass through.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        <strong>SOPs</strong> describe the handoff. They don&apos;t enforce it. People still ping you to clarify step 3 every week.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        <strong>Project management SaaS</strong> measures the problem — it doesn&apos;t fix it. It&apos;s now a graveyard of half-updated cards.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        Agents are different. They sit between your team members like a silent project manager that never sleeps — briefing the next person automatically, with full context, the moment the previous step finishes. That&apos;s the mechanism.
      </Text>
      <Text style={{ margin: "24px 0" }}>
        <a href={bookingUrl()} style={{ backgroundColor: "#E8524A", color: "#fff", padding: "14px 24px", fontWeight: 700, textDecoration: "none", borderRadius: 4, display: "inline-block" }}>
          See it on your stack — book the call
        </a>
      </Text>
    </EmailLayout>
  );
}
