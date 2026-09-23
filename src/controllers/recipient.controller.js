const recipientService = require('../services/recipient.service');

async function addRecipient(req, res) {
  const { id: campaignId } = req.params;
  const recipient = await recipientService.addRecipient(campaignId, req.body);
  
  res.status(201).json({
    success: true,
    data: recipient,
  });
}

module.exports = {
  addRecipient,
};
