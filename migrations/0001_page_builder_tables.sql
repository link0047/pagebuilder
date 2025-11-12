-- Create enums for page builder
CREATE TYPE build_type AS ENUM ('homepage', 'category', 'landing_page', 'custom');

CREATE TABLE builds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  build_type build_type NOT NULL,
  
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  thumbnail_url TEXT NOT NULL,
  
  created_by TEXT REFERENCES "user"(id) ON DELETE SET NULL,
  updated_by TEXT REFERENCES "user"(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  build_type build_type NOT NULL,

  content jsonb NOT NULL,
  thumbnail_url TEXT NOT NULL,
  
  created_by TEXT REFERENCES "user"(id) ON DELETE SET NULL,
  updated_by TEXT REFERENCES "user"(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_builds_updated_at BEFORE UPDATE ON "builds"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON "templates"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- For filtering/grouping by type
CREATE INDEX idx_builds_build_type ON builds(build_type);
CREATE INDEX idx_templates_build_type ON templates(build_type);

-- For user lookups
CREATE INDEX idx_builds_created_by ON builds(created_by);
CREATE INDEX idx_templates_created_by ON templates(created_by);