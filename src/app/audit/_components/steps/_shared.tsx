"use client";

import type { ReactNode } from "react";

export function StepHeading({ children }: { children: ReactNode }) {
  return (
    <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-8 leading-tight">
      {children}
    </h1>
  );
}

export function OptionButton({
  selected,
  onClick,
  children,
}: {
  selected?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-6 py-5 border-2 rounded transition-colors ${
        selected
          ? "border-[#E8524A] bg-[#E8524A] text-white"
          : "border-black/20 bg-white hover:border-[#E8524A]"
      }`}
    >
      <span className="text-base md:text-lg font-semibold">{children}</span>
    </button>
  );
}

export function ContinueButton({
  disabled,
  onClick,
  label = "CONTINUE",
}: {
  disabled?: boolean;
  onClick: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="mt-8 w-full md:w-auto bg-[#E8524A] text-white px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-[#d14a43] transition-colors disabled:opacity-50 rounded"
    >
      {label}
    </button>
  );
}
