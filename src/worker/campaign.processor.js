const campaignService = require('../services/campaign.service');
const recipientService = require('../services/recipient.service');
const { createLogger } = require('../utils/logger');
const { loadEnv } = require('../config/env');

const config = loadEnv();
const logger = createLogger(config.logLevel);

let isRunning = false;
let intervalId = null;

async function processTick() {
  if (isRunning) return; // Prevent overlapping runs
  isRunning = true;

  try {
    const processed = await campaignService.processDueCampaigns(recipientService);
    if (processed) {
      logger.info('Worker processed a campaign');
    }
  } catch (error) {
    logger.error('Worker tick failed', { message: error.message });
  } finally {
    isRunning = false;
  }
}

function startWorker(intervalMs = 5000) {
  if (intervalId) return;
  logger.info(`Starting campaign processor worker (interval: ${intervalMs}ms)`);
  intervalId = setInterval(processTick, intervalMs);
}

function stopWorker() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    logger.info('Stopped campaign processor worker');
  }
}

module.exports = {
  startWorker,
  stopWorker,
};
