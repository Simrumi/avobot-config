import { Heading, Text } from "@react-email/components";
import EmailLayout from "./_Layout";
import type { Lead } from "@/lib/supabase";

const bookingUrl = () => process.env.NEXT_PUBLIC_BOOKING_URL ?? "https://hustlr.com/audit";

export const subject = (_l: Lead) => `Why hiring more staff won't fix your lead leaks`;

export default function SalesD1Mechanism({ lead }: { lead: Lead }) {
  return (
    <EmailLayout leadId={lead.id} preview="The reason an SDR and a CRM haven't fixed your pipeline leaks — and what actually does.">
      <Heading style={{ fontSize: 28, fontWeight: 900, margin: "0 0 16px", letterSpacing: -0.5 }}>
        Why hiring didn&apos;t fix it.
      </Heading>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        Pipeline leaks get the same three &quot;fixes&quot; — and all three leave follow-up discipline still running through a human neck.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        <strong>Hiring an SDR</strong> front-loads cost before the system can support them. They&apos;re great on calls — the follow-up still drops when their day gets busy.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        <strong>SOPs</strong> tell reps what to do — they don&apos;t do it when the rep is on another call. Everyone agrees with the follow-up process. Nobody follows it on bad days.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        <strong>CRMs</strong> track pipeline — they don&apos;t move it. Your CRM tells you every lead you&apos;re not following up on. Helpful. Demoralising.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        Agents replace the follow-up discipline you wish you had. When a lead comes in, the agent acts — immediately, every time, in your voice. Unlike a human, it never has a bad day. That&apos;s the mechanism.
      </Text>
      <Text style={{ margin: "24px 0" }}>
        <a href={bookingUrl()} style={{ backgroundColor: "#E8524A", color: "#fff", padding: "14px 24px", fontWeight: 700, textDecoration: "none", borderRadius: 4, display: "inline-block" }}>
          See it on your stack — book the call
        </a>
      </Text>
    </EmailLayout>
  );
}
