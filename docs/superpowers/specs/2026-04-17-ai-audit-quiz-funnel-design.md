# AI Audit Quiz Funnel — Design

**Date:** 2026-04-17
**Status:** Design approved, ready for implementation plan
**Target site:** hustlr.com (hustlr-web repo)

## Goal

Replace the "Get A Free AI Audit" CTA path (currently anchored to a generic contact form) with a Hormozi-style quiz funnel. The quiz diagnoses the prospect's pain in their own words, segments them into one of four buckets, delivers a presell-style result page with a single primary offer (book a free audit call), and enrols them in a 5-email segment-specific drip sequence.

Framework: one hook question, segmentation questions (behavior + pain + failed solutions + stakes), result page that feels like "this is literally me," followed by a single SKU path. No branching to multiple products.

## Scope

**In scope (v1)**
- A 6-step quiz at `/audit` with localStorage recovery and capture-at-end.
- A server action that validates, writes a lead to Supabase, and seeds 5 scheduled emails.
- A segment-keyed presell page at `/audit/result` with one primary CTA (book audit call).
- A Koyeb-scheduled cron endpoint that polls Supabase every 5 minutes and sends due emails via Resend.
- 4 segments × 5 email templates = 20 drip emails (rendered via React Email).
- Unsubscribe flow and Resend webhook for open/click events.
- Replacing all existing "Get A Free AI Audit" CTAs on the home page to link to `/audit`.

**Out of scope (v1, explicit YAGNI)**
- Branched multi-SKU paths (framework says one result path = one SKU).
- A/B test framework on quiz copy.
- Multi-language (MY/SG audience is English-first).
- Admin dashboard for leads — read Supabase directly for v1.
- Partial-abandon retargeting (capture-at-end is deliberate).
- Custom-built calendar UI — use hosted Cal.com / Calendly via env-configured URL.
- WhatsApp/SMS drip — the WhatsApp field is captured and stored but not sent to in v1.
- Sentry / APM integration — Koyeb logs are sufficient for v1.

## Architecture at a glance

```
                    ┌──────────────────────────┐
  /audit (client) ──▶ QuizFlow (6 steps)       │
                    │ localStorage recovery    │
                    └────────────┬─────────────┘
                                 │ submitQuiz (server action)
                                 ▼
                    ┌──────────────────────────┐
                    │ Validate (zod)           │
                    │ Derive segment + urgency │
                    │ Insert lead              │
                    │ Seed 5 scheduled_emails  │
                    └────────────┬─────────────┘
                                 │ redirect
                                 ▼
                    /audit/result?segment=…&id=…
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │ Presell page + single CTA│
                    └──────────────────────────┘

       Koyeb Scheduled Job (every 5 min)
                ▼
       POST /api/cron/send-drip (Bearer CRON_SECRET)
                ▼
       Select pending scheduled_emails where send_at <= now()
                ▼
       Render template → Resend API → mark row sent
```

## File layout

```
src/app/audit/page.tsx                         # quiz shell (server)
src/app/audit/_components/QuizFlow.tsx         # client state machine
src/app/audit/_components/ProgressBar.tsx      # top-pinned progress bar
src/app/audit/_components/steps/Step1Hook.tsx
src/app/audit/_components/steps/Step2Failed.tsx
src/app/audit/_components/steps/Step3When.tsx
src/app/audit/_components/steps/Step4Stakes.tsx
src/app/audit/_components/steps/Step5Team.tsx
src/app/audit/_components/steps/Step6Capture.tsx
src/app/audit/actions.ts                       # submitQuiz server action
src/app/audit/schema.ts                        # zod schemas (shared)
src/app/audit/result/page.tsx                  # segment-keyed presell
src/app/audit/result/_copy/ops.ts
src/app/audit/result/_copy/team.ts
src/app/audit/result/_copy/sales.ts
src/app/audit/result/_copy/service.ts
src/app/audit/unsubscribe/page.tsx             # verifies HMAC, flips unsubscribed_at

src/app/api/cron/send-drip/route.ts            # Koyeb cron handler
src/app/api/webhooks/resend/route.ts           # Resend open/click events

src/lib/supabase.ts                            # typed server-side client
src/lib/drip/schedule.ts                       # seeds scheduled_emails on submit
src/lib/drip/send.ts                           # renders + sends one email
src/lib/drip/segment.ts                        # deriveSegment, deriveUrgency
src/lib/email/render.tsx                       # React Email → HTML/text
src/lib/email/templates/index.ts               # key → component map
src/lib/email/templates/<segment>_d0_result.tsx
src/lib/email/templates/<segment>_d1_mechanism.tsx
src/lib/email/templates/<segment>_d3_proof.tsx
src/lib/email/templates/<segment>_d5_objections.tsx
src/lib/email/templates/<segment>_d9_last_call.tsx
src/lib/email/unsubscribe.ts                   # HMAC sign/verify
```

