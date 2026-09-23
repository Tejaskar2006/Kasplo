const { AppError } = require('../utils/AppError');
const { validateCreateRecipientBody } = require('../utils/validation');
const recipientRepository = require('../repositories/recipient.repository');
const campaignRepository = require('../repositories/campaign.repository');
const { toRecipientResponse } = require('../mappers/recipient.mapper');

async function addRecipient(campaignId, body) {
  // Validate request body
  const validation = validateCreateRecipientBody(body);
  if (!validation.valid) {
    throw new AppError('Validation failed', {
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      details: validation.errors,
    });
  }

  // Ensure campaign exists and is in 'draft' status
  const campaign = await campaignRepository.findCampaignById(campaignId);
  if (!campaign) {
    throw new AppError('Campaign not found', {
      statusCode: 404,
      code: 'NOT_FOUND',
    });
  }
  if (campaign.status !== 'draft') {
    throw new AppError('Recipients can only be added to draft campaigns', {
      statusCode: 400,
      code: 'INVALID_STATUS',
    });
  }

  try {
    // Insert recipient
    const row = await recipientRepository.insertRecipient(campaignId, validation.data);
    return toRecipientResponse(row);
  } catch (error) {
    // Handle unique constraint violation (duplicate email for same campaign)
    if (error.code === 'ER_DUP_ENTRY') {
      throw new AppError('Recipient with this email already exists in the campaign', {
        statusCode: 409,
        code: 'CONFLICT',
      });
    }
    throw error;
  }
}

async function processRecipientsForCampaign(campaignId) {
  // Update all pending recipients for this campaign to delivered
  await recipientRepository.markRecipientsAsProcessed(campaignId);
}

async function getRecipients(campaignId) {
  // Ensure campaign exists
  const campaign = await campaignRepository.findCampaignById(campaignId);
  if (!campaign) {
    throw new AppError('Campaign not found', { statusCode: 404, code: 'NOT_FOUND' });
  }

  const rows = await recipientRepository.findRecipientsByCampaignId(campaignId);
  return rows.map(toRecipientResponse);
}

module.exports = {
  addRecipient,
  processRecipientsForCampaign,
  getRecipients,
};
