import type { ResultCopy } from "./types";

const copy: ResultCopy = {
  segment: "sales",
  headline: "YOUR LEADS AREN'T COLD — THEY'RE FORGOTTEN.",
  subhead:
    "Inbound shows up hot. It goes cold in your inbox while you were on another call. Not a lead problem — a follow-up problem.",
  mechanismBullets: [
    "Hiring an SDR front-loads cost before the system can support them.",
    "SOPs tell reps what to do — they don't do it when the rep is on a call.",
    "Most CRMs track pipeline — they don't move it.",
  ],
  failureMessages: {
    hired:
      "You hired a rep. They're great on calls. The follow-up still drops when their day gets busy.",
    sops:
      "You wrote a follow-up SOP. Everyone agrees with it. Nobody follows it on bad days.",
    saas:
      "You bought a CRM. It tells you every lead you're not following up on. Helpful. Demoralising.",
    chatgpt:
      "You used ChatGPT to write follow-up emails. Faster drafts. Still nobody to hit send.",
    ignored:
      "You've been letting leads leak. They're converting for someone else right now.",
    other:
      "Whatever you tried — the funnel still leaks between first contact and second touch.",
  },
  mechanismParagraph:
    "AI agents replace the follow-up discipline you wish you had. When a lead comes in, the agent qualifies them, sends a contextual first response in minutes, books the call if warm, nurtures them on a schedule if cold, and reminds you personally when the lead responds to something that needs your judgment. Unlike a human SDR, the agent costs a fraction and never has a bad day. Unlike a CRM, it doesn't just track the lead — it actually moves them. Unlike a generic email sequence, each message references what the lead actually said, in their tone. The result: the leads you're already generating start converting at the rate they should have been all along.",
  proof: [
    {
      number: "2.4x reply rate",
      summary:
        "Follow-up agent for a Singapore B2B SaaS — warmer replies, less manual chasing.",
    },
    {
      number: "18 deals/month recovered",
      summary:
        "Lead-revival agent for a KL agency — surfaced stalled deals worth re-engaging.",
    },
  ],
  planSteps: [
    "Book a 30-min audit call — we find where your pipeline is leaking leads.",
    "Get your roadmap in 7 days — exact agents to plug the leaks.",
    "We build the first agent live in 30 days — integrated with your inbox and CRM.",
  ],
  faqs: [
    {
      q: "Won't AI email feel robotic?",
      a: "The agent writes in your voice from your past emails. Prospects can't tell. Replies prove it.",
    },
    {
      q: "We'll lose the relationship if a bot follows up.",
      a: "The bot handles the touches a human was never going to make anyway. Relationships form on the call — which you still take.",
    },
    {
      q: "Our sales cycle is too complex.",
      a: "Complex cycles benefit more — the agent carries the context the rep keeps dropping.",
    },
    {
      q: "We already use a sequencer.",
      a: "Sequencers fire the same 5 emails regardless. Agents respond to what the lead actually does.",
    },
  ],
};

export default copy;
