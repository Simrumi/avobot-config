import { Heading, Text } from "@react-email/components";
import EmailLayout from "./_Layout";
import type { Lead } from "@/lib/supabase";

const bookingUrl = () => process.env.NEXT_PUBLIC_BOOKING_URL ?? "https://hustlr.com/audit";

export const subject = (_l: Lead) => `Why hiring more staff won't fix your admin drag`;

export default function OpsD1Mechanism({ lead }: { lead: Lead }) {
  return (
    <EmailLayout leadId={lead.id} preview="The reason hiring + SOPs haven't fixed this.">
      <Heading style={{ fontSize: 28, fontWeight: 900, margin: "0 0 16px", letterSpacing: -0.5 }}>
        Why hiring didn&apos;t fix it.
      </Heading>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        Most ops bottlenecks get the same three &quot;fixes&quot; — and all three leave the work still running through a human neck.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        <strong>Hiring</strong> moves the bottleneck to whoever you hired. Great hire? You&apos;re still one flu day from the backlog.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        <strong>SOPs</strong> describe the work. They don&apos;t do the work. And nobody reads them under pressure.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        <strong>SaaS</strong> solves the 60% of your process that matches their product. The 40% that doesn&apos;t is where all your time goes.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        Agents are different. They adapt to your process, execute the rule-based work end-to-end, and only tap a human for genuine judgment calls. That&apos;s the mechanism.
      </Text>
      <Text style={{ margin: "24px 0" }}>
        <a href={bookingUrl()} style={{ backgroundColor: "#E8524A", color: "#fff", padding: "14px 24px", fontWeight: 700, textDecoration: "none", borderRadius: 4, display: "inline-block" }}>
          See it on your stack — book the call
        </a>
      </Text>
    </EmailLayout>
  );
}
