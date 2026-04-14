# HUSTLR AI Agency Pivot — Design Spec

## Context

HUSTLR is pivoting from a digital marketing agency to an AI solutions agency targeting SMEs/SMBs in Malaysia and Singapore. The website currently positions HUSTLR as a growth-focused digital marketing team. The pivot keeps the brand name, existing client logos, and core visual design (color palette, typography, layout patterns) while completely rewriting messaging, restructuring the page, and adding new sections. The Hormozi $100M Offers framework guides all copy decisions — lead with dream outcomes, anchor value against alternatives, include a named guarantee, and always offer a downgrade path.

## Brand & Tone

- **Brand name:** HUSTLR (unchanged)
- **Tagline:** "AI Solutions for Malaysian & Singaporean Businesses"
- **Tone:** Approachable and simple. Speak to business owners, not engineers. No jargon. Explain AI in terms of time saved, money saved, and problems eliminated.
- **Target audience:** SME/SMB owners and operations leaders in MY/SG who know AI matters but don't know where to start.

## Design System

- **Primary color:** `#E8524A` (unchanged)
- **Dark backgrounds:** `#1f2937` / `#0a0a0a` (unchanged)
- **Typography:** System fonts, same weight scale (unchanged)
- **New accent needed:** A green/teal for "After" states in before/after cards (suggest `#10B981` — Tailwind emerald-500)
- **New muted accent:** A warm gray or muted red for "Before" states (suggest `#EF4444` with low opacity or `#FEE2E2` background)

## Page Structure (top to bottom)

### 1. Navigation
- **File:** `src/app/components/Navigation.tsx`
- Logo text: "HUSTLR"
- Badge next to logo: "AI Solutions for SEA Businesses"
- Nav links: Services | Clients | About | Contact
- CTA button: **"Get a Free AI Audit"** (scrolls to contact)

### 2. Hero
- **File:** `src/app/components/Hero.tsx`
- **Headline:**
  ```
  YOUR BUSINESS
  RUNS ON AI.
  YOU JUST DON'T
  KNOW IT YET.
  ```
- **Subheadline:** "We build AI agents and automations that save Malaysian and Singaporean SMEs 20+ hours a week — without hiring a single engineer."
- **Primary CTA:** "See What AI Can Do For You" (scroll to services)
- **Secondary CTA:** "Get a Free AI Audit" (scroll to contact)
- **Stats row:**
  - "50+ Businesses Automated"
  - "20+ Hours Saved Weekly Per Client"
  - "98% Client Retention"
  - "Malaysia & Singapore" (with flag emojis or text)

### 3. How It Works (NEW)
- **File:** `src/app/components/HowItWorks.tsx` (new component)
- **Section label:** "How It Works"
- **Headline:** "FROM IDEA TO AI IN 3 STEPS"
- **Subheadline:** "No technical knowledge needed. We handle everything."
- **Steps:**
  1. **Free AI Audit** — "We analyse your business and find the biggest time and money sinks that AI can fix." (Number: 01)
  2. **We Build It** — "Our team designs and builds your custom AI solution — agents, automations, or apps." (Number: 02)
  3. **You Save Time & Money** — "Your AI goes live. We train your team, monitor performance, and optimise continuously." (Number: 03)
- **Design:** Horizontal 3-column on desktop, vertical stack on mobile. Large step numbers, bold step titles, body text below.

### 4. Services (REWORKED)
- **File:** `src/app/components/Services.tsx`
- **Section label:** "What We Build"
- **Headline:** "AI THAT WORKS WHILE YOU SLEEP"
- **Subheadline:** "From custom AI agents to full workflow automation — we handle the tech so you can focus on growing your business."
- **Layout:** Each service is a before/after split card.

#### Before/After Card Design
- Full-width card with two halves
- **Left ("Without AI"):** Muted red/warm background (`#FEE2E2` or similar), pain-focused copy
- **Right ("With HUSTLR"):** Green-tinted background (`#D1FAE5` or similar), outcome-focused copy
- Icon or visual indicator on each side

#### Service Cards Content

