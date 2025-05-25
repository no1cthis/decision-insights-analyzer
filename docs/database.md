# Database Schema: Decision Insight Analyzer

## Tables

### decision
- `id`: uuid, primary key
- `user_id`: uuid, references `auth.users`, not null
- `situation_text`: text, not null
- `decision_text`: text, not null
- `reasoning_text`: text, nullable
- `status`: text, default 'draft'
- `created_at`: timestamp with time zone, default now
- `analysis_result`: jsonb, nullable

**Row Level Security Policies:**
- Users can view, insert, update, and delete only their own decisions

---

## Relationships
- Each decision is linked to a user via `user_id`

## Migrations
- See `supabase/migrations/` for SQL migration files

---
For more details, see the [README](../README.md). 