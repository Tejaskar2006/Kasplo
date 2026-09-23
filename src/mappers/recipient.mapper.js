function toRecipientResponse(row) {
  if (!row) return null;

  return {
    id: row.id,
    campaignId: row.campaign_id,
    name: row.name,
    email: row.email,
    deliveryStatus: row.delivery_status,
    processedAt: row.processed_at ? row.processed_at.toISOString() : null,
    createdAt: row.created_at ? row.created_at.toISOString() : null,
    updatedAt: row.updated_at ? row.updated_at.toISOString() : null,
  };
}

module.exports = {
  toRecipientResponse,
};
