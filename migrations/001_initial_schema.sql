-- Email campaign management — initial schema

CREATE TABLE IF NOT EXISTS campaigns (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  sender_email VARCHAR(320) NOT NULL,
  email_content TEXT NOT NULL,
  scheduled_at DATETIME NULL,
  status ENUM('draft', 'scheduled', 'processing', 'completed') NOT NULL DEFAULT 'draft',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  completed_at DATETIME NULL,
  PRIMARY KEY (id),
  INDEX idx_campaigns_status (status),
  INDEX idx_campaigns_created_at (created_at),
  INDEX idx_campaigns_name (name),
  INDEX idx_campaigns_scheduled_status (status, scheduled_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS campaign_recipients (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  campaign_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(320) NOT NULL,
  delivery_status ENUM('pending', 'delivered', 'failed') NOT NULL DEFAULT 'pending',
  processed_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_campaign_recipient_email (campaign_id, email),
  INDEX idx_recipients_campaign_id (campaign_id),
  INDEX idx_recipients_delivery_status (campaign_id, delivery_status),
  CONSTRAINT fk_recipients_campaign
    FOREIGN KEY (campaign_id) REFERENCES campaigns (id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
