# STORYFORGE: AI-Powered Book Writing System
## Product Requirements Document (PRD)
### Version 1.0 | December 2024

---

# EXECUTIVE SUMMARY

**Product Name:** StoryForge (working title)

**Vision:** Transform the way authors write transformation and memoir books by replacing blank-page paralysis with structured voice-first workflows, AI-powered content processing, and intelligent source integration.

**Tagline:** "Your voice. Your story. Your book. Finally finished."

---

# THE PROBLEM

## Primary Problem Statement

**Authors don't have a writing problem—they have an extraction and organization problem.**

Most aspiring authors, especially those writing memoirs and transformation books, face these barriers:

### 1. The Blank Page Problem
- Staring at a blank document creates paralysis
- Writing feels unnatural compared to speaking
- The pressure to write "perfectly" stops progress

### 2. The Scattered Content Problem
- Stories, insights, and ideas exist in the author's head but aren't captured
- Research lives in 47 browser tabs, highlighted books, and voice notes
- No system connects raw material to book structure

### 3. The Voice Loss Problem
- Authors hire ghostwriters and lose their authentic voice
- AI tools produce generic content that sounds like everyone else
- The final book doesn't feel like THEM

### 4. The Progress Blindness Problem
- Authors don't know how much content they actually have
- They can't see which chapters are ready vs. need more material
- No clear path from "I have ideas" to "I have a manuscript"

### 5. The Research Integration Problem
- Authors read dozens of books for research but can't connect insights to their narrative
- Valuable frameworks and quotes get lost in notes
- No way to systematically extract and apply learnings

---

## The Cost of These Problems

- **80% of people who want to write a book never start**
- **97% of people who start a book never finish**
- Average time to write a non-fiction book: 2-5 years
- Many authors pay $30,000-$100,000 for ghostwriters
- Even with ghostwriters, books often don't sound authentic

---

# THE SOLUTION

## StoryForge: Voice-First Book Writing System

StoryForge solves these problems through four integrated systems:

### 1. INTERVIEW ENGINE
Instead of writing, authors ANSWER QUESTIONS. 
- Structured question banks organized by chapter
- Voice recording with automatic transcription
- AI identifies which questions were answered and extracts content
- Progress tracking shows exactly where the book stands

### 2. SOURCE BRAIN (NotebookLM-style)
Research becomes actionable content.
- Upload any source: PDFs, YouTube, articles, podcasts, books
- AI summarizes, extracts key concepts, identifies frameworks
- Automatically generates interview questions from sources
- "Chat with your sources" to explore ideas
- Map insights directly to book chapters

### 3. VOICE GUARDIAN
Every output sounds like the author.
- Capture author's unique phrases, rhythms, and patterns
- Style guide that AI references for all writing
- Signature phrases and frameworks preserved
- Author reviews and trains the voice model over time

### 4. CHAPTER FORGE
Raw content becomes polished chapters.
- Gather all answered content for a chapter
- Apply author's voice and book structure
- Generate drafts in Story-Principle-Practice format
- Track revisions and versions

---

# TARGET USERS

## Primary Persona: "The Transformation Author"

**Demographics:**
- Age: 35-60
- Has overcome significant life challenge
- Wants to help others through their story
- May have coaching, speaking, or business platform
- Not a professional writer
- Time-constrained (business owner, professional, parent)

**Psychographics:**
- Believes their story can help others
- Frustrated by failed attempts to write
- Values authenticity over polish
- Speaks better than they write
- Willing to invest in tools that work

**Example User: Adam James**
- Runs behavioral health company
- Former bishop's son who experienced incarceration
- Writing transformation memoir
- Uses voice dictation naturally
- Has 150+ interview questions to answer
- Integrating research from 10+ books

## Secondary Personas

### "The Coach/Expert"
- Has methodology or framework to share
- Wants book for credibility and lead generation
- Content exists in courses, talks, or sessions
- Needs to organize existing material

### "The Memoirist"
- Writing personal/family story
- May have journals, letters, documents
- Needs emotional support through the process
- Authenticity is paramount

---

# CORE FEATURES SPECIFICATION

## PHASE 1: CORE MVP (Weeks 1-4)

### Feature 1.1: Project Setup

**Description:** Create a new book project with basic configuration.

**User Stories:**
- As an author, I can create a new book project with a title and description
- As an author, I can define my book's chapters/outline
- As an author, I can set my target word count and timeline

**Acceptance Criteria:**
- [ ] Create project with title, description, target word count
- [ ] Add/edit/reorder chapters
- [ ] Set target completion date
- [ ] Dashboard shows project overview

---

### Feature 1.2: Question Bank Management

**Description:** Structured interview questions organized by chapter.

**User Stories:**
- As an author, I can view all questions organized by chapter
- As an author, I can see which questions are answered/unanswered
- As an author, I can add custom questions
- As an author, I can import a question template

**Acceptance Criteria:**
- [ ] Display questions grouped by chapter
- [ ] Status indicators: Unanswered, Partial, Complete
- [ ] Filter by chapter, status, or search
- [ ] Add/edit/delete questions
- [ ] Bulk import from CSV or template
- [ ] Question count per chapter displayed

**Data Model:**
```
Question {
  id: UUID
  project_id: FK -> Project
  chapter_id: FK -> Chapter
  text: String (the question itself)
  status: Enum [unanswered, partial, complete]
  order: Integer
  source_id: FK -> Source (optional, if generated from source)
  created_at: Timestamp
  updated_at: Timestamp
}
```

