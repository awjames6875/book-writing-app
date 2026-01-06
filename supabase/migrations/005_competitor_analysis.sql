-- Migration: Add Competitive Analysis Engine tables
-- Tables: competitor_books, competitor_reviews

-- =============================================================================
-- NEW TABLES
-- =============================================================================

-- Competitor Books: Track competing books for market analysis
CREATE TABLE competitor_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  author VARCHAR(255),
  amazon_url TEXT,
  analysis_summary TEXT,
  pain_points TEXT[],
  missing_topics TEXT[],
  reader_expectations TEXT[],
  differentiation_recommendations TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Competitor Reviews: Store individual reviews for analysis
CREATE TABLE competitor_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES competitor_books(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  pain_points TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- INDEXES
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_competitor_books_project ON competitor_books(project_id);
CREATE INDEX IF NOT EXISTS idx_competitor_reviews_book ON competitor_reviews(book_id);

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

-- Enable RLS on new tables
ALTER TABLE competitor_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitor_reviews ENABLE ROW LEVEL SECURITY;

-- Competitor Books policies
CREATE POLICY "Users can view own competitor_books"
  ON competitor_books FOR SELECT
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own competitor_books"
  ON competitor_books FOR INSERT
  WITH CHECK (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own competitor_books"
  ON competitor_books FOR UPDATE
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own competitor_books"
  ON competitor_books FOR DELETE
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

-- Competitor Reviews policies (access through book ownership)
CREATE POLICY "Users can view own competitor_reviews"
  ON competitor_reviews FOR SELECT
  USING (
    book_id IN (
      SELECT cb.id FROM competitor_books cb
      JOIN projects p ON p.id = cb.project_id
      WHERE p.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own competitor_reviews"
  ON competitor_reviews FOR INSERT
  WITH CHECK (
    book_id IN (
      SELECT cb.id FROM competitor_books cb
      JOIN projects p ON p.id = cb.project_id
      WHERE p.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own competitor_reviews"
  ON competitor_reviews FOR UPDATE
  USING (
    book_id IN (
      SELECT cb.id FROM competitor_books cb
      JOIN projects p ON p.id = cb.project_id
      WHERE p.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own competitor_reviews"
  ON competitor_reviews FOR DELETE
  USING (
    book_id IN (
      SELECT cb.id FROM competitor_books cb
      JOIN projects p ON p.id = cb.project_id
      WHERE p.user_id = auth.uid()
    )
  );