**CTA replacements:** Every `href="#contact"` labelled "Get A Free AI Audit" in `Hero.tsx`, `Navigation.tsx`, and `Contact.tsx` becomes `href="/audit"`. The existing `Contact.tsx` form stays on the home page as a secondary fallback.

## Quiz flow (client)

**Component:** `QuizFlow` is a client component with `{ step: 1..6, answers: QuizAnswers }`. Answers are mirrored to `localStorage` under `hustlr.audit.v1` on every change; on mount, restore if present. A version key lets us invalidate old schemas. Capture-step data (PII) is never persisted to localStorage.

**Navigation:** Enter / "Continue" advances; per-step back button. No forward-skipping. Step 6 validates the email client-side (RFC-ish regex), submits via server action, then `router.push(resultUrl)` on success. Submit is disabled during pending with a spinner.

**Progress bar:** 3px top-pinned bar, brand red (`#E8524A`) fill, light neutral base, 350ms ease-out width animation. Label row above: `STEP N OF 6` (uppercase tracking-widest, 10px) on the left, `← BACK` link on the right (hidden on step 1). On step 6 the bar is 100% and label reads `ALMOST DONE · YOUR RESULT`. Mobile tightens the label to `3/6` + chevron.

**Visual tone:** Matches existing brand — `#E8524A` red, black on cream, bold uppercase headings, full-height one-decision-per-screen panels. Horizontal slide on advance (CSS transform, no library).

**Accessibility:** Each step is a `<form>` that submits on Enter. Focus moves to the first interactive control on step change. `aria-live` region announces step transitions. Radio groups use `fieldset`/`legend`.

## The 6 questions

**Q1 — Hook / segment (single-select, routes segment):**
*"Where is time leaking out of your business right now?"*
- Manual admin, data entry, invoicing, spreadsheets → `ops`
- Onboarding, internal handoffs, training, SOPs → `team`
- Slow lead follow-up, leads going cold, no nurture → `sales`
- Customer support, same questions answered 100 times → `service`

**Q2 — Failed solutions (multi-select, 0+ allowed):**
*"What have you already tried that didn't stick?"*
- Hired someone to handle it
- Built SOPs / documented the process
- Bought a SaaS for it
- Used ChatGPT manually
- Ignored it and hoped it'd fix itself
- Something else *(checkbox only in v1; no free-text input)*

**Q3 — When it's worst (single-select):**
*"When does this hit you the hardest?"*
- Every day
- Weekly crunch
- Month-end / reporting periods
- Always-on — it never stops

**Q4 — Stakes (single-select):**
*"What are you afraid happens if this keeps bleeding you for another 12 months?"*
- We lose clients to faster competitors
- My team burns out and leaves
- We can't grow past our current ceiling
- We fall behind on tech everyone else is adopting

**Q5 — Team size (single-select):**
- Solo
- 2–5
- 6–20
- 20+

**Q6 — Capture:**
- Name (required)
- Work email (required, validated)
- WhatsApp (optional)
- Company (optional)
- Country — MY / SG / Other (required)

## Data model (Supabase)

```sql
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
  answers jsonb not null,          -- full raw payload (for analysis / ad angles)
  unsubscribed_at timestamptz,     -- set when user unsubs; drip skips these
  utm jsonb                         -- captured if present on referrer
);
create index leads_email_idx on leads (email);

create table scheduled_emails (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id) on delete cascade,
  template_key text not null,       -- e.g. 'ops_d1_mechanism'
  send_at timestamptz not null,
  sent_at timestamptz,
  status text not null default 'pending' check (status in ('pending','in_flight','sent','failed','skipped')),
  error text,
  attempts int not null default 0
);
create index scheduled_emails_due_idx on scheduled_emails (status, send_at);

create table email_events (
  id bigserial primary key,
  lead_id uuid references leads(id) on delete cascade,
  template_key text not null,
  event_type text not null,        -- 'delivered' | 'opened' | 'clicked' | 'bounced' | 'complained'
  at timestamptz not null default now(),
  payload jsonb
);
create index email_events_lead_idx on email_events (lead_id);
```

## Segment & urgency derivation

