CREATE TABLE IF NOT EXISTS admins (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP NULL
);

INSERT INTO admins (username, email, password, is_active, role, created_at)
VALUES (
  'superadmin',
  'tinompofu06@gmail.com',
  '$2a$10$N0JqDGcBkjVKULMA75R0WuffmLgU0jzLfbc5widpd063QYtxz4khS',
  true,
  'ADMIN',
  CURRENT_TIMESTAMP
)
ON CONFLICT (username) DO NOTHING;

INSERT INTO admins (username, email, password, is_active, role, created_at)
VALUES (
  'admin',
  'fransheita21@gmail.com',
  '$2a$10$bHf/9jiLQPLVEZyQqdp53uVp5jZsz8lZnbDEskcp/8mDj9acclcSG',
  true,
  'ADMIN',
  CURRENT_TIMESTAMP
)
ON CONFLICT (username) DO NOTHING;