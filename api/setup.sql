CREATE DATABASE IF NOT EXISTS abbey_cars;
USE abbey_cars;

-- Migrate admins to users table if needed
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'super_admin') DEFAULT 'admin',
  permissions JSON DEFAULT '{"pages": ["dashboard"]}',
  profile_image TEXT NULL,
  password_change_requested BOOLEAN DEFAULT FALSE,
  email_verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(255) NULL,
  verification_token_expires TIMESTAMP NULL,
  is_deletable BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Support legacy admins table for backward compatibility
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default super admin user
INSERT IGNORE INTO users (name, email, password_hash, role, profile_image, password_change_requested, email_verified, is_deletable, permissions)
VALUES (
  'Admin',
  'admin@abbeycars.com',
  '$2y$10$SiMn5ZU1SQLd7cGZMCRrx.JgZ.QLwbrsKCGL6x0YEuvNxrkdDOglK',
  'super_admin',
  NULL,
  FALSE,
  TRUE,
  FALSE,
  '{"pages": ["dashboard", "bookings", "privacy", "terms", "fleet", "media", "notifications", "areas", "blogs", "contact", "forms", "settings", "help"]}'
);

-- Sync legacy admins table for backward compatibility
INSERT INTO admins (name, email, password_hash)
VALUES (
  'Admin',
  'admin@abbeycars.com',
  '$2y$10$8qf8fJ9JbRJb0gq0g2gF2uN5xg0L7Z7q4f1iUQ4w5fa3qfM3R0e3S'
)
ON DUPLICATE KEY UPDATE email = VALUES(email);