- `segment` — direct map from Q1 (single-select).
- `urgency` — combines Q3 and Q4:
  - `high` if Q3 ∈ {every day, always-on} AND Q4 ∈ {lose clients, burn out}
  - `low` if Q3 ∈ {month-end} AND Q4 ∈ {fall behind}
  - `med` otherwise
- `team_tier` — direct map from Q5.

Copy variables read by templates: `segment_pain` (pre-baked phrase per segment), `failed_solutions_text` (stitched from Q2 picks), `urgency`, `team_tier`.

## Submission (server action)

`submitQuiz(input)` in `src/app/audit/actions.ts`:
1. Validate with Zod (exact enum values, email format, length caps).
2. Derive `segment`, `urgency`, `team_tier` via `src/lib/drip/segment.ts`.
3. Upsert `leads` row by `email`:
   - If no existing row → insert new.
   - If a row exists and `unsubscribed_at is null` → update its segment/urgency/team_tier/answers in place; cancel (`status='skipped'`) any still-pending scheduled_emails before reseeding. Prevents accidental double-subscribe.
   - If a row exists and `unsubscribed_at is not null` → update the answers snapshot but do **not** reseed the drip. The user can still see their result page; honouring the prior unsubscribe takes precedence.
4. Seed 5 `scheduled_emails` rows (only when the lead is not unsubscribed) with offsets: D0 = now, D1 = +24h, D3 = +72h, D5 = +120h, D9 = +216h.
5. Return `{ leadId, segment }`. Client redirects to `/audit/result?segment=<slug>&id=<leadId>&failed=<csv-of-q2-picks>`.

On failure: surface a generic error, leave client state intact so the user can retry. All PII stays server-side; the client never sees `leadId` until the redirect URL.

## Result page (presell)

**Route:** `/audit/result` — server component, reads `?segment`, `?id`, `?failed` query params. Loads per-segment copy from `result/_copy/<segment>.ts`. No DB read for render (lead exists, but the page is stateless for cacheability and speed).

**Section beats (Hormozi structure, softened for MY/SG service-business tone):**

1. **Pain mirror headline** — full-bleed brand red, segment-specific. *Example (ops):* "YOU'RE NOT BEHIND ON ADMIN — YOU'RE DROWNING IN IT." Subhead names the symptoms back in one sentence. Typographic system matches Hero.
2. **"Here's what's actually happening"** — 3 bullets diagnosing the mechanism. Why SOPs failed. Why hiring failed. Why SaaS failed. Dynamically highlights the ones the user ticked in Q2 (via `?failed` csv).
3. **The mechanism** — ~120-word explainer: "AI agents don't replace your team — they replace the bottleneck tasks *in between* your team." Branded CSS-only diagram strip (inputs → agent → outputs); no image asset required in v1.
4. **Proof** — 2 segment-matched case snippets. Numbers-first format: "**RM38K/mo saved** — invoice-matching agent, Shah Alam logistics SME." v1 pulls real quotes from existing `Clients.tsx` content.
5. **The plan** — 3 steps: *Audit call → Roadmap in 7 days → Build in 30.* One sentence each.
6. **Product reveal (single CTA)** — primary button: "Book Your Free AI Audit Call" (red-on-white, same treatment as Hero). Subtext: "30 minutes. No sales pitch. You leave with 3 automations you can run next week." Below: "Or check your inbox — your personalised AI audit report is on its way." (Delivered by D0 email.)
7. **Risk reversal** — reuse The Clarity Guarantee from `Contact.tsx` verbatim.
8. **FAQ** — 4 segment-specific objections. Native `<details>` accordions, no JS.

**Calendar link:** CTA targets a URL from `NEXT_PUBLIC_BOOKING_URL` (Cal.com / Calendly — provider swappable). A thin client wrapper fires an analytics event on click.

**One-CTA rule:** a single button, repeated 3× — after headline, after plan, after FAQ. No secondary conversions on this page.

## Drip engine

**Koyeb Scheduled Job** — `*/5 * * * *` cron → `POST {SITE_URL}/api/cron/send-drip` with header `Authorization: Bearer ${CRON_SECRET}`.

**Handler (`/api/cron/send-drip/route.ts`):**
1. Verify `CRON_SECRET`; reject 401 otherwise.
2. Candidate query: `select id from scheduled_emails where status='pending' and send_at <= now() and attempts < 3 order by send_at asc limit 50`.
3. For each candidate id, attempt to claim it atomically:
   `update scheduled_emails set status='in_flight', attempts = attempts + 1 where id=? and status='pending' returning *`. If the update returns zero rows (another worker claimed it), skip and continue.
