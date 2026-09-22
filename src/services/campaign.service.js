const { AppError } = require('../utils/AppError');
const { validateCreateCampaignBody } = require('../utils/validation');
const campaignRepository = require('../repositories/campaign.repository');
const { toCampaignResponse } = require('../mappers/campaign.mapper');

async function createCampaign(body) {
  const validation = validateCreateCampaignBody(body);
  if (!validation.valid) {
    throw new AppError('Validation failed', {
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      details: validation.errors,
    });
  }

  const row = await campaignRepository.insertCampaign(validation.data);
  return toCampaignResponse(row);
}

module.exports = {
  createCampaign,
};
