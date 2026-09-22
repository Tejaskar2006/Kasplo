function toCampaignResponse(row) {
  if (!row) {
    return null;
  }

  return {
    id: Number(row.id),
    name: row.name,
    subject: row.subject,
    senderEmail: row.sender_email,
    emailContent: row.email_content,
    scheduledAt: row.scheduled_at ? new Date(row.scheduled_at).toISOString() : null,
    status: row.status,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
    completedAt: row.completed_at ? new Date(row.completed_at).toISOString() : null,
  };
}

module.exports = { toCampaignResponse };
