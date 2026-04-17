"use client";

type Props = {
  step: number;
  total: number;
  onBack?: () => void;
};

export default function ProgressBar({ step, total, onBack }: Props) {
  const pct = Math.max(0, Math.min(100, (step / total) * 100));
  const label =
    step === total ? "ALMOST DONE · YOUR RESULT" : `STEP ${step} OF ${total}`;

  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur">
      <div className="max-w-3xl mx-auto flex items-center justify-between px-4 pt-3 pb-1">
        <span className="text-[10px] tracking-widest font-semibold text-black/60 uppercase">
          {label}
        </span>
        {onBack && step > 1 ? (
          <button
            type="button"
            onClick={onBack}
            className="text-[10px] tracking-widest font-semibold text-black/60 uppercase hover:text-[#E8524A]"
          >
            ← BACK
          </button>
        ) : (
          <span />
        )}
      </div>
      <div className="h-[3px] bg-[#F2EDE6]">
        <div
          className="h-full bg-[#E8524A] transition-[width] duration-[350ms] ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
