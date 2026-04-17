import { notFound } from "next/navigation";
import type { Segment, Q2Option } from "@/types/quiz";
import { COPY_BY_SEGMENT } from "./_copy";
import {
  FAQ,
  Guarantee,
  Mechanism,
  PainHero,
  Plan,
  Proof,
  WhyNormalFails,
} from "./_components/PresellSections";

const VALID: Segment[] = ["ops", "team", "sales", "service"];

type SP = { segment?: string; id?: string; failed?: string };

function parseFailed(raw: string | undefined): Q2Option[] {
  if (!raw) return [];
  const allowed: Q2Option[] = ["hired", "sops", "saas", "chatgpt", "ignored", "other"];
  return raw.split(",").map((s) => s.trim()).filter((s): s is Q2Option => allowed.includes(s as Q2Option));
}

export default async function ResultPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const segment = sp.segment as Segment | undefined;
  if (!segment || !VALID.includes(segment)) return notFound();
  const copy = COPY_BY_SEGMENT[segment];
  const failed = parseFailed(sp.failed);

  return (
    <main className="min-h-screen">
      <PainHero copy={copy} />
      <WhyNormalFails copy={copy} failed={failed} />
      <Mechanism copy={copy} />
      <Proof copy={copy} />
      <Plan copy={copy} />
      <Guarantee />
      <FAQ copy={copy} />
    </main>
  );
}
