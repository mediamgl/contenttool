/*
  # Error Logging Table

  ## Purpose
  Centralized error logging for application monitoring and debugging.

  ## New Tables

  1. **error_logs**
     - `id` (uuid, primary key) - Unique identifier
     - `user_id` (uuid, nullable) - User who experienced the error (if authenticated)
     - `message` (text) - Error message
     - `severity` (text) - Error severity level (info, warning, error, critical)
     - `category` (text) - Error category (authentication, database, api, network, etc.)
     - `stack` (text, nullable) - Error stack trace
     - `context` (jsonb, nullable) - Additional context data
     - `user_agent` (text, nullable) - Browser user agent string
     - `url` (text, nullable) - URL where error occurred
     - `occurred_at` (timestamptz) - When the error occurred
     - `created_at` (timestamptz) - When the log was created

  ## Security
  - RLS enabled
  - Users can insert their own error logs
  - Users can view their own error logs
  - Admins can view all error logs (for monitoring)

  ## Indexes
  - Index on user_id for efficient user-specific queries
  - Index on occurred_at for time-based queries
  - Index on severity for filtering critical errors
  - Index on category for grouping by error type

  ## Notes
  - Includes automatic cleanup capability
  - Supports integration with external error tracking services
  - Designed for high-volume logging with efficient querying
*/

-- Create error_logs table
CREATE TABLE IF NOT EXISTS error_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  message text NOT NULL,
  severity text NOT NULL DEFAULT 'error' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  category text NOT NULL DEFAULT 'unknown' CHECK (category IN ('authentication', 'database', 'api', 'network', 'validation', 'ui', 'edge_function', 'unknown')),
  stack text,
  context jsonb DEFAULT '{}'::jsonb,
  user_agent text,
  url text,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_error_logs_user_id ON error_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_error_logs_occurred_at ON error_logs(occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_error_logs_severity ON error_logs(severity);
CREATE INDEX IF NOT EXISTS idx_error_logs_category ON error_logs(category);

-- Enable RLS
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own error logs
CREATE POLICY "Users can insert error logs"
  ON error_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Allow anonymous error logging (for errors before authentication)
CREATE POLICY "Anonymous users can insert error logs"
  ON error_logs FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

-- Allow users to view their own error logs
CREATE POLICY "Users can view own error logs"
  ON error_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow admins to view all error logs
CREATE POLICY "Admins can view all error logs"
  ON error_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Allow admins to delete error logs (for cleanup)
CREATE POLICY "Admins can delete error logs"
  ON error_logs FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );
