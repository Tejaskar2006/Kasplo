# Email Campaign Management API

REST API for creating email campaigns, managing recipients, scheduling sends, and tracking statistics. Built with **Node.js**, **Express**, and **MySQL**.

## Step 1 — Initial setup (current)

This step includes:

- Express application bootstrap
- Environment-based configuration (via `.env`)
- MySQL connection pool (`mysql2`)
- Structured logging
- Consistent JSON error responses
- Health endpoints to verify the app and database

Campaign APIs, migrations, and tests will be added in later steps.

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

3. Start the server:

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
src/
  app.js              # Express app
  server.js           # Entry point, graceful shutdown
  config/
    env.js            # Load & validate env
    database.js       # MySQL pool
  middleware/
    errorHandler.js
  routes/
    health.routes.js
  utils/
    logger.js
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
2. Database schema & migrations
3. Campaign create & validation
4. Recipients API
5. Schedule & process simulation
6. Listing, details & statistics
7. Automated tests & polish

## License

Assignment submission — internal use.
