"use client";

import { useEffect, useRef, useState } from "react";
import { 
  Globe, 
  Share2, 
  PenTool, 
  TrendingUp,
  ArrowRight
} from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Web Development",
    description: "High-performance websites and web applications built with modern technologies. From landing pages to full-stack platforms.",
    features: ["Next.js & React", "E-commerce Solutions", "Custom Web Apps", "SEO Optimization"],
  },
  {
    icon: Share2,
    title: "Social Media Management",
    description: "Strategic content creation and community management that builds engagement and drives brand loyalty across all platforms.",
    features: ["Content Strategy", "Community Management", "Analytics & Reporting", "Paid Social Campaigns"],
  },
  {
    icon: PenTool,
    title: "Content Creation",
    description: "Compelling visual and written content that tells your brand story and converts viewers into customers.",
    features: ["Video Production", "Photography", "Copywriting", "Brand Identity"],
  },
  {
    icon: TrendingUp,
    title: "Performance Marketing",
    description: "Data-driven advertising campaigns that maximize ROI. We optimize every dollar for measurable business growth.",
    features: ["Google Ads", "Meta Ads", "Conversion Optimization", "Attribution Tracking"],
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
            const index = parseInt(entry.target.getAttribute("data-index") || "0");
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
    <section id="services" ref={sectionRef} className="py-32 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#E8524A] mb-4 block">
            What We Do
          </span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
            SERVICES THAT
            <br />
            <span className="text-gray-500">DRIVE RESULTS</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Full-stack digital marketing solutions tailored to your growth goals. 
            Every service is designed to work together as an integrated system.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                data-index={index}
                className={`group p-8 border border-gray-800 hover:border-[#E8524A] transition-all duration-500 cursor-pointer rounded-lg ${
                  visibleItems.includes(index)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-[#E8524A] text-white flex items-center justify-center rounded">
                    <Icon className="w-7 h-7" />
                  </div>
                  <ArrowRight className="w-6 h-6 text-gray-600 group-hover:text-[#E8524A] group-hover:translate-x-2 transition-all" />
                </div>

                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  {service.description}
                </p>

                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-sm text-gray-500">
                      <span className="w-1.5 h-1.5 bg-[#E8524A] rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
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
            Discuss Your Needs
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
