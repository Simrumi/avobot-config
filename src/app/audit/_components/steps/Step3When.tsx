"use client";

import type { Q3Option } from "@/types/quiz";
import { OptionButton, StepHeading } from "./_shared";

const OPTIONS: { value: Q3Option; label: string }[] = [
  { value: "daily", label: "Every day" },
  { value: "weekly", label: "Weekly crunch" },
  { value: "month_end", label: "Month-end or reporting periods" },
  { value: "always", label: "Always-on — it never stops" },
];

export default function Step3When({
  value,
  onPick,
}: {
  value?: Q3Option;
  onPick: (v: Q3Option) => void;
}) {
  return (
    <div>
      <StepHeading>When does this hit you the hardest?</StepHeading>
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
