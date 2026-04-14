"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Wrench, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Free AI Audit",
    description:
      "We analyse your business and find the biggest time and money sinks that AI can fix.",
  },
  {
    number: "02",
    icon: Wrench,
    title: "We Build It",
    description:
      "Our team designs and builds your custom AI solution — agents, automations, or apps.",
  },
  {
    number: "03",
    icon: Rocket,
    title: "You Save Time & Money",
    description:
      "Your AI goes live. We train your team, monitor performance, and optimise continuously.",
  },
];

export default function HowItWorks() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#E8524A] mb-4 block">
            How It Works
          </span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
            FROM IDEA TO AI
            <br />
            <span className="text-gray-400">IN 3 STEPS</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            No technical knowledge needed. We handle everything.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className={`text-center transition-all duration-700 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="text-6xl font-black text-[#E8524A]/10 mb-4">
                  {step.number}
                </div>
                <div className="w-16 h-16 bg-[#E8524A] text-white flex items-center justify-center mx-auto mb-6 rounded-lg">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
