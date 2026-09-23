const campaignService = require('../services/campaign.service');

async function createCampaign(req, res) {
  const campaign = await campaignService.createCampaign(req.body);
  res.status(201).json({
    success: true,
    data: campaign,
  });
}

async function scheduleCampaign(req, res) {
  const { id } = req.params;
  const campaign = await campaignService.scheduleCampaign(id);
  res.json({
    success: true,
    data: campaign,
  });
}

module.exports = {
  createCampaign,
  scheduleCampaign,
};