---

### Feature 1.3: Voice Recording & Transcription

**Description:** Record answers and automatically transcribe.

**User Stories:**
- As an author, I can record audio answers in the app
- As an author, I can see which questions I'm answering
- As an author, I can upload pre-recorded audio files
- As an author, I receive accurate transcriptions of my recordings

**Acceptance Criteria:**
- [ ] In-app audio recording with waveform visualization
- [ ] Select questions before recording (creates context)
- [ ] Upload audio files (mp3, m4a, wav)
- [ ] Whisper API transcription with speaker labels
- [ ] Transcription accuracy > 95%
- [ ] Edit transcription after processing
- [ ] Store both audio file and transcript

**Technical Notes:**
- Use Whisper API for transcription
- Store audio in Supabase Storage / AWS S3
- Process async with job queue
- Notify user when transcription complete

**Data Model:**
```
Recording {
  id: UUID
  project_id: FK -> Project
  audio_url: String (S3/Supabase storage URL)
  duration_seconds: Integer
  status: Enum [uploading, transcribing, processed, failed]
  created_at: Timestamp
}

Transcript {
  id: UUID
  recording_id: FK -> Recording
  raw_text: Text
  processed_text: Text (after AI processing)
  word_count: Integer
  created_at: Timestamp
}
```

---

### Feature 1.4: AI Content Processing

**Description:** Claude analyzes transcripts to identify answers and extract content.

**User Stories:**
- As an author, my transcript is automatically analyzed
- As an author, I see which questions were answered in a recording
- As an author, content is automatically tagged to chapters
- As an author, I see follow-up questions for partial answers

**Acceptance Criteria:**
- [ ] AI identifies which questions were addressed
- [ ] AI marks questions as complete/partial
- [ ] AI extracts content blocks mapped to chapters
- [ ] AI generates follow-up questions for gaps
- [ ] Author can approve/edit AI mappings
- [ ] Content blocks linked to source transcript

**AI Prompt Strategy:**
```
System: You are analyzing an author's interview transcript.
Given these questions: [list]
And this transcript: [text]

Identify:
1. Which questions were answered (quote relevant sections)
2. Which were partially answered (note what's missing)
3. Which were not addressed
4. Key stories, insights, and quotes extracted
5. Which chapter each content block serves
6. Follow-up questions needed
```

**Data Model:**
```
ContentBlock {
  id: UUID
  project_id: FK -> Project
  transcript_id: FK -> Transcript
  chapter_id: FK -> Chapter
  question_id: FK -> Question (optional)
  content_type: Enum [story, insight, quote, framework, exercise]
  raw_text: Text (from transcript)
  polished_text: Text (after AI processing)
  status: Enum [extracted, reviewed, approved]
  created_at: Timestamp
}
```

---

### Feature 1.5: Progress Dashboard

**Description:** Visual tracking of book completion status.

**User Stories:**
- As an author, I see my overall book progress percentage
- As an author, I see which chapters have enough content
- As an author, I see what's needed to complete each chapter
- As an author, I see my timeline projection

**Acceptance Criteria:**
- [ ] Overall progress bar (questions answered / total)
- [ ] Per-chapter progress indicators
- [ ] "Ready to write" flags for complete chapters
- [ ] Gap analysis showing missing content
- [ ] Word count tracking
- [ ] Pace calculator (if you continue at X rate, done by Y date)

---

## PHASE 2: SOURCE BRAIN (Weeks 5-8)
### NotebookLM-Style Source Integration

### Feature 2.1: Multi-Source Upload

**Description:** Upload any content type as research sources.

**Supported Sources:**
- PDF documents (books, articles, reports)
- YouTube videos (via transcript extraction)
- Web articles (via URL)
- Audio files (podcasts, interviews)
- Images (book covers, diagrams for reference)
- Plain text / Markdown

**User Stories:**
- As an author, I can upload a PDF and have it processed
- As an author, I can paste a YouTube URL and get the transcript
- As an author, I can paste an article URL and have it scraped
- As an author, I can upload podcast audio and have it transcribed

**Acceptance Criteria:**
- [ ] Drag-and-drop file upload
- [ ] URL paste for YouTube and articles
- [ ] Progress indicator during processing
- [ ] Source library with search and filter
- [ ] Preview source content
- [ ] Delete sources

**Data Model:**
```
Source {
  id: UUID
  project_id: FK -> Project
  title: String
  source_type: Enum [pdf, youtube, article, audio, text, image]
  original_url: String (optional)
  file_url: String (storage URL for uploaded files)
  raw_content: Text (extracted text)
  summary: Text (AI-generated summary)
  key_concepts: JSONB (extracted frameworks, ideas)
  status: Enum [uploading, processing, ready, failed]
  created_at: Timestamp
}
```

---

### Feature 2.2: AI Source Processing

**Description:** Automatically analyze and summarize uploaded sources.

**For each source, AI extracts:**
- Executive summary (300 words max)
- Key concepts and frameworks
- Memorable quotes
- Actionable insights
- Relevance to author's book chapters

**User Stories:**
- As an author, I see a summary of each uploaded source
- As an author, I see key concepts extracted
- As an author, I see how the source relates to my chapters
- As an author, concepts are tagged for easy retrieval

