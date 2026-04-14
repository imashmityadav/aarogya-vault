-- Aarogya Vault Database Schema
-- Run this using: mysql -u root -p < database.sql

CREATE DATABASE IF NOT EXISTS aarogya_vault;
USE aarogya_vault;

-- Users table with roles
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('patient','doctor','insurance') NOT NULL DEFAULT 'patient',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medical reports uploaded by users or doctors on behalf of patients
CREATE TABLE IF NOT EXISTS reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  filename VARCHAR(255) NOT NULL,
  upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  file_size BIGINT DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Appointments between patients and doctors
CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  appointment_date DATETIME NOT NULL,
  status ENUM('pending','accepted','rejected') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Medicine reminders for patients
CREATE TABLE IF NOT EXISTS reminders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  medicine VARCHAR(255) NOT NULL,
  time VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insurance claims submitted by patients
CREATE TABLE IF NOT EXISTS insurance_claims (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  policy_number VARCHAR(100) NOT NULL,
  hospital VARCHAR(255) NOT NULL,
  status ENUM('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
