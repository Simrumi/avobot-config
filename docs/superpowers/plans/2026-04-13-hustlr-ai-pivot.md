# HUSTLR AI Agency Pivot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pivot the HUSTLR website from a digital marketing agency to an AI solutions agency targeting Malaysian and Singaporean SMEs, with new sections, reworked services, and Hormozi-style value stacking.

**Architecture:** Single-page Next.js app with 10 section components rendered sequentially. Three new components (HowItWorks, UseCases, Pricing) follow the same patterns as existing ones: "use client", IntersectionObserver for scroll animations, Tailwind CSS, Lucide icons. All existing components get copy/content updates.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Lucide React

**Spec:** `docs/superpowers/specs/2026-04-13-hustlr-ai-pivot-design.md`

---

## File Structure

### New Files
- `src/app/components/HowItWorks.tsx` — 3-step process section (01/02/03 layout)
- `src/app/components/UseCases.tsx` — 4 industry use case cards (F&B, Retail, Logistics, Professional Services)
- `src/app/components/Pricing.tsx` — Hormozi value stack comparison table + guarantee + downgrade path

### Modified Files
- `src/app/layout.tsx` — Update metadata (title, description)
- `src/app/page.tsx` — Add HowItWorks, UseCases, Pricing imports and render order
- `src/app/components/Navigation.tsx` — Update CTA text and add badge
- `src/app/components/Hero.tsx` — Replace headline, subheadline, CTAs, stats
- `src/app/components/Services.tsx` — Rewrite as before/after split cards
- `src/app/components/Clients.tsx` — Update testimonial copy
- `src/app/components/About.tsx` — Replace headline, body copy, values
- `src/app/components/Contact.tsx` — Update headline, subheadline, form fields, add guarantee + price anchor
- `src/app/components/Footer.tsx` — Update tagline, service links, newsletter copy

---

## Task 1: Update metadata and page layout

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Update layout.tsx metadata**

Replace the metadata object in `src/app/layout.tsx`:

```tsx
export const metadata: Metadata = {
  title: "HUSTLR | AI Solutions for Malaysian & Singaporean Businesses",
  description: "We build custom AI agents, workflow automations, and AI applications for SMEs in Malaysia and Singapore. Save 20+ hours a week without hiring engineers.",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
  },
};
```

- [ ] **Step 2: Update page.tsx with new component imports and order**

Replace `src/app/page.tsx` with:

```tsx
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Services from "./components/Services";
import UseCases from "./components/UseCases";
import Clients from "./components/Clients";
import Pricing from "./components/Pricing";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <HowItWorks />
      <Services />
      <UseCases />
      <Clients />
      <Pricing />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
```

Note: This will break until we create the three new components. That's expected — we'll create them in Tasks 4-6.

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx src/app/page.tsx
git commit -m "feat: update metadata and page layout for AI pivot"
```

---

## Task 2: Update Navigation

**Files:**
- Modify: `src/app/components/Navigation.tsx`

- [ ] **Step 1: Update the CTA text and add badge**

In `src/app/components/Navigation.tsx`, make these changes:

1. Add a badge next to the logo text. Replace the logo `<Link>`:

```tsx
<Link href="/" className="flex items-center gap-3">
  <span className={`font-black tracking-tighter transition-all duration-300 ${isScrolled ? 'text-xl text-[#E8524A]' : 'text-2xl text-white'}`}>
    HUSTLR
  </span>
  <span className={`hidden sm:inline text-[10px] font-semibold uppercase tracking-widest px-2 py-1 rounded transition-all duration-300 ${isScrolled ? 'bg-[#E8524A]/10 text-[#E8524A]' : 'bg-white/20 text-white/80'}`}>
    AI Solutions
  </span>
</Link>
```

2. Change the desktop CTA button text from "Start Project" to "Get a Free AI Audit":

```tsx
<a
  href="#contact"
  className={`px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-colors ${
    isScrolled
      ? "bg-[#E8524A] text-white hover:bg-[#d14a43]"
      : "bg-white text-[#E8524A] hover:bg-white/90"
  }`}
>
  Get a Free AI Audit
</a>
```

3. Change the mobile CTA button text to match:

```tsx
<a
  href="#contact"
  className="bg-white text-[#E8524A] px-8 py-4 text-lg font-semibold uppercase tracking-wide rounded"
  onClick={() => setIsMobileMenuOpen(false)}
>
  Get a Free AI Audit
