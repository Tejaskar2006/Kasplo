const mysql = require('mysql2/promise');

let pool;

function createPool(dbConfig) {
  if (pool) {
    return pool;
  }

  pool = mysql.createPool({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });

  return pool;
}

async function pingDatabase() {
  const connection = await pool.getConnection();
  try {
    await connection.ping();
  } finally {
    connection.release();
  }
}

async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

function getPool() {
  if (!pool) {
    throw new Error('Database pool is not initialized');
  }
  return pool;
}

module.exports = {
  createPool,
  pingDatabase,
  closePool,
  getPool,
};
