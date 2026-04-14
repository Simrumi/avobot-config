"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, BarChart3, Globe, Users } from "lucide-react";

const values = [
  {
    icon: MessageCircle,
    title: "Plain Language",
    description:
      "We explain everything in terms you understand. No jargon, no buzzwords, no fluff.",
  },
  {
    icon: BarChart3,
    title: "Results You Can Measure",
    description:
      "Every AI solution comes with a clear ROI projection. If it doesn\u2019t save you time or money, we don\u2019t build it.",
  },
  {
    icon: Globe,
    title: "Built for SEA",
    description:
      "We understand Malaysian and Singaporean businesses. Our solutions work in English, Malay, and Mandarin.",
  },
  {
    icon: Users,
    title: "Your Team, Extended",
    description:
      "We don\u2019t just deliver and disappear. We train your team, maintain your systems, and grow with you.",
  },
];

export default function About() {
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
    <section id="about" ref={sectionRef} className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          {/* Left: Content */}
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            }`}
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-[#E8524A] mb-4 block">
              About HUSTLR
            </span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8">
              WE MAKE AI
              <br />
              <span className="text-gray-400">SIMPLE FOR</span>
              <br />
              BUSINESSES
              <br />
              <span className="text-[#E8524A]">THAT BUILD ASIA.</span>
            </h2>
            <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
              <p>
                Most AI agencies talk to engineers. We talk to business owners.
              </p>
              <p>
                We started HUSTLR because we saw SMEs across Malaysia and Singapore
                getting left behind in the AI wave — not because they didn&apos;t want to
                adopt it, but because nobody explained it in plain language.
              </p>
              <p>
                We&apos;re a team of builders who speak both tech and business. We don&apos;t
                sell hype. We build AI that saves you time, cuts your costs, and
                makes your team more effective — then we show you the numbers to prove it.
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-8 mt-12 pt-12 border-t border-gray-200">
              <div>
                <div className="text-3xl font-black mb-1 text-[#E8524A]">7+</div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">Years Active</div>
              </div>
              <div>
                <div className="text-3xl font-black mb-1 text-[#E8524A]">25</div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">Team Members</div>
              </div>
            </div>
          </div>

          {/* Right: Visual - Teamwork Image */}
          <div
            className={`relative transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
          >
            <div className="aspect-square relative overflow-hidden rounded-lg shadow-2xl">
              <img 
                src="/teamwork.jpg" 
                alt="HUSTLR Team" 
                className="w-full h-full object-cover"
              />
              {/* Subtle orange overlay for brand consistency */}
              <div className="absolute inset-0 bg-[#E8524A]/10"></div>
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={index}
                className={`p-6 border border-gray-200 hover:border-[#E8524A] transition-all duration-300 group rounded-lg ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${(index + 2) * 150}ms` }}
              >
                <div className="w-12 h-12 bg-[#E8524A] text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform rounded">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
