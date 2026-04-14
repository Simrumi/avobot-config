"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Workflow, Lightbulb, AppWindow, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Bot,
    title: "Custom AI Agents",
    before:
      "Your team answers the same 50 questions every day. Customers wait hours for a reply. You lose leads after business hours.",
    after:
      "An AI agent handles enquiries 24/7 in English, Malay, and Mandarin. Response time: under 30 seconds. Your team handles only the complex stuff.",
    features: [
      "Customer Support Bots",
      "Sales Agents",
      "Internal Knowledge Bots",
      "Multi-language Support",
    ],
  },
  {
    icon: Workflow,
    title: "AI Workflow Automation",
    before:
      "Staff spend 3 hours a day on data entry, invoice processing, and report generation. Errors pile up.",
    after:
      "Invoices process themselves. Reports generate overnight. Your team reclaims 15+ hours a week for actual work.",
    features: [
      "Process Automation",
      "Document Processing",
      "Smart Reporting",
      "System Integration",
    ],
  },
  {
    icon: Lightbulb,
    title: "AI Consulting & Strategy",
    before:
      "You know AI is important but don\u2019t know where to start. Consultants charge RM10k+ just to tell you what\u2019s possible.",
    after:
      "A free audit shows you exactly where AI saves time and money. Clear roadmap. No jargon. No obligation.",
    features: [
      "AI Readiness Audit",
      "ROI Analysis",
      "Implementation Roadmap",
      "Team Training",
    ],
  },
  {
    icon: AppWindow,
    title: "AI App Development",
    before:
      "You\u2019re using 5 different tools stitched together with spreadsheets. Nothing talks to each other.",
    after:
      "One custom AI app that does exactly what your business needs \u2014 built around your workflow, not the other way around.",
    features: [
      "Custom AI Apps",
      "Predictive Analytics",
      "Intelligent Dashboards",
      "API Integrations",
    ],
  },
];

export default function Services() {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(
              entry.target.getAttribute("data-index") || "0"
            );
            setVisibleItems((prev) => [...new Set([...prev, index])]);
          }
        });
      },
      { threshold: 0.15 }
    );

    const items = sectionRef.current?.querySelectorAll("[data-index]");
    items?.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="services" ref={sectionRef} className="py-32 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#E8524A] mb-4 block">
            What We Build
          </span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
            AI THAT WORKS
            <br />
            <span className="text-gray-500">WHILE YOU SLEEP</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            From custom AI agents to full workflow automation — we handle the
            tech so you can focus on growing your business.
          </p>
        </div>

        {/* Before/After Service Cards */}
        <div className="space-y-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                data-index={index}
                className={`transition-all duration-700 ${
                  visibleItems.includes(index)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                {/* Service Title Row */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-[#E8524A] text-white flex items-center justify-center rounded-lg">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold">{service.title}</h3>
                </div>

                {/* Before/After Split */}
                <div className="grid md:grid-cols-2 gap-0 rounded-lg overflow-hidden">
                  {/* Before */}
                  <div className="bg-red-950/40 p-8">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                      <span className="text-xs font-semibold uppercase tracking-widest text-red-400">
                        Without AI
                      </span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      {service.before}
                    </p>
                  </div>

                  {/* After */}
                  <div className="bg-emerald-950/40 p-8">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                      <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                        With HUSTLR
                      </span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      {service.after}
                    </p>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-3 mt-4">
                  {service.features.map((feature, i) => (
                    <span
                      key={i}
                      className="text-xs text-gray-400 border border-gray-700 px-3 py-1.5 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <a
            href="#contact"
            className="inline-flex items-center gap-3 bg-[#E8524A] text-white px-10 py-5 text-sm font-bold uppercase tracking-widest hover:bg-[#d14a43] transition-colors rounded"
          >
            Book a Free AI Audit
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
