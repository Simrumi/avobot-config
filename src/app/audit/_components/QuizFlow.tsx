"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "./ProgressBar";
import Step1Hook from "./steps/Step1Hook";
import Step2Failed from "./steps/Step2Failed";
import Step3When from "./steps/Step3When";
import Step4Stakes from "./steps/Step4Stakes";
import Step5Team from "./steps/Step5Team";
import Step6Capture from "./steps/Step6Capture";
import type { QuizAnswers } from "@/types/quiz";
import { submitQuiz } from "../actions";
import type { QuizInput } from "../schema";

const STORAGE_KEY = "hustlr.audit.v1";
const TOTAL_STEPS = 6;

const EMPTY: Partial<QuizAnswers> = {
  q2: [],
};

type Partial6 = Partial<QuizAnswers>;

export default function QuizFlow() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Partial6>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { step: number; answers: Partial6 };
        if (parsed && typeof parsed.step === "number") {
          setStep(Math.min(parsed.step, 5));
          const { capture: _c, ...rest } = parsed.answers ?? {};
          setAnswers({ q2: [], ...rest });
        }
      }
    } catch {
      // ignore corrupt state
    }
  }, []);

  useEffect(() => {
    if (step >= TOTAL_STEPS) return;
    const { capture: _c, ...persisted } = answers;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ step, answers: persisted })
    );
  }, [step, answers]);

  const update = (patch: Partial6) => setAnswers((a) => ({ ...a, ...patch }));
  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const onSubmit = (capture: QuizAnswers["capture"]) => {
    setError(null);
    const full = { ...(answers as QuizAnswers), capture };
    startTransition(async () => {
      try {
        const { leadId, segment } = await submitQuiz(full as QuizInput);
        localStorage.removeItem(STORAGE_KEY);
        const failed = (full.q2 ?? []).join(",");
        router.push(
          `/audit/result?segment=${segment}&id=${leadId}&failed=${encodeURIComponent(failed)}`
        );
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Something went wrong. Try again."
        );
      }
    });
  };

  const body = useMemo(() => {
    switch (step) {
      case 1:
        return <Step1Hook value={answers.q1} onPick={(q1) => { update({ q1 }); next(); }} />;
      case 2:
        return (
          <Step2Failed
            value={answers.q2 ?? []}
            onChange={(q2) => update({ q2 })}
            onContinue={next}
          />
        );
      case 3:
        return <Step3When value={answers.q3} onPick={(q3) => { update({ q3 }); next(); }} />;
      case 4:
        return <Step4Stakes value={answers.q4} onPick={(q4) => { update({ q4 }); next(); }} />;
      case 5:
        return <Step5Team value={answers.q5} onPick={(q5) => { update({ q5 }); next(); }} />;
      case 6:
        return (
          <Step6Capture
            onSubmit={onSubmit}
            isPending={isPending}
            error={error}
          />
        );
      default:
        return null;
    }
  }, [step, answers, isPending, error]);

  return (
    <>
      <ProgressBar step={step} total={TOTAL_STEPS} onBack={back} />
      <div
        role="region"
        aria-live="polite"
        className="pt-16 min-h-screen flex items-center justify-center px-4"
      >
        <div className="max-w-2xl w-full">{body}</div>
      </div>
    </>
  );
}
