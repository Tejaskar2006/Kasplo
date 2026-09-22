const express = require('express');
const healthRoutes = require('./routes/health.routes');
const campaignRoutes = require('./routes/campaign.routes');
const {
  notFoundHandler,
  jsonParseErrorHandler,
  errorHandler,
} = require('./middleware/errorHandler');

function createApp() {
  const app = express();

  app.use(express.json({ limit: '1mb' }));

  app.use('/api', healthRoutes);
  app.use('/api/campaigns', campaignRoutes);

  app.use(notFoundHandler);
  app.use(jsonParseErrorHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
