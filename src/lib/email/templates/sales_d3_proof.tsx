import { Heading, Text } from "@react-email/components";
import EmailLayout from "./_Layout";
import type { Lead } from "@/lib/supabase";

const bookingUrl = () => process.env.NEXT_PUBLIC_BOOKING_URL ?? "https://hustlr.com/audit";

export const subject = (_l: Lead) => `2.4x reply rate — here's what this Singapore B2B SaaS did`;

export default function SalesD3Proof({ lead }: { lead: Lead }) {
  return (
    <EmailLayout leadId={lead.id} preview="Real numbers from a B2B SaaS that stopped chasing leads manually.">
      <Heading style={{ fontSize: 28, fontWeight: 900, margin: "0 0 16px" }}>
        2.4x reply rate — one agent.
      </Heading>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        A Singapore B2B SaaS was doing what most teams do — sending the same generic follow-up sequence to every lead, watching replies trickle in, manually chasing the ones that went quiet.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        We built one follow-up agent. It reads what each lead actually said in their initial message, sends a contextual reply within minutes of them filling out the form, and references their specific situation — not a template. Warm leads get booked. Cold leads get nurtured on a schedule.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        Result: 2.4x reply rate. Warmer conversations on calls. Less manual chasing. The reps now spend their time on conversations that are already warm — not trying to resurrect cold ones.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        A KL agency added a lead-revival agent on top and recovered 18 stalled deals in month one — deals they&apos;d written off as dead.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        You&apos;ve got at least one of these leaks in your funnel. The audit call finds it.
      </Text>
      <Text style={{ margin: "24px 0" }}>
        <a href={bookingUrl()} style={{ backgroundColor: "#E8524A", color: "#fff", padding: "14px 24px", fontWeight: 700, textDecoration: "none", borderRadius: 4, display: "inline-block" }}>
          Find yours — book the call
        </a>
      </Text>
    </EmailLayout>
  );
}
