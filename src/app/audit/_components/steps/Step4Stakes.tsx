"use client";

import type { Q4Option } from "@/types/quiz";
import { OptionButton, StepHeading } from "./_shared";

const OPTIONS: { value: Q4Option; label: string }[] = [
  { value: "lose_clients", label: "We lose clients to faster competitors" },
  { value: "burn_out", label: "My team burns out and leaves" },
  { value: "cap_growth", label: "We can't grow past our current ceiling" },
  { value: "fall_behind", label: "We fall behind on tech everyone else is adopting" },
];

export default function Step4Stakes({
  value,
  onPick,
}: {
  value?: Q4Option;
  onPick: (v: Q4Option) => void;
}) {
  return (
    <div>
      <StepHeading>
        What are you afraid happens if this keeps bleeding you for another 12 months?
      </StepHeading>
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
