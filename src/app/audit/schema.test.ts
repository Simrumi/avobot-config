import { describe, it, expect } from "vitest";
import { QuizInputSchema } from "./schema";

const valid = {
  q1: "ops",
  q2: ["sops", "saas"],
  q3: "daily",
  q4: "burn_out",
  q5: "2-5",
  capture: {
    name: "Aiman",
    email: "aiman@example.com",
    country: "MY",
  },
};

describe("QuizInputSchema", () => {
  it("accepts valid input", () => {
    expect(QuizInputSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects invalid segment", () => {
    expect(
      QuizInputSchema.safeParse({ ...valid, q1: "nope" }).success
    ).toBe(false);
  });

  it("rejects invalid email", () => {
    expect(
      QuizInputSchema.safeParse({
        ...valid,
        capture: { ...valid.capture, email: "not-an-email" },
      }).success
    ).toBe(false);
  });

  it("allows empty q2 array", () => {
    expect(
      QuizInputSchema.safeParse({ ...valid, q2: [] }).success
    ).toBe(true);
  });

  it("requires country in enum", () => {
    expect(
      QuizInputSchema.safeParse({
        ...valid,
        capture: { ...valid.capture, country: "US" },
      }).success
    ).toBe(false);
  });

  it("caps name length at 200", () => {
    expect(
      QuizInputSchema.safeParse({
        ...valid,
        capture: { ...valid.capture, name: "a".repeat(201) },
      }).success
    ).toBe(false);
  });
});