**Custom AI Agents**
- Without AI: "Your team answers the same 50 questions every day. Customers wait hours for a reply. You lose leads after business hours."
- With HUSTLR: "An AI agent handles enquiries 24/7 in English, Malay, and Mandarin. Response time: under 30 seconds. Your team handles only the complex stuff."
- Features: Customer Support Bots, Sales Agents, Internal Knowledge Bots, Multi-language Support

**AI Workflow Automation**
- Without AI: "Staff spend 3 hours a day on data entry, invoice processing, and report generation. Errors pile up."
- With HUSTLR: "Invoices process themselves. Reports generate overnight. Your team reclaims 15+ hours a week for actual work."
- Features: Process Automation, Document Processing, Smart Reporting, System Integration

**AI Consulting & Strategy**
- Without AI: "You know AI is important but don't know where to start. Consultants charge RM10k+ just to tell you what's possible."
- With HUSTLR: "A free audit shows you exactly where AI saves time and money. Clear roadmap. No jargon. No obligation."
- Features: AI Readiness Audit, ROI Analysis, Implementation Roadmap, Team Training

**AI App Development**
- Without AI: "You're using 5 different tools stitched together with spreadsheets. Nothing talks to each other."
- With HUSTLR: "One custom AI app that does exactly what your business needs — built around your workflow, not the other way around."
- Features: Custom AI Apps, Predictive Analytics, Intelligent Dashboards, API Integrations

**CTA:** "Book a Free AI Audit"

### 5. Use Cases (NEW)
- **File:** `src/app/components/UseCases.tsx` (new component)
- **Section label:** "AI For Every Industry"
- **Headline:** "AI FOR EVERY BUSINESS"
- **Subheadline:** "See how businesses like yours are using AI to get ahead."
- **Layout:** 4 cards in a 2x2 grid (desktop), stacked on mobile

#### Cards

1. **F&B / Restaurants** — "AI handles reservations, answers menu questions on WhatsApp, and predicts inventory needs. Your staff focuses on the food."
2. **Retail / E-commerce** — "Automated customer support in 3 languages, smart product recommendations, and demand forecasting that cuts overstock by 30%."
3. **Logistics / Operations** — "AI optimises delivery routes, automates shipment tracking updates, and handles supplier communications."
4. **Professional Services** — "AI drafts proposals, manages client follow-ups, and automates billing — so consultants, accountants, and lawyers spend time on clients, not admin."

Each card should have an icon relevant to the industry (use Lucide icons already in the project).

### 6. Clients
- **File:** `src/app/components/Clients.tsx`
- Keep existing logos: Melissa, Nature's Wonders, Alibaba, Honda, Axiata
- **Section label:** "Trusted By Industry Leaders"
- **Headline:** "BRANDS WE'VE ELEVATED"
- **Updated testimonial:**
  ```
  "HUSTLR automated our entire customer response workflow. What
  used to take our team 4 hours a day now runs on its own — and
  our response time dropped from 12 hours to under 2 minutes."

  — Operations Director, E-commerce Brand
  ```

### 7. Value Stack / Pricing (NEW)
- **File:** `src/app/components/Pricing.tsx` (new component)
- **Section label:** "Investment"
- **Headline:** "THE REAL COST OF NOT USING AI"

#### Comparison Table

| | Hire In-House AI Team | Traditional AI Consultancy | HUSTLR |
|---|---|---|---|
| Setup time | 3-6 months hiring | 2-3 months scoping | 2-4 weeks to first AI live |
| Monthly cost | RM30k+ (salaries) | RM15k-25k/month | From RM5k/month |
| Languages | Depends on hire | Usually English only | EN, BM, Mandarin |
| Ongoing support | You manage it | Billed hourly | Included |
| **Total Year 1** | **RM360k+** | **RM180k+** | **From RM60k** |

- HUSTLR column should be visually highlighted (brand color border/background)
- Competitor columns should be muted/grayed

#### Named Guarantee
> **The Clarity Guarantee** — If our free AI audit doesn't reveal at least 3 actionable ways to save your business 10+ hours a week, we'll pay for your next consultation with any competitor. No questions asked.

#### Downgrade Path
> "Not ready for a monthly plan? Start with a one-time AI audit for RM2,500 — no subscription needed."

### 8. About
- **File:** `src/app/components/About.tsx`
- **Section label:** "About HUSTLR"
- **Headline:**
  ```
  WE MAKE AI
  SIMPLE FOR
  BUSINESSES
  THAT BUILD ASIA.
  ```
