-- Clear existing data (optional)
DELETE FROM admins;

-- Insert admin with BCrypt password
INSERT INTO admins (username, email, password, is_active, role, created_at)
VALUES (
  'admin',
  'tinompofu06@gmail.com',
  '$2a$10$N0JqDGcBkjVKULMA75R0WuffmLgU0jzLfbc5widpd063QYtxz4khS', -- BCrypt hash of "TestPassword123"
  true,
  'ADMIN',
  CURRENT_TIMESTAMP
);