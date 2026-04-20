# AI Audit Quiz Funnel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the "Get A Free AI Audit" CTA with a Hormozi-style quiz funnel that diagnoses an SME's biggest pain, segments them, shows a presell result page with a single audit-call CTA, and enrols them in a 5-email segment-specific drip.

**Architecture:** Client-side quiz in a single `/audit` route, server action for atomic lead + drip seeding into Supabase, segment-keyed static presell at `/audit/result`, and a Koyeb-scheduled cron endpoint that polls Supabase every 5 minutes and sends due emails via Resend.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Zod, Supabase Postgres (`@supabase/supabase-js`), Resend, React Email, Vitest.

**Spec:** `docs/superpowers/specs/2026-04-17-ai-audit-quiz-funnel-design.md`

---

## File Structure

### New Files

**Quiz UI**
- `src/app/audit/page.tsx` — server shell that mounts QuizFlow
- `src/app/audit/layout.tsx` — audit-wide layout (progress bar lives here)
- `src/app/audit/_components/QuizFlow.tsx` — client state machine (steps, localStorage, submit)
- `src/app/audit/_components/ProgressBar.tsx` — top-pinned progress bar
- `src/app/audit/_components/steps/Step1Hook.tsx` through `Step6Capture.tsx` — one file per step
- `src/app/audit/actions.ts` — `submitQuiz` server action
- `src/app/audit/schema.ts` — Zod schemas shared client/server

**Result**
- `src/app/audit/result/page.tsx` — segment-keyed presell
- `src/app/audit/result/_copy/ops.ts` — per-segment copy blocks
- `src/app/audit/result/_copy/team.ts`
- `src/app/audit/result/_copy/sales.ts`
- `src/app/audit/result/_copy/service.ts`
- `src/app/audit/result/_components/PresellSections.tsx` — section components that read copy by segment

**Unsubscribe**
- `src/app/audit/unsubscribe/page.tsx`

**APIs**
- `src/app/api/cron/send-drip/route.ts` — Koyeb cron handler
- `src/app/api/webhooks/resend/route.ts` — Resend event webhook

**Libraries**
- `src/lib/supabase.ts` — typed server client
- `src/lib/drip/segment.ts` — `deriveSegment`, `deriveUrgency`, `deriveTeamTier`
- `src/lib/drip/schedule.ts` — `scheduleDrip` (5 rows)
- `src/lib/drip/send.ts` — `sendOneEmail` (render + Resend + row update)
- `src/lib/email/render.tsx` — React Email → HTML/text
- `src/lib/email/unsubscribe.ts` — HMAC sign/verify
- `src/lib/email/templates/index.ts` — template_key → component map
- `src/lib/email/templates/_Layout.tsx` — shared email layout (header/footer/unsubscribe)
- `src/lib/email/templates/<segment>_d0_result.tsx` × 4
- `src/lib/email/templates/<segment>_d1_mechanism.tsx` × 4
- `src/lib/email/templates/<segment>_d3_proof.tsx` × 4
- `src/lib/email/templates/<segment>_d5_objections.tsx` × 4
- `src/lib/email/templates/<segment>_d9_last_call.tsx` × 4

**Types**
- `src/types/quiz.ts` — shared types (`QuizAnswers`, `Segment`, `Urgency`, `TeamTier`)

**Database**
- `supabase/migrations/0001_quiz_funnel.sql` — schema migration

**Tests** (co-located under `tests/` or `__tests__/` — follow step instructions)
- `src/lib/drip/segment.test.ts`
- `src/lib/drip/schedule.test.ts`
- `src/lib/email/unsubscribe.test.ts`
- `src/app/audit/schema.test.ts`
- `src/app/audit/actions.test.ts`
- `src/app/api/cron/send-drip/route.test.ts`

**Config**
- `vitest.config.ts`
- `.env.example` (new)

### Modified Files
- `package.json` — add new deps + test script
- `src/app/components/Hero.tsx` — swap `href="#contact"` → `href="/audit"` on audit CTA
- `src/app/components/Navigation.tsx` — same CTA swap
- `src/app/components/Contact.tsx` — leave form as-is (secondary path); if a header CTA exists, swap to `/audit`

---

## Task 1: Install dependencies and configure Vitest

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `.env.example`

- [ ] **Step 1: Install runtime dependencies**

```bash
npm install @supabase/supabase-js resend react-email @react-email/components @react-email/render zod
```

- [ ] **Step 2: Install dev dependencies**

```bash
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom jsdom happy-dom
```

- [ ] **Step 3: Add test script to `package.json`**

Add to `"scripts"` in `package.json`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: ["src/**/*.test.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

- [ ] **Step 5: Create `.env.example`**

```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
RESEND_WEBHOOK_SECRET=
CRON_SECRET=
SITE_URL=http://localhost:3000
NEXT_PUBLIC_BOOKING_URL=
```

- [ ] **Step 6: Sanity check**

Run: `npm test`
Expected: "No test files found" (passes with zero tests is OK).

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vitest.config.ts .env.example
git commit -m "chore: add quiz funnel deps and vitest setup"
```

---

## Task 2: Create Supabase schema migration

**Files:**
- Create: `supabase/migrations/0001_quiz_funnel.sql`

- [ ] **Step 1: Create migration file**

```sql
-- supabase/migrations/0001_quiz_funnel.sql

create table leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  whatsapp text,
  company text,
  country text not null check (country in ('MY','SG','OTHER')),
  segment text not null check (segment in ('ops','team','sales','service')),
  urgency text not null check (urgency in ('low','med','high')),
  team_tier text not null check (team_tier in ('solo','2-5','6-20','20+')),
  answers jsonb not null,
  unsubscribed_at timestamptz,
  utm jsonb
);
create index leads_email_idx on leads (email);

create table scheduled_emails (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id) on delete cascade,
  template_key text not null,
  send_at timestamptz not null,
  sent_at timestamptz,
  status text not null default 'pending'
    check (status in ('pending','in_flight','sent','failed','skipped')),
  error text,
  attempts int not null default 0
);
create index scheduled_emails_due_idx on scheduled_emails (status, send_at);

create table email_events (
  id bigserial primary key,
  lead_id uuid references leads(id) on delete cascade,
  template_key text not null,
  event_type text not null,
  at timestamptz not null default now(),
  payload jsonb
);
create index email_events_lead_idx on email_events (lead_id);
```

- [ ] **Step 2: Apply migration to Supabase**

Run in the Supabase SQL editor (or via `supabase db push` if the CLI is set up):

```bash
# if CLI is configured:
supabase db push
```

If no CLI: paste `0001_quiz_funnel.sql` into the Supabase project's SQL editor and run it.

- [ ] **Step 3: Verify tables exist**

In the Supabase dashboard → Table Editor, confirm `leads`, `scheduled_emails`, `email_events` are all present.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/0001_quiz_funnel.sql
git commit -m "feat(db): quiz funnel schema (leads, scheduled_emails, email_events)"
```

---

## Task 3: Shared types and Supabase client

**Files:**
- Create: `src/types/quiz.ts`
- Create: `src/lib/supabase.ts`

- [ ] **Step 1: Write `src/types/quiz.ts`**

```ts
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
```

- [ ] **Step 2: Write `src/lib/supabase.ts`**

```ts
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
}

export const supabase = createClient(url, key, {
  auth: { persistSession: false },
});

export type Lead = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  whatsapp: string | null;
  company: string | null;
  country: "MY" | "SG" | "OTHER";
  segment: "ops" | "team" | "sales" | "service";
  urgency: "low" | "med" | "high";
  team_tier: "solo" | "2-5" | "6-20" | "20+";
  answers: unknown;
  unsubscribed_at: string | null;
  utm: unknown | null;
};

export type ScheduledEmail = {
  id: string;
  lead_id: string;
  template_key: string;
  send_at: string;
  sent_at: string | null;
  status: "pending" | "in_flight" | "sent" | "failed" | "skipped";
  error: string | null;
  attempts: number;
};
```

- [ ] **Step 3: Commit**

```bash
git add src/types/quiz.ts src/lib/supabase.ts
git commit -m "feat(lib): shared quiz types and supabase server client"
```

---

## Task 4: Quiz Zod schema (TDD)

**Files:**
- Create: `src/app/audit/schema.ts`
- Create: `src/app/audit/schema.test.ts`

- [ ] **Step 1: Write failing test**

`src/app/audit/schema.test.ts`:

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- schema`
Expected: FAIL with "Cannot find module './schema'".

- [ ] **Step 3: Implement `src/app/audit/schema.ts`**

```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- schema`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add src/app/audit/schema.ts src/app/audit/schema.test.ts
git commit -m "feat(audit): zod schema for quiz input"
```

---

## Task 5: Segment and urgency derivation (TDD)

**Files:**
- Create: `src/lib/drip/segment.ts`
- Create: `src/lib/drip/segment.test.ts`

- [ ] **Step 1: Write failing test**

`src/lib/drip/segment.test.ts`:

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- segment`
Expected: FAIL with "Cannot find module './segment'".

- [ ] **Step 3: Implement `src/lib/drip/segment.ts`**

```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- segment`
Expected: PASS (5 tests across 3 describes).

- [ ] **Step 5: Commit**

```bash
git add src/lib/drip/segment.ts src/lib/drip/segment.test.ts
git commit -m "feat(drip): derive segment, urgency, team tier from quiz answers"
```

---

## Task 6: Drip schedule computation (TDD)

**Files:**
- Create: `src/lib/drip/schedule.ts`
- Create: `src/lib/drip/schedule.test.ts`

- [ ] **Step 1: Write failing test**

`src/lib/drip/schedule.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { buildDripRows } from "./schedule";

