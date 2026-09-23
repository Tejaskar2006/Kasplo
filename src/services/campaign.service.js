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

async function scheduleCampaign(id) {
  const campaign = await campaignRepository.findCampaignById(id);
  if (!campaign) {
    throw new AppError('Campaign not found', { statusCode: 404, code: 'NOT_FOUND' });
  }

  if (campaign.status !== 'draft') {
    throw new AppError('Only draft campaigns can be scheduled', { statusCode: 400, code: 'INVALID_STATUS' });
  }

  const updated = await campaignRepository.updateCampaignStatus(id, 'scheduled', 'draft');
  if (!updated) {
    throw new AppError('Failed to schedule campaign (status may have changed)', { statusCode: 409, code: 'CONFLICT' });
  }

  return { ...campaign, status: 'scheduled' };
}

async function processDueCampaigns(recipientService) {
  const campaign = await campaignRepository.claimDueCampaign();
  if (!campaign) return false; // None to process

  try {
    // We pass recipientService dynamically from the worker to avoid circular dependency
    // between campaign.service and recipient.service, or we can just require it here.
    if (recipientService) {
      await recipientService.processRecipientsForCampaign(campaign.id);
    }
    
    await campaignRepository.markCampaignCompleted(campaign.id);
    return true; // Processed one
  } catch (err) {
    console.error(`Failed to process campaign ${campaign.id}:`, err);
    return false;
  }
}

module.exports = {
  createCampaign,
  scheduleCampaign,
  processDueCampaigns,
};
