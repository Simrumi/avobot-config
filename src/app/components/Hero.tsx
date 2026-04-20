"use client";

import { useEffect, useState } from "react";

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#E8524A] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            #fff 10px,
            #fff 11px
          )`
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-32 text-center relative z-10">
        <div
          className={`transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-none text-white">
            YOUR BUSINESS
            <br />
            <span className="text-white/90">
              RUNS ON AI.
            </span>
            <br />
            YOU JUST DON&apos;T
            <br />
            KNOW IT YET.
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-12 leading-relaxed">
            We build AI agents and automations that save Malaysian and
            Singaporean SMEs 20+ hours a week — without hiring a single engineer.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#services"
              className="w-full sm:w-auto bg-white text-[#E8524A] px-10 py-5 text-sm font-bold uppercase tracking-widest hover:bg-white/90 transition-all transform hover:scale-105 shadow-lg"
            >
              See What AI Can Do For You
            </a>
            <a
              href="/audit"
              className="w-full sm:w-auto border-2 border-white text-white px-10 py-5 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-[#E8524A] transition-all"
            >
              Get a Free AI Audit
            </a>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { number: "50+", label: "Businesses Automated" },
              { number: "20+", label: "Hours Saved Weekly" },
              { number: "98%", label: "Client Retention" },
              { number: "🇲🇾 🇸🇬", label: "Malaysia & Singapore" },
            ].map((stat, index) => (
              <div
                key={index}
                className={`transition-all duration-1000 delay-${index * 200} ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                }`}
              >
                <div className="text-3xl md:text-4xl font-black mb-2 text-white">{stat.number}</div>
                <div className="text-sm text-white/60 uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  );
}
