const { loadEnv } = require('./config/env');
const { createPool, closePool } = require('./config/database');
const { createLogger } = require('./utils/logger');
const { createApp } = require('./app');
const { startWorker, stopWorker } = require('./worker/campaign.processor');

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
    
    // Start background worker for campaign processing
    startWorker(5000);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      logger.error(`Port ${config.port} is already in use`, {
        hint: 'Stop the other Node process or set a different PORT in .env',
      });
    } else {
      logger.error('Server failed to start', { message: error.message });
    }
    process.exit(1);
  });

  const shutdown = async (signal) => {
    logger.info('Shutdown signal received', { signal });
    stopWorker();
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
