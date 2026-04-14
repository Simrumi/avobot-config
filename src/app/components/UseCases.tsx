"use client";

import { useEffect, useRef, useState } from "react";
import { UtensilsCrossed, ShoppingBag, Truck, Briefcase } from "lucide-react";

const useCases = [
  {
    icon: UtensilsCrossed,
    industry: "F&B / Restaurants",
    description:
      "AI handles reservations, answers menu questions on WhatsApp, and predicts inventory needs. Your staff focuses on the food.",
  },
  {
    icon: ShoppingBag,
    industry: "Retail / E-commerce",
    description:
      "Automated customer support in 3 languages, smart product recommendations, and demand forecasting that cuts overstock by 30%.",
  },
  {
    icon: Truck,
    industry: "Logistics / Operations",
    description:
      "AI optimises delivery routes, automates shipment tracking updates, and handles supplier communications.",
  },
  {
    icon: Briefcase,
    industry: "Professional Services",
    description:
      "AI drafts proposals, manages client follow-ups, and automates billing \u2014 so consultants, accountants, and lawyers spend time on clients, not admin.",
  },
];

export default function UseCases() {
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
      { threshold: 0.2 }
    );

    const items = sectionRef.current?.querySelectorAll("[data-index]");
    items?.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#E8524A] mb-4 block">
            AI For Every Industry
          </span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
            AI FOR EVERY
            <br />
            <span className="text-gray-400">BUSINESS</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            See how businesses like yours are using AI to get ahead.
          </p>
        </div>

        {/* Use Case Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <div
                key={index}
                data-index={index}
                className={`group p-8 border border-gray-200 hover:border-[#E8524A] transition-all duration-500 rounded-lg ${
                  visibleItems.includes(index)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <div className="w-14 h-14 bg-[#E8524A] text-white flex items-center justify-center mb-6 rounded-lg group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">{useCase.industry}</h3>
                <p className="text-gray-500 leading-relaxed">
                  {useCase.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
