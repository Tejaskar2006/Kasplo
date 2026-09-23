const { getPool } = require('../config/database');

async function insertCampaign(campaign) {
  const pool = getPool();
  const [result] = await pool.query(
    `INSERT INTO campaigns (
      name, subject, sender_email, email_content, scheduled_at, status
    ) VALUES (?, ?, ?, ?, ?, 'draft')`,
    [
      campaign.name,
      campaign.subject,
      campaign.senderEmail,
      campaign.emailContent,
      campaign.scheduledAt,
    ]
  );

  return findCampaignById(result.insertId);
}

async function findCampaignById(id) {
  const pool = getPool();
  const [rows] = await pool.query(
    'SELECT * FROM campaigns WHERE id = ? LIMIT 1',
    [id]
  );
  return rows[0] ?? null;
}

async function updateCampaignStatus(id, newStatus, currentStatus) {
  const pool = getPool();
  const [result] = await pool.query(
    'UPDATE campaigns SET status = ? WHERE id = ? AND status = ?',
    [newStatus, id, currentStatus]
  );
  return result.affectedRows > 0;
}

async function claimDueCampaign() {
  const pool = getPool();
  
  // Find a single due campaign that is scheduled
  const [rows] = await pool.query(
    'SELECT id FROM campaigns WHERE status = "scheduled" AND scheduled_at <= UTC_TIMESTAMP() ORDER BY scheduled_at ASC LIMIT 1'
  );
  
  if (rows.length === 0) {
    return null; // No due campaigns
  }
  
  const campaignId = rows[0].id;
  
  // Try to claim it
  const [updateResult] = await pool.query(
    'UPDATE campaigns SET status = "processing" WHERE id = ? AND status = "scheduled"',
    [campaignId]
  );
  
  if (updateResult.affectedRows === 1) {
    return findCampaignById(campaignId);
  }
  
  // Another worker claimed it first
  return null;
}

async function markCampaignCompleted(id) {
  const pool = getPool();
  await pool.query(
    'UPDATE campaigns SET status = "completed", completed_at = UTC_TIMESTAMP() WHERE id = ?',
    [id]
  );
}

module.exports = {
  insertCampaign,
  findCampaignById,
  updateCampaignStatus,
  claimDueCampaign,
  markCampaignCompleted,
};