**Acceptance Criteria:**
- [ ] Auto-generate summary on upload
- [ ] Extract 5-10 key concepts per source
- [ ] Identify relevant quotes
- [ ] Map concepts to book chapters
- [ ] Tag system for organization

**Data Model:**
```
SourceConcept {
  id: UUID
  source_id: FK -> Source
  concept_name: String
  description: Text
  quotes: JSONB (array of relevant quotes)
  chapter_ids: JSONB (array of relevant chapter IDs)
  created_at: Timestamp
}
```

---

### Feature 2.3: Question Generation from Sources

**Description:** AI generates interview questions based on source content.

**User Stories:**
- As an author, I can generate questions from any source
- As an author, generated questions are mapped to chapters
- As an author, I can approve/edit/reject generated questions
- As an author, I know which questions came from which source

**Acceptance Criteria:**
- [ ] "Generate Questions" button on each source
- [ ] AI creates 5-15 questions per source
- [ ] Questions linked to source and relevant chapter
- [ ] Review interface to approve/edit/reject
- [ ] Approved questions added to question bank

**AI Prompt Strategy:**
```
System: You are helping an author extract interview questions from research material.

The author is writing: [book description]
Their chapters are: [chapter list]

Based on this source material: [content]

Generate interview questions that will help the author:
1. Apply these concepts to their own experience
2. Tell stories that illustrate these principles
3. Connect this research to their transformation journey

For each question, specify which chapter it serves.
```

---

### Feature 2.4: Source Chat (RAG)

**Description:** Chat interface to explore sources, NotebookLM-style.

**User Stories:**
- As an author, I can ask questions about my sources
- As an author, I get answers with citations
- As an author, I can explore connections between sources
- As an author, I can save insights from chat to my book

**Acceptance Criteria:**
- [ ] Chat interface with source context
- [ ] Answers cite specific sources and pages
- [ ] Can select which sources to include in chat
- [ ] Save response as content block
- [ ] Generate questions from chat insights

**Technical Notes:**
- Use vector embeddings for semantic search
- RAG (Retrieval Augmented Generation) architecture
- Chunk sources into searchable segments
- Store embeddings in pgvector (Supabase) or Pinecone

**Data Model:**
```
SourceChunk {
  id: UUID
  source_id: FK -> Source
  content: Text
  embedding: Vector(1536) -- for semantic search
  chunk_index: Integer
  metadata: JSONB (page number, timestamp, etc.)
}

ChatSession {
  id: UUID
  project_id: FK -> Project
  created_at: Timestamp
}

ChatMessage {
  id: UUID
  session_id: FK -> ChatSession
  role: Enum [user, assistant]
  content: Text
  citations: JSONB (array of source_chunk_ids)
  created_at: Timestamp
}
```

---

## PHASE 3: VOICE GUARDIAN & CHAPTER FORGE (Weeks 9-12)

### Feature 3.1: Author Voice Profile

**Description:** Capture and preserve author's unique voice.

**Components:**
- Writing style guide (auto-generated from samples)
- Signature phrases and patterns
- Frameworks and terminology
- Tone and rhythm preferences

**User Stories:**
- As an author, I can upload sample writing to train voice
- As an author, I can add signature phrases
- As an author, I can define my frameworks
- As an author, all AI writing matches my voice

**Acceptance Criteria:**
- [ ] Upload writing samples (transcripts, blogs, etc.)
- [ ] AI extracts voice patterns
- [ ] Editable style guide
- [ ] Signature phrase library
- [ ] Framework/terminology glossary
- [ ] Voice applied to all AI outputs

**Data Model:**
```
VoiceProfile {
  id: UUID
  project_id: FK -> Project
  style_guide: Text (markdown)
  signature_phrases: JSONB (array)
  frameworks: JSONB (array of {name, description})
  tone_notes: Text
  sample_ids: JSONB (array of sample document IDs)
  updated_at: Timestamp
}
```

---

### Feature 3.2: Chapter Writing

**Description:** Generate chapter drafts from accumulated content.

**User Stories:**
- As an author, I can see when a chapter has enough content
- As an author, I can generate a chapter draft
- As an author, the draft sounds like me
- As an author, I can edit and refine drafts

**Acceptance Criteria:**
- [ ] "Ready to Write" indicator per chapter
- [ ] One-click chapter generation
- [ ] Draft uses Story-Principle-Practice structure
- [ ] Draft incorporates voice profile
- [ ] Inline editing with version history
- [ ] Export to DOCX/Google Docs

**Chapter Generation Pipeline:**
1. Gather all content blocks for chapter
2. Load voice profile and style guide
3. Load chapter outline/structure template
4. Generate draft via Claude
5. Apply formatting and structure
6. Present for author review

---

### Feature 3.3: Export & Publishing Prep

**Description:** Export completed work for editing and publishing.

**Export Formats:**
- Full manuscript (DOCX)
- Individual chapters
- Google Docs sync
- Markdown for developers

**User Stories:**
- As an author, I can export my full manuscript
- As an author, I can export individual chapters
- As an author, exports are professionally formatted

**Acceptance Criteria:**
- [ ] Export full manuscript as DOCX
- [ ] Export individual chapters
- [ ] Consistent formatting
- [ ] Table of contents generation
- [ ] Word count and page estimatesblc

---

# DATABASE SCHEMA

