const express = require('express');
const { asyncHandler } = require('../middleware/asyncHandler');
const campaignController = require('../controllers/campaign.controller');

const router = express.Router();

router.post('/', asyncHandler(campaignController.createCampaign));

module.exports = router;
