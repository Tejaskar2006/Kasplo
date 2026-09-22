# Email Campaign Management API

REST API for creating email campaigns, managing recipients, scheduling sends, and tracking statistics. Built with **Node.js**, **Express**, and **MySQL**.

## Step 1 — Initial setup (done)

- Express application bootstrap
- Environment-based configuration (via `.env`)
- MySQL connection pool (`mysql2`)
- Structured logging, JSON errors, health endpoints

## Step 2 — Database schema & migrations (done)

- SQL migration: `migrations/001_initial_schema.sql`
- Migration runner: `npm run migrate` (tracks applied files in `schema_migrations`)
- Design notes: [docs/DATABASE.md](docs/DATABASE.md)

## Step 3 — Create campaign (current)

`POST /api/campaigns` creates a campaign with status **`draft`**.

**Request body (JSON):**

| Field | Type | Required |
|-------|------|----------|
| `name` | string | yes (max 255) |
| `subject` | string | yes (max 500) |
| `senderEmail` | string | yes (valid email) |
| `emailContent` | string | yes |
| `scheduledAt` | string | yes (ISO 8601 date-time) |

**Example:**

```bash
curl -X POST http://localhost:3000/api/campaigns \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Spring Sale\",\"subject\":\"Hello\",\"senderEmail\":\"noreply@example.com\",\"emailContent\":\"<p>Hi</p>\",\"scheduledAt\":\"2026-12-01T10:00:00.000Z\"}"
```

**Success:** `201` with `{ "success": true, "data": { ... } }`.

**Validation errors:** `400` with `{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "Validation failed", "details": [...] } }`.

## Prerequisites

- Node.js 18+
- MySQL 8+ (database `kasplo` and user with access)

## Setup

1. Clone the repository and install dependencies:

   ```bash
   npm install
   ```

2. Copy the example environment file and fill in your values:

   ```bash
   cp .env.example .env
   ```

   Do **not** commit `.env` or real passwords to Git.

3. Run database migrations:

   ```bash
   npm run migrate
   ```

4. Start the server:

   ```bash
   npm start
   ```

## Verify

- **App health:** `GET http://localhost:3000/api/health`
- **Database:** `GET http://localhost:3000/api/health/db`

## Project structure

```
migrations/           # Versioned SQL migrations
scripts/
  migrate.js          # Apply pending migrations
docs/
  DATABASE.md         # Schema & design notes
src/
  app.js
  server.js
  config/
  middleware/
  routes/
  utils/
```

## Environment variables

| Variable       | Description        |
|----------------|--------------------|
| `NODE_ENV`     | `development` / `production` |
| `PORT`         | HTTP port (default `3000`) |
| `DB_HOST`      | MySQL host         |
| `DB_PORT`      | MySQL port         |
| `DB_USER`      | MySQL user         |
| `DB_PASSWORD`  | MySQL password     |
| `DB_NAME`      | Database name      |
| `LOG_LEVEL`    | `error`, `warn`, `info`, `debug` |

## Roadmap (assignment steps)

1. Initial setup — **done**
2. Database schema & migrations — **done**
3. Campaign create & validation — **done**
4. Recipients API
5. Schedule & process simulation
6. Listing, details & statistics
7. Automated tests & polish

## License

Assignment submission — internal use.