## Complete Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                           STORYFORGE SCHEMA                         │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    User      │       │   Project    │       │   Chapter    │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │──────<│ id (PK)      │──────<│ id (PK)      │
│ email        │       │ user_id (FK) │       │ project_id   │
│ name         │       │ title        │       │ title        │
│ avatar_url   │       │ description  │       │ order        │
│ created_at   │       │ target_words │       │ target_words │
│ updated_at   │       │ target_date  │       │ status       │
└──────────────┘       │ status       │       │ created_at   │
                       │ created_at   │       └──────────────┘
                       └──────────────┘              │
                              │                      │
        ┌─────────────────────┼──────────────────────┼─────────────────┐
        │                     │                      │                 │
        ▼                     ▼                      ▼                 ▼
┌──────────────┐       ┌──────────────┐       ┌──────────────┐  ┌──────────────┐
│   Question   │       │   Source     │       │ ContentBlock │  │ VoiceProfile │
├──────────────┤       ├──────────────┤       ├──────────────┤  ├──────────────┤
│ id (PK)      │       │ id (PK)      │       │ id (PK)      │  │ id (PK)      │
│ project_id   │       │ project_id   │       │ project_id   │  │ project_id   │
│ chapter_id   │       │ title        │       │ chapter_id   │  │ style_guide  │
│ source_id    │       │ source_type  │       │ question_id  │  │ sig_phrases  │
│ text         │       │ file_url     │       │ transcript_id│  │ frameworks   │
│ status       │       │ raw_content  │       │ content_type │  │ tone_notes   │
│ order        │       │ summary      │       │ raw_text     │  │ updated_at   │
│ created_at   │       │ key_concepts │       │ polished_text│  └──────────────┘
└──────────────┘       │ status       │       │ status       │
        │              │ created_at   │       │ created_at   │
        │              └──────────────┘       └──────────────┘
        │                     │                      ▲
        │                     │                      │
        │                     ▼                      │
        │              ┌──────────────┐              │
        │              │ SourceChunk  │              │
        │              ├──────────────┤              │
        │              │ id (PK)      │              │
        │              │ source_id    │              │
        │              │ content      │              │
        │              │ embedding    │              │
        │              │ chunk_index  │              │
        │              └──────────────┘              │
        │                                            │
        │              ┌──────────────┐              │
        │              │  Recording   │──────────────┤
        │              ├──────────────┤              │
        │              │ id (PK)      │              │
        │              │ project_id   │       ┌──────────────┐
        │              │ audio_url    │       │  Transcript  │
        │              │ duration     │       ├──────────────┤
        │              │ status       │──────>│ id (PK)      │
        │              │ created_at   │       │ recording_id │
        │              └──────────────┘       │ raw_text     │
        │                                     │ processed    │
        │                                     │ word_count   │
        │                                     └──────────────┘
        │
        │              ┌──────────────┐       ┌──────────────┐
        └─────────────>│ QuestionLink │       │ChapterDraft  │
                       ├──────────────┤       ├──────────────┤
                       │ question_id  │       │ id (PK)      │
                       │ recording_id │       │ chapter_id   │
                       │ answered     │       │ version      │
                       └──────────────┘       │ content      │
                                              │ word_count   │
                                              │ created_at   │
                                              └──────────────┘
```

---

## SQL Schema Definition


CRE```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ENUM Types
CREATE TYPE project_status AS ENUM ('draft', 'in_progress', 'review', 'complete');
CREATE TYPE chapter_status AS ENUM ('not_started', 'in_progress', 'ready_to_write', 'drafted', 'complete');
CREATE TYPE question_status AS ENUM ('unanswered', 'partial', 'complete');
CREATE TYPE source_type AS ENUM ('pdf', 'youtube', 'article', 'audio', 'text', 'image');
CREATE TYPE source_status AS ENUM ('uploading', 'processing', 'ready', 'failed');
CREATE TYPE content_type AS ENUM ('story', 'insight', 'quote', 'framework', 'exercise', 'other');
CREATE TYPE content_status AS ENUM ('extracted', 'reviewed', 'approved', 'rejected');
CREATE TYPE recording_status AS ENUM ('uploading', 'transcribing', 'processed', 'failed');

