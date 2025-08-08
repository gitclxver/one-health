-- Insert predefined admin accounts
-- Password for both is "admin123" (bcrypt hashed)
INSERT INTO admins (username, email, password, is_active, role, created_at)
VALUES 
('superadmin', 'tinompofu06@gmail.com', 'TestPassword123', true, 'ADMIN', CURRENT_TIMESTAMP),
('admin', 'admin@blog.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuDk9r1GDLsFjpwA8h3W8R1JN6o1qJy', true, 'ADMIN', CURRENT_TIMESTAMP);