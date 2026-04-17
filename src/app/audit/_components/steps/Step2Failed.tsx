"use client";

import type { Q2Option } from "@/types/quiz";
import { ContinueButton, OptionButton, StepHeading } from "./_shared";

const OPTIONS: { value: Q2Option; label: string }[] = [
  { value: "hired", label: "Hired someone to handle it" },
  { value: "sops", label: "Built SOPs / documented the process" },
  { value: "saas", label: "Bought a SaaS for it" },
  { value: "chatgpt", label: "Used ChatGPT manually" },
  { value: "ignored", label: "Ignored it and hoped it'd fix itself" },
  { value: "other", label: "Something else" },
];

export default function Step2Failed({
  value,
  onChange,
  onContinue,
}: {
  value: Q2Option[];
  onChange: (v: Q2Option[]) => void;
  onContinue: () => void;
}) {
  const toggle = (v: Q2Option) => {
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  };

  return (
    <div>
      <StepHeading>What have you already tried that didn&apos;t stick?</StepHeading>
      <p className="text-sm text-black/60 uppercase tracking-wider mb-6">
        Pick any that apply — or none.
      </p>
      <div className="space-y-3">
        {OPTIONS.map((o) => (
          <OptionButton
            key={o.value}
            selected={value.includes(o.value)}
            onClick={() => toggle(o.value)}
          >
            {o.label}
          </OptionButton>
        ))}
      </div>
      <ContinueButton onClick={onContinue} />
    </div>
  );
}
