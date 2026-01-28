DO $$
BEGIN
   IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_status_activity') THEN
      CREATE TYPE enum_status_activity AS ENUM ('active', 'deactivated');
   END IF;
END$$;

ALTER TABLE users
ADD COLUMN full_name VARCHAR(255) NOT NULL DEFAULT 'Unknown',
ADD COLUMN status enum_status_activity NOT NULL DEFAULT 'active';
