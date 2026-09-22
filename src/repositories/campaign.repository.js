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

module.exports = {
  insertCampaign,
  findCampaignById,
};
