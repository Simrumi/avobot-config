import { Heading, Text } from "@react-email/components";
import EmailLayout from "./_Layout";
import type { Lead } from "@/lib/supabase";

const bookingUrl = () => process.env.NEXT_PUBLIC_BOOKING_URL ?? "https://hustlr.com/audit";

export const subject = (_l: Lead) => `Last one from me — then I'll stop emailing`;

export default function OpsD9LastCall({ lead }: { lead: Lead }) {
  return (
    <EmailLayout leadId={lead.id} preview="Final nudge before I close the loop.">
      <Heading style={{ fontSize: 28, fontWeight: 900, margin: "0 0 16px" }}>
        Last one from me.
      </Heading>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        This is the last email in this sequence. If the audit call isn&apos;t a fit, no worries — I&apos;ll stop emailing after this.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        We only onboard 3 SMEs a month because we build every agent live alongside the client. If your ops load is getting worse not better, this is the door.
      </Text>
      <Text style={{ margin: "24px 0" }}>
        <a href={bookingUrl()} style={{ backgroundColor: "#E8524A", color: "#fff", padding: "14px 24px", fontWeight: 700, textDecoration: "none", borderRadius: 4, display: "inline-block" }}>
          Book the final audit slot
        </a>
      </Text>
      <Text style={{ fontSize: 14, color: "#666" }}>— Jeremy</Text>
    </EmailLayout>
  );
}
