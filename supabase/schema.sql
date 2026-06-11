-- ──────────────────────────────────────────────
-- Supabase Schema for Rezome Admin Dashboard
── Paste into Supabase SQL Editor
── Run ALL at once
-- ──────────────────────────────────────────────

-- 1. Projects
CREATE TABLE IF NOT EXISTS projects (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title      text NOT NULL,
  description text NOT NULL,
  tags       text[] DEFAULT '{}',
  github_url text,
  live_url   text,
  image_url  text,
  featured   boolean DEFAULT false,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Blog Posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  slug          text UNIQUE NOT NULL,
  content       text NOT NULL DEFAULT '',
  cover_image   text,
  tags          text[] DEFAULT '{}',
  status        text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at  timestamptz,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- 3. Skills
CREATE TABLE IF NOT EXISTS skills (
  id       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name     text NOT NULL,
  category text NOT NULL,
  level    int NOT NULL CHECK (level BETWEEN 1 AND 5),
  icon     text,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 4. Experiences
CREATE TABLE IF NOT EXISTS experiences (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company     text NOT NULL,
  role        text NOT NULL,
  start_date  date NOT NULL,
  end_date    date,
  description text NOT NULL DEFAULT '',
  is_current  boolean DEFAULT false,
  sort_order  int DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

-- 5. Contact Messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  email      text NOT NULL,
  message    text NOT NULL,
  is_read    boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- 6. Page Views (analytics)
CREATE TABLE IF NOT EXISTS page_views (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path       text NOT NULL,
  referrer   text,
  user_agent text,
  viewed_at  timestamptz DEFAULT now()
);

-- 7. Services
CREATE TABLE IF NOT EXISTS services (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  price       text NOT NULL,
  duration    text NOT NULL,
  description text NOT NULL,
  features    text[] DEFAULT '{}',
  revisions   text NOT NULL,
  is_popular  boolean DEFAULT false,
  is_active   boolean DEFAULT true,
  sort_order  int DEFAULT 0,
  cta_text    text DEFAULT 'سفارش بده',
  cta_link    text DEFAULT '/contact',
  created_at  timestamptz DEFAULT now()
);

-- ──────────────────────────────────────────────
-- Row Level Security (RLS) Policies
-- ──────────────────────────────────────────────

ALTER TABLE projects         ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills           ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences      ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views       ENABLE ROW LEVEL SECURITY;
ALTER TABLE services         ENABLE ROW LEVEL SECURITY;

-- Admin-only: full access to all tables
-- Uses auth.uid() — only the authenticated admin user
CREATE POLICY "Admin full access projects"
  ON projects FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin full access blog_posts"
  ON blog_posts FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin full access skills"
  ON skills FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin full access experiences"
  ON experiences FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin full access services"
  ON services FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Public read services"
  ON services FOR SELECT
  USING (true);

-- Contact messages: public INSERT, admin SELECT/DELETE
CREATE POLICY "Public insert contact_messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin select contact_messages"
  ON contact_messages FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin delete contact_messages"
  ON contact_messages FOR DELETE
  USING (auth.role() = 'authenticated');

-- Page views: public INSERT, admin SELECT
CREATE POLICY "Public insert page_views"
  ON page_views FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public select page_views"
  ON page_views FOR SELECT
  USING (true);

-- ──────────────────────────────────────────────
-- Helper Functions
-- ──────────────────────────────────────────────

-- Auto-generate slug from title
CREATE OR REPLACE FUNCTION generate_slug(title_text text)
RETURNS text AS $$
BEGIN
  RETURN lower(regexp_replace(regexp_replace(trim(title_text), '\s+', '-', 'g'), '[^a-zA-Z0-9\-]', '', 'g'));
END;
$$ LANGUAGE plpgsql;

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: auto updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