-- Users (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects (Books)
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    target_word_count INTEGER DEFAULT 50000,
    target_completion_date DATE,
    status project_status DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chapters
CREATE TABLE public.chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    target_word_count INTEGER DEFAULT 5000,
    current_word_count INTEGER DEFAULT 0,
    order_index INTEGER NOT NULL,
    status chapter_status DEFAULT 'not_started',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sources (research materials)
CREATE TABLE public.sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    source_type source_type NOT NULL,
    original_url TEXT,
    file_url TEXT,
    raw_content TEXT,
    summary TEXT,
    key_concepts JSONB DEFAULT '[]',
    status source_status DEFAULT 'uploading',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Source Chunks (for RAG/vector search)
CREATE TABLE public.source_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID NOT NULL REFERENCES public.sources(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    embedding VECTOR(1536), -- OpenAI embedding dimension
    chunk_index INTEGER NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Questions
CREATE TABLE public.questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    chapter_id UUID REFERENCES public.chapters(id) ON DELETE SET NULL,
    source_id UUID REFERENCES public.sources(id) ON DELETE SET NULL,
    text TEXT NOT NULL,
    context_notes TEXT,
    status question_status DEFAULT 'unanswered',
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recordings
CREATE TABLE public.recordings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT,
    audio_url TEXT NOT NULL,
    duration_seconds INTEGER,
    status recording_status DEFAULT 'uploading',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transcripts
CREATE TABLE public.transcripts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recording_id UUID NOT NULL REFERENCES public.recordings(id) ON DELETE CASCADE,
    raw_text TEXT NOT NULL,
    processed_text TEXT,
    word_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Question-Recording Links (which questions were addressed in which recordings)
CREATE TABLE public.question_recordings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    recording_id UUID NOT NULL REFERENCES public.recordings(id) ON DELETE CASCADE,
    transcript_excerpt TEXT,
    confidence FLOAT DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(question_id, recording_id)
);

-- Content Blocks (extracted content mapped to chapters)
CREATE TABLE public.content_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    chapter_id UUID REFERENCES public.chapters(id) ON DELETE SET NULL,
    question_id UUID REFERENCES public.questions(id) ON DELETE SET NULL,
    transcript_id UUID REFERENCES public.transcripts(id) ON DELETE SET NULL,
    source_id UUID REFERENCES public.sources(id) ON DELETE SET NULL,
    content_type content_type DEFAULT 'other',
    raw_text TEXT NOT NULL,
    polished_text TEXT,
    status content_status DEFAULT 'extracted',
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Voice Profiles
CREATE TABLE public.voice_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    style_guide TEXT,
    signature_phrases JSONB DEFAULT '[]',
    frameworks JSONB DEFAULT '[]',
    tone_notes TEXT,
    writing_samples JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id)
);

-- Chapter Drafts (version history)
CREATE TABLE public.chapter_drafts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    content TEXT NOT NULL,
    word_count INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(chapter_id, version)
);

-- Chat Sessions (for Source Brain chat)
CREATE TABLE public.chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT DEFAULT 'New Chat',
    source_ids JSONB DEFAULT '[]', -- which sources are in context
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat Messages
CREATE TABLE public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    citations JSONB DEFAULT '[]', -- source_chunk_ids used
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_questions_project ON public.questions(project_id);
CREATE INDEX idx_questions_chapter ON public.questions(chapter_id);
CREATE INDEX idx_questions_status ON public.questions(status);
CREATE INDEX idx_sources_project ON public.sources(project_id);
CREATE INDEX idx_content_blocks_chapter ON public.content_blocks(chapter_id);
CREATE INDEX idx_source_chunks_source ON public.source_chunks(source_id);
CREATE INDEX idx_source_chunks_embedding ON public.source_chunks USING ivfflat (embedding vector_cosine_ops);

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users can only access their own data)
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view own projects" ON public.projects
    FOR ALL USING (auth.uid() = user_id);
ATE POLICY "Users can view project chapters" ON public.chapters
    FOR ALL USING (
        project_id IN (
            SELECT id FROM public.projects WHERE user_id = auth.uid()
        )
    );

-- (Similar policies for all other tables)
```

---

# BACKEND ARCHITECTURE

## Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Runtime** | Node.js 20+ | Modern, async-native, excellent AI SDK support |
| **Framework** | Next.js 14 (App Router) | Full-stack, API routes, server actions, edge-ready |
| **Database** | Supabase (PostgreSQL) | Managed, auth built-in, vector support, real-time |
| **Storage** | Supabase Storage | Integrated with auth, CDN-backed |
| **Auth** | Supabase Auth | JWT, magic links, OAuth ready |
| **AI - LLM** | Claude API (Anthropic) | Best reasoning, long context, consistent quality |
| **AI - Transcription** | Whisper API (OpenAI) | Industry-leading accuracy |
| **AI - Embeddings** | OpenAI Embeddings | Standard 1536-dim, wide compatibility |
| **Vector Search** | pgvector (Supabase) | Native PostgreSQL, no extra service |
| **Queue/Jobs** | Supabase Edge Functions + pg_cron | Serverless, integrated |
| **Hosting** | Vercel | Optimized for Next.js, global edge |

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     Next.js Frontend (React)                         │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │    │
│  │  │Dashboard │  │Questions │  │Recording │  │  Source  │            │    │
│  │  │  Page    │  │  Bank    │  │  Studio  │  │  Brain   │            │    │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘            │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                          │    │
│  │  │ Chapter  │  │  Voice   │  │  Export  │                          │    │
│  │  │  Writer  │  │ Profile  │  │  Manager │                          │    │
│  │  └──────────┘  └──────────┘  └──────────┘                          │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API LAYER                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    Next.js API Routes (/api/*)                       │    │
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐        │    │
│  │  │  /api/projects │  │ /api/questions │  │ /api/recordings│        │    │
│  │  └────────────────┘  └────────────────┘  └────────────────┘        │    │
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐        │    │
│  │  │  /api/sources  │  │   /api/chat    │  │ /api/chapters  │        │    │
│  │  └────────────────┘  └────────────────┘  └────────────────┘        │    │
│  │  ┌────────────────┐  ┌────────────────┐                            │    │
│  │  │   /api/voice   │  │  /api/export   │                            │    │
│  │  └────────────────┘  └────────────────┘                            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    ▼                 ▼                 ▼
┌──────────────────────┐  ┌──────────────────┐  ┌──────────────────────────┐
│   AI SERVICE LAYER   │  │  STORAGE LAYER   │  │   DATABASE LAYER         │
│  ┌────────────────┐  │  │  ┌────────────┐  │  │  ┌────────────────────┐  │
│  │  Claude API    │  │  │  │  Supabase  │  │  │  │    PostgreSQL      │  │
│  │  (Processing)  │  │  │  │  Storage   │  │  │  │    (Supabase)      │  │
│  └────────────────┘  │  │  │  (Files)   │  │  │  │  ┌──────────────┐  │  │
│  ┌────────────────┐  │  │  └────────────┘  │  │  │  │   pgvector   │  │  │
│  │  Whisper API   │  │  └──────────────────┘  │  │  │  (Embeddings)│  │  │
│  │ (Transcription)│  │                        │  │  └──────────────┘  │  │
│  └────────────────┘  │                        │  └────────────────────┘  │
│  ┌────────────────┐  │                        └──────────────────────────┘
│  │ OpenAI Embed   │  │
│  │  (Vectors)     │  │
│  └────────────────┘  │
└──────────────────────┘
```

