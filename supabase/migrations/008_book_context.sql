-- Add book_context JSONB field to projects table
-- Stores structured context about the book for AI to generate better questions

ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS book_context jsonb DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.projects.book_context IS 'Structured book context: {book_type, target_reader, transformation, main_message, why_you}';
