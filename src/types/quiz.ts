export type Segment = "ops" | "team" | "sales" | "service";
export type Urgency = "low" | "med" | "high";
export type TeamTier = "solo" | "2-5" | "6-20" | "20+";
export type Country = "MY" | "SG" | "OTHER";

export type Q2Option =
  | "hired"
  | "sops"
  | "saas"
  | "chatgpt"
  | "ignored"
  | "other";

export type Q3Option = "daily" | "weekly" | "month_end" | "always";

export type Q4Option =
  | "lose_clients"
  | "burn_out"
  | "cap_growth"
  | "fall_behind";

export interface QuizAnswers {
  q1: Segment;
  q2: Q2Option[];
  q3: Q3Option;
  q4: Q4Option;
  q5: TeamTier;
  capture: {
    name: string;
    email: string;
    whatsapp?: string;
    company?: string;
    country: Country;
  };
}

export type TemplateSlot =
  | "d0_result"
  | "d1_mechanism"
  | "d3_proof"
  | "d5_objections"
  | "d9_last_call";

export type TemplateKey = `${Segment}_${TemplateSlot}`;
