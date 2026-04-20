-- Prevent duplicate pending drip rows for the same (lead, template_key) when
-- two concurrent quiz submissions race.  A row can transition through
-- 'in_flight' → 'sent'/'failed'/'skipped' freely — the constraint only guards
-- the pending queue.

create unique index scheduled_emails_pending_slot_uniq
  on scheduled_emails (lead_id, template_key)
  where status = 'pending';
