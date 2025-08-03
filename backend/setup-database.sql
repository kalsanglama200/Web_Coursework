-- Database setup script for Freelancing Platform
-- Run this script in your MySQL database

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS freelancing_platform;
USE freelancing_platform;

-- Create users table with role support and ban functionality
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('Client', 'Freelancer', 'Admin') NOT NULL DEFAULT 'Freelancer',
  banned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create jobs table with updated structure
CREATE TABLE IF NOT EXISTS jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  budget DECIMAL(10,2),
  user_id INT NOT NULL,
  status ENUM('open', 'in_progress', 'completed', 'cancelled') DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create proposals table with updated structure
CREATE TABLE IF NOT EXISTS proposals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id INT NOT NULL,
  freelancer_id INT NOT NULL,
  message TEXT NOT NULL,
  status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  FOREIGN KEY (freelancer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert sample admin user (password: admin123)
INSERT INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Show the created tables
SHOW TABLES;

-- Show users table structure
DESCRIBE users; 