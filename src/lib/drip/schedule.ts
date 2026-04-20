import type { Segment, TemplateSlot } from "@/types/quiz";

const HOUR_MS = 60 * 60 * 1000;

const SLOT_OFFSETS_HOURS: Record<TemplateSlot, number> = {
  d0_result: 0,
  d1_mechanism: 24,
  d3_proof: 72,
  d5_objections: 120,
  d9_last_call: 216,
};

const SLOT_ORDER: TemplateSlot[] = [
  "d0_result",
  "d1_mechanism",
  "d3_proof",
  "d5_objections",
  "d9_last_call",
];

export type DripRowInput = {
  leadId: string;
  segment: Segment;
  now: Date;
};

export type DripRow = {
  lead_id: string;
  template_key: string;
  send_at: string;
  status: "pending";
  attempts: 0;
};

export function buildDripRows(input: DripRowInput): DripRow[] {
  return SLOT_ORDER.map((slot) => ({
    lead_id: input.leadId,
    template_key: `${input.segment}_${slot}`,
    send_at: new Date(
      input.now.getTime() + SLOT_OFFSETS_HOURS[slot] * HOUR_MS
    ).toISOString(),
    status: "pending" as const,
    attempts: 0 as const,
  }));
}
