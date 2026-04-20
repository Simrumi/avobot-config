import type { ResultCopy } from "./types";

const copy: ResultCopy = {
  segment: "team",
  headline: "YOUR TEAM ISN'T SLOW — YOUR HANDOFFS ARE.",
  subhead:
    "The work moves fast inside any one person's head. It dies every time it crosses between them.",
  mechanismBullets: [
    "Hiring a project manager just puts a human middleman on the broken handoff.",
    "SOPs describe the handoff. They don't enforce it.",
    "Most project management SaaS measures the problem — it doesn't fix it.",
  ],
  failureMessages: {
    hired:
      "You hired a coordinator. The coordination bandwidth got bigger — not faster. They became another handoff.",
    sops:
      "You documented your process. People still ping you to clarify step 3 every week.",
    saas:
      "You bought Asana/Trello/Monday. It's now a graveyard of half-updated cards.",
    chatgpt:
      "You used ChatGPT. It wrote nice process docs. Nobody executed them.",
    ignored:
      "You've been letting it slide. The cost shows up as missed deadlines and staff frustration.",
    other:
      "You've tried things. The handoffs are still the choke point. Noted.",
  },
  mechanismParagraph:
    "AI agents sit between your team members like a silent project manager that never sleeps. When step 1 finishes, the agent automatically briefs the person for step 2 — with full context, the relevant files attached, and the checklist already populated. When something stalls, it nudges. When a handoff has all the inputs it needs, it flags ready-to-go. The work doesn't wait in Slack for someone to notice. Unlike a human PM, the agent costs nothing extra per project. Unlike a SaaS tool, it works inside your existing stack — Slack, email, Google Drive, whatever you already use. The result: the team stops stepping on each other and the work actually moves.",
  proof: [
    {
      number: "3x faster onboarding",
      summary:
        "Onboarding agent for a Singapore consultancy — new hires productive in week 1 instead of month 2.",
    },
    {
      number: "60% fewer 'status?' pings",
      summary:
        "Handoff agent for a KL creative studio — clients and PMs always know where work stands.",
    },
  ],
  planSteps: [
    "Book a 30-min audit call — we map where your handoffs are leaking time.",
    "Get your roadmap in 7 days — specific agents for your top 3 handoff points.",
    "We build the first agent live in 30 days — integrated into your existing stack.",
  ],
  faqs: [
    {
      q: "My team won't adopt another tool.",
      a: "Agents don't add a new app — they work through the tools your team already uses (Slack, email, Drive).",
    },
    {
      q: "Won't this make people feel surveilled?",
      a: "We frame it as an assistant, not a monitor. Teams report feeling more supported, not watched.",
    },
    {
      q: "We're too small for this.",
      a: "Small teams feel handoff pain more per-head, not less. One agent often replaces a PM hire you were dreading.",
    },
    {
      q: "What if our process changes?",
      a: "Agents are edited in minutes. Not months. Changing a step is cheaper than editing an SOP.",
    },
  ],
};

export default copy;
