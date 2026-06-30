-- SEO fields (canonical_url, og_image) and search_vector are managed by Prisma migrate.
-- This migration adds FTS trigger, GIN index, and page_views enhancements.

-- GIN index for full-text search (idempotent)
CREATE INDEX IF NOT EXISTS newsletters_search_vector_gin_idx ON newsletters USING GIN (search_vector);

-- Keep search_vector in sync on content changes
CREATE OR REPLACE FUNCTION newsletters_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.excerpt, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.content, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS newsletters_search_vector_trigger ON newsletters;
CREATE TRIGGER newsletters_search_vector_trigger
  BEFORE INSERT OR UPDATE OF title, excerpt, content ON newsletters
  FOR EACH ROW EXECUTE FUNCTION newsletters_search_vector_update();

-- Backfill existing published newsletters
UPDATE newsletters
SET search_vector =
  setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(excerpt, '')), 'B') ||
  setweight(to_tsvector('english', coalesce(content, '')), 'C')
WHERE search_vector IS NULL;
