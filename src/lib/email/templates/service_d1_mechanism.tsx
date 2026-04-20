import { Heading, Text } from "@react-email/components";
import EmailLayout from "./_Layout";
import type { Lead } from "@/lib/supabase";

const bookingUrl = () => process.env.NEXT_PUBLIC_BOOKING_URL ?? "https://hustlr.com/audit";

export const subject = (_l: Lead) => `Why hiring more staff won't fix your ticket volume`;

export default function ServiceD1Mechanism({ lead }: { lead: Lead }) {
  return (
    <EmailLayout leadId={lead.id} preview="The reason more headcount and chatbots haven't fixed your support queue — and what actually does.">
      <Heading style={{ fontSize: 28, fontWeight: 900, margin: "0 0 16px", letterSpacing: -0.5 }}>
        Why hiring didn&apos;t fix it.
      </Heading>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        Support volume problems get the same three &quot;fixes&quot; — and all three leave the repetitive work still running through a human.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        <strong>Hiring more agents</strong> scales cost with volume — not leverage. Queue is shorter. Cost per ticket hasn&apos;t moved.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        <strong>FAQ pages</strong> exist. Customers don&apos;t read them. You wrote a macro library. Agents use it. Customers still need a human for half of it.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        <strong>Generic chatbots</strong> deflect — they don&apos;t actually resolve. They confidently give wrong answers. You shut it off.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        Agents are different. They read your actual tickets, your help docs, your product data — and they resolve, not deflect. When the answer requires judgment, they hand off with full context pre-written. That&apos;s the mechanism.
      </Text>
      <Text style={{ margin: "24px 0" }}>
        <a href={bookingUrl()} style={{ backgroundColor: "#E8524A", color: "#fff", padding: "14px 24px", fontWeight: 700, textDecoration: "none", borderRadius: 4, display: "inline-block" }}>
          See it on your stack — book the call
        </a>
      </Text>
    </EmailLayout>
  );
}
