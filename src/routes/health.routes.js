const express = require('express');
const { pingDatabase } = require('../config/database');

const router = express.Router();

router.get('/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      service: 'kasplo-email-campaign-api',
    },
  });
});

router.get('/health/db', async (_req, res, next) => {
  try {
    await pingDatabase();
    res.json({
      success: true,
      data: {
        status: 'ok',
        database: 'connected',
      },
    });
  } catch (error) {
    error.statusCode = 503;
    error.code = 'DB_UNAVAILABLE';
    error.message = 'Database connection failed';
    next(error);
  }
});

module.exports = router;
