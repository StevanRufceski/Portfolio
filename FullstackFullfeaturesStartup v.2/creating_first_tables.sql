-- =========================================

DROP TABLE IF EXISTS
  password_reset_tokens,
  email_verification_tokens,
  refresh_tokens,
  audit_logs,
  users
CASCADE;
-- =========================================
-- 1. Enable extensions
-- =========================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================
-- 2. Create ENUM type (safe)
-- =========================================
DO $$
BEGIN
   IF NOT EXISTS (
      SELECT 1 FROM pg_type WHERE typname = 'enum_status_activity'
   ) THEN
      CREATE TYPE enum_status_activity AS ENUM ('active', 'deactivated');
   END IF;
END$$;

-- =========================================
-- 3. Users table
-- =========================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Core identity
  full_name TEXT NOT NULL DEFAULT 'Unknown',
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('Administrator', 'Manager', 'Officer', 'Customer')),
  phone TEXT NOT NULL,
  status enum_status_activity NOT NULL DEFAULT 'active',
  email_verified BOOLEAN DEFAULT FALSE,
  promoted BOOLEAN NOT NULL DEFAULT FALSE,

  -- Optional profile fields
  title TEXT,
  description TEXT,  
  picture TEXT,
  promo_number TEXT DEFAULT NULL,

  -- Creator (admin / manager / officer)
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW()
);
-- =========================================
-- 4. Refresh tokens
-- =========================================
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL
);

-- =========================================
-- 5. Audit logs
-- =========================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =========================================
-- 6. Email verification tokens
-- =========================================
CREATE TABLE email_verification_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token UUID NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =========================================
-- 7. Password reset tokens
-- =========================================
CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token UUID NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =========================================
-- 8. Indexes (HIGHLY recommended with UUIDs)
-- =========================================


CREATE INDEX idx_users_email ON users(email);


CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
