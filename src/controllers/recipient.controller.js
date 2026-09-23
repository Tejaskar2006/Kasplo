const recipientService = require('../services/recipient.service');

async function addRecipient(req, res) {
  const { id: campaignId } = req.params;
  const recipient = await recipientService.addRecipient(campaignId, req.body);
  
  res.status(201).json({
    success: true,
    data: recipient,
  });
}

async function listRecipients(req, res) {
  const { id: campaignId } = req.params;
  const recipients = await recipientService.getRecipients(campaignId);
  
  res.json({
    success: true,
    data: recipients,
  });
}

module.exports = {
  addRecipient,
  listRecipients,
};
