const express = require('express');
const { asyncHandler } = require('../middleware/asyncHandler');
const campaignController = require('../controllers/campaign.controller');
const recipientController = require('../controllers/recipient.controller');

const router = express.Router();

router.get('/', asyncHandler(campaignController.listCampaigns));
router.post('/', asyncHandler(campaignController.createCampaign));

router.get('/:id', asyncHandler(campaignController.getCampaign));
router.post('/:id/schedule', asyncHandler(campaignController.scheduleCampaign));
router.get('/:id/statistics', asyncHandler(campaignController.getStatistics));

router.get('/:id/recipients', asyncHandler(recipientController.listRecipients));
router.post('/:id/recipients', asyncHandler(recipientController.addRecipient));

module.exports = router;
