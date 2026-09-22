const { loadEnv } = require('./config/env');
const { createPool, closePool } = require('./config/database');
const { createLogger } = require('./utils/logger');
const { createApp } = require('./app');

let logger;

async function start() {
  const config = loadEnv();
  logger = createLogger(config.logLevel);

  createPool(config.db);

  const app = createApp();
  const server = app.listen(config.port, () => {
    logger.info('Server started', {
      port: config.port,
      nodeEnv: config.nodeEnv,
    });
  });

  const shutdown = async (signal) => {
    logger.info('Shutdown signal received', { signal });
    server.close(async () => {
      try {
        await closePool();
        logger.info('Graceful shutdown complete');
        process.exit(0);
      } catch (error) {
        logger.error('Error during shutdown', { message: error.message });
        process.exit(1);
      }
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

start().catch((error) => {
  const message = error?.message || 'Failed to start server';
  if (logger) {
    logger.error(message);
  } else {
    console.error(message);
  }
  process.exit(1);
});
