"use client";

import { useEffect, useRef, useState } from "react";

const clients = [
  { name: "Melissa", url: "https://melissa.my/" },
  { name: "Nature's Wonders", url: "#" },
  { name: "Alibaba", url: "#" },
  { name: "Honda", url: "#" },
  { name: "Axiata", url: "#" },
  { name: "Mr. Money TV", url: "#" },
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
    <section id="clients" ref={sectionRef} className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4 block">
            Trusted By Industry Leaders
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter">
            BRANDS WE'VE ELEVATED
          </h2>
        </div>

        {/* Client Logos Grid */}
        <div
          className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center transition-all duration-1000 ${
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
                <div className="text-xl md:text-2xl font-black text-gray-400 group-hover:text-black transition-colors tracking-tight">
                  {client.name === "Melissa" && (
                    <span className="font-serif italic">melissa</span>
                  )}
                  {client.name === "Nature's Wonders" && (
                    <span className="text-sm md:text-base">Nature&apos;s<br/>Wonders</span>
                  )}
                  {client.name === "Alibaba" && (
                    <span className="font-bold">Alibaba</span>
                  )}
                  {client.name === "Honda" && (
                    <span className="tracking-widest">HONDA</span>
                  )}
                  {client.name === "Axiata" && (
                    <span className="font-bold text-blue-600 group-hover:text-blue-700">axiata</span>
                  )}
                  {client.name === "Mr. Money TV" && (
                    <span className="text-sm md:text-base">Mr. Money<br/><span className="text-xs">TV</span></span>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Testimonial Preview */}
        <div className="mt-20 max-w-4xl mx-auto text-center">
          <blockquote className="text-2xl md:text-3xl font-medium text-gray-800 leading-relaxed mb-8">
            &ldquo;HUSTLR transformed our digital presence. Their strategic approach 
            to content and performance marketing delivered a 340% ROI in the first quarter.&rdquo;
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold">
              M
            </div>
            <div className="text-left">
              <div className="font-semibold">Marketing Director</div>
              <div className="text-sm text-gray-500">Fortune 500 Brand</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