</a>
```

- [ ] **Step 2: Commit**

```bash
git add src/app/components/Navigation.tsx
git commit -m "feat: update navigation CTA and add AI badge"
```

---

## Task 3: Update Hero

**Files:**
- Modify: `src/app/components/Hero.tsx`

- [ ] **Step 1: Replace hero content**

Replace the entire content inside the visibility-animated `<div>` in `src/app/components/Hero.tsx`. The outer section wrapper and background pattern stay the same. Replace from `{/* Main Headline */}` through the end of the stats grid:

```tsx
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
    href="#contact"
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
```

- [ ] **Step 2: Commit**

```bash
git add src/app/components/Hero.tsx
git commit -m "feat: update hero with AI pivot messaging"
```

---

## Task 4: Create HowItWorks component

**Files:**
- Create: `src/app/components/HowItWorks.tsx`

- [ ] **Step 1: Create the component**

Create `src/app/components/HowItWorks.tsx`:

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/app/components/HowItWorks.tsx
git commit -m "feat: add HowItWorks section"
```

---

## Task 5: Rewrite Services as before/after cards

**Files:**
- Modify: `src/app/components/Services.tsx`

- [ ] **Step 1: Replace the entire Services component**

Replace all contents of `src/app/components/Services.tsx` with:

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/app/components/Services.tsx
git commit -m "feat: rewrite services as before/after AI cards"
```

---

## Task 6: Create UseCases component

**Files:**
- Create: `src/app/components/UseCases.tsx`

- [ ] **Step 1: Create the component**

Create `src/app/components/UseCases.tsx`:

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/app/components/UseCases.tsx
git commit -m "feat: add UseCases section with industry examples"
```

---

## Task 7: Update Clients

**Files:**
- Modify: `src/app/components/Clients.tsx`

- [ ] **Step 1: Update the testimonial copy**

In `src/app/components/Clients.tsx`, replace the testimonial `<blockquote>` and attribution:

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/app/components/Clients.tsx
git commit -m "feat: update client testimonial for AI pivot"
```

---

## Task 8: Create Pricing component

**Files:**
- Create: `src/app/components/Pricing.tsx`

- [ ] **Step 1: Create the component**

Create `src/app/components/Pricing.tsx`:

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/app/components/Pricing.tsx
git commit -m "feat: add Pricing section with value stack and guarantee"
```

---

## Task 9: Update About

**Files:**
- Modify: `src/app/components/About.tsx`

- [ ] **Step 1: Update the values array**

In `src/app/components/About.tsx`, replace the imports and `values` array at the top:

```tsx
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
```

- [ ] **Step 2: Update the headline and body copy**

Replace the section label, h2, and body paragraphs inside the left column `<div>`:

```tsx
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
```

- [ ] **Step 3: Commit**

```bash
git add src/app/components/About.tsx
git commit -m "feat: update About section for AI pivot"
```

---

## Task 10: Update Contact

**Files:**
- Modify: `src/app/components/Contact.tsx`

- [ ] **Step 1: Update section header**

Replace the section header (label, h2, subheadline) in `src/app/components/Contact.tsx`:

```tsx
<span className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-4 block">
  Start Your AI Journey
</span>
<h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
  LET&apos;S FIND YOUR
  <br />
  <span className="text-white/70">BIGGEST AI WIN</span>
</h2>
<p className="text-white/70 max-w-2xl mx-auto text-lg">
  Book a free AI audit — we&apos;ll show you exactly where AI can 
  save you time and money, with no obligation.
</p>
```

- [ ] **Step 2: Update form dropdowns**

Replace the service `<select>`:

```tsx
<select
  name="service"
  value={formData.service}
  onChange={handleChange}
  className="w-full px-4 py-3 border border-gray-300 focus:border-[#E8524A] focus:outline-none transition-colors bg-white rounded"
>
  <option value="">Select a service</option>
  <option value="agents">Custom AI Agents</option>
  <option value="automation">AI Workflow Automation</option>
  <option value="consulting">AI Consulting & Strategy</option>
  <option value="apps">AI App Development</option>
  <option value="unsure">Not Sure — Help Me Decide</option>
</select>
```

Replace the budget `<select>`:

```tsx
<select
  name="budget"
  value={formData.budget}
  onChange={handleChange}
  className="w-full px-4 py-3 border border-gray-300 focus:border-[#E8524A] focus:outline-none transition-colors bg-white rounded"
>
  <option value="">Select budget range</option>
  <option value="5k-15k">RM5,000 - RM15,000</option>
  <option value="15k-30k">RM15,000 - RM30,000</option>
  <option value="30k-50k">RM30,000 - RM50,000</option>
  <option value="50k+">RM50,000+</option>
</select>
```

