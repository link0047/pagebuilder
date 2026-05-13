ALTER TABLE builds
  ADD COLUMN locked_by text REFERENCES "user"(id) ON DELETE SET NULL,
  ADD COLUMN locked_at timestamp with time zone;
