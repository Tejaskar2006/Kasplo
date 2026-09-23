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

async function listCampaigns(req, res) {
  const campaigns = await campaignService.getCampaigns();
  res.json({
    success: true,
    data: campaigns,
  });
}

async function getCampaign(req, res) {
  const { id } = req.params;
  const campaign = await campaignService.getCampaignDetails(id);
  res.json({
    success: true,
    data: campaign,
  });
}

async function getStatistics(req, res) {
  const { id } = req.params;
  const stats = await campaignService.getCampaignStatistics(id);
  res.json({
    success: true,
    data: stats,
  });
}

module.exports = {
  createCampaign,
  scheduleCampaign,
  listCampaigns,
  getCampaign,
  getStatistics,
};
