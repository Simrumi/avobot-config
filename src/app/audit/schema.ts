import { z } from "zod";

export const QuizInputSchema = z.object({
  q1: z.enum(["ops", "team", "sales", "service"]),
  q2: z
    .array(
      z.enum(["hired", "sops", "saas", "chatgpt", "ignored", "other"])
    )
    .max(6),
  q3: z.enum(["daily", "weekly", "month_end", "always"]),
  q4: z.enum(["lose_clients", "burn_out", "cap_growth", "fall_behind"]),
  q5: z.enum(["solo", "2-5", "6-20", "20+"]),
  capture: z.object({
    name: z.string().trim().min(1).max(200),
    email: z.string().trim().toLowerCase().email().max(320),
    whatsapp: z.string().trim().max(40).optional().or(z.literal("")),
    company: z.string().trim().max(200).optional().or(z.literal("")),
    country: z.enum(["MY", "SG", "OTHER"]),
  }),
});

export type QuizInput = z.infer<typeof QuizInputSchema>;
