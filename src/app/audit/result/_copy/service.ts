import type { ResultCopy } from "./types";

const copy: ResultCopy = {
  segment: "service",
  headline: "YOU'RE NOT ANSWERING QUESTIONS — YOU'RE ANSWERING THE SAME ONES.",
  subhead:
    "80% of what your support team types today is something they typed last week — and the week before.",
  mechanismBullets: [
    "Hiring more agents scales cost with volume. Not leverage.",
    "FAQ pages exist. Customers don't read them.",
    "Generic chatbots deflect — they don't actually resolve.",
  ],
  failureMessages: {
    hired:
      "You hired another support agent. Queue is shorter. Cost per ticket hasn't moved.",
    sops:
      "You wrote a macro library. Agents use it. Customers still need a human for half of it.",
    saas:
      "You tried an off-the-shelf chatbot. It confidently gave wrong answers. You shut it off.",
    chatgpt:
      "You tried ChatGPT for support drafts. Good first draft. Still need a human to send.",
    ignored:
      "You've been eating the cost. Margins know it. Your team knows it.",
    other:
      "Whatever you tried — support still eats hours you can't get back.",
  },
  mechanismParagraph:
    "AI agents handle the customer questions you answer the same way every time — and escalate only when judgment is needed. The agent reads your past tickets, your help docs, and your product data. It responds in your tone. When the answer requires account access, it actually does the lookup. When the issue is genuinely new, it hands off to a human with the full context pre-written. Unlike a chatbot, it doesn't deflect — it resolves. Unlike a FAQ, it answers the exact question asked. Unlike an SOP, it does the work, not just describes it. The result: your team spends their time on the 20% of tickets that actually need human judgment, and the other 80% resolves in seconds.",
  proof: [
    {
      number: "73% deflection",
      summary:
        "Support agent for a Singapore e-commerce brand — resolved the majority of Tier 1 tickets end-to-end.",
    },
    {
      number: "8 min → 45 sec response",
      summary:
        "First-touch agent for a KL services firm — no more queue anxiety.",
    },
  ],
  planSteps: [
    "Book a 30-min audit call — we audit your top-10 ticket categories.",
    "Get your roadmap in 7 days — exact agents to deflect each category.",
    "We build the first agent live in 30 days — trained on your real tickets.",
  ],
  faqs: [
    {
      q: "What if the AI answers wrong?",
      a: "The agent only resolves confidently. When confidence is low, it drafts and hands to a human. Wrong answers are vanishingly rare in practice.",
    },
    {
      q: "Our product is too niche.",
      a: "Niche is an advantage — the agent reads your own docs and tickets, not the public internet.",
    },
    {
      q: "We're too small for this.",
      a: "Small teams benefit more per-head. One agent replaces a part-time support hire.",
    },
    {
      q: "Will customers hate it?",
      a: "Customers hate waiting. They don't care who answers — only that it's fast and correct.",
    },
  ],
};

export default copy;