- **Body copy:**
  ```
  Most AI agencies talk to engineers. We talk to business owners.

  We started HUSTLR because we saw SMEs across Malaysia and Singapore
  getting left behind in the AI wave — not because they didn't want to
  adopt it, but because nobody explained it in plain language.

  We're a team of builders who speak both tech and business. We don't
  sell hype. We build AI that saves you time, cuts your costs, and
  makes your team more effective — then we show you the numbers to prove it.
  ```
- **Stats:** "7+ Years Active" | "25 Team Members"
- **Core values (4 cards):**
  1. **Plain Language** — "We explain everything in terms you understand. No jargon, no buzzwords, no fluff."
  2. **Results You Can Measure** — "Every AI solution comes with a clear ROI projection. If it doesn't save you time or money, we don't build it."
  3. **Built for SEA** — "We understand Malaysian and Singaporean businesses. Our solutions work in English, Malay, and Mandarin."
  4. **Your Team, Extended** — "We don't just deliver and disappear. We train your team, maintain your systems, and grow with you."

### 9. Contact
- **File:** `src/app/components/Contact.tsx`
- **Section label:** "Start Your AI Journey"
- **Headline:**
  ```
  LET'S FIND YOUR
  BIGGEST AI WIN
  ```
- **Subheadline:** "Book a free AI audit — we'll show you exactly where AI can save you time and money, with no obligation."
- **Price anchor:** "Most AI consultancies charge RM5,000-15,000 for an audit like this. Yours is free."
- **Guarantee restatement:** Display The Clarity Guarantee near the submit button.

#### Form Fields
- Name (required)
- Email (required)
- Company
- Service dropdown: Custom AI Agents, AI Workflow Automation, AI Consulting & Strategy, AI App Development, Not Sure — Help Me Decide
- Budget dropdown: RM5k-15k, RM15k-30k, RM30k-50k, RM50k+
- Project Details (textarea, required)

#### Contact Info
- Email: hello@hustlr.com
- Office: Raffles Place, Singapore

### 10. Footer
- **File:** `src/app/components/Footer.tsx`
- **Tagline:** "AI solutions that save time, cut costs, and grow revenue for Malaysian and Singaporean businesses."
- **Services links:** Custom AI Agents, AI Workflow Automation, AI Consulting & Strategy, AI App Development
- **Company links:** About Us, Our Work, Careers, Contact
- **Newsletter:** "Get the latest insights on AI for Southeast Asian businesses."
- Social links: LinkedIn, Instagram, Twitter, YouTube (unchanged)

## Metadata
- **File:** `src/app/layout.tsx`
- **Title:** "HUSTLR | AI Solutions for Malaysian & Singaporean Businesses"
- **Description:** "We build custom AI agents, workflow automations, and AI applications for SMEs in Malaysia and Singapore. Save 20+ hours a week without hiring engineers."

## Page Component Order
- **File:** `src/app/page.tsx`
- Navigation > Hero > HowItWorks > Services > UseCases > Clients > Pricing > About > Contact > Footer

## Files to Create
- `src/app/components/HowItWorks.tsx`
- `src/app/components/UseCases.tsx`
- `src/app/components/Pricing.tsx`

## Files to Modify
- `src/app/components/Navigation.tsx`
- `src/app/components/Hero.tsx`
- `src/app/components/Services.tsx`
- `src/app/components/Clients.tsx`
- `src/app/components/About.tsx`
- `src/app/components/Contact.tsx`
- `src/app/components/Footer.tsx`
- `src/app/layout.tsx`
- `src/app/page.tsx`

## Dependencies
- No new npm packages needed
- Lucide React icons already installed — use for industry icons in Use Cases and service icons
- Tailwind CSS already configured — use for all styling

## Verification
1. Run `npm run dev` and check all sections render correctly
2. Test responsive layout on mobile (check all before/after cards stack properly)
3. Verify all scroll navigation links point to correct sections (Services, Clients, About, Contact + new sections)
4. Check the contact form dropdown options are updated
5. Verify the comparison table is readable on mobile (may need horizontal scroll or card layout)
6. Test all animations/transitions carry over to new sections
