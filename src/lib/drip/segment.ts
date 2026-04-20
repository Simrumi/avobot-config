import type {
  QuizAnswers,
  Segment,
  Urgency,
  TeamTier,
} from "@/types/quiz";

export function deriveSegment(answers: QuizAnswers): Segment {
  return answers.q1;
}

export function deriveUrgency(answers: QuizAnswers): Urgency {
  const hotTiming = answers.q3 === "daily" || answers.q3 === "always";
  const hotStakes = answers.q4 === "lose_clients" || answers.q4 === "burn_out";
  if (hotTiming && hotStakes) return "high";

  const coldTiming = answers.q3 === "month_end";
  const coldStakes = answers.q4 === "fall_behind";
  if (coldTiming && coldStakes) return "low";

  return "med";
}

export function deriveTeamTier(answers: QuizAnswers): TeamTier {
  return answers.q5;
}
