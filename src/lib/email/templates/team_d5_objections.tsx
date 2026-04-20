import { Heading, Text } from "@react-email/components";
import EmailLayout from "./_Layout";
import type { Lead } from "@/lib/supabase";

const bookingUrl = () => process.env.NEXT_PUBLIC_BOOKING_URL ?? "https://hustlr.com/audit";

export const subject = (_l: Lead) => `"My team won't adopt another tool" — read this`;

export default function TeamD5Objections({ lead }: { lead: Lead }) {
  return (
    <EmailLayout leadId={lead.id} preview="The three objections I hear before every team audit — and why they're wrong.">
      <Heading style={{ fontSize: 28, fontWeight: 900, margin: "0 0 16px" }}>
        The three things people tell me before they book.
      </Heading>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        <strong>&quot;My team won&apos;t adopt another tool.&quot;</strong> Agents don&apos;t add a new app — they work through the tools your team already uses (Slack, email, Drive). Nothing new to log in to.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        <strong>&quot;Won&apos;t this make people feel surveilled?&quot;</strong> We frame it as an assistant, not a monitor. Teams consistently report feeling more supported, not watched. The agent helps them — it doesn&apos;t report on them.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        <strong>&quot;We&apos;re too small for this.&quot;</strong> Small teams feel handoff pain more per-head, not less. One agent often replaces a PM hire you were dreading making anyway.
      </Text>
      <Text style={{ margin: "24px 0" }}>
        <a href={bookingUrl()} style={{ backgroundColor: "#E8524A", color: "#fff", padding: "14px 24px", fontWeight: 700, textDecoration: "none", borderRadius: 4, display: "inline-block" }}>
          Book the free audit
        </a>
      </Text>
    </EmailLayout>
  );
}
