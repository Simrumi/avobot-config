import type { Q2Option, Segment } from "@/types/quiz";

export type ResultCopy = {
  segment: Segment;
  headline: string;            // the pain-mirror hero line
  subhead: string;             // one sentence naming symptoms
  mechanismBullets: string[];  // 3 bullets: why normal fixes fail — 1 each for hired/sops/saas
  failureMessages: Record<Q2Option, string>;  // "Why X didn't stick"
  mechanismParagraph: string;  // ~120 words on how AI agents solve this specifically
  proof: { number: string; summary: string }[]; // 2 case snippets, numbers-first
  planSteps: [string, string, string]; // audit call → roadmap → build
  faqs: { q: string; a: string }[];    // 4 objections
};
