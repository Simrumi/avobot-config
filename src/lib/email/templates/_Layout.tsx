import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";
import { signLeadToken } from "../unsubscribe";

type Props = {
  leadId: string;
  preview: string;
  children: ReactNode;
};

export default function EmailLayout({ leadId, preview, children }: Props) {
  const site = process.env.SITE_URL ?? "https://hustlr.com";
  const unsub = `${site}/audit/unsubscribe?lead=${leadId}&t=${signLeadToken(leadId)}`;
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ fontFamily: "system-ui, sans-serif", backgroundColor: "#FBF8F4", color: "#111", margin: 0 }}>
        <Container style={{ maxWidth: 560, margin: "0 auto", padding: "32px 24px" }}>
          <Section>
            <Text style={{ fontSize: 14, letterSpacing: 2, fontWeight: 700, color: "#E8524A", textTransform: "uppercase" }}>
              hustlr
            </Text>
          </Section>
          {children}
          <Hr style={{ borderColor: "#ddd", margin: "40px 0 16px" }} />
          <Text style={{ fontSize: 12, color: "#666", lineHeight: 1.5 }}>
            hustlr — Raffles Place, Singapore<br />
            You&apos;re receiving this because you took the AI audit quiz at hustlr.com.
            {" "}
            <Link href={unsub} style={{ color: "#666" }}>Unsubscribe</Link>.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