4. For each claimed row:
   - If `lead.unsubscribed_at is not null` → `update status='skipped'` and continue.
   - Render template (React Email → HTML + plain-text) via `src/lib/email/render.tsx`.
   - Send via Resend (`from` = `RESEND_FROM_EMAIL`, reply-to = `hello@hustlr.com`).
   - On success: `update status='sent', sent_at=now()`.
   - On failure: store `error`. If `attempts >= 3` → `status='failed'`; otherwise revert to `status='pending'` so the next cron tick retries.
5. Return JSON summary `{ processed, sent, failed, skipped, duration_ms }` — appears in Koyeb logs.

**Idempotency:** The `pending → in_flight` atomic claim is the lock. Two concurrent cron runs cannot double-send because only one update succeeds. If a worker crashes mid-send, the row stays `in_flight` indefinitely; a weekly maintenance task (out of scope v1 — documented for follow-up) would sweep `in_flight` rows older than 1 hour back to `pending`.

**Unsubscribe:** Every email footer links to `/audit/unsubscribe?lead=<id>&t=<hmac>`. HMAC is `hmacSha256(CRON_SECRET, leadId)`. The page verifies, sets `unsubscribed_at = now()`, confirms in plain text.

**Resend webhook (`/api/webhooks/resend/route.ts`):** Verifies Resend signature, writes append-only rows to `email_events`. Used later for reporting; not read by any send-time logic in v1.

## Email drip content (beats, not final copy)

Full copy is written during implementation; this spec locks the beat per slot so tone stays consistent across all 4 segments.

| Slot | Timing | Beat | Subject formula |
|---|---|---|---|
| D0 result | +0m | "Your AI audit outline." Mirrors pain, lists 3 specific automations in their domain, one-line CTA to book. | `{firstName}, here's where AI wins you 20 hrs/week` |
| D1 mechanism | +24h | Why "normal" fixes failed. Explains why SOPs / hires / generic SaaS don't solve this bottleneck. Names the mechanism. | `Why hiring more staff won't fix {segment_pain}` |
| D3 proof | +72h | One segment-matched case study, number-first hook. RM saved or hours back. | `{Client} saved {X} hrs/week — here's what they did` |
| D5 objections | +120h | Kills top 3 objections for the segment. | `"We're too small for AI" — read this` |
| D9 last call | +216h | Scarcity anchor: "We only onboard 3 SMEs/month." Final invite. Post this, the lead falls out of the drip. | `Last one from me — then I'll stop emailing` |

**Constraint:** every template renders plain-text + HTML; footer includes unsubscribe link + physical address (Raffles Place, Singapore) for CAN-SPAM / PDPA hygiene.

## Env vars

| Var | Purpose |
|---|---|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | server-side only (never exposed to client) |
| `RESEND_API_KEY` | Resend API key |
| `RESEND_FROM_EMAIL` | verified sender (e.g. `jeremy@hustlr.com`) |
| `CRON_SECRET` | shared secret for Koyeb cron auth + unsubscribe HMAC |
| `SITE_URL` | canonical base URL (used in email links) |
| `NEXT_PUBLIC_BOOKING_URL` | Cal.com / Calendly link for the audit call |
| `RESEND_WEBHOOK_SECRET` | signature secret for Resend event webhook |

## Testing

- **Unit (Vitest):** `deriveSegment(answers)`, `deriveUrgency(answers)`, `scheduleDrip(leadId, segment, now)`, unsubscribe HMAC sign/verify.
- **Integration:** `submitQuiz` valid → rows inserted; invalid email → validation error; duplicate email within 30 days → reused lead + drip reseeded; cron handler happy path + unauth rejected.
- **Manual smoke (documented in plan):** complete quiz on desktop + mobile, verify Supabase rows, confirm D0 arrives on staging within 5 min, unsubscribe flips the row, Resend webhook writes an `email_events` row.
- **No E2E framework** v1 — overhead not justified.

## Observability

- Cron handler logs a single structured line per run: `{ processed, sent, failed, skipped, duration_ms }`.
- Send failures log Resend error body + `template_key` + `lead_id`.
- Koyeb logs are the single source of truth v1; no Sentry / APM.

## Open questions (none blocking)

- Exact Cal.com / Calendly URL goes into `NEXT_PUBLIC_BOOKING_URL` at deploy time.
- Resend domain verification is a manual DNS step post-merge.
- Final copy for each email + result page is drafted during implementation, not in this spec.
