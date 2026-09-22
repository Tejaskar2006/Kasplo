# Email Campaign Management API

REST API for creating email campaigns, managing recipients, scheduling sends, and tracking statistics. Built with **Node.js**, **Express**, and **MySQL**.

## Step 1 — Initial setup (done)

- Express application bootstrap
- Environment-based configuration (via `.env`)
- MySQL connection pool (`mysql2`)
- Structured logging, JSON errors, health endpoints

## Step 2 — Database schema & migrations (current)

- SQL migration: `migrations/001_initial_schema.sql`
- Migration runner: `npm run migrate` (tracks applied files in `schema_migrations`)
- Design notes: [docs/DATABASE.md](docs/DATABASE.md)

Tables: `campaigns`, `campaign_recipients`, `schema_migrations`.

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
   npm run dev
   ```

   Or for production-style start:

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
3. Campaign create & validation
4. Recipients API
5. Schedule & process simulation
6. Listing, details & statistics
7. Automated tests & polish

## License

Assignment submission — internal use.
