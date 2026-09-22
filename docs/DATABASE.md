# Database design

MySQL (InnoDB) with UTF-8 (`utf8mb4`). Migrations live in `migrations/` and are applied with `npm run migrate`.

## Tables

### `campaigns`

Stores campaign metadata and lifecycle state.

| Column | Type | Notes |
|--------|------|--------|
| `id` | BIGINT PK | Auto-increment |
| `name` | VARCHAR(255) | List/search |
| `subject` | VARCHAR(500) | Email subject |
| `sender_email` | VARCHAR(320) | From address |
| `email_content` | TEXT | Body |
| `scheduled_at` | DATETIME NULL | Intended send time (set at create/schedule) |
| `status` | ENUM | `draft` → `scheduled` → `processing` → `completed` |
| `created_at` / `updated_at` | DATETIME | Audit |
| `completed_at` | DATETIME NULL | Set when sending simulation finishes |

**Status flow**

- **draft** — Created; recipients can be added.
- **scheduled** — Ready to send at `scheduled_at`.
- **processing** — Claimed by the worker/API so only one process runs the campaign (concurrency-safe).
- **completed** — All recipients processed.

Indexes support filtering by `status`, sorting by `created_at`, searching by `name`, and finding due scheduled campaigns.

### `campaign_recipients`

One row per recipient per campaign.

| Column | Type | Notes |
|--------|------|--------|
| `id` | BIGINT PK | |
| `campaign_id` | FK → `campaigns.id` | CASCADE delete |
| `name` | VARCHAR(255) | |
| `email` | VARCHAR(320) | Normalized to lowercase in application layer (Step 4) |
| `delivery_status` | ENUM | `pending`, `delivered`, `failed` |
| `processed_at` | DATETIME NULL | When simulation ran for this recipient |

**Unique constraint:** `(campaign_id, email)` prevents duplicate addresses within the same campaign.

### `schema_migrations`

Tracks which SQL migration files have been applied (managed by `scripts/migrate.js`).

## Concurrency (processing step)

A scheduled campaign is claimed with a conditional update, for example:

```sql
UPDATE campaigns
SET status = 'processing'
WHERE id = ? AND status = 'scheduled';
```

If `affectedRows !== 1`, another worker already claimed it or the campaign is not eligible — avoids processing twice.

## Assumptions

- Campaign IDs are numeric auto-increment (sufficient for this assignment).
- `scheduled_at` may be stored at creation time; scheduling API will enforce business rules in a later step.
- Email uniqueness is per campaign, not globally.