---

## API Endpoints Specification

### Projects API

```typescript
// GET /api/projects
// List all projects for authenticated user
Response: {
  projects: Project[]
}

// POST /api/projects
// Create new project
Request: {
  title: string
  description?: string
  target_word_count?: number
  target_completion_date?: string
}
Response: {
  project: Project
}

// GET /api/projects/:id
// Get project with chapters and stats
Response: {
  project: Project
  chapters: Chapter[]
  stats: {
    total_questions: number
    answered_questions: number
    total_word_count: number
    completion_percentage: number
  }
}

// PATCH /api/projects/:id
// Update project
Request: Partial<Project>
Response: { project: Project }

// DELETE /api/projects/:id
// Delete project and all related data
Response: { success: boolean }
```

### Questions API

```typescript
// GET /api/projects/:id/questions
// List all questions for a project
Query: {
  chapter_id?: string
  status?: 'unanswered' | 'partial' | 'complete'
  search?: string
}
Response: {
  questions: Question[]
  counts: {
    unanswered: number
    partial: number
    complete: number
  }
}

// POST /api/projects/:id/questions
// Create new question
Request: {
  text: string
  chapter_id?: string
  order_index?: number
}
Response: { question: Question }

// POST /api/projects/:id/questions/bulk
// Import multiple questions
Request: {
  questions: Array<{
    text: string
    chapter_id?: string
  }>
}
Response: {
  created: number
  questions: Question[]
}

// PATCH /api/questions/:id
// Update question
Request: Partial<Question>
Response: { question: Question }

// DELETE /api/questions/:id
// Delete question
Response: { success: boolean }
```

### Recordings API

```typescript
// GET /api/projects/:id/recordings
// List all recordings
Response: {
  recordings: Recording[]
}

// POST /api/projects/:id/recordings
// Create recording (upload audio)
Request: FormData {
  audio: File
  title?: string
  question_ids?: string[] // questions being answered
}
Response: {
  recording: Recording
  upload_url: string // presigned URL if using direct upload
}

// GET /api/recordings/:id
// Get recording with transcript
Response: {
  recording: Recording
  transcript?: Transcript
  linked_questions: Question[]
}

// POST /api/recordings/:id/process
// Trigger AI processing of transcript
Response: {
  job_id: string
  status: 'queued'
}

// GET /api/recordings/:id/process/status
// Check processing status
Response: {
  status: 'processing' | 'complete' | 'failed'
  result?: {
    questions_answered: Array<{
      question_id: string
      confidence: number
      excerpt: string
    }>
    content_blocks: ContentBlock[]
    follow_up_questions: string[]
  }
}
```

### Sources API

```typescript
// GET /api/projects/:id/sources
// List all sources
Response: {
  sources: Source[]
}

// POST /api/projects/:id/sources
// Upload new source
Request: FormData {
  file?: File
  url?: string // for YouTube or articles
  title?: string
  source_type: SourceType
}
Response: {
  source: Source
  job_id: string // for async processing
}

// GET /api/sources/:id
// Get source with details
Response: {
  source: Source
  concepts: SourceConcept[]
  chunks_count: number
}

// POST /api/sources/:id/generate-questions
// Generate interview questions from source
Request: {
  count?: number // default 10
}
Response: {
  questions: Array<{
    text: string
    suggested_chapter_id?: string
    rationale: string
  }>
}

// DELETE /api/sources/:id
// Delete source and chunks
Response: { success: boolean }
```

### Chat API (Source Brain)

```typescript
// POST /api/projects/:id/chat
// Create new chat session
Request: {
  source_ids?: string[] // which sources to include
}
Response: {
  session: ChatSession
}

// POST /api/chat/:session_id/messages
// Send message and get AI response
Request: {
  content: string
}
Response: {
  user_message: ChatMessage
  assistant_message: ChatMessage
  citations: Array<{
    source_id: string
    source_title: string
    chunk_content: string
    relevance_score: number
  }>
}

// GET /api/chat/:session_id/messages
// Get chat history
Response: {
  messages: ChatMessage[]
}
```

### Chapters API

```typescript
// GET /api/projects/:id/chapters
// List chapters with status
Response: {
  chapters: Array<Chapter & {
    question_count: number
    answered_count: number
    content_block_count: number
    ready_to_write: boolean
  }>
}

// POST /api/projects/:id/chapters
// Create chapter
Request: {
  title: string
  description?: string
  order_index: number
  target_word_count?: number
}
Response: { chapter: Chapter }

// POST /api/chapters/:id/generate-draft
// Generate chapter draft from content
Request: {
  structure?: 'story-principle-practice' | 'custom'
  additional_instructions?: string
}
Response: {
  draft: ChapterDraft
  word_count: number
}

// GET /api/chapters/:id/drafts
// Get all draft versions
Response: {
  drafts: ChapterDraft[]
}

// PATCH /api/chapters/:id/drafts/:version
// Update draft content
Request: {
  content: string
}
Response: { draft: ChapterDraft }
```

