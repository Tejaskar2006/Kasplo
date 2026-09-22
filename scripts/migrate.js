const fs = require('fs');
const path = require('path');
const { loadEnv } = require('../src/config/env');
const { createPool, closePool } = require('../src/config/database');
const { createLogger } = require('../src/utils/logger');

const MIGRATIONS_DIR = path.join(__dirname, '..', 'migrations');

async function ensureMigrationsTable(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uq_schema_migrations_name (name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}

async function getAppliedMigrationNames(pool) {
  const [rows] = await pool.query(
    'SELECT name FROM schema_migrations ORDER BY name ASC'
  );
  return new Set(rows.map((row) => row.name));
}

function listMigrationFiles() {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    return [];
  }

  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((file) => file.endsWith('.sql'))
    .sort();
}

async function applyMigration(pool, fileName) {
  const filePath = path.join(MIGRATIONS_DIR, fileName);
  const sql = fs.readFileSync(filePath, 'utf8').trim();

  if (!sql) {
    throw new Error(`Migration file is empty: ${fileName}`);
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.query(sql);
    await connection.query(
      'INSERT INTO schema_migrations (name) VALUES (?)',
      [fileName]
    );
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function runMigrations() {
  const config = loadEnv();
  const logger = createLogger(config.logLevel);
  const pool = createPool(config.db);

  try {
    await ensureMigrationsTable(pool);
    const applied = await getAppliedMigrationNames(pool);
    const files = listMigrationFiles();

    if (files.length === 0) {
      logger.warn('No migration files found', { dir: MIGRATIONS_DIR });
      return;
    }

    let appliedCount = 0;
    for (const file of files) {
      if (applied.has(file)) {
        logger.info('Migration already applied', { file });
        continue;
      }

      logger.info('Applying migration', { file });
      await applyMigration(pool, file);
      appliedCount += 1;
      logger.info('Migration applied', { file });
    }

    if (appliedCount === 0) {
      logger.info('Database schema is up to date');
    } else {
      logger.info('Migrations finished', { appliedCount });
    }
  } finally {
    await closePool();
  }
}

runMigrations().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
