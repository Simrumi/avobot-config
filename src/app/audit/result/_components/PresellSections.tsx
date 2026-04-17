import type { Q2Option } from "@/types/quiz";
import type { ResultCopy } from "../_copy/types";

const CTA_LABEL = "Book Your Free AI Audit Call";
const CTA_SUB = "30 minutes. No sales pitch. You leave with 3 automations you can run next week.";

export function CTA() {
  const url = process.env.NEXT_PUBLIC_BOOKING_URL ?? "#";
  return (
    <div className="text-center my-16">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-white text-[#E8524A] px-12 py-5 text-sm font-bold uppercase tracking-widest hover:bg-white/90 transition-colors rounded shadow-lg"
      >
        {CTA_LABEL}
      </a>
      <p className="mt-4 text-white/70 text-sm max-w-md mx-auto">{CTA_SUB}</p>
    </div>
  );
}

export function PainHero({ copy }: { copy: ResultCopy }) {
  return (
    <section className="bg-[#E8524A] text-white py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-4 block">
          Your AI audit
        </span>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6 leading-none">
          {copy.headline}
        </h1>
        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
          {copy.subhead}
        </p>
        <CTA />
        <p className="text-white/60 text-sm">
          Or check your inbox — your personalised AI audit report is on its way.
        </p>
      </div>
    </section>
  );
}

export function WhyNormalFails({ copy, failed }: { copy: ResultCopy; failed: Q2Option[] }) {
  const highlighted = failed.length > 0
    ? failed.map((f) => ({ key: f, text: copy.failureMessages[f] }))
    : [{ key: "ignored" as Q2Option, text: copy.failureMessages.ignored }];

  return (
    <section className="bg-[#FBF8F4] py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-10">
          Here&apos;s what&apos;s actually happening.
        </h2>
        <ul className="space-y-4 mb-12">
          {copy.mechanismBullets.map((b, i) => (
            <li key={i} className="flex gap-3 text-lg">
              <span className="text-[#E8524A] font-black">—</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <div className="space-y-6 border-l-4 border-[#E8524A] pl-6">
          {highlighted.map((h) => (
            <p key={h.key} className="text-black/80 leading-relaxed">
              <strong>{h.text}</strong>
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Mechanism({ copy }: { copy: ResultCopy }) {
  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-8">
          The mechanism.
        </h2>
        <p className="text-lg leading-relaxed text-black/80 mb-10">
          {copy.mechanismParagraph}
        </p>
        <div className="grid grid-cols-3 gap-4 text-center border-y-2 border-black/10 py-8">
          <div><div className="text-xs uppercase tracking-widest text-black/60 mb-2">Inputs</div><div className="font-black">Your stack</div></div>
          <div><div className="text-xs uppercase tracking-widest text-black/60 mb-2">Agent</div><div className="font-black">→</div></div>
          <div><div className="text-xs uppercase tracking-widest text-black/60 mb-2">Outputs</div><div className="font-black">Work done</div></div>
        </div>
      </div>
    </section>
  );
}

export function Proof({ copy }: { copy: ResultCopy }) {
  return (
    <section className="bg-[#FBF8F4] py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-10">
          Proof.
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {copy.proof.map((p, i) => (
            <div key={i} className="bg-white p-8 rounded shadow-sm">
              <div className="text-3xl md:text-4xl font-black text-[#E8524A] mb-3">{p.number}</div>
              <p className="text-black/70">{p.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Plan({ copy }: { copy: ResultCopy }) {
  return (
    <section className="bg-[#E8524A] text-white py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-10">
          The plan.
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {copy.planSteps.map((s, i) => (
            <div key={i}>
              <div className="text-5xl font-black text-white/40 mb-3">0{i + 1}</div>
              <p className="text-lg leading-relaxed">{s}</p>
            </div>
          ))}
        </div>
        <CTA />
      </div>
    </section>
  );
}

export function Guarantee() {
  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-2xl mx-auto bg-[#FBF8F4] p-8 rounded text-center">
        <h3 className="font-bold mb-3 text-lg">🛡️ The Clarity Guarantee</h3>
        <p className="text-black/70 leading-relaxed">
          If our free AI audit doesn&apos;t reveal at least 3 actionable ways to
          save your business 10+ hours a week, we&apos;ll pay for your next
          consultation with any competitor. No questions asked.
        </p>
      </div>
    </section>
  );
}

export function FAQ({ copy }: { copy: ResultCopy }) {
  return (
    <section className="bg-[#FBF8F4] py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-10">
          Objections.
        </h2>
        <div className="space-y-4">
          {copy.faqs.map((f, i) => (
            <details key={i} className="bg-white p-6 rounded group">
              <summary className="font-bold cursor-pointer text-lg">{f.q}</summary>
              <p className="mt-3 text-black/70 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
        <div className="bg-[#E8524A] text-white mt-16 p-12 rounded text-center">
          <CTA />
        </div>
      </div>
    </section>
  );
}
