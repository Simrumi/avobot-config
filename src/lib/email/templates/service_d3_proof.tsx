import { Heading, Text } from "@react-email/components";
import EmailLayout from "./_Layout";
import type { Lead } from "@/lib/supabase";

const bookingUrl = () => process.env.NEXT_PUBLIC_BOOKING_URL ?? "https://hustlr.com/audit";

export const subject = (_l: Lead) => `73% deflection — here's what this Singapore e-commerce brand did`;

export default function ServiceD3Proof({ lead }: { lead: Lead }) {
  return (
    <EmailLayout leadId={lead.id} preview="Real numbers from an e-commerce brand that resolved the majority of tickets end-to-end.">
      <Heading style={{ fontSize: 28, fontWeight: 900, margin: "0 0 16px" }}>
        73% deflection — one agent.
      </Heading>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        A Singapore e-commerce brand was drowning in Tier-1 tickets. Order status, return requests, shipping questions — the same 15 questions, asked 100 times a day. Their support team was burnt out answering things a document could answer.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        We built one resolution agent. It reads their past tickets, their help docs, and does live order lookups. It responds in their brand tone. When the answer is clear, it resolves end-to-end. When it&apos;s not, it drafts and hands to a human with the full conversation context already written.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        Result: 73% of Tier-1 tickets resolved without a human. The support team now spends their time on the 27% that actually needs them.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        A separate KL services firm cut first-touch response time from 8 minutes to 45 seconds with a first-touch agent — customers stopped abandoning the queue before anyone replied.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        You&apos;ve got at least one category like this in your ticket queue. The audit call finds it.
      </Text>
      <Text style={{ margin: "24px 0" }}>
        <a href={bookingUrl()} style={{ backgroundColor: "#E8524A", color: "#fff", padding: "14px 24px", fontWeight: 700, textDecoration: "none", borderRadius: 4, display: "inline-block" }}>
          Find yours — book the call
        </a>
      </Text>
    </EmailLayout>
  );
}