- [ ] **Step 3: Add price anchor and guarantee to the contact info section**

Replace the contact info `<div className="space-y-12">` with:

```tsx
<div className="space-y-12">
  <div>
    <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
    <p className="text-white/70 leading-relaxed mb-4">
      Whether you have a specific project in mind or just want to explore 
      what AI can do for your business, we&apos;d love to hear from you.
    </p>
    <p className="text-white/90 font-medium text-sm bg-white/10 px-4 py-3 rounded">
      Most AI consultancies charge RM5,000–15,000 for an audit like this. Yours is free.
    </p>
  </div>

  {/* Guarantee */}
  <div className="bg-white/10 p-6 rounded-lg">
    <h4 className="font-bold mb-2 flex items-center gap-2">
      <span className="text-lg">🛡️</span> The Clarity Guarantee
    </h4>
    <p className="text-white/70 text-sm leading-relaxed">
      If our free AI audit doesn&apos;t reveal at least 3 actionable ways to
      save your business 10+ hours a week, we&apos;ll pay for your next
      consultation with any competitor. No questions asked.
    </p>
  </div>

  <div className="space-y-6">
    <a 
      href="mailto:hello@hustlr.com" 
      className="flex items-center gap-4 group"
    >
      <div className="w-14 h-14 bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-[#E8524A] transition-all rounded">
        <Mail className="w-6 h-6" />
      </div>
      <div>
        <div className="text-sm text-white/60 uppercase tracking-wide">Email</div>
        <div className="font-semibold">hello@hustlr.com</div>
      </div>
    </a>

    <div className="flex items-center gap-4">
      <div className="w-14 h-14 bg-white/10 flex items-center justify-center rounded">
        <MapPin className="w-6 h-6" />
      </div>
      <div>
        <div className="text-sm text-white/60 uppercase tracking-wide">Office</div>
        <div className="font-semibold">Raffles Place, Singapore</div>
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 4: Commit**

```bash
git add src/app/components/Contact.tsx
git commit -m "feat: update Contact with AI services, guarantee, and price anchor"
```

---

## Task 11: Update Footer

**Files:**
- Modify: `src/app/components/Footer.tsx`

- [ ] **Step 1: Update footer content**

In `src/app/components/Footer.tsx`, update the `footerLinks` object:

```tsx
const footerLinks = {
  services: [
    { label: "Custom AI Agents", href: "#services" },
    { label: "AI Workflow Automation", href: "#services" },
    { label: "AI Consulting & Strategy", href: "#services" },
    { label: "AI App Development", href: "#services" },
  ],
  company: [
    { label: "About Us", href: "#about" },
    { label: "Our Work", href: "#clients" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#contact" },
  ],
  social: [
    { label: "LinkedIn", href: "#", icon: Linkedin },
    { label: "Instagram", href: "#", icon: Instagram },
    { label: "Twitter", href: "#", icon: Twitter },
    { label: "YouTube", href: "#", icon: Youtube },
  ],
};
```

Update the tagline paragraph:

```tsx
<p className="text-gray-400 text-sm leading-relaxed mb-6">
  AI solutions that save time, cut costs, and grow revenue for Malaysian and Singaporean businesses.
</p>
```

Update the newsletter copy:

```tsx
<p className="text-gray-400 text-sm mb-4">
  Get the latest insights on AI for Southeast Asian businesses.
</p>
```

- [ ] **Step 2: Commit**

```bash
git add src/app/components/Footer.tsx
git commit -m "feat: update Footer with AI services and copy"
```

---

## Task 12: Verify and fix

- [ ] **Step 1: Run the dev server**

```bash
npm run dev
```

Verify all 10 sections render without errors in the browser at `http://localhost:3000`.

- [ ] **Step 2: Check responsive layout**

Open browser dev tools, test at 375px (mobile) and 768px (tablet). Verify:
- Before/after cards in Services stack vertically on mobile
- Pricing table switches to card layout on mobile
- HowItWorks steps stack vertically on mobile
- UseCases cards stack to single column on mobile
- Navigation mobile menu works

- [ ] **Step 3: Check scroll navigation**

Click each nav link (Services, Clients, About, Contact) and verify smooth scroll to the correct section.

- [ ] **Step 4: Check contact form**

Verify the service dropdown shows the 5 new AI options and the budget dropdown shows RM values.

- [ ] **Step 5: Fix any issues found**

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "fix: resolve any issues from verification"
```
