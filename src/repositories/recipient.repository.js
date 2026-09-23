const { getPool } = require('../config/database');

async function insertRecipient(campaignId, data) {
  const pool = getPool();
  const [result] = await pool.query(
    `INSERT INTO campaign_recipients (
      campaign_id, name, email, delivery_status
    ) VALUES (?, ?, ?, 'pending')`,
    [
      campaignId,
      data.name,
      data.email,
    ]
  );

  return findRecipientById(result.insertId);
}

async function findRecipientById(id) {
  const pool = getPool();
  const [rows] = await pool.query(
    'SELECT * FROM campaign_recipients WHERE id = ? LIMIT 1',
    [id]
  );
  return rows[0] ?? null;
}

module.exports = {
  insertRecipient,
  findRecipientById,
};
