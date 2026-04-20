"use client";

import type { Segment } from "@/types/quiz";
import { OptionButton, StepHeading } from "./_shared";

const OPTIONS: { value: Segment; label: string }[] = [
  { value: "ops", label: "Manual admin, data entry, invoicing, spreadsheets" },
  { value: "team", label: "Onboarding, internal handoffs, training, SOPs" },
  { value: "sales", label: "Slow lead follow-up, leads going cold, no nurture" },
  { value: "service", label: "Customer support, same questions answered 100 times" },
];

export default function Step1Hook({
  value,
  onPick,
}: {
  value?: Segment;
  onPick: (v: Segment) => void;
}) {
  return (
    <div>
      <StepHeading>Where is time leaking out of your business right now?</StepHeading>
      <div className="space-y-3">
        {OPTIONS.map((o) => (
          <OptionButton
            key={o.value}
            selected={value === o.value}
            onClick={() => onPick(o.value)}
          >
            {o.label}
          </OptionButton>
        ))}
      </div>
    </div>
  );
}
