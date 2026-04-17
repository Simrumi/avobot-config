"use client";

import type { TeamTier } from "@/types/quiz";
import { OptionButton, StepHeading } from "./_shared";

const OPTIONS: { value: TeamTier; label: string }[] = [
  { value: "solo", label: "Solo" },
  { value: "2-5", label: "2–5 people" },
  { value: "6-20", label: "6–20 people" },
  { value: "20+", label: "20+ people" },
];

export default function Step5Team({
  value,
  onPick,
}: {
  value?: TeamTier;
  onPick: (v: TeamTier) => void;
}) {
  return (
    <div>
      <StepHeading>How big is your team today?</StepHeading>
      <div className="space-y-3">
        {OPTIONS.map((o) => (
          <OptionButton key={o.value} selected={value === o.value} onClick={() => onPick(o.value)}>
            {o.label}
          </OptionButton>
        ))}
      </div>
    </div>
  );
}
