"use client";

import { useEffect, useRef, useState } from "react";
import { Shield, ArrowRight } from "lucide-react";

const rows = [
  {
    label: "Setup time",
    inHouse: "3-6 months hiring",
    consultancy: "2-3 months scoping",
    hustlr: "2-4 weeks to first AI live",
  },
  {
    label: "Monthly cost",
    inHouse: "RM30k+ (salaries)",
    consultancy: "RM15k-25k/month",
    hustlr: "From RM5k/month",
  },
  {
    label: "Languages",
    inHouse: "Depends on hire",
    consultancy: "Usually English only",
    hustlr: "EN, BM, Mandarin",
  },
  {
    label: "Ongoing support",
    inHouse: "You manage it",
    consultancy: "Billed hourly",
    hustlr: "Included",
  },
  {
    label: "Total Year 1",
    inHouse: "RM360k+",
    consultancy: "RM180k+",
    hustlr: "From RM60k",
    isBold: true,
  },
];

export default function Pricing() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#E8524A] mb-4 block">
            Investment
          </span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
            THE REAL COST OF
            <br />
            <span className="text-gray-500">NOT USING AI</span>
          </h2>
        </div>

        {/* Comparison Table — Desktop */}
        <div
          className={`hidden md:block transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="pb-4 pr-6 text-sm text-gray-500 uppercase tracking-wide font-semibold w-1/4"></th>
                  <th className="pb-4 px-6 text-sm text-gray-500 uppercase tracking-wide font-semibold w-1/4">
                    Hire In-House AI Team
                  </th>
                  <th className="pb-4 px-6 text-sm text-gray-500 uppercase tracking-wide font-semibold w-1/4">
                    Traditional Consultancy
                  </th>
                  <th className="pb-4 px-6 text-sm text-[#E8524A] uppercase tracking-wide font-bold w-1/4 border-x border-t border-[#E8524A]/30 rounded-t-lg pt-4">
                    HUSTLR
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr
                    key={index}
                    className={`border-b border-gray-800 ${
                      row.isBold ? "bg-white/5" : ""
                    }`}
                  >
                    <td
                      className={`py-5 pr-6 text-sm ${
                        row.isBold
                          ? "font-bold text-white"
                          : "text-gray-400"
                      }`}
                    >
                      {row.label}
                    </td>
                    <td
                      className={`py-5 px-6 text-sm ${
                        row.isBold
                          ? "font-bold text-white"
                          : "text-gray-400"
                      }`}
                    >
                      {row.inHouse}
                    </td>
                    <td
                      className={`py-5 px-6 text-sm ${
                        row.isBold
                          ? "font-bold text-white"
                          : "text-gray-400"
                      }`}
                    >
                      {row.consultancy}
                    </td>
                    <td
                      className={`py-5 px-6 text-sm border-x border-[#E8524A]/30 ${
                        row.isBold
                          ? "font-bold text-[#E8524A] text-lg border-b rounded-b-lg"
                          : "text-white font-medium"
                      }`}
                    >
                      {row.hustlr}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Comparison Cards — Mobile */}
        <div
          className={`md:hidden space-y-6 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* HUSTLR Card (featured) */}
          <div className="border-2 border-[#E8524A] rounded-lg p-6">
            <h3 className="text-lg font-bold text-[#E8524A] mb-4">HUSTLR</h3>
            {rows.map((row, index) => (
              <div
                key={index}
                className={`flex justify-between py-3 ${
                  index < rows.length - 1 ? "border-b border-gray-800" : ""
                }`}
              >
                <span className="text-sm text-gray-400">{row.label}</span>
                <span
                  className={`text-sm text-right ${
                    row.isBold
                      ? "font-bold text-[#E8524A]"
                      : "text-white font-medium"
                  }`}
                >
                  {row.hustlr}
                </span>
              </div>
            ))}
          </div>

          {/* In-House Card */}
          <div className="border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-400 mb-4">
              Hire In-House AI Team
            </h3>
            {rows.map((row, index) => (
              <div
                key={index}
                className={`flex justify-between py-3 ${
                  index < rows.length - 1 ? "border-b border-gray-800" : ""
                }`}
              >
                <span className="text-sm text-gray-500">{row.label}</span>
                <span className="text-sm text-gray-400 text-right">
                  {row.inHouse}
                </span>
              </div>
            ))}
          </div>

          {/* Consultancy Card */}
          <div className="border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-400 mb-4">
              Traditional Consultancy
            </h3>
            {rows.map((row, index) => (
              <div
                key={index}
                className={`flex justify-between py-3 ${
                  index < rows.length - 1 ? "border-b border-gray-800" : ""
                }`}
              >
                <span className="text-sm text-gray-500">{row.label}</span>
                <span className="text-sm text-gray-400 text-right">
                  {row.consultancy}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Guarantee */}
        <div className="mt-16 text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-[#E8524A]" />
            <h3 className="text-xl font-bold">The Clarity Guarantee</h3>
          </div>
          <p className="text-gray-400 leading-relaxed mb-8">
            If our free AI audit doesn&apos;t reveal at least 3 actionable ways to
            save your business 10+ hours a week, we&apos;ll pay for your next
            consultation with any competitor. No questions asked.
          </p>

          {/* CTA */}
          <a
            href="#contact"
            className="inline-flex items-center gap-3 bg-[#E8524A] text-white px-10 py-5 text-sm font-bold uppercase tracking-widest hover:bg-[#d14a43] transition-colors rounded"
          >
            Get Your Free AI Audit
            <ArrowRight className="w-5 h-5" />
          </a>

          {/* Downgrade Path */}
          <p className="text-sm text-gray-500 mt-6">
            Not ready for a monthly plan? Start with a one-time AI audit for
            RM2,500 — no subscription needed.
          </p>
        </div>
      </div>
    </section>
  );
}
