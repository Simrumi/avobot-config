"use client";

import { useEffect, useRef, useState } from "react";

const clients = [
  { name: "Melissa", url: "https://melissa.my/", image: "/melissa-logo.webp" },
  { name: "Nature's Wonders", url: "#", image: "/natures-wonders-logo.png" },
  { name: "Alibaba", url: "#" },
  { name: "Honda", url: "#" },
  { name: "Axiata", url: "#" },
];

export default function Clients() {
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
    <section id="clients" ref={sectionRef} className="py-24 bg-[#E8524A]/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#E8524A] mb-4 block">
            Trusted By Industry Leaders
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-gray-900">
            BRANDS WE&apos;VE ELEVATED
          </h2>
        </div>

        {/* Client Logos Grid */}
        <div
          className={`flex flex-wrap justify-center gap-8 md:gap-12 items-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {clients.map((client, index) => (
            <a
              key={index}
              href={client.url}
              target={client.url !== "#" ? "_blank" : undefined}
              rel={client.url !== "#" ? "noopener noreferrer" : undefined}
              className="group flex items-center justify-center h-24 grayscale hover:grayscale-0 transition-all duration-300"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="text-center">
                {client.image ? (
                  <img 
                    src={client.image} 
                    alt={client.name}
                    className="h-16 w-auto object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                ) : (
                  <div className="text-xl md:text-2xl font-black text-gray-400 group-hover:text-[#E8524A] transition-colors tracking-tight">
                    {client.name === "Alibaba" && (
                      <span className="font-bold">Alibaba</span>
                    )}
                    {client.name === "Honda" && (
                      <span className="tracking-widest">HONDA</span>
                    )}
                    {client.name === "Axiata" && (
                      <span className="font-bold">axiata</span>
                    )}
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>

        {/* Testimonial Preview */}
        <div className="mt-20 max-w-4xl mx-auto text-center">
          <blockquote className="text-2xl md:text-3xl font-medium text-gray-800 leading-relaxed mb-8">
            &ldquo;HUSTLR automated our entire customer response workflow. What
            used to take our team 4 hours a day now runs on its own — and
            our response time dropped from 12 hours to under 2 minutes.&rdquo;
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 bg-[#E8524A] rounded-full flex items-center justify-center text-white font-bold">
              O
            </div>
            <div className="text-left">
              <div className="font-semibold">Operations Director</div>
              <div className="text-sm text-gray-500">E-commerce Brand</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
