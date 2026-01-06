-- Migration: Add Chat Sessions and Messages for RAG Chat Interface
-- Tables: chat_sessions, chat_messages

-- =============================================================================
-- NEW TABLES
-- =============================================================================

-- Chat Sessions: Track conversation sessions per project
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT,
  source_ids JSONB,  -- Array of source IDs to filter context
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat Messages: Individual messages in a chat session
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  citations JSONB,  -- Array of {chunk_id, source_title, snippet}
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- INDEXES
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_chat_sessions_project ON chat_sessions(project_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_created ON chat_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON chat_messages(created_at);

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

-- Enable RLS on new tables
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Chat Sessions policies
CREATE POLICY "Users can view own chat_sessions"
  ON chat_sessions FOR SELECT
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own chat_sessions"
  ON chat_sessions FOR INSERT
  WITH CHECK (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own chat_sessions"
  ON chat_sessions FOR UPDATE
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own chat_sessions"
  ON chat_sessions FOR DELETE
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

-- Chat Messages policies (access through session ownership)
CREATE POLICY "Users can view own chat_messages"
  ON chat_messages FOR SELECT
  USING (
    session_id IN (
      SELECT cs.id FROM chat_sessions cs
      JOIN projects p ON p.id = cs.project_id
      WHERE p.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own chat_messages"
  ON chat_messages FOR INSERT
  WITH CHECK (
    session_id IN (
      SELECT cs.id FROM chat_sessions cs
      JOIN projects p ON p.id = cs.project_id
      WHERE p.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own chat_messages"
  ON chat_messages FOR UPDATE
  USING (
    session_id IN (
      SELECT cs.id FROM chat_sessions cs
      JOIN projects p ON p.id = cs.project_id
      WHERE p.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own chat_messages"
  ON chat_messages FOR DELETE
  USING (
    session_id IN (
      SELECT cs.id FROM chat_sessions cs
      JOIN projects p ON p.id = cs.project_id
      WHERE p.user_id = auth.uid()
    )
  );

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Update chat_sessions.updated_at on change
CREATE OR REPLACE FUNCTION update_chat_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER chat_sessions_updated_at
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_sessions_updated_at();
