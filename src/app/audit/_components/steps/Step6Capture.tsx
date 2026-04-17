"use client";

import { useState } from "react";
import type { QuizAnswers } from "@/types/quiz";
import { ContinueButton, StepHeading } from "./_shared";

type CaptureFields = QuizAnswers["capture"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Step6Capture({
  onSubmit,
  isPending,
  error,
}: {
  onSubmit: (c: CaptureFields) => void;
  isPending: boolean;
  error: string | null;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [company, setCompany] = useState("");
  const [country, setCountry] = useState<CaptureFields["country"]>("MY");
  const [localError, setLocalError] = useState<string | null>(null);

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setLocalError("Your name, please.");
    if (!EMAIL_RE.test(email.trim())) return setLocalError("That email looks off.");
    setLocalError(null);
    onSubmit({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      whatsapp: whatsapp.trim() || undefined,
      company: company.trim() || undefined,
      country,
    });
  };

  return (
    <form onSubmit={handle}>
      <StepHeading>Where should we send your AI audit?</StepHeading>
      <p className="text-black/70 mb-6">
        Your personalised audit lands in your inbox in the next few minutes.
      </p>
      <div className="space-y-4">
        <input
          aria-label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name *"
          className="w-full px-5 py-4 border-2 border-black/20 focus:border-[#E8524A] focus:outline-none rounded"
          required
          autoFocus
        />
        <input
          aria-label="Work email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Work email *"
          className="w-full px-5 py-4 border-2 border-black/20 focus:border-[#E8524A] focus:outline-none rounded"
          required
        />
        <input
          aria-label="WhatsApp (optional)"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          placeholder="WhatsApp (optional)"
          className="w-full px-5 py-4 border-2 border-black/20 focus:border-[#E8524A] focus:outline-none rounded"
        />
        <input
          aria-label="Company (optional)"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Company (optional)"
          className="w-full px-5 py-4 border-2 border-black/20 focus:border-[#E8524A] focus:outline-none rounded"
        />
        <select
          aria-label="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value as CaptureFields["country"])}
          className="w-full px-5 py-4 border-2 border-black/20 focus:border-[#E8524A] focus:outline-none rounded bg-white"
        >
          <option value="MY">Malaysia</option>
          <option value="SG">Singapore</option>
          <option value="OTHER">Other</option>
        </select>
      </div>
      {(localError || error) && (
        <p className="mt-4 text-[#E8524A] font-semibold">{localError ?? error}</p>
      )}
      <ContinueButton
        onClick={() => (document.activeElement as HTMLElement)?.blur()}
        disabled={isPending}
        label={isPending ? "SENDING…" : "GET MY AUDIT"}
      />
      <input type="submit" hidden />
    </form>
  );
}
