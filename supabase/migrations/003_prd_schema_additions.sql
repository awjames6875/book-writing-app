-- Migration: Add PRD schema additions
-- Tables: voice_dna, voice_confidence, quotes, characters, question_sections
-- Also adds new columns to existing tables

-- =============================================================================
-- NEW ENUMS
-- =============================================================================

-- Voice DNA category enum
CREATE TYPE voice_dna_category AS ENUM (
  'phrase',      -- Signature phrases
  'rhythm',      -- Speech rhythm patterns
  'teaching',    -- Teaching style patterns
  'story',       -- Story structure patterns
  'quote'        -- Memorable quotes/sayings
);

-- Question section status enum
CREATE TYPE question_section_status AS ENUM (
  'not_started',
  'in_progress',
  'complete'
);

-- Upload type enum (extends source_type concept)
CREATE TYPE upload_type AS ENUM (
  'transcript',
  'research',
  'youtube',
  'summary',
  'pdf',
  'audio',
  'other'
);

-- =============================================================================
-- NEW TABLES
-- =============================================================================

-- Voice DNA: Granular voice pattern tracking
CREATE TABLE voice_dna (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  category voice_dna_category NOT NULL,
  pattern TEXT NOT NULL,
  context VARCHAR(255),
  source_transcript_id UUID REFERENCES transcripts(id) ON DELETE SET NULL,
  frequency INTEGER DEFAULT 1,
  confidence_score DECIMAL(3,2) DEFAULT 0.50,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Voice Confidence: Track confidence per aspect
CREATE TABLE voice_confidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  aspect VARCHAR(50) NOT NULL,  -- 'signature_phrases', 'speech_rhythms', etc.
  current_score INTEGER DEFAULT 0 CHECK (current_score >= 0 AND current_score <= 100),
  target_score INTEGER DEFAULT 95 CHECK (target_score >= 0 AND target_score <= 100),
  transcripts_analyzed INTEGER DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, aspect)
);

-- Quotes: Gold quotes database
CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  quote_text TEXT NOT NULL,
  category VARCHAR(100),  -- 'Identity', 'Transformation', 'Faith', etc.
  source_transcript_id UUID REFERENCES transcripts(id) ON DELETE SET NULL,
  chapter_suggested INTEGER[],  -- Array of chapter numbers
  social_media_ready BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Characters: People/character tracker
CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  description TEXT,
  chapters_appearing INTEGER[],  -- Array of chapter numbers
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Question Sections: Group questions by section
CREATE TABLE question_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  section_name VARCHAR(100) NOT NULL,
  question_start INTEGER NOT NULL,
  question_end INTEGER NOT NULL,
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  status question_section_status DEFAULT 'not_started',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, section_name)
);

-- =============================================================================
-- ADD COLUMNS TO EXISTING TABLES
-- =============================================================================

-- Add PRD fields to chapters table
ALTER TABLE chapters
  ADD COLUMN IF NOT EXISTS part VARCHAR(100),
  ADD COLUMN IF NOT EXISTS theme TEXT,
  ADD COLUMN IF NOT EXISTS core_principle TEXT,
  ADD COLUMN IF NOT EXISTS content_percentage INTEGER DEFAULT 0 CHECK (content_percentage >= 0 AND content_percentage <= 100),
  ADD COLUMN IF NOT EXISTS key_stories TEXT[],
  ADD COLUMN IF NOT EXISTS exercises TEXT[];

-- Add PRD fields to questions table
ALTER TABLE questions
  ADD COLUMN IF NOT EXISTS section VARCHAR(100),
  ADD COLUMN IF NOT EXISTS prep_guide TEXT,
  ADD COLUMN IF NOT EXISTS memory_prompts TEXT[],
  ADD COLUMN IF NOT EXISTS starter_phrase VARCHAR(255),
  ADD COLUMN IF NOT EXISTS question_number INTEGER;

-- Add PRD fields to projects table
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE,
  ADD COLUMN IF NOT EXISTS genre VARCHAR(100),
  ADD COLUMN IF NOT EXISTS target_audience TEXT,
  ADD COLUMN IF NOT EXISTS transformation_goal TEXT,
  ADD COLUMN IF NOT EXISTS total_chapters INTEGER DEFAULT 14;

-- Add quality_score to chapter_drafts
ALTER TABLE chapter_drafts
  ADD COLUMN IF NOT EXISTS quality_score DECIMAL(3,2);

-- =============================================================================
-- INDEXES
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_voice_dna_project ON voice_dna(project_id);
CREATE INDEX IF NOT EXISTS idx_voice_dna_category ON voice_dna(category);
CREATE INDEX IF NOT EXISTS idx_voice_confidence_project ON voice_confidence(project_id);
CREATE INDEX IF NOT EXISTS idx_quotes_project ON quotes(project_id);
CREATE INDEX IF NOT EXISTS idx_quotes_category ON quotes(category);
CREATE INDEX IF NOT EXISTS idx_characters_project ON characters(project_id);
CREATE INDEX IF NOT EXISTS idx_question_sections_project ON question_sections(project_id);

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

-- Enable RLS on new tables
ALTER TABLE voice_dna ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_confidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_sections ENABLE ROW LEVEL SECURITY;

-- Voice DNA policies
CREATE POLICY "Users can view own voice_dna"
  ON voice_dna FOR SELECT
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own voice_dna"
  ON voice_dna FOR INSERT
  WITH CHECK (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own voice_dna"
  ON voice_dna FOR UPDATE
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own voice_dna"
  ON voice_dna FOR DELETE
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

-- Voice Confidence policies
CREATE POLICY "Users can view own voice_confidence"
  ON voice_confidence FOR SELECT
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own voice_confidence"
  ON voice_confidence FOR INSERT
  WITH CHECK (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own voice_confidence"
  ON voice_confidence FOR UPDATE
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own voice_confidence"
  ON voice_confidence FOR DELETE
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

-- Quotes policies
CREATE POLICY "Users can view own quotes"
  ON quotes FOR SELECT
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own quotes"
  ON quotes FOR INSERT
  WITH CHECK (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own quotes"
  ON quotes FOR UPDATE
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own quotes"
  ON quotes FOR DELETE
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

-- Characters policies
CREATE POLICY "Users can view own characters"
  ON characters FOR SELECT
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own characters"
  ON characters FOR INSERT
  WITH CHECK (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own characters"
  ON characters FOR UPDATE
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own characters"
  ON characters FOR DELETE
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

-- Question Sections policies
CREATE POLICY "Users can view own question_sections"
  ON question_sections FOR SELECT
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own question_sections"
  ON question_sections FOR INSERT
  WITH CHECK (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own question_sections"
  ON question_sections FOR UPDATE
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own question_sections"
  ON question_sections FOR DELETE
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Update characters.updated_at on change
CREATE OR REPLACE FUNCTION update_characters_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER characters_updated_at
  BEFORE UPDATE ON characters
  FOR EACH ROW
  EXECUTE FUNCTION update_characters_updated_at();

-- Update voice_confidence.last_updated on change
CREATE OR REPLACE FUNCTION update_voice_confidence_last_updated()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER voice_confidence_last_updated
  BEFORE UPDATE ON voice_confidence
  FOR EACH ROW
  EXECUTE FUNCTION update_voice_confidence_last_updated();
