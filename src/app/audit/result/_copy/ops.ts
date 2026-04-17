import type { ResultCopy } from "./types";

const copy: ResultCopy = {
  segment: "ops",
  headline: "YOU'RE NOT BEHIND ON ADMIN — YOU'RE DROWNING IN IT.",
  subhead:
    "Spreadsheets stacking, invoices chasing themselves, your week evaporating into manual ops work that shouldn't need a human at all.",
  mechanismBullets: [
    "Hiring another admin just moves the bottleneck — the work still flows through one person.",
    "SOPs make the problem legible, but they don't execute themselves.",
    "Generic SaaS expects your processes to fit its shape — yours never quite does.",
  ],
  failureMessages: {
    hired:
      "You hired help. The work got faster — not smaller. When they take leave, you're the fallback.",
    sops:
      "You wrote SOPs. They now sit in a Notion page nobody reads. The work still runs through your head.",
    saas:
      "You bought a SaaS. It solved 60% and the remaining 40% is where all your time goes.",
    chatgpt:
      "You used ChatGPT manually. Works great — if you sit there copy-pasting all day.",
    ignored:
      "You've been ignoring it. Meanwhile it's been quietly eating your margin for months.",
    other:
      "Whatever you tried before — it didn't make the work disappear. That's the real signal.",
  },
  mechanismParagraph:
    "AI agents don't replace your team — they replace the bottleneck tasks in between your team. An agent sits on your tool stack (email, spreadsheets, your CRM, accounting software) and executes the boring, repetitive, rule-based work that used to need a human. Invoice-matching. Data entry. Reconciliations. Status updates. The stuff your admin hates doing and you hate paying for. Unlike a SaaS, it adapts to your process. Unlike a new hire, it works 24/7 without onboarding. Unlike ChatGPT, it takes action instead of just giving advice. The result: the work quietly gets done, and you stop being the bottleneck.",
  proof: [
    {
      number: "RM38K/mo saved",
      summary:
        "Invoice-matching agent for a Shah Alam logistics SME — replaced 3 days of manual reconciliation a week.",
    },
    {
      number: "22 hrs/week back",
      summary:
        "Data-entry agent for a Johor distributor — pulled PDF purchase orders into their ERP automatically.",
    },
  ],
  planSteps: [
    "Book a 30-min audit call — we find the 3 highest-leverage automations in your ops stack.",
    "Get your roadmap in 7 days — no fluff, just what to build and the expected ROI.",
    "We build the first agent live in 30 days — you keep it whether you continue with us or not.",
  ],
  faqs: [
    {
      q: "Won't the AI get it wrong?",
      a: "Agents run with guardrails and human review for edge cases — same way a junior admin would. Over 90% of ops tasks are rule-based and safe to automate outright.",
    },
    {
      q: "We're too small for this.",
      a: "Smaller teams benefit more, not less — one agent can carry half a team's load. Our smallest client is a 2-person firm.",
    },
    {
      q: "We already use ChatGPT.",
      a: "ChatGPT gives advice. Agents take action. The leverage isn't the model — it's the integration into your tool stack.",
    },
    {
      q: "Is this locked into your platform?",
      a: "No. We build on open infrastructure. If you fire us, the agents keep running.",
    },
  ],
};

export default copy;
