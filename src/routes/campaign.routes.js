const express = require('express');
const { asyncHandler } = require('../middleware/asyncHandler');
const campaignController = require('../controllers/campaign.controller');
const recipientController = require('../controllers/recipient.controller');

const router = express.Router();

router.post('/', asyncHandler(campaignController.createCampaign));
router.post('/:id/schedule', asyncHandler(campaignController.scheduleCampaign));
router.post('/:id/recipients', asyncHandler(recipientController.addRecipient));

module.exports = router;
