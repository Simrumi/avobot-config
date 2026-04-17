import { describe, it, expect } from "vitest";
import { deriveSegment, deriveUrgency, deriveTeamTier } from "./segment";
import type { QuizAnswers } from "@/types/quiz";

const base: QuizAnswers = {
  q1: "ops",
  q2: [],
  q3: "weekly",
  q4: "cap_growth",
  q5: "2-5",
  capture: { name: "x", email: "x@x.com", country: "MY" },
};

describe("deriveSegment", () => {
  it("returns q1 verbatim", () => {
    expect(deriveSegment({ ...base, q1: "sales" })).toBe("sales");
    expect(deriveSegment({ ...base, q1: "service" })).toBe("service");
  });
});

describe("deriveUrgency", () => {
  it("returns high when q3 is daily/always AND q4 is lose_clients/burn_out", () => {
    expect(deriveUrgency({ ...base, q3: "daily", q4: "lose_clients" })).toBe("high");
    expect(deriveUrgency({ ...base, q3: "always", q4: "burn_out" })).toBe("high");
  });

  it("returns low when q3 is month_end AND q4 is fall_behind", () => {
    expect(deriveUrgency({ ...base, q3: "month_end", q4: "fall_behind" })).toBe("low");
  });

  it("returns med otherwise", () => {
    expect(deriveUrgency({ ...base, q3: "weekly", q4: "cap_growth" })).toBe("med");
    expect(deriveUrgency({ ...base, q3: "daily", q4: "fall_behind" })).toBe("med");
  });
});

describe("deriveTeamTier", () => {
  it("returns q5 verbatim", () => {
    expect(deriveTeamTier({ ...base, q5: "solo" })).toBe("solo");
    expect(deriveTeamTier({ ...base, q5: "20+" })).toBe("20+");
  });
});