describe("buildDripRows", () => {
  const now = new Date("2026-04-17T00:00:00.000Z");
  const leadId = "lead-1";

  it("returns 5 rows for a given segment", () => {
    const rows = buildDripRows({ leadId, segment: "ops", now });
    expect(rows).toHaveLength(5);
  });

  it("uses correct template_keys for the segment", () => {
    const rows = buildDripRows({ leadId, segment: "sales", now });
    expect(rows.map((r) => r.template_key)).toEqual([
      "sales_d0_result",
      "sales_d1_mechanism",
      "sales_d3_proof",
      "sales_d5_objections",
      "sales_d9_last_call",
    ]);
  });

  it("schedules D0 at now, and D1/D3/D5/D9 at the correct offsets", () => {
    const rows = buildDripRows({ leadId, segment: "ops", now });
    expect(rows[0].send_at).toEqual(now.toISOString());
    expect(rows[1].send_at).toEqual(new Date("2026-04-18T00:00:00.000Z").toISOString());
    expect(rows[2].send_at).toEqual(new Date("2026-04-20T00:00:00.000Z").toISOString());
    expect(rows[3].send_at).toEqual(new Date("2026-04-22T00:00:00.000Z").toISOString());
    expect(rows[4].send_at).toEqual(new Date("2026-04-26T00:00:00.000Z").toISOString());
  });

  it("all rows reference the given leadId with status 'pending'", () => {
    const rows = buildDripRows({ leadId, segment: "team", now });
    for (const r of rows) {
      expect(r.lead_id).toBe(leadId);
      expect(r.status).toBe("pending");
      expect(r.attempts).toBe(0);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- schedule`
Expected: FAIL with "Cannot find module './schedule'".

- [ ] **Step 3: Implement `src/lib/drip/schedule.ts`**

```ts
import type { Segment, TemplateSlot } from "@/types/quiz";

const HOUR_MS = 60 * 60 * 1000;

const SLOT_OFFSETS_HOURS: Record<TemplateSlot, number> = {
  d0_result: 0,
  d1_mechanism: 24,
  d3_proof: 72,
  d5_objections: 120,
  d9_last_call: 216,
};

const SLOT_ORDER: TemplateSlot[] = [
  "d0_result",
  "d1_mechanism",
  "d3_proof",
  "d5_objections",
  "d9_last_call",
];

export type DripRowInput = {
  leadId: string;
  segment: Segment;
  now: Date;
};

export type DripRow = {
  lead_id: string;
  template_key: string;
  send_at: string;
  status: "pending";
  attempts: 0;
};

export function buildDripRows(input: DripRowInput): DripRow[] {
  return SLOT_ORDER.map((slot) => ({
    lead_id: input.leadId,
    template_key: `${input.segment}_${slot}`,
    send_at: new Date(
      input.now.getTime() + SLOT_OFFSETS_HOURS[slot] * HOUR_MS
    ).toISOString(),
    status: "pending" as const,
    attempts: 0 as const,
  }));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- schedule`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/drip/schedule.ts src/lib/drip/schedule.test.ts
git commit -m "feat(drip): compute 5-email schedule rows for a lead"
```

---

## Task 7: Unsubscribe HMAC sign/verify (TDD)

**Files:**
- Create: `src/lib/email/unsubscribe.ts`
- Create: `src/lib/email/unsubscribe.test.ts`

- [ ] **Step 1: Write failing test**

`src/lib/email/unsubscribe.test.ts`:

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { signLeadToken, verifyLeadToken } from "./unsubscribe";

beforeEach(() => {
  process.env.CRON_SECRET = "test-secret-12345";
});

describe("unsubscribe token", () => {
  it("verifies a freshly signed token", () => {
    const token = signLeadToken("lead-abc");
    expect(verifyLeadToken("lead-abc", token)).toBe(true);
  });

  it("rejects a tampered token", () => {
    const token = signLeadToken("lead-abc");
    expect(verifyLeadToken("lead-abc", token + "x")).toBe(false);
  });

  it("rejects a token signed for a different lead", () => {
    const token = signLeadToken("lead-abc");
    expect(verifyLeadToken("lead-xyz", token)).toBe(false);
  });

  it("rejects when CRON_SECRET changes", () => {
    const token = signLeadToken("lead-abc");
    process.env.CRON_SECRET = "different-secret";
    expect(verifyLeadToken("lead-abc", token)).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- unsubscribe`
Expected: FAIL with "Cannot find module './unsubscribe'".

- [ ] **Step 3: Implement `src/lib/email/unsubscribe.ts`**

```ts
import { createHmac, timingSafeEqual } from "node:crypto";

function secret(): string {
  const s = process.env.CRON_SECRET;
  if (!s) throw new Error("CRON_SECRET is required");
  return s;
}

export function signLeadToken(leadId: string): string {
  return createHmac("sha256", secret()).update(leadId).digest("hex");
}

export function verifyLeadToken(leadId: string, token: string): boolean {
  const expected = signLeadToken(leadId);
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(token, "hex");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- unsubscribe`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/email/unsubscribe.ts src/lib/email/unsubscribe.test.ts
git commit -m "feat(email): hmac-signed unsubscribe tokens"
```

---

## Task 8: submitQuiz server action (TDD with integration)

**Files:**
- Create: `src/app/audit/actions.ts`
- Create: `src/app/audit/actions.test.ts`

This test exercises the server action against a real Supabase client. Requires `.env.local` with `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` pointing at a project where the migration has been applied. Integration-style — per the spec, we do not mock the DB.

- [ ] **Step 1: Write failing test**

`src/app/audit/actions.test.ts`:

```ts
import { describe, it, expect, beforeAll, afterEach } from "vitest";
import { submitQuiz } from "./actions";
import { supabase } from "@/lib/supabase";
import type { QuizInput } from "./schema";

const uniqueEmail = (suffix: string) =>
  `test+${Date.now()}.${suffix}@hustlr-test.local`;

const validInput = (email: string): QuizInput => ({
  q1: "ops",
  q2: ["sops"],
  q3: "daily",
  q4: "burn_out",
  q5: "2-5",
  capture: { name: "Test User", email, country: "MY" },
});

afterEach(async () => {
  await supabase.from("leads").delete().like("email", "test+%@hustlr-test.local");
});

describe("submitQuiz", () => {
  it("rejects invalid input", async () => {
    const bad = { ...validInput("x@y.com"), q1: "nope" } as unknown as QuizInput;
    await expect(submitQuiz(bad)).rejects.toThrow();
  });

  it("inserts a lead and 5 scheduled_emails on first submit", async () => {
    const email = uniqueEmail("first");
    const { leadId, segment } = await submitQuiz(validInput(email));
    expect(segment).toBe("ops");

    const { data: lead } = await supabase.from("leads").select("*").eq("id", leadId).single();
    expect(lead?.email).toBe(email);
    expect(lead?.urgency).toBe("high");

    const { data: rows } = await supabase
      .from("scheduled_emails")
      .select("template_key,status")
      .eq("lead_id", leadId);
    expect(rows?.length).toBe(5);
    expect(rows?.every((r) => r.status === "pending")).toBe(true);
  });

  it("reseeds a drip when the same email resubmits and is not unsubscribed", async () => {
    const email = uniqueEmail("resub");
    const first = await submitQuiz(validInput(email));
    const second = await submitQuiz(validInput(email));
    expect(second.leadId).toBe(first.leadId);

    const { data: rows } = await supabase
      .from("scheduled_emails")
      .select("status")
      .eq("lead_id", first.leadId);
    const pending = rows?.filter((r) => r.status === "pending").length ?? 0;
    const skipped = rows?.filter((r) => r.status === "skipped").length ?? 0;
    expect(pending).toBe(5);
    expect(skipped).toBe(5);
  });

  it("does NOT reseed a drip for an unsubscribed lead", async () => {
    const email = uniqueEmail("unsub");
    const { leadId } = await submitQuiz(validInput(email));
    await supabase.from("leads").update({ unsubscribed_at: new Date().toISOString() }).eq("id", leadId);
    await supabase.from("scheduled_emails").delete().eq("lead_id", leadId);

    await submitQuiz(validInput(email));

    const { data: rows } = await supabase
      .from("scheduled_emails")
      .select("id")
      .eq("lead_id", leadId);
    expect(rows?.length).toBe(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- actions`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/app/audit/actions.ts`**

```ts
"use server";

import { supabase } from "@/lib/supabase";
import { QuizInputSchema, type QuizInput } from "./schema";
import {
  deriveSegment,
  deriveUrgency,
  deriveTeamTier,
} from "@/lib/drip/segment";
import { buildDripRows } from "@/lib/drip/schedule";
import type { Segment } from "@/types/quiz";

export type SubmitQuizResult = {
  leadId: string;
  segment: Segment;
};

export async function submitQuiz(input: QuizInput): Promise<SubmitQuizResult> {
  const parsed = QuizInputSchema.parse(input);

  const segment = deriveSegment(parsed);
  const urgency = deriveUrgency(parsed);
  const team_tier = deriveTeamTier(parsed);

  const existing = await supabase
    .from("leads")
    .select("id,unsubscribed_at")
    .eq("email", parsed.capture.email)
    .maybeSingle();

  let leadId: string;
  let isUnsubscribed = false;

  if (existing.data) {
    leadId = existing.data.id;
    isUnsubscribed = !!existing.data.unsubscribed_at;
    const { error: updErr } = await supabase
      .from("leads")
      .update({
        name: parsed.capture.name,
        whatsapp: parsed.capture.whatsapp || null,
        company: parsed.capture.company || null,
        country: parsed.capture.country,
        segment,
        urgency,
        team_tier,
        answers: parsed,
      })
      .eq("id", leadId);
    if (updErr) throw new Error(updErr.message);
  } else {
    const { data: ins, error: insErr } = await supabase
      .from("leads")
      .insert({
        name: parsed.capture.name,
        email: parsed.capture.email,
        whatsapp: parsed.capture.whatsapp || null,
        company: parsed.capture.company || null,
        country: parsed.capture.country,
        segment,
        urgency,
        team_tier,
        answers: parsed,
      })
      .select("id")
      .single();
    if (insErr || !ins) throw new Error(insErr?.message ?? "insert failed");
    leadId = ins.id;
  }

  if (!isUnsubscribed) {
    await supabase
      .from("scheduled_emails")
      .update({ status: "skipped" })
      .eq("lead_id", leadId)
      .eq("status", "pending");

    const rows = buildDripRows({ leadId, segment, now: new Date() });
    const { error: seedErr } = await supabase.from("scheduled_emails").insert(rows);
    if (seedErr) throw new Error(seedErr.message);
  }

  return { leadId, segment };
}
```

- [ ] **Step 4: Run tests**

Run: `npm test -- actions`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/app/audit/actions.ts src/app/audit/actions.test.ts
git commit -m "feat(audit): submitQuiz server action with upsert + drip seeding"
```

---

## Task 9: Progress bar + quiz shell routing

**Files:**
- Create: `src/app/audit/layout.tsx`
- Create: `src/app/audit/page.tsx`
- Create: `src/app/audit/_components/ProgressBar.tsx`

- [ ] **Step 1: Write `ProgressBar.tsx`**

```tsx
"use client";

type Props = {
  step: number;
  total: number;
  onBack?: () => void;
};

export default function ProgressBar({ step, total, onBack }: Props) {
  const pct = Math.max(0, Math.min(100, (step / total) * 100));
  const label =
    step === total ? "ALMOST DONE · YOUR RESULT" : `STEP ${step} OF ${total}`;

  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur">
      <div className="max-w-3xl mx-auto flex items-center justify-between px-4 pt-3 pb-1">
        <span className="text-[10px] tracking-widest font-semibold text-black/60 uppercase">
          {label}
        </span>
        {onBack && step > 1 ? (
          <button
            type="button"
            onClick={onBack}
            className="text-[10px] tracking-widest font-semibold text-black/60 uppercase hover:text-[#E8524A]"
          >
            ← BACK
          </button>
        ) : (
          <span />
        )}
      </div>
      <div className="h-[3px] bg-[#F2EDE6]">
        <div
          className="h-full bg-[#E8524A] transition-[width] duration-[350ms] ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write `src/app/audit/layout.tsx`**

```tsx
export default function AuditLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#FBF8F4] text-black">{children}</div>;
}
```

- [ ] **Step 3: Write `src/app/audit/page.tsx`**

```tsx
import QuizFlow from "./_components/QuizFlow";

export const metadata = {
  title: "Free AI Audit — hustlr",
  description:
    "2-minute diagnostic. Find your biggest AI win and we'll send you a personalised audit.",
};

export default function AuditPage() {
  return <QuizFlow />;
}
```

- [ ] **Step 4: Visual smoke check**

Run: `npm run dev` and visit `http://localhost:3000/audit`.
Expected: blank page errors (QuizFlow not yet implemented) — next task fixes this. Skip if the module resolution already surfaces the error at build time.

- [ ] **Step 5: Commit**

```bash
git add src/app/audit/layout.tsx src/app/audit/page.tsx src/app/audit/_components/ProgressBar.tsx
git commit -m "feat(audit): quiz page shell + progress bar"
```

---

## Task 10: QuizFlow client state machine

**Files:**
- Create: `src/app/audit/_components/QuizFlow.tsx`

- [ ] **Step 1: Write `QuizFlow.tsx`**

```tsx
"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "./ProgressBar";
import Step1Hook from "./steps/Step1Hook";
import Step2Failed from "./steps/Step2Failed";
import Step3When from "./steps/Step3When";
import Step4Stakes from "./steps/Step4Stakes";
import Step5Team from "./steps/Step5Team";
import Step6Capture from "./steps/Step6Capture";
import type { QuizAnswers } from "@/types/quiz";
import { submitQuiz } from "../actions";
import type { QuizInput } from "../schema";

const STORAGE_KEY = "hustlr.audit.v1";
const TOTAL_STEPS = 6;

const EMPTY: Partial<QuizAnswers> = {
  q2: [],
};

type Partial6 = Partial<QuizAnswers>;

export default function QuizFlow() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Partial6>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { step: number; answers: Partial6 };
        if (parsed && typeof parsed.step === "number") {
          setStep(Math.min(parsed.step, 5));
          const { capture: _c, ...rest } = parsed.answers ?? {};
          setAnswers({ q2: [], ...rest });
        }
      }
    } catch {
      // ignore corrupt state
    }
  }, []);

  useEffect(() => {
    if (step >= TOTAL_STEPS) return;
    const { capture: _c, ...persisted } = answers;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ step, answers: persisted })
    );
  }, [step, answers]);

  const update = (patch: Partial6) => setAnswers((a) => ({ ...a, ...patch }));
  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const onSubmit = (capture: QuizAnswers["capture"]) => {
    setError(null);
    const full = { ...(answers as QuizAnswers), capture };
    startTransition(async () => {
      try {
        const { leadId, segment } = await submitQuiz(full as QuizInput);
        localStorage.removeItem(STORAGE_KEY);
        const failed = (full.q2 ?? []).join(",");
        router.push(
          `/audit/result?segment=${segment}&id=${leadId}&failed=${encodeURIComponent(failed)}`
        );
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Something went wrong. Try again."
        );
      }
    });
  };

  const body = useMemo(() => {
    switch (step) {
      case 1:
        return <Step1Hook value={answers.q1} onPick={(q1) => { update({ q1 }); next(); }} />;
      case 2:
        return (
          <Step2Failed
            value={answers.q2 ?? []}
            onChange={(q2) => update({ q2 })}
            onContinue={next}
          />
        );
      case 3:
        return <Step3When value={answers.q3} onPick={(q3) => { update({ q3 }); next(); }} />;
      case 4:
        return <Step4Stakes value={answers.q4} onPick={(q4) => { update({ q4 }); next(); }} />;
      case 5:
        return <Step5Team value={answers.q5} onPick={(q5) => { update({ q5 }); next(); }} />;
      case 6:
        return (
          <Step6Capture
            onSubmit={onSubmit}
            isPending={isPending}
            error={error}
          />
        );
      default:
        return null;
    }
  }, [step, answers, isPending, error]);

  return (
    <>
      <ProgressBar step={step} total={TOTAL_STEPS} onBack={back} />
      <div
        role="region"
        aria-live="polite"
        className="pt-16 min-h-screen flex items-center justify-center px-4"
      >
        <div className="max-w-2xl w-full">{body}</div>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Commit (tests land with steps in Task 11)**

```bash
git add src/app/audit/_components/QuizFlow.tsx
git commit -m "feat(audit): QuizFlow client state machine with localStorage recovery"
```

---

## Task 11: Steps 1–5 components

**Files:**
- Create: `src/app/audit/_components/steps/Step1Hook.tsx`
- Create: `src/app/audit/_components/steps/Step2Failed.tsx`
- Create: `src/app/audit/_components/steps/Step3When.tsx`
- Create: `src/app/audit/_components/steps/Step4Stakes.tsx`
- Create: `src/app/audit/_components/steps/Step5Team.tsx`
- Create: `src/app/audit/_components/steps/_shared.tsx`

- [ ] **Step 1: Shared primitives**

`src/app/audit/_components/steps/_shared.tsx`:

```tsx
"use client";

import type { ReactNode } from "react";

export function StepHeading({ children }: { children: ReactNode }) {
  return (
    <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-8 leading-tight">
      {children}
    </h1>
  );
}

export function OptionButton({
  selected,
  onClick,
  children,
}: {
  selected?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-6 py-5 border-2 rounded transition-colors ${
        selected
          ? "border-[#E8524A] bg-[#E8524A] text-white"
          : "border-black/20 bg-white hover:border-[#E8524A]"
      }`}
    >
      <span className="text-base md:text-lg font-semibold">{children}</span>
    </button>
  );
}

export function ContinueButton({
  disabled,
  onClick,
  label = "CONTINUE",
}: {
  disabled?: boolean;
  onClick: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="mt-8 w-full md:w-auto bg-[#E8524A] text-white px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-[#d14a43] transition-colors disabled:opacity-50 rounded"
    >
      {label}
    </button>
  );
}
```

- [ ] **Step 2: `Step1Hook.tsx`**

```tsx
"use client";

import type { Segment } from "@/types/quiz";
import { OptionButton, StepHeading } from "./_shared";

const OPTIONS: { value: Segment; label: string }[] = [
  { value: "ops", label: "Manual admin, data entry, invoicing, spreadsheets" },
  { value: "team", label: "Onboarding, internal handoffs, training, SOPs" },
  { value: "sales", label: "Slow lead follow-up, leads going cold, no nurture" },
  { value: "service", label: "Customer support, same questions answered 100 times" },
];

export default function Step1Hook({
  value,
  onPick,
}: {
  value?: Segment;
  onPick: (v: Segment) => void;
}) {
  return (
    <div>
      <StepHeading>Where is time leaking out of your business right now?</StepHeading>
      <div className="space-y-3">
        {OPTIONS.map((o) => (
          <OptionButton
            key={o.value}
            selected={value === o.value}
            onClick={() => onPick(o.value)}
          >
            {o.label}
          </OptionButton>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: `Step2Failed.tsx`**

```tsx
"use client";

import type { Q2Option } from "@/types/quiz";
import { ContinueButton, OptionButton, StepHeading } from "./_shared";

const OPTIONS: { value: Q2Option; label: string }[] = [
  { value: "hired", label: "Hired someone to handle it" },
  { value: "sops", label: "Built SOPs / documented the process" },
  { value: "saas", label: "Bought a SaaS for it" },
  { value: "chatgpt", label: "Used ChatGPT manually" },
  { value: "ignored", label: "Ignored it and hoped it'd fix itself" },
  { value: "other", label: "Something else" },
];

export default function Step2Failed({
  value,
  onChange,
  onContinue,
}: {
  value: Q2Option[];
  onChange: (v: Q2Option[]) => void;
  onContinue: () => void;
}) {
  const toggle = (v: Q2Option) => {
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  };

  return (
    <div>
      <StepHeading>What have you already tried that didn&apos;t stick?</StepHeading>
      <p className="text-sm text-black/60 uppercase tracking-wider mb-6">
        Pick any that apply — or none.
      </p>
      <div className="space-y-3">
        {OPTIONS.map((o) => (
          <OptionButton
            key={o.value}
            selected={value.includes(o.value)}
            onClick={() => toggle(o.value)}
          >
            {o.label}
          </OptionButton>
        ))}
      </div>
      <ContinueButton onClick={onContinue} />
    </div>
  );
}
```

- [ ] **Step 4: `Step3When.tsx`**

```tsx
"use client";

import type { Q3Option } from "@/types/quiz";
import { OptionButton, StepHeading } from "./_shared";

const OPTIONS: { value: Q3Option; label: string }[] = [
  { value: "daily", label: "Every day" },
  { value: "weekly", label: "Weekly crunch" },
  { value: "month_end", label: "Month-end or reporting periods" },
  { value: "always", label: "Always-on — it never stops" },
];

export default function Step3When({
  value,
  onPick,
}: {
  value?: Q3Option;
  onPick: (v: Q3Option) => void;
}) {
  return (
    <div>
      <StepHeading>When does this hit you the hardest?</StepHeading>
      <div className="space-y-3">
        {OPTIONS.map((o) => (
          <OptionButton key={o.value} selected={value === o.value} onClick={() => onPick(o.value)}>
            {o.label}
          </OptionButton>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: `Step4Stakes.tsx`**

```tsx
"use client";

import type { Q4Option } from "@/types/quiz";
import { OptionButton, StepHeading } from "./_shared";

const OPTIONS: { value: Q4Option; label: string }[] = [
  { value: "lose_clients", label: "We lose clients to faster competitors" },
  { value: "burn_out", label: "My team burns out and leaves" },
  { value: "cap_growth", label: "We can't grow past our current ceiling" },
  { value: "fall_behind", label: "We fall behind on tech everyone else is adopting" },
];

export default function Step4Stakes({
  value,
  onPick,
}: {
  value?: Q4Option;
  onPick: (v: Q4Option) => void;
}) {
  return (
    <div>
      <StepHeading>
        What are you afraid happens if this keeps bleeding you for another 12 months?
      </StepHeading>
      <div className="space-y-3">
        {OPTIONS.map((o) => (
          <OptionButton key={o.value} selected={value === o.value} onClick={() => onPick(o.value)}>
            {o.label}
          </OptionButton>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 6: `Step5Team.tsx`**

```tsx
"use client";

import type { TeamTier } from "@/types/quiz";
import { OptionButton, StepHeading } from "./_shared";

const OPTIONS: { value: TeamTier; label: string }[] = [
  { value: "solo", label: "Solo" },
  { value: "2-5", label: "2–5 people" },
  { value: "6-20", label: "6–20 people" },
  { value: "20+", label: "20+ people" },
];

export default function Step5Team({
  value,
  onPick,
}: {
  value?: TeamTier;
  onPick: (v: TeamTier) => void;
}) {
  return (
    <div>
      <StepHeading>How big is your team today?</StepHeading>
      <div className="space-y-3">
        {OPTIONS.map((o) => (
          <OptionButton key={o.value} selected={value === o.value} onClick={() => onPick(o.value)}>
            {o.label}
          </OptionButton>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Manual smoke check**

Run: `npm run dev`, visit `/audit`, walk through Q1–Q5.
Expected: pages advance on select (Q1/3/4/5), Q2 toggles with continue, back button works on Q2–Q5, refresh on Q4 restores to Q4.

- [ ] **Step 8: Commit**

```bash
git add src/app/audit/_components/steps
git commit -m "feat(audit): Q1–Q5 step components"
```

---

## Task 12: Step 6 capture component

**Files:**
- Create: `src/app/audit/_components/steps/Step6Capture.tsx`

- [ ] **Step 1: Write `Step6Capture.tsx`**

```tsx
"use client";

import { useState } from "react";
import type { QuizAnswers } from "@/types/quiz";
import { ContinueButton, StepHeading } from "./_shared";

type CaptureFields = QuizAnswers["capture"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Step6Capture({
  onSubmit,
  isPending,
  error,
}: {
  onSubmit: (c: CaptureFields) => void;
  isPending: boolean;
  error: string | null;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [company, setCompany] = useState("");
  const [country, setCountry] = useState<CaptureFields["country"]>("MY");
  const [localError, setLocalError] = useState<string | null>(null);

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setLocalError("Your name, please.");
    if (!EMAIL_RE.test(email.trim())) return setLocalError("That email looks off.");
    setLocalError(null);
    onSubmit({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      whatsapp: whatsapp.trim() || undefined,
      company: company.trim() || undefined,
      country,
    });
  };

  return (
    <form onSubmit={handle}>
      <StepHeading>Where should we send your AI audit?</StepHeading>
      <p className="text-black/70 mb-6">
        Your personalised audit lands in your inbox in the next few minutes.
      </p>
      <div className="space-y-4">
        <input
          aria-label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name *"
          className="w-full px-5 py-4 border-2 border-black/20 focus:border-[#E8524A] focus:outline-none rounded"
          required
          autoFocus
        />
        <input
          aria-label="Work email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Work email *"
          className="w-full px-5 py-4 border-2 border-black/20 focus:border-[#E8524A] focus:outline-none rounded"
          required
        />
        <input
          aria-label="WhatsApp (optional)"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          placeholder="WhatsApp (optional)"
          className="w-full px-5 py-4 border-2 border-black/20 focus:border-[#E8524A] focus:outline-none rounded"
        />
        <input
          aria-label="Company (optional)"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Company (optional)"
          className="w-full px-5 py-4 border-2 border-black/20 focus:border-[#E8524A] focus:outline-none rounded"
        />
        <select
          aria-label="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value as CaptureFields["country"])}
          className="w-full px-5 py-4 border-2 border-black/20 focus:border-[#E8524A] focus:outline-none rounded bg-white"
        >
          <option value="MY">Malaysia</option>
          <option value="SG">Singapore</option>
          <option value="OTHER">Other</option>
        </select>
      </div>
      {(localError || error) && (
        <p className="mt-4 text-[#E8524A] font-semibold">{localError ?? error}</p>
      )}
      <ContinueButton
        onClick={() => (document.activeElement as HTMLElement)?.blur()}
        disabled={isPending}
        label={isPending ? "SENDING…" : "GET MY AUDIT"}
      />
      <input type="submit" hidden />
    </form>
  );
}
```

- [ ] **Step 2: Manual smoke check**

Run: `npm run dev`. Complete the quiz end-to-end. Confirm:
- A row appears in the `leads` table.
- 5 rows appear in `scheduled_emails`.
- The app redirects to `/audit/result?segment=…&id=…&failed=…` (404 acceptable until Task 14).

- [ ] **Step 3: Commit**

```bash
git add src/app/audit/_components/steps/Step6Capture.tsx
git commit -m "feat(audit): capture step wired to submitQuiz"
```

---

## Task 13: Per-segment result copy

**Files:**
- Create: `src/app/audit/result/_copy/types.ts`
- Create: `src/app/audit/result/_copy/ops.ts`
- Create: `src/app/audit/result/_copy/team.ts`
- Create: `src/app/audit/result/_copy/sales.ts`
- Create: `src/app/audit/result/_copy/service.ts`
- Create: `src/app/audit/result/_copy/index.ts`

- [ ] **Step 1: `types.ts`**

```ts
import type { Q2Option, Segment } from "@/types/quiz";

export type ResultCopy = {
  segment: Segment;
  headline: string;            // the pain-mirror hero line
  subhead: string;             // one sentence naming symptoms
  mechanismBullets: string[];  // 3 bullets: why normal fixes fail — 1 each for hired/sops/saas
  failureMessages: Record<Q2Option, string>;  // "Why X didn't stick"
  mechanismParagraph: string;  // ~120 words on how AI agents solve this specifically
  proof: { number: string; summary: string }[]; // 2 case snippets, numbers-first
  planSteps: [string, string, string]; // audit call → roadmap → build
  faqs: { q: string; a: string }[];    // 4 objections
};
```

- [ ] **Step 2: `ops.ts`**

```ts
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
```

- [ ] **Step 3: `team.ts`**

```ts
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
```

- [ ] **Step 4: `sales.ts`**

```ts
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
```

- [ ] **Step 5: `service.ts`**

```ts
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
```

- [ ] **Step 6: `index.ts`**

```ts
import type { Segment } from "@/types/quiz";
import type { ResultCopy } from "./types";
import ops from "./ops";
import team from "./team";
import sales from "./sales";
import service from "./service";

export const COPY_BY_SEGMENT: Record<Segment, ResultCopy> = {
  ops,
  team,
  sales,
  service,
};
```

- [ ] **Step 7: Commit**

```bash
git add src/app/audit/result/_copy
git commit -m "feat(audit): per-segment presell copy (ops/team/sales/service)"
```

---

## Task 14: Result page

**Files:**
- Create: `src/app/audit/result/_components/PresellSections.tsx`
- Create: `src/app/audit/result/page.tsx`

- [ ] **Step 1: Write `PresellSections.tsx`**

```tsx
import type { Q2Option } from "@/types/quiz";
import type { ResultCopy } from "../_copy/types";

const CTA_LABEL = "Book Your Free AI Audit Call";
const CTA_SUB = "30 minutes. No sales pitch. You leave with 3 automations you can run next week.";

export function CTA() {
  const url = process.env.NEXT_PUBLIC_BOOKING_URL ?? "#";
  return (
    <div className="text-center my-16">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-white text-[#E8524A] px-12 py-5 text-sm font-bold uppercase tracking-widest hover:bg-white/90 transition-colors rounded shadow-lg"
      >
        {CTA_LABEL}
      </a>
      <p className="mt-4 text-white/70 text-sm max-w-md mx-auto">{CTA_SUB}</p>
    </div>
  );
}

export function PainHero({ copy }: { copy: ResultCopy }) {
  return (
    <section className="bg-[#E8524A] text-white py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-4 block">
          Your AI audit
        </span>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6 leading-none">
          {copy.headline}
        </h1>
        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
          {copy.subhead}
        </p>
        <CTA />
        <p className="text-white/60 text-sm">
          Or check your inbox — your personalised AI audit report is on its way.
        </p>
      </div>
    </section>
  );
}

export function WhyNormalFails({ copy, failed }: { copy: ResultCopy; failed: Q2Option[] }) {
  const highlighted = failed.length > 0
    ? failed.map((f) => ({ key: f, text: copy.failureMessages[f] }))
    : [{ key: "ignored" as Q2Option, text: copy.failureMessages.ignored }];

  return (
    <section className="bg-[#FBF8F4] py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-10">
          Here&apos;s what&apos;s actually happening.
        </h2>
        <ul className="space-y-4 mb-12">
          {copy.mechanismBullets.map((b, i) => (
            <li key={i} className="flex gap-3 text-lg">
              <span className="text-[#E8524A] font-black">—</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <div className="space-y-6 border-l-4 border-[#E8524A] pl-6">
          {highlighted.map((h) => (
            <p key={h.key} className="text-black/80 leading-relaxed">
              <strong>{h.text}</strong>
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Mechanism({ copy }: { copy: ResultCopy }) {
  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-8">
          The mechanism.
        </h2>
        <p className="text-lg leading-relaxed text-black/80 mb-10">
          {copy.mechanismParagraph}
        </p>
        <div className="grid grid-cols-3 gap-4 text-center border-y-2 border-black/10 py-8">
          <div><div className="text-xs uppercase tracking-widest text-black/60 mb-2">Inputs</div><div className="font-black">Your stack</div></div>
          <div><div className="text-xs uppercase tracking-widest text-black/60 mb-2">Agent</div><div className="font-black">→</div></div>
          <div><div className="text-xs uppercase tracking-widest text-black/60 mb-2">Outputs</div><div className="font-black">Work done</div></div>
        </div>
      </div>
    </section>
  );
}

export function Proof({ copy }: { copy: ResultCopy }) {
  return (
    <section className="bg-[#FBF8F4] py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-10">
          Proof.
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {copy.proof.map((p, i) => (
            <div key={i} className="bg-white p-8 rounded shadow-sm">
              <div className="text-3xl md:text-4xl font-black text-[#E8524A] mb-3">{p.number}</div>
              <p className="text-black/70">{p.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Plan({ copy }: { copy: ResultCopy }) {
  return (
    <section className="bg-[#E8524A] text-white py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-10">
          The plan.
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {copy.planSteps.map((s, i) => (
            <div key={i}>
              <div className="text-5xl font-black text-white/40 mb-3">0{i + 1}</div>
              <p className="text-lg leading-relaxed">{s}</p>
            </div>
          ))}
        </div>
        <CTA />
      </div>
    </section>
  );
}

export function Guarantee() {
  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-2xl mx-auto bg-[#FBF8F4] p-8 rounded text-center">
        <h3 className="font-bold mb-3 text-lg">🛡️ The Clarity Guarantee</h3>
        <p className="text-black/70 leading-relaxed">
          If our free AI audit doesn&apos;t reveal at least 3 actionable ways to
          save your business 10+ hours a week, we&apos;ll pay for your next
          consultation with any competitor. No questions asked.
        </p>
      </div>
    </section>
  );
}

export function FAQ({ copy }: { copy: ResultCopy }) {
  return (
    <section className="bg-[#FBF8F4] py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-10">
          Objections.
        </h2>
        <div className="space-y-4">
          {copy.faqs.map((f, i) => (
            <details key={i} className="bg-white p-6 rounded group">
              <summary className="font-bold cursor-pointer text-lg">{f.q}</summary>
              <p className="mt-3 text-black/70 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
        <div className="bg-[#E8524A] text-white mt-16 p-12 rounded text-center">
          <CTA />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Write `src/app/audit/result/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import type { Segment, Q2Option } from "@/types/quiz";
import { COPY_BY_SEGMENT } from "./_copy";
import {
  FAQ,
  Guarantee,
  Mechanism,
  PainHero,
  Plan,
  Proof,
  WhyNormalFails,
} from "./_components/PresellSections";

const VALID: Segment[] = ["ops", "team", "sales", "service"];

type SP = { segment?: string; id?: string; failed?: string };

function parseFailed(raw: string | undefined): Q2Option[] {
  if (!raw) return [];
  const allowed: Q2Option[] = ["hired", "sops", "saas", "chatgpt", "ignored", "other"];
  return raw.split(",").map((s) => s.trim()).filter((s): s is Q2Option => allowed.includes(s as Q2Option));
}

export default async function ResultPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const segment = sp.segment as Segment | undefined;
  if (!segment || !VALID.includes(segment)) return notFound();
  const copy = COPY_BY_SEGMENT[segment];
  const failed = parseFailed(sp.failed);

  return (
    <main className="min-h-screen">
      <PainHero copy={copy} />
      <WhyNormalFails copy={copy} failed={failed} />
      <Mechanism copy={copy} />
      <Proof copy={copy} />
      <Plan copy={copy} />
      <Guarantee />
      <FAQ copy={copy} />
    </main>
  );
}
```

- [ ] **Step 3: Manual smoke**

Visit `/audit/result?segment=ops&failed=sops,saas`. Visually verify each section, the segment-specific copy, and the highlighted failure messages.

- [ ] **Step 4: Commit**

```bash
git add src/app/audit/result
git commit -m "feat(audit): segment-keyed presell result page"
```

---

## Task 15: Email base layout + render utility

**Files:**
- Create: `src/lib/email/templates/_Layout.tsx`
- Create: `src/lib/email/render.tsx`

- [ ] **Step 1: Write `_Layout.tsx`**

```tsx
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";
import { signLeadToken } from "../unsubscribe";

type Props = {
  leadId: string;
  preview: string;
  children: ReactNode;
};

export default function EmailLayout({ leadId, preview, children }: Props) {
  const site = process.env.SITE_URL ?? "https://hustlr.com";
  const unsub = `${site}/audit/unsubscribe?lead=${leadId}&t=${signLeadToken(leadId)}`;
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ fontFamily: "system-ui, sans-serif", backgroundColor: "#FBF8F4", color: "#111", margin: 0 }}>
        <Container style={{ maxWidth: 560, margin: "0 auto", padding: "32px 24px" }}>
          <Section>
            <Text style={{ fontSize: 14, letterSpacing: 2, fontWeight: 700, color: "#E8524A", textTransform: "uppercase" }}>
              hustlr
            </Text>
          </Section>
          {children}
          <Hr style={{ borderColor: "#ddd", margin: "40px 0 16px" }} />
          <Text style={{ fontSize: 12, color: "#666", lineHeight: 1.5 }}>
            hustlr — Raffles Place, Singapore<br />
            You&apos;re receiving this because you took the AI audit quiz at hustlr.com.
            {" "}
            <Link href={unsub} style={{ color: "#666" }}>Unsubscribe</Link>.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
```

- [ ] **Step 2: Write `render.tsx`**

```tsx
import { render } from "@react-email/render";
import type { ReactElement } from "react";

export async function renderEmail(el: ReactElement): Promise<{ html: string; text: string }> {
  const [html, text] = await Promise.all([
    render(el, { pretty: false }),
    render(el, { plainText: true }),
  ]);
  return { html, text };
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/email/render.tsx src/lib/email/templates/_Layout.tsx
git commit -m "feat(email): react-email base layout + render helpers"
```

---

## Task 16: Ops segment email templates (5 files)

**Files:**
- Create: `src/lib/email/templates/ops_d0_result.tsx`
- Create: `src/lib/email/templates/ops_d1_mechanism.tsx`
- Create: `src/lib/email/templates/ops_d3_proof.tsx`
- Create: `src/lib/email/templates/ops_d5_objections.tsx`
- Create: `src/lib/email/templates/ops_d9_last_call.tsx`

Each template exports `default` a function component taking `{ lead: Lead }`, plus a named export `subject(lead: Lead): string`.

- [ ] **Step 1: `ops_d0_result.tsx`**

```tsx
import { Heading, Section, Text } from "@react-email/components";
import EmailLayout from "./_Layout";
import type { Lead } from "@/lib/supabase";

const bookingUrl = () => process.env.NEXT_PUBLIC_BOOKING_URL ?? "https://hustlr.com/audit";
const firstName = (l: Lead) => l.name.split(/\s+/)[0] || l.name;

export const subject = (l: Lead) => `${firstName(l)}, here's where AI wins you 20 hrs/week`;

export default function OpsD0Result({ lead }: { lead: Lead }) {
  return (
    <EmailLayout leadId={lead.id} preview="Your personalised AI audit — 3 specific automations.">
      <Heading style={{ fontSize: 28, fontWeight: 900, margin: "0 0 16px", letterSpacing: -0.5 }}>
        {firstName(lead)}, here&apos;s what I found.
      </Heading>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        Based on your quiz answers, your ops load is almost certainly bleeding you 15–25 hours a week. Here are the three automations I&apos;d start with for a business your size:
      </Text>
      <Section style={{ backgroundColor: "#fff", padding: 16, borderRadius: 4, margin: "16px 0" }}>
        <Text style={{ margin: 0, fontWeight: 700 }}>1. Invoice-matching agent</Text>
        <Text style={{ margin: "4px 0 12px", color: "#555" }}>Auto-match POs to invoices, flag discrepancies. Kills your month-end chase.</Text>
        <Text style={{ margin: 0, fontWeight: 700 }}>2. Data-entry agent</Text>
        <Text style={{ margin: "4px 0 12px", color: "#555" }}>Reads PDFs, forms, emails → populates your ERP / sheet / accounting tool.</Text>
        <Text style={{ margin: 0, fontWeight: 700 }}>3. Status-update agent</Text>
        <Text style={{ margin: "4px 0", color: "#555" }}>Pings your team / clients automatically when things move. Kills the &quot;any update?&quot; pings.</Text>
      </Section>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        Want me to walk you through how to actually build these? Grab 30 mins — I&apos;ll show you the exact setup and the rough ROI.
      </Text>
      <Text style={{ margin: "24px 0" }}>
        <a href={bookingUrl()} style={{ backgroundColor: "#E8524A", color: "#fff", padding: "14px 24px", fontWeight: 700, textDecoration: "none", borderRadius: 4, display: "inline-block" }}>
          Book the free audit call
        </a>
      </Text>
      <Text style={{ fontSize: 14, color: "#666", lineHeight: 1.6 }}>— Jeremy @ hustlr</Text>
    </EmailLayout>
  );
}
```

- [ ] **Step 2: `ops_d1_mechanism.tsx`**

```tsx
import { Heading, Text } from "@react-email/components";
import EmailLayout from "./_Layout";
import type { Lead } from "@/lib/supabase";

const bookingUrl = () => process.env.NEXT_PUBLIC_BOOKING_URL ?? "https://hustlr.com/audit";

export const subject = (_l: Lead) => `Why hiring more staff won't fix your admin drag`;

export default function OpsD1Mechanism({ lead }: { lead: Lead }) {
  return (
    <EmailLayout leadId={lead.id} preview="The reason hiring + SOPs haven't fixed this.">
      <Heading style={{ fontSize: 28, fontWeight: 900, margin: "0 0 16px", letterSpacing: -0.5 }}>
        Why hiring didn&apos;t fix it.
      </Heading>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        Most ops bottlenecks get the same three &quot;fixes&quot; — and all three leave the work still running through a human neck.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        <strong>Hiring</strong> moves the bottleneck to whoever you hired. Great hire? You&apos;re still one flu day from the backlog.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        <strong>SOPs</strong> describe the work. They don&apos;t do the work. And nobody reads them under pressure.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        <strong>SaaS</strong> solves the 60% of your process that matches their product. The 40% that doesn&apos;t is where all your time goes.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        Agents are different. They adapt to your process, execute the rule-based work end-to-end, and only tap a human for genuine judgment calls. That&apos;s the mechanism.
      </Text>
      <Text style={{ margin: "24px 0" }}>
        <a href={bookingUrl()} style={{ backgroundColor: "#E8524A", color: "#fff", padding: "14px 24px", fontWeight: 700, textDecoration: "none", borderRadius: 4, display: "inline-block" }}>
          See it on your stack — book the call
        </a>
      </Text>
    </EmailLayout>
  );
}
```

- [ ] **Step 3: `ops_d3_proof.tsx`**

```tsx
import { Heading, Text } from "@react-email/components";
import EmailLayout from "./_Layout";
import type { Lead } from "@/lib/supabase";

const bookingUrl = () => process.env.NEXT_PUBLIC_BOOKING_URL ?? "https://hustlr.com/audit";

export const subject = (_l: Lead) => `A Shah Alam SME saved RM38K/mo — here's what they did`;

export default function OpsD3Proof({ lead }: { lead: Lead }) {
  return (
    <EmailLayout leadId={lead.id} preview="Real numbers from a logistics SME that nuked manual reconciliation.">
      <Heading style={{ fontSize: 28, fontWeight: 900, margin: "0 0 16px" }}>
        RM38K/mo — one agent.
      </Heading>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        A logistics SME in Shah Alam was spending 3 full days a week on invoice-matching. Three people, rotating, every single week.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        We built one agent. It reads incoming invoices from email attachments, matches them against the POs in their ERP, flags the ~5% with discrepancies for a human, and auto-approves the rest.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        Result: 22 hours/week back across the team. Measured over 90 days, that&apos;s RM38K/month saved — not counting the fact that the team now actually takes lunch.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        You&apos;ve got at least one of these hiding in your ops stack. The audit call finds it.
      </Text>
      <Text style={{ margin: "24px 0" }}>
        <a href={bookingUrl()} style={{ backgroundColor: "#E8524A", color: "#fff", padding: "14px 24px", fontWeight: 700, textDecoration: "none", borderRadius: 4, display: "inline-block" }}>
          Find yours — book the call
        </a>
      </Text>
    </EmailLayout>
  );
}
```

- [ ] **Step 4: `ops_d5_objections.tsx`**

```tsx
import { Heading, Text } from "@react-email/components";
import EmailLayout from "./_Layout";
import type { Lead } from "@/lib/supabase";

const bookingUrl = () => process.env.NEXT_PUBLIC_BOOKING_URL ?? "https://hustlr.com/audit";

export const subject = (_l: Lead) => `"We're too small for AI" — read this`;

export default function OpsD5Objections({ lead }: { lead: Lead }) {
  return (
    <EmailLayout leadId={lead.id} preview="The three objections that hold small ops teams back — and why they're wrong.">
      <Heading style={{ fontSize: 28, fontWeight: 900, margin: "0 0 16px" }}>
        The three things people tell me before they book.
      </Heading>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        <strong>&quot;We&apos;re too small.&quot;</strong> Smaller teams benefit more. One agent carries half a seat&apos;s load. Our smallest client is 2 people.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        <strong>&quot;AI will get it wrong.&quot;</strong> Agents run with guardrails. The ambiguous 5% goes to a human. The rule-based 95% gets done correctly, 24/7.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        <strong>&quot;We can&apos;t afford it.&quot;</strong> Most ops agents pay back in month one. The audit itself is free — you find out before you commit.
      </Text>
      <Text style={{ margin: "24px 0" }}>
        <a href={bookingUrl()} style={{ backgroundColor: "#E8524A", color: "#fff", padding: "14px 24px", fontWeight: 700, textDecoration: "none", borderRadius: 4, display: "inline-block" }}>
          Book the free audit
        </a>
      </Text>
    </EmailLayout>
  );
}
```

- [ ] **Step 5: `ops_d9_last_call.tsx`**

```tsx
import { Heading, Text } from "@react-email/components";
import EmailLayout from "./_Layout";
import type { Lead } from "@/lib/supabase";

const bookingUrl = () => process.env.NEXT_PUBLIC_BOOKING_URL ?? "https://hustlr.com/audit";

export const subject = (_l: Lead) => `Last one from me — then I'll stop emailing`;

export default function OpsD9LastCall({ lead }: { lead: Lead }) {
  return (
    <EmailLayout leadId={lead.id} preview="Final nudge before I close the loop.">
      <Heading style={{ fontSize: 28, fontWeight: 900, margin: "0 0 16px" }}>
        Last one from me.
      </Heading>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        This is the last email in this sequence. If the audit call isn&apos;t a fit, no worries — I&apos;ll stop emailing after this.
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 1.6 }}>
        We only onboard 3 SMEs a month because we build every agent live alongside the client. If your ops load is getting worse not better, this is the door.
      </Text>
      <Text style={{ margin: "24px 0" }}>
        <a href={bookingUrl()} style={{ backgroundColor: "#E8524A", color: "#fff", padding: "14px 24px", fontWeight: 700, textDecoration: "none", borderRadius: 4, display: "inline-block" }}>
          Book the final audit slot
        </a>
      </Text>
      <Text style={{ fontSize: 14, color: "#666" }}>— Jeremy</Text>
    </EmailLayout>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/email/templates/ops_*.tsx
git commit -m "feat(email): ops segment drip templates (5 slots)"
```

---

## Task 17: Team, Sales, Service email templates

Each file follows the exact same shape as the ops templates above — same imports, same wrapper (`EmailLayout`), same styled elements, same button block. Only the subject function and body copy change. Follow the beats from the spec (D0 result, D1 mechanism, D3 proof, D5 objections, D9 last call) and the segment voice established in the corresponding `result/_copy/<segment>.ts`.

**Files (15 total):**
- `src/lib/email/templates/team_d0_result.tsx`
- `src/lib/email/templates/team_d1_mechanism.tsx`
- `src/lib/email/templates/team_d3_proof.tsx`
- `src/lib/email/templates/team_d5_objections.tsx`
- `src/lib/email/templates/team_d9_last_call.tsx`
- `src/lib/email/templates/sales_d0_result.tsx`
- `src/lib/email/templates/sales_d1_mechanism.tsx`
- `src/lib/email/templates/sales_d3_proof.tsx`
- `src/lib/email/templates/sales_d5_objections.tsx`
- `src/lib/email/templates/sales_d9_last_call.tsx`
- `src/lib/email/templates/service_d0_result.tsx`
- `src/lib/email/templates/service_d1_mechanism.tsx`
- `src/lib/email/templates/service_d3_proof.tsx`
- `src/lib/email/templates/service_d5_objections.tsx`
- `src/lib/email/templates/service_d9_last_call.tsx`

- [ ] **Step 1: Write the 15 templates, one per file**

For each, use this scaffold verbatim and fill in the two text blocks:

```tsx
import { Heading, Text } from "@react-email/components";
import EmailLayout from "./_Layout";
import type { Lead } from "@/lib/supabase";

const bookingUrl = () => process.env.NEXT_PUBLIC_BOOKING_URL ?? "https://hustlr.com/audit";
const firstName = (l: Lead) => l.name.split(/\s+/)[0] || l.name;

export const subject = (l: Lead) => /* SUBJECT (use formula from spec) */ "…";

export default function Template({ lead }: { lead: Lead }) {
  return (
    <EmailLayout leadId={lead.id} preview={/* one-line preview */ "…"}>
      <Heading style={{ fontSize: 28, fontWeight: 900, margin: "0 0 16px", letterSpacing: -0.5 }}>
        {/* headline */}
      </Heading>
      {/* body: 3–5 <Text> paragraphs; reuse styles from ops_d0_result.tsx */}
      <Text style={{ margin: "24px 0" }}>
        <a href={bookingUrl()} style={{ backgroundColor: "#E8524A", color: "#fff", padding: "14px 24px", fontWeight: 700, textDecoration: "none", borderRadius: 4, display: "inline-block" }}>
          {/* CTA label */}
        </a>
      </Text>
    </EmailLayout>
  );
}
```

**Copy direction per slot** (apply per segment — pull pain language, failed-solution framing, and the case-study numbers from the corresponding `result/_copy/<segment>.ts`):

- **D0 result:** Greet by first name. Name the top pain (from `headline` + `subhead`). List three specific agents you'd build for this segment (pull the exact agent names from the segment's copy). End with the booking CTA.
- **D1 mechanism:** Headline is "Why [hire/SOP/SaaS] didn't fix it." Walk through the three failures (mirror `mechanismBullets`). Close with one sentence on the agent mechanism (compress `mechanismParagraph`). CTA.
- **D3 proof:** Lead with the case-study number (from `proof[0]`). Tell the story in 2–3 short paragraphs. CTA.
- **D5 objections:** Three bolded objections with one-paragraph rebuttals each. Pull directly from `faqs` (first 3).
- **D9 last call:** Short. "Last email. We only onboard 3 SMEs/month. Door's here if you want it." CTA.

- [ ] **Step 2: Commit**

```bash
git add src/lib/email/templates/team_*.tsx src/lib/email/templates/sales_*.tsx src/lib/email/templates/service_*.tsx
git commit -m "feat(email): team/sales/service segment drip templates"
```

---

## Task 18: Template registry

**Files:**
- Create: `src/lib/email/templates/index.ts`

- [ ] **Step 1: Write the registry**

```ts
import type { Lead } from "@/lib/supabase";
import type { TemplateKey } from "@/types/quiz";
import type { ReactElement } from "react";

import OpsD0, { subject as opsD0Subject } from "./ops_d0_result";
import OpsD1, { subject as opsD1Subject } from "./ops_d1_mechanism";
import OpsD3, { subject as opsD3Subject } from "./ops_d3_proof";
import OpsD5, { subject as opsD5Subject } from "./ops_d5_objections";
import OpsD9, { subject as opsD9Subject } from "./ops_d9_last_call";

import TeamD0, { subject as teamD0Subject } from "./team_d0_result";
import TeamD1, { subject as teamD1Subject } from "./team_d1_mechanism";
import TeamD3, { subject as teamD3Subject } from "./team_d3_proof";
import TeamD5, { subject as teamD5Subject } from "./team_d5_objections";
import TeamD9, { subject as teamD9Subject } from "./team_d9_last_call";

import SalesD0, { subject as salesD0Subject } from "./sales_d0_result";
import SalesD1, { subject as salesD1Subject } from "./sales_d1_mechanism";
import SalesD3, { subject as salesD3Subject } from "./sales_d3_proof";
import SalesD5, { subject as salesD5Subject } from "./sales_d5_objections";
import SalesD9, { subject as salesD9Subject } from "./sales_d9_last_call";

import ServiceD0, { subject as serviceD0Subject } from "./service_d0_result";
import ServiceD1, { subject as serviceD1Subject } from "./service_d1_mechanism";
import ServiceD3, { subject as serviceD3Subject } from "./service_d3_proof";
import ServiceD5, { subject as serviceD5Subject } from "./service_d5_objections";
import ServiceD9, { subject as serviceD9Subject } from "./service_d9_last_call";

type Entry = {
  component: (props: { lead: Lead }) => ReactElement;
  subject: (lead: Lead) => string;
};

export const TEMPLATES: Record<TemplateKey, Entry> = {
  ops_d0_result: { component: OpsD0, subject: opsD0Subject },
  ops_d1_mechanism: { component: OpsD1, subject: opsD1Subject },
  ops_d3_proof: { component: OpsD3, subject: opsD3Subject },
  ops_d5_objections: { component: OpsD5, subject: opsD5Subject },
  ops_d9_last_call: { component: OpsD9, subject: opsD9Subject },

  team_d0_result: { component: TeamD0, subject: teamD0Subject },
  team_d1_mechanism: { component: TeamD1, subject: teamD1Subject },
  team_d3_proof: { component: TeamD3, subject: teamD3Subject },
  team_d5_objections: { component: TeamD5, subject: teamD5Subject },
  team_d9_last_call: { component: TeamD9, subject: teamD9Subject },

  sales_d0_result: { component: SalesD0, subject: salesD0Subject },
  sales_d1_mechanism: { component: SalesD1, subject: salesD1Subject },
  sales_d3_proof: { component: SalesD3, subject: salesD3Subject },
  sales_d5_objections: { component: SalesD5, subject: salesD5Subject },
  sales_d9_last_call: { component: SalesD9, subject: salesD9Subject },

  service_d0_result: { component: ServiceD0, subject: serviceD0Subject },
  service_d1_mechanism: { component: ServiceD1, subject: serviceD1Subject },
  service_d3_proof: { component: ServiceD3, subject: serviceD3Subject },
  service_d5_objections: { component: ServiceD5, subject: serviceD5Subject },
  service_d9_last_call: { component: ServiceD9, subject: serviceD9Subject },
};

export function getTemplate(key: string): Entry | null {
  return (TEMPLATES as Record<string, Entry>)[key] ?? null;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/email/templates/index.ts
git commit -m "feat(email): template registry keyed by template_key"
```

---

## Task 19: One-email send helper

**Files:**
- Create: `src/lib/drip/send.ts`

- [ ] **Step 1: Write `send.ts`**

```ts
import { Resend } from "resend";
import { supabase, type Lead, type ScheduledEmail } from "@/lib/supabase";
import { getTemplate } from "@/lib/email/templates";
import { renderEmail } from "@/lib/email/render";

function resend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is required");
  return new Resend(key);
}

function fromAddress(): string {
  const f = process.env.RESEND_FROM_EMAIL;
  if (!f) throw new Error("RESEND_FROM_EMAIL is required");
  return f;
}

export type SendOutcome = "sent" | "failed" | "skipped";

export async function sendScheduledEmail(row: ScheduledEmail): Promise<SendOutcome> {
  const { data: leadRow, error: leadErr } = await supabase
    .from("leads")
    .select("*")
    .eq("id", row.lead_id)
    .single();

  if (leadErr || !leadRow) {
    await supabase.from("scheduled_emails").update({ status: "failed", error: leadErr?.message ?? "lead not found" }).eq("id", row.id);
    return "failed";
  }

  const lead = leadRow as Lead;

  if (lead.unsubscribed_at) {
    await supabase.from("scheduled_emails").update({ status: "skipped" }).eq("id", row.id);
    return "skipped";
  }

  const tpl = getTemplate(row.template_key);
  if (!tpl) {
    await supabase.from("scheduled_emails").update({ status: "failed", error: `unknown template_key ${row.template_key}` }).eq("id", row.id);
    return "failed";
  }

  try {
    const el = tpl.component({ lead });
    const { html, text } = await renderEmail(el);
    const subject = tpl.subject(lead);

    const sendRes = await resend().emails.send({
      from: fromAddress(),
      to: lead.email,
      replyTo: "hello@hustlr.com",
      subject,
      html,
      text,
      headers: { "X-Entity-Ref-ID": row.id },
    });

    if (sendRes.error) throw new Error(sendRes.error.message);

    await supabase
      .from("scheduled_emails")
      .update({ status: "sent", sent_at: new Date().toISOString() })
      .eq("id", row.id);
    return "sent";
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    const finalStatus = row.attempts >= 3 ? "failed" : "pending";
    await supabase
      .from("scheduled_emails")
      .update({ status: finalStatus, error: message })
      .eq("id", row.id);
    return finalStatus === "failed" ? "failed" : "failed";
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/drip/send.ts
git commit -m "feat(drip): sendScheduledEmail renders + ships + updates row"
```

---

## Task 20: Cron `send-drip` endpoint (TDD)

**Files:**
- Create: `src/app/api/cron/send-drip/route.ts`
- Create: `src/app/api/cron/send-drip/route.test.ts`

- [ ] **Step 1: Write failing test**

`src/app/api/cron/send-drip/route.test.ts`:

```ts
import { describe, it, expect, beforeAll } from "vitest";
import { POST } from "./route";

beforeAll(() => {
  process.env.CRON_SECRET = "test-secret";
});

function req(auth?: string) {
  const headers = new Headers();
  if (auth) headers.set("authorization", auth);
  return new Request("http://localhost/api/cron/send-drip", {
    method: "POST",
    headers,
  });
}

describe("POST /api/cron/send-drip", () => {
  it("rejects without auth", async () => {
    const res = await POST(req());
    expect(res.status).toBe(401);
  });

  it("rejects wrong secret", async () => {
    const res = await POST(req("Bearer nope"));
    expect(res.status).toBe(401);
  });

  it("accepts correct secret and returns a summary", async () => {
    const res = await POST(req("Bearer test-secret"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("processed");
    expect(body).toHaveProperty("sent");
    expect(body).toHaveProperty("failed");
    expect(body).toHaveProperty("skipped");
    expect(body).toHaveProperty("duration_ms");
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test -- send-drip`
Expected: FAIL, module not found.

- [ ] **Step 3: Implement `route.ts`**

```ts
import { NextResponse } from "next/server";
import { supabase, type ScheduledEmail } from "@/lib/supabase";
import { sendScheduledEmail } from "@/lib/drip/send";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

export async function POST(req: Request) {
  const auth = req.headers.get("authorization") ?? "";
  const expected = `Bearer ${process.env.CRON_SECRET ?? ""}`;
  if (!process.env.CRON_SECRET || auth !== expected) return unauthorized();

  const started = Date.now();
  let processed = 0;
  let sent = 0;
  let failed = 0;
  let skipped = 0;

  const { data: candidates } = await supabase
    .from("scheduled_emails")
    .select("id")
    .eq("status", "pending")
    .lte("send_at", new Date().toISOString())
    .lt("attempts", 3)
    .order("send_at", { ascending: true })
    .limit(50);

  for (const c of candidates ?? []) {
    const { data: claimed } = await supabase
      .from("scheduled_emails")
      .update({ status: "in_flight" })
      .eq("id", c.id)
      .eq("status", "pending")
      .select("*")
      .maybeSingle();

    if (!claimed) continue;

    const row = claimed as ScheduledEmail;
    const nextAttempts = row.attempts + 1;
    await supabase
      .from("scheduled_emails")
      .update({ attempts: nextAttempts })
      .eq("id", row.id);

    processed++;
    const outcome = await sendScheduledEmail({ ...row, attempts: nextAttempts });
    if (outcome === "sent") sent++;
    else if (outcome === "skipped") skipped++;
    else failed++;
  }

  const body = { processed, sent, failed, skipped, duration_ms: Date.now() - started };
  console.log(JSON.stringify({ job: "send-drip", ...body }));
  return NextResponse.json(body);
}
```

- [ ] **Step 4: Run tests**

Run: `npm test -- send-drip`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/app/api/cron/send-drip/route.ts src/app/api/cron/send-drip/route.test.ts
git commit -m "feat(api): Koyeb-triggered send-drip cron endpoint"
```

---

## Task 21: Resend webhook endpoint

**Files:**
- Create: `src/app/api/webhooks/resend/route.ts`

- [ ] **Step 1: Write `route.ts`**

```ts
import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function verifySignature(raw: string, signature: string | null): boolean {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const expected = createHmac("sha256", secret).update(raw).digest("hex");
  try {
    const a = Buffer.from(expected, "hex");
    const b = Buffer.from(signature, "hex");
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

type ResendEvent = {
  type: string;
  created_at?: string;
  data?: {
    email_id?: string;
    to?: string | string[];
    headers?: Record<string, string>;
  };
};

export async function POST(req: Request) {
  const raw = await req.text();
  const sig = req.headers.get("svix-signature") ?? req.headers.get("resend-signature");
  if (!verifySignature(raw, sig)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  const evt = JSON.parse(raw) as ResendEvent;
  const refId = evt.data?.headers?.["X-Entity-Ref-ID"] ?? evt.data?.headers?.["x-entity-ref-id"];
  const eventType = evt.type.replace(/^email\./, "");

  if (!refId) return NextResponse.json({ ok: true });

  const { data: row } = await supabase
    .from("scheduled_emails")
    .select("lead_id,template_key")
    .eq("id", refId)
    .maybeSingle();

  if (!row) return NextResponse.json({ ok: true });

  await supabase.from("email_events").insert({
    lead_id: row.lead_id,
    template_key: row.template_key,
    event_type: eventType,
    payload: evt,
  });

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/webhooks/resend/route.ts
git commit -m "feat(api): resend webhook writes email_events"
```

---

## Task 22: Unsubscribe page

**Files:**
- Create: `src/app/audit/unsubscribe/page.tsx`

- [ ] **Step 1: Write `page.tsx`**

```tsx
import { supabase } from "@/lib/supabase";
import { verifyLeadToken } from "@/lib/email/unsubscribe";

type SP = { lead?: string; t?: string };

export default async function UnsubscribePage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const leadId = sp.lead ?? "";
  const token = sp.t ?? "";
  const valid = !!leadId && !!token && verifyLeadToken(leadId, token);

  let result: "unsubscribed" | "already" | "invalid" = "invalid";
  if (valid) {
    const { data } = await supabase.from("leads").select("unsubscribed_at").eq("id", leadId).maybeSingle();
    if (data?.unsubscribed_at) {
      result = "already";
    } else if (data) {
      await supabase.from("leads").update({ unsubscribed_at: new Date().toISOString() }).eq("id", leadId);
      await supabase.from("scheduled_emails").update({ status: "skipped" }).eq("lead_id", leadId).eq("status", "pending");
      result = "unsubscribed";
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FBF8F4] px-6">
      <div className="max-w-md text-center">
        {result === "unsubscribed" && (
          <>
            <h1 className="text-3xl font-black mb-4">You&apos;re out.</h1>
            <p className="text-black/70">We&apos;ve stopped the emails. Sorry it wasn&apos;t a fit.</p>
          </>
        )}
        {result === "already" && (
          <>
            <h1 className="text-3xl font-black mb-4">Already unsubscribed.</h1>
            <p className="text-black/70">You&apos;re not on the list. Nothing to do.</p>
          </>
        )}
        {result === "invalid" && (
          <>
            <h1 className="text-3xl font-black mb-4">Link expired.</h1>
            <p className="text-black/70">
              That unsubscribe link isn&apos;t valid. Reply to any of our emails and
              we&apos;ll remove you manually.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/audit/unsubscribe/page.tsx
git commit -m "feat(audit): unsubscribe page with hmac-verified lead token"
```

---

## Task 23: Home-page CTA swaps

**Files:**
- Modify: `src/app/components/Hero.tsx`
- Modify: `src/app/components/Navigation.tsx`

- [ ] **Step 1: Update `Hero.tsx`**

In `src/app/components/Hero.tsx`, find:

```tsx
<a
  href="#contact"
  className="w-full sm:w-auto border-2 border-white text-white px-10 py-5 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-[#E8524A] transition-all"
>
  Get a Free AI Audit
</a>
```

Replace with:

```tsx
<a
  href="/audit"
  className="w-full sm:w-auto border-2 border-white text-white px-10 py-5 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-[#E8524A] transition-all"
>
  Get a Free AI Audit
</a>
```

- [ ] **Step 2: Update `Navigation.tsx`**

Open `src/app/components/Navigation.tsx`. Find every anchor whose label is "Get a Free AI Audit" (case-insensitive — may appear in both desktop and mobile menus) and change its `href` from `#contact` (or whatever it currently points to) to `/audit`. Leave all other links untouched.

- [ ] **Step 3: Manual check**

Run: `npm run dev`, load `/`, click each "Get A Free AI Audit" link. Confirm every one routes to `/audit`.

- [ ] **Step 4: Commit**

```bash
git add src/app/components/Hero.tsx src/app/components/Navigation.tsx
git commit -m "feat(home): point AI Audit CTAs to /audit"
```

---

## Task 24: Koyeb cron configuration (manual) + production smoke test

This task is a runbook, not code.

- [ ] **Step 1: Configure Koyeb Scheduled Job**

In the Koyeb dashboard for this app, create a new Scheduled Job:
- **Name:** `send-drip`
- **Schedule:** `*/5 * * * *` (every 5 minutes)
- **Command:** `curl -fsSL -X POST -H "Authorization: Bearer ${CRON_SECRET}" ${SITE_URL}/api/cron/send-drip`
- **Env vars on the job:** `CRON_SECRET`, `SITE_URL` (same values as the web service).

- [ ] **Step 2: Verify Resend env vars exist on the web service**

Set the following on the Koyeb web service:
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL`
- `RESEND_WEBHOOK_SECRET`
- `CRON_SECRET`
- `SITE_URL` (canonical https URL, no trailing slash)
- `NEXT_PUBLIC_BOOKING_URL` (Cal.com or Calendly URL)

- [ ] **Step 3: Verify Resend domain + webhook**

- Verify sending domain in Resend (DNS step — done separately by the operator).
- In Resend dashboard, add a webhook → URL `${SITE_URL}/api/webhooks/resend`, set the signing secret to match `RESEND_WEBHOOK_SECRET`, enable `email.delivered`, `email.opened`, `email.clicked`, `email.bounced`, `email.complained`.

- [ ] **Step 4: End-to-end smoke on staging**

1. Visit `${SITE_URL}/audit`.
2. Complete the quiz with a real inbox you control.
3. Confirm redirect to `/audit/result?segment=…`.
4. In Supabase, confirm a new `leads` row and 5 `scheduled_emails` rows for that lead.
5. Wait up to 5 minutes; confirm the D0 email arrives in the inbox.
6. Click the unsubscribe link; confirm the page shows "You're out."
7. In Supabase, confirm `leads.unsubscribed_at` is set and the 4 remaining `scheduled_emails` rows are `skipped`.
8. In `email_events`, confirm at least one `delivered` event for the D0 send.

- [ ] **Step 5: No commit** — this task is runbook-only. If any step fails, fix the underlying code and open a new task.

---

## Summary of commits produced

1. `chore: add quiz funnel deps and vitest setup`
2. `feat(db): quiz funnel schema`
3. `feat(lib): shared quiz types and supabase server client`
4. `feat(audit): zod schema for quiz input`
5. `feat(drip): derive segment, urgency, team tier`
6. `feat(drip): compute 5-email schedule rows`
7. `feat(email): hmac-signed unsubscribe tokens`
8. `feat(audit): submitQuiz server action`
9. `feat(audit): quiz page shell + progress bar`
10. `feat(audit): QuizFlow client state machine`
11. `feat(audit): Q1–Q5 step components`
12. `feat(audit): capture step wired to submitQuiz`
13. `feat(audit): per-segment presell copy`
14. `feat(audit): segment-keyed presell result page`
15. `feat(email): react-email base layout + render helpers`
16. `feat(email): ops segment drip templates`
17. `feat(email): team/sales/service segment drip templates`
18. `feat(email): template registry`
19. `feat(drip): sendScheduledEmail`
20. `feat(api): send-drip cron endpoint`
21. `feat(api): resend webhook`
22. `feat(audit): unsubscribe page`
23. `feat(home): point AI Audit CTAs to /audit`
