/*
  # ContentFlow - Initial Database Schema

  This migration creates the complete database schema for ContentFlow, an AI-powered content creation platform.

  ## Tables Created

  1. **user_profiles**
     - Extended user profile information beyond Supabase auth
     - Links to auth.users via user_id
     - Stores preferences and settings

  2. **content**
     - Main content storage (blog posts, social posts, scripts, etc.)
     - Stores title, body, metadata, status
     - Links to users

  3. **ideas**
     - Saved content ideas from AI generation
     - Includes category, description, suggested platforms
     - Links to users

  4. **outlines**
     - Content outlines from the builder wizard
     - Includes hook, sections, key points, CTA
     - Links to users

  5. **knowledge_base_documents**
     - Uploaded reference documents
     - File metadata and storage paths
     - Links to users

  6. **publishing_connections**
     - Social media platform connection status
     - OAuth tokens and connection metadata
     - Links to users

  7. **published_content**
     - Publishing history and tracking
     - Platform-specific URLs and status
     - Links to content and users

  8. **analytics**
     - Performance metrics per published content
     - Views, engagement, shares, comments
     - Links to published_content

  9. **api_keys**
     - User AI provider API keys (encrypted)
     - Provider name and key metadata
     - Links to users

  10. **user_preferences**
      - User settings and preferences
      - Timezone, default platforms, AI provider, writing tone
      - Links to users

  ## Security

  - Row Level Security (RLS) enabled on all tables
  - Policies restrict access to user's own data
  - Admin users have elevated permissions where appropriate
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  name text NOT NULL,
  avatar_url text,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create content table
CREATE TABLE IF NOT EXISTS content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content_body text NOT NULL DEFAULT '',
  content_type text NOT NULL CHECK (content_type IN ('blog', 'social', 'script', 'outline', 'thread', 'other')),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'ready', 'published', 'archived')),
  word_count integer DEFAULT 0,
  character_count integer DEFAULT 0,
  tags text[] DEFAULT ARRAY[]::text[],
  target_platform text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  published_at timestamptz
);

-- Create ideas table
CREATE TABLE IF NOT EXISTS ideas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  category text,
  tags text[] DEFAULT ARRAY[]::text[],
  content_types text[] DEFAULT ARRAY[]::text[],
  suggested_platforms text[] DEFAULT ARRAY[]::text[],
  is_saved boolean DEFAULT true,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create outlines table
CREATE TABLE IF NOT EXISTS outlines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  hook text NOT NULL,
  hook_alternatives text[] DEFAULT ARRAY[]::text[],
  sections jsonb NOT NULL DEFAULT '[]'::jsonb,
  cta text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'ready', 'archived')),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create knowledge_base_documents table
CREATE TABLE IF NOT EXISTS knowledge_base_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_type text NOT NULL,
  file_size integer NOT NULL,
  description text,
  tags text[] DEFAULT ARRAY[]::text[],
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create publishing_connections table
CREATE TABLE IF NOT EXISTS publishing_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  platform text NOT NULL CHECK (platform IN ('medium', 'twitter', 'linkedin', 'bluesky', 'substack', 'dev', 'hashnode')),
  is_connected boolean DEFAULT false,
  access_token text,
  refresh_token text,
  token_expires_at timestamptz,
  platform_user_id text,
  platform_username text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, platform)
);

-- Create published_content table
CREATE TABLE IF NOT EXISTS published_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content_id uuid REFERENCES content(id) ON DELETE CASCADE NOT NULL,
  platform text NOT NULL,
  platform_post_id text,
  platform_url text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'failed', 'scheduled')),
  scheduled_for timestamptz,
  published_at timestamptz,
  error_message text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  published_content_id uuid REFERENCES published_content(id) ON DELETE CASCADE NOT NULL,
  views integer DEFAULT 0,
  likes integer DEFAULT 0,
  shares integer DEFAULT 0,
  comments integer DEFAULT 0,
  engagement_rate numeric(5,2) DEFAULT 0,
  click_through_rate numeric(5,2) DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  recorded_at timestamptz DEFAULT now() NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create api_keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  provider text NOT NULL CHECK (provider IN ('anthropic', 'openai', 'google', 'other')),
  key_name text NOT NULL,
  encrypted_key text NOT NULL,
  is_active boolean DEFAULT true,
  last_used_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, provider, key_name)
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  timezone text DEFAULT 'UTC',
  default_platform text DEFAULT 'medium',
  default_content_type text DEFAULT 'blog',
  default_ai_provider text DEFAULT 'anthropic',
  writing_tone text DEFAULT 'professional',
  notifications_enabled boolean DEFAULT true,
  email_notifications boolean DEFAULT true,
  preferences jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_content_user_id ON content(user_id);
CREATE INDEX IF NOT EXISTS idx_content_status ON content(status);
CREATE INDEX IF NOT EXISTS idx_content_created_at ON content(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ideas_user_id ON ideas(user_id);
CREATE INDEX IF NOT EXISTS idx_outlines_user_id ON outlines(user_id);
CREATE INDEX IF NOT EXISTS idx_published_content_user_id ON published_content(user_id);
CREATE INDEX IF NOT EXISTS idx_published_content_content_id ON published_content(content_id);
CREATE INDEX IF NOT EXISTS idx_analytics_published_content_id ON analytics(published_content_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_documents_user_id ON knowledge_base_documents(user_id);

-- Enable Row Level Security on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE outlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE publishing_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE published_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for content
CREATE POLICY "Users can view own content"
  ON content FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own content"
  ON content FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own content"
  ON content FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own content"
  ON content FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for ideas
CREATE POLICY "Users can view own ideas"
  ON ideas FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ideas"
  ON ideas FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ideas"
  ON ideas FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own ideas"
  ON ideas FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for outlines
CREATE POLICY "Users can view own outlines"
  ON outlines FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own outlines"
  ON outlines FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own outlines"
  ON outlines FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own outlines"
  ON outlines FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for knowledge_base_documents
CREATE POLICY "Users can view own documents"
  ON knowledge_base_documents FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents"
  ON knowledge_base_documents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents"
  ON knowledge_base_documents FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents"
  ON knowledge_base_documents FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for publishing_connections
CREATE POLICY "Users can view own connections"
  ON publishing_connections FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own connections"
  ON publishing_connections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own connections"
  ON publishing_connections FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own connections"
  ON publishing_connections FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for published_content
CREATE POLICY "Users can view own published content"
  ON published_content FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own published content"
  ON published_content FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own published content"
  ON published_content FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own published content"
  ON published_content FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for analytics
CREATE POLICY "Users can view own analytics"
  ON analytics FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics"
  ON analytics FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analytics"
  ON analytics FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for api_keys
CREATE POLICY "Users can view own api keys"
  ON api_keys FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own api keys"
  ON api_keys FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own api keys"
  ON api_keys FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own api keys"
  ON api_keys FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for user_preferences
CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_updated_at BEFORE UPDATE ON content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ideas_updated_at BEFORE UPDATE ON ideas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_outlines_updated_at BEFORE UPDATE ON outlines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_knowledge_base_documents_updated_at BEFORE UPDATE ON knowledge_base_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_publishing_connections_updated_at BEFORE UPDATE ON publishing_connections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_published_content_updated_at BEFORE UPDATE ON published_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_analytics_updated_at BEFORE UPDATE ON analytics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_api_keys_updated_at BEFORE UPDATE ON api_keys FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();