### Voice Profile API

```typescript
// GET /api/projects/:id/voice
// Get voice profile
Response: {
  profile: VoiceProfile
}

// PATCH /api/projects/:id/voice
// Update voice profile
Request: Partial<VoiceProfile>
Response: { profile: VoiceProfile }

// POST /api/projects/:id/voice/analyze
// Analyze writing sample to extract voice patterns
Request: {
  sample_text: string
}
Response: {
  extracted_patterns: {
    signature_phrases: string[]
    tone_characteristics: string[]
    sentence_patterns: string[]
    suggested_style_guide: string
  }
}
```

### Export API

```typescript
// POST /api/projects/:id/export
// Export full manuscript or chapters
Request: {
  format: 'docx' | 'markdown' | 'pdf'
  chapters?: string[] // specific chapters, or all if omitted
  include_toc?: boolean
}
Response: {
  download_url: string
  expires_at: string
}
```

---

## Backend Service Modules

### 1. TranscriptionService

```typescript
// services/transcription.ts
export class TranscriptionService {
  
  async transcribe(audioUrl: string): Promise<TranscriptResult> {
    // 1. Download audio from storage
    // 2. Send to Whisper API
    // 3. Return formatted transcript with timestamps
  }
  
  async processWithContext(
    transcript: string, 
    questions: Question[]
  ): Promise<ProcessedTranscript> {
    // 1. Send to Claude with question context
    // 2. Identify which questions were answered
    // 3. Extract content blocks
    // 4. Generate follow-up questions
    // 5. Return structured result
  }
}
```

### 2. SourceProcessingService

```typescript
// services/source-processing.ts
export class SourceProcessingService {
  
  async processSource(source: Source): Promise<ProcessedSource> {
    switch (source.source_type) {
      case 'pdf':
        return this.processPDF(source);
      case 'youtube':
        return this.processYouTube(source);
      case 'article':
        return this.processArticle(source);
      case 'audio':
        return this.processAudio(source);
    }
  }
  
  async generateEmbeddings(sourceId: string): Promise<void> {
    // 1. Get source content
    // 2. Chunk into ~500 token segments
    // 3. Generate embeddings via OpenAI
    // 4. Store in source_chunks table
  }
  
  async semanticSearch(
    projectId: string, 
    query: string, 
    sourceIds?: string[]
  ): Promise<SearchResult[]> {
    // 1. Generate query embedding
    // 2. Vector similarity search in pgvector
    // 3. Return ranked results with context
  }
}
```

### 3. ChapterWritingService

```typescript
// services/chapter-writing.ts
export class ChapterWritingService {
  
  async generateDraft(
    chapterId: string, 
    voiceProfile: VoiceProfile,
    structure: ChapterStructure
  ): Promise<ChapterDraft> {
    // 1. Gather all content blocks for chapter
    // 2. Organize by content type (story, insight, etc.)
    // 3. Load voice profile and style guide
    // 4. Generate draft via Claude with structure template
    // 5. Return formatted draft
  }
  
  async assessReadiness(chapterId: string): Promise<ReadinessReport> {
    // 1. Count content blocks by type
    // 2. Check for required elements (story, principle, practice)
    // 3. Identify gaps
    // 4. Return readiness score and recommendations
  }
}
```

### 4. QuestionGenerationService

```typescript
// services/question-generation.ts
export class QuestionGenerationService {
  
  async generateFromSource(
    source: Source, 
    chapters: Chapter[],
    count: number = 10
  ): Promise<GeneratedQuestion[]> {
    // 1. Load source summary and key concepts
    // 2. Send to Claude with chapter context
    // 3. Generate interview questions mapped to chapters
    // 4. Return with rationale for each
  }
  
  async generateFollowUp(
    contentBlock: ContentBlock,
    originalQuestion: Question
  ): Promise<string[]> {
    // 1. Analyze partial answer
    // 2. Identify what's missing
    // 3. Generate probing follow-up questions
  }
}
```

---

# DEVELOPMENT ROADMAP

## Phase 1: Core MVP (Weeks 1-4)

**Week 1: Foundation**
- [ ] Project setup (Next.js, Supabase, Tailwind)
- [ ] Database schema creation
- [ ] Authentication flow
- [ ] Basic project CRUD

**Week 2: Question System**
- [ ] Question bank UI
- [ ] Question CRUD operations
- [ ] Bulk import functionality
- [ ] Chapter assignment

**Week 3: Recording System**
- [ ] Audio recording component
- [ ] File upload to Supabase Storage
- [ ] Whisper API integration
- [ ] Transcript display and editing

**Week 4: AI Processing**
- [ ] Claude integration for transcript analysis
- [ ] Content block extraction
- [ ] Question status updates
- [ ] Progress dashboard

## Phase 2: Source Brain (Weeks 5-8)

**Week 5: Source Upload**
- [ ] Multi-type file upload
- [ ] YouTube transcript extraction
- [ ] Article URL scraping
- [ ] Source library UI

**Week 6: Source Processing**
- [ ] PDF text extraction
- [ ] AI summarization
- [ ] Key concept extraction
- [ ] Chapter mapping

**Week 7: Vector Search**
- [ ] Embedding generation
- [ ] pgvector setup
- [ ] Semantic search API
- [ ] Search UI

**Week 8: Source Chat**
- [ ] Chat interface
- [ ] RAG implementation
- [ ] Citation display
- [ ] Save insights to content blocks

## Phase 3: Writing System (Weeks 9-12)

**Week 9: Voice Profile**
- [ ] Style guide editor
- [ ] Signature phrase management
- [ ] Writing sample analysis
- [ ] Voice pattern extraction

**Week 10: Chapter Generation**
- [ ] Readiness assessment
- [ ] Draft generation with Claude
- [ ] Structure template system
- [ ] Version history

**Week 11: Editing & Export**
- [ ] Rich text editor integration
- [ ] DOCX export
- [ ] Markdown export
- [ ] Table of contents

**Week 12: Polish & Testing**
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] Bug fixes
- [ ] Documentation

---

# SUCCESS METRICS

## Product Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Time to complete question bank | < 4 weeks | Days from start to 100% |
| Questions answered per session | 5+ | Avg per recording session |
| Source-to-questions conversion | 80%+ | Sources that generate questions |
| Chapter readiness accuracy | 90%+ | Chapters marked "ready" that need no more content |
| Voice authenticity score | 8+/10 | Author rating of draft voice match |
| Time to first draft | 50% reduction | vs. traditional writing |

## Business Metrics (Post-Launch)

| Metric | Target | 
|--------|--------|
| Weekly active users | 100+ |
| Book completion rate | 60%+ |
| User satisfaction (NPS) | 50+ |
| Referral rate | 30%+ |

---

# APPENDIX A: Claude Code Build Instructions

## Getting Started with Claude Code

```bash
# Initialize project
npx create-next-app@latest storyforge --typescript --tailwind --app --src-dir

# Install dependencies
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install @anthropic-ai/sdk openai
npm install react-audio-recorder docx mammoth
npm install lucide-react @radix-ui/react-* 
npm install zod react-hook-form

# Set up Supabase
npx supabase init
npx supabase start
```

## Project Structure

```
storyforge/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── (dashboard)/
│   │   │   ├── projects/
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── questions/
│   │   │   │   │   ├── recordings/
│   │   │   │   │   ├── sources/
│   │   │   │   │   ├── chapters/
│   │   │   │   │   └── settings/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── api/
│   │   │   ├── projects/
│   │   │   ├── questions/
│   │   │   ├── recordings/
│   │   │   ├── sources/
│   │   │   ├── chat/
│   │   │   └── chapters/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── projects/
│   │   ├── questions/
│   │   ├── recordings/
│   │   ├── sources/
│   │   └── chapters/
│   ├── lib/
│   │   ├── supabase/
│   │   ├── ai/
│   │   └── utils/
│   ├── services/
│   │   ├── transcription.ts
│   │   ├── source-processing.ts
│   │   ├── chapter-writing.ts
│   │   └── question-generation.ts
│   └── types/
│       └── index.ts
├── supabase/
│   ├── migrations/
│   └── seed.sql
└── ...config files
```

## Environment Variables

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

ANTHROPIC_API_KEY=your_claude_api_key
OPENAI_API_KEY=your_openai_api_key

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

# APPENDIX B: AI Prompt Templates

## Transcript Processing Prompt

```
You are analyzing an author interview transcript for a book project.

BOOK CONTEXT:
Title: {book_title}
Description: {book_description}

CHAPTERS:
{chapter_list}

QUESTIONS BEING ANSWERED:
{question_list}

TRANSCRIPT:
{transcript_text}

YOUR TASK:
1. Identify which questions were addressed (even partially)
2. For each addressed question:
   - Quote the relevant excerpt
   - Rate completeness (complete/partial)
   - Note what's missing if partial
3. Extract content blocks:
   - Stories (vivid personal narratives)
   - Insights (realizations, lessons learned)
   - Quotes (memorable phrases)
   - Frameworks (teaching concepts)
4. Map each content block to the most relevant chapter
5. Generate follow-up questions for gaps

OUTPUT FORMAT:
{structured_json_format}
```

## Chapter Generation Prompt

```
You are a ghostwriter helping an author create a book chapter.

AUTHOR VOICE PROFILE:
{voice_profile}

CHAPTER DETAILS:
Title: {chapter_title}
Position in book: Chapter {number} of {total}
Previous chapter summary: {prev_summary}
Next chapter preview: {next_preview}

CONTENT TO INCORPORATE:
Stories:
{stories}

Insights:
{insights}

Frameworks:
{frameworks}

STRUCTURE REQUIREMENTS:
1. STORY: Open with a vivid scene that hooks the reader
2. PRINCIPLE: Transition to the teaching/insight
3. PRACTICE: End with actionable steps for the reader

VOICE REQUIREMENTS:
- Sound conversational, like talking to a friend
- Include signature phrases: {signature_phrases}
- Use direct address ("you", "your")
- Show vulnerability without victimhood
- End on empowerment

Write the complete chapter draft (target: {word_count} words).
```

---

**END OF PRD**

*Document Version: 1.0*
*Last Updated: December 2024*
*Author: Claude (for Adam James)*
