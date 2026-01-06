# StoryForge - Complete PRD & Handoff Document
## Transform Voice Recordings into Bestselling Books
### Version 1.0 | January 6, 2026

---

# EXECUTIVE SUMMARY

**Product Name:** StoryForge

**One-Liner:** An AI-powered book writing assistant that transforms voice recordings and raw content into polished, publishable manuscripts while maintaining the author's authentic voice.

**Problem Solved:** Writing a book is overwhelming. Authors have ideas in their head but struggle to organize, structure, and write consistently. Traditional ghostwriting is expensive ($15K-$100K). Self-publishing guides focus on marketing, not the actual writing process.

**Solution:** A SaaS platform that acts as an AI ghostwriter, research assistant, and project manager—guiding authors through a structured interview process, organizing their content by chapter, learning their voice, and producing transformation-focused manuscripts.

**Target Users:**
1. First-time authors with a story to tell (memoirs, self-help)
2. Coaches/consultants turning their expertise into books
3. Business leaders building thought leadership
4. People with ADHD who have ideas but struggle with organization
5. Anyone intimidated by the blank page

**Revenue Model:**
- Freemium: 1 project, 3 chapters free
- Pro: $29/mo - Unlimited projects, voice DNA, all features
- Enterprise: $99/mo - Team collaboration, white-label option

---

# CORE FEATURES

## 1. PROJECT DASHBOARD & FILE ORGANIZATION

**What It Does:**
- Creates structured folder hierarchy for each book project
- Auto-organizes ALL uploads (transcripts, research, PDFs, voice memos)
- Shows real-time progress with visual indicators
- Never loses work—everything is saved and indexed

**Key Components:**
```
/book-projects/[project-slug]/
├── 00-PROJECT-DASHBOARD.md          # Central command center
├── 01-book-info/
│   ├── project-brief.md              # Book concept, audience, goals
│   ├── competitive-research.md       # Top 10 analysis
│   └── outline.md                    # Chapter structure
├── 02-raw-uploads/
│   ├── transcripts/                  # Voice recordings
│   ├── summaries/                    # Notes, outlines
│   ├── research/                     # PDFs, articles
│   ├── youtube/                      # Video transcripts
│   └── answers/                      # Interview responses
├── 03-chapters/
│   ├── chapter-01/
│   │   ├── content-inventory.md     # All raw material
│   │   ├── sources.md               # What feeds this chapter
│   │   ├── gaps.md                  # What's missing
│   │   └── draft.md                 # Polished chapter
├── 04-questions/
│   ├── master-question-bank.md      # All interview questions
│   └── answered/                    # Processed responses
├── 05-drafts/
│   └── manuscript-v1.md             # Combined chapters
└── 06-publishing/
    ├── beta-reader-guide.md
    └── launch-checklist.md
```

**User Experience:**
```
PROJECT DASHBOARD: Identity Theft

Overall Progress: 47% ▓▓▓▓▓░░░░░

CHAPTERS:
CH 1  ██████████ ✅ DONE
CH 2  ██████████ ✅ DONE
CH 3  ████████░░ 80%
CH 4  ░░░░░░░░░░ Ready to Draft
...

RECENT ACTIVITY:
• 2 hours ago: Uploaded voice transcript (Q36-42)
• Yesterday: Chapter 2 marked complete
• 3 days ago: Added 3 new research sources

NEXT ACTIONS:
→ Answer Q91-100 (Faith Journey)
→ Review Chapter 3 draft
→ Upload research on trauma recovery
```

---

## 2. MASTER QUESTION TRACKER

**What It Does:**
- Manages 200+ structured interview questions
- Tracks answered vs. pending questions
- Maps questions to chapters
- Generates prep guides for recording sessions

**Database Schema:**
```sql
CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id),
  question_number INTEGER,
  section VARCHAR(100),          -- "Foundation", "Bishop's Son", "Prison"
  question_text TEXT,
  status ENUM('pending', 'answered', 'processed'),
  source_file VARCHAR(255),      -- Where the answer lives
  chapter_ids INTEGER[],         -- Which chapters this feeds
  key_quotes TEXT[],             -- Gold quotes extracted
  created_at TIMESTAMP,
  answered_at TIMESTAMP
);

CREATE TABLE question_sections (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id),
  section_name VARCHAR(100),
  question_start INTEGER,
  question_end INTEGER,
  completion_percentage INTEGER,
  status ENUM('not_started', 'in_progress', 'complete')
);
```

**Visual Display:**
```
MASTER QUESTION TRACKER

| Section | Progress | Status |
|---------|----------|--------|
| Foundation (Q1-10) | ██████████ 100% | ✅ |
| Bishop's Son (Q11-25) | ██████████ 100% | ✅ |
| The Secret (Q26-35) | ██████████ 100% | ✅ |
| The Fall (Q36-60) | ██████████ 100% | ✅ |
| Prison (Q71-90) | ██████████ 100% | ✅ |
| Faith Journey (Q91-115) | ░░░░░░░░░░ 0% | ❌ NEXT |
| Rebuild (Q116-200) | ░░░░░░░░░░ 0% | ❌ |

TOTAL: 93/284 questions (33%)
```

---

## 3. INTERVIEW PREP SYSTEM

**What It Does:**
- Generates detailed question guides for recording sessions
- Provides memory prompts and scene-setting suggestions
- Suggests how to start each answer
- Creates recording checklists

**Example Output:**
```markdown
# FAITH JOURNEY INTERVIEW PREP
## Questions 91-115

## Q91: What did you believe about God BEFORE prison?

**What I'm looking for:**
The God of your childhood. The God your father preached.

**Memory prompts:**
- When you prayed as a kid, who were you talking to?
- Was God loving? Angry? Distant?
- Did you feel like you had to EARN God's love?

**Start with:** "The God I grew up with was..."

---

**RECORDING CHECKLIST:**
- [ ] Quiet space secured
- [ ] Phone on Do Not Disturb
- [ ] Water nearby
- [ ] This prep guide open
```

---

## 4. VOICE DNA LEARNING SYSTEM

**What It Does:**
- Analyzes every transcript to learn the author's speech patterns
- Extracts signature phrases, rhythms, teaching style
- Builds a "Voice DNA" profile that improves over time
- Uses this to write chapters that sound authentic

**Voice DNA Components:**

| Component | What We Capture | Example |
|-----------|-----------------|---------|
| Signature Phrases | Repeated expressions | "Man," "I tell you," "See, the thing is..." |
| Speech Rhythms | Sentence patterns | Short punch + long explanation |
| Teaching Style | How they explain concepts | Etymology breakdowns, analogies |
| Story Structure | How they tell stories | Scene → Dialogue → Emotion → Lesson |
| Powerful Quotes | Memorable lines | "Knowledge without action is just an insight" |

**Database Schema:**
```sql
CREATE TABLE voice_dna (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id),
  category ENUM('phrase', 'rhythm', 'teaching', 'story', 'quote'),
  pattern TEXT,
  context VARCHAR(255),
  source_transcript VARCHAR(255),
  frequency INTEGER DEFAULT 1,
  confidence_score DECIMAL(3,2),
  created_at TIMESTAMP
);

CREATE TABLE voice_confidence (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id),
  aspect VARCHAR(50),           -- "signature_phrases", "speech_rhythms", etc.
  current_score INTEGER,        -- 0-100
  target_score INTEGER,
  transcripts_analyzed INTEGER,
  last_updated TIMESTAMP
);
```

**Voice Confidence Dashboard:**
```
VOICE CONFIDENCE SCORE: 82%

| Aspect | Score | Target |
|--------|-------|--------|
| Signature phrases | 90% | 95% |
| Speech rhythms | 85% | 90% |
| Story structure | 90% | 95% |
| Teaching voice | 85% | 90% |
| Emotional vulnerability | 80% | 85% |
| Theological voice | 85% | 90% |

Transcripts Analyzed: 15
Goal: 95%+ by manuscript completion
```

---

## 5. CHAPTER STATUS TRACKING

**What It Does:**
- Tracks completion status of every chapter
- Shows what content is available for each chapter
- Identifies gaps and what questions need answering
- Determines when chapters are "ready to draft"

**Chapter Status States:**
1. **Not Started** (0%) - No content yet
2. **Content Building** (1-79%) - Gathering material
3. **Ready to Draft** (80-99%) - Enough content to write
4. **Draft Complete** - First draft done
5. **Publication Ready** - Final, polished chapter

**Database Schema:**
```sql
CREATE TABLE chapters (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id),
  chapter_number INTEGER,
  title VARCHAR(255),
  part VARCHAR(100),             -- "Part I: The Theft"
  theme TEXT,
  core_principle TEXT,
  status ENUM('not_started', 'building', 'ready', 'drafted', 'complete'),
  content_percentage INTEGER,
  word_count INTEGER,
  file_path VARCHAR(255),
  key_stories TEXT[],
  exercises TEXT[],
  created_at TIMESTAMP,
  completed_at TIMESTAMP
);

CREATE TABLE chapter_content (
  id SERIAL PRIMARY KEY,
  chapter_id INTEGER REFERENCES chapters(id),
  content_type ENUM('story', 'principle', 'exercise', 'quote', 'research'),
  content TEXT,
  source_file VARCHAR(255),
  source_question INTEGER,
  added_at TIMESTAMP
);
```

---

## 6. CONTENT INGESTION ENGINE

**What It Does:**
- Accepts ANY content type (voice, PDF, YouTube, websites, notes)
- Auto-categorizes and saves to correct folder
- Analyzes content and extracts relevant pieces
- Updates chapter inventories automatically
- Generates follow-up questions based on gaps

**Supported Content Types:**
- Voice recordings/transcripts
- PDFs and documents
- YouTube transcript URLs
- Website URLs (for research)
- Raw text/notes
- Images with text

**Processing Pipeline:**
```
USER UPLOADS CONTENT
        ↓
┌─────────────────────────┐
│ 1. SAVE ORIGINAL        │
│    /02-raw-uploads/     │
│    with timestamp       │
└─────────────────────────┘
        ↓
┌─────────────────────────┐
│ 2. ANALYZE CONTENT      │
│    - Extract topics     │
│    - Find key quotes    │
│    - Identify stories   │
│    - Note citations     │
└─────────────────────────┘
        ↓
┌─────────────────────────┐
│ 3. MAP TO CHAPTERS      │
│    - Which chapters?    │
│    - What content type? │
└─────────────────────────┘
        ↓
┌─────────────────────────┐
│ 4. UPDATE INVENTORIES   │
│    - Chapter content    │
│    - Sources.md         │
│    - Progress %         │
└─────────────────────────┘
        ↓
┌─────────────────────────┐
│ 5. GENERATE FOLLOW-UPS  │
│    - Gap questions      │
│    - Clarifications     │
└─────────────────────────┘
        ↓
SHOW USER CONFIRMATION
```

**User Sees:**
```
✅ CONTENT SAVED & ORGANIZED

Original File:
   /transcripts/20260106-143022_faith_journey_q91-100.txt

Analysis:
   - Topics: Faith deconstruction, childhood beliefs, spiritual transformation
   - Assigned to: Chapter 7, Chapter 13
   - Stories Found: 3 personal narratives
   - Quotes Extracted: 8 powerful lines

Updates Made:
   ✓ Added to Chapter 7 content inventory
   ✓ Added to Chapter 13 content inventory
   ✓ Updated project dashboard
   ✓ Generated 3 follow-up questions

Progress:
   - Chapter 7: 60% → 85% (+25%)
   - Chapter 13: 50% → 72% (+22%)

View Dashboard →
```

---

## 7. AI GHOSTWRITING ENGINE

**What It Does:**
- Writes chapters using Voice DNA profile
- Follows Story → Principle → Practice structure
- Maintains author's authentic voice
- Runs quality checklist before delivering

**Chapter Template Structure:**
```markdown
# CHAPTER [X]: [TITLE]
## [SUBTITLE/THEME]

### PART 1: THE STORY
[Vivid personal scene with sensory details]
[Dialogue and real tension]
[Named emotions]

### PART 2: THE PRINCIPLE
[Core framework or insight]
[Etymology if relevant]
[Research/psychological backing]

### PART 3: THE PRACTICE
[Actionable exercise]
[Reflection questions]
[How reader knows they've progressed]

---

## READER EXERCISE: [TITLE]
[Specific instructions]
[Journal prompts]
[Action steps]
```

**Quality Checklist (AI runs before delivery):**
- [ ] Would the author actually say this out loud?
- [ ] At least one specific story with sensory details?
- [ ] Teaching moment with etymology or framework?
- [ ] Moment of vulnerability or self-correction?
- [ ] Ends with empowerment, not victimhood?
- [ ] Direct address to reader at least 3 times?
- [ ] Signature phrases used naturally?

---

## 8. COMPETITIVE ANALYSIS ENGINE

**What It Does:**
- Analyzes top 10 books in the author's niche
- Extracts 3-star Amazon reviews (most actionable feedback)
- Identifies market gaps the new book can fill
- Generates positioning recommendations

**Output:**
```
COMPETITIVE ANALYSIS: Identity/Self-Help Niche

TOP 10 ANALYZED:
1. The Gifts of Imperfection - Brené Brown
2. Daring Greatly - Brené Brown
3. The Four Agreements - Don Miguel Ruiz
...

COMMON COMPLAINTS (3-star reviews):
❌ Too repetitive and padded
❌ Not enough actionable steps
❌ Generic examples, not relatable
❌ Too focused on women/privileged audiences
❌ Missing diverse perspectives

YOUR OPPORTUNITY:
✅ Concise, no padding
✅ Exercises EVERY chapter
✅ Real stories (incarceration, faith, business)
✅ Diverse audience appeal
✅ Male perspective in self-help space
```

---

## 9. GOLD QUOTES DATABASE

**What It Does:**
- Extracts memorable, quotable lines from transcripts
- Categorizes by theme
- Suggests where to use in chapters
- Can export for social media/marketing

**Database Schema:**
```sql
CREATE TABLE quotes (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id),
  quote_text TEXT,
  category VARCHAR(100),        -- "Identity", "Transformation", "Faith"
  source_transcript VARCHAR(255),
  chapter_suggested INTEGER[],
  social_media_ready BOOLEAN,
  created_at TIMESTAMP
);
```

**Example Display:**
```
GOLD QUOTES DATABASE

ON IDENTITY:
• "If I can erase your identity, I can erase your power."
• "It's not about who you can become—it's who you always been."
• "I don't fix people. I just clean their glasses."

ON TRANSFORMATION:
• "Knowledge without action is just an insight."
• "What died is I had to earn love. What was born is that I am love already."

ON FAITH:
• "The kingdom of God is the power of interpretation."
• "If your God can't handle your questions, maybe it's not God you're worshipping."

[Export for Social Media →]
```

---

## 10. CHARACTER/PEOPLE TRACKER

**What It Does:**
- Tracks all people mentioned in the book
- Notes their role and which chapters they appear in
- Ensures consistency in how they're described
- Flags if important people are underused

**Example:**
```
KEY CHARACTERS

| Character | Role | Chapters | Notes |
|-----------|------|----------|-------|
| Bishop William Morgan James | Father, legacy source | 1, 10, 13 | Complex, passed 25 years ago |
| Phil, Terry, MJ | Loyal friends | 4-5 | Only 3 who stayed |
| Leroy | Prison mentor | 6-7 | Gang member, gave shoes |
| Nathan | Pastor friend | 4 | Normalized the crime decision |
```

---

# TECHNICAL ARCHITECTURE

## Tech Stack

**Frontend:**
- Next.js 14+ (App Router)
- React 18+
- Tailwind CSS + shadcn/ui
- TypeScript

**Backend:**
- Next.js API routes
- PostgreSQL database (via Supabase)
- Supabase Auth

**AI/ML:**
- Claude API (Anthropic) for:
  - Content analysis
  - Voice DNA learning
  - Chapter generation
  - Question answering
- Whisper API for voice transcription
- OpenAI Embeddings for semantic search
- pgvector for vector storage

**Storage:**
- Supabase Storage for files

**Deployment:**
- Vercel for frontend/backend
- Supabase for database

---

## Database Schema (Complete)

```sql
-- CORE TABLES

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  plan ENUM('free', 'pro', 'enterprise') DEFAULT 'free',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  genre VARCHAR(100),
  target_audience TEXT,
  transformation_goal TEXT,
  total_chapters INTEGER DEFAULT 14,
  status ENUM('planning', 'writing', 'editing', 'complete') DEFAULT 'planning',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  chapter_number INTEGER NOT NULL,
  title VARCHAR(255),
  part VARCHAR(100),
  theme TEXT,
  core_principle TEXT,
  status ENUM('not_started', 'building', 'ready', 'drafted', 'complete') DEFAULT 'not_started',
  content_percentage INTEGER DEFAULT 0,
  word_count INTEGER DEFAULT 0,
  key_stories TEXT[],
  exercises TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  question_number INTEGER,
  section VARCHAR(100),
  question_text TEXT NOT NULL,
  prep_guide TEXT,
  memory_prompts TEXT[],
  starter_phrase VARCHAR(255),
  status ENUM('pending', 'answered', 'processed') DEFAULT 'pending',
  answered_at TIMESTAMP,
  UNIQUE(project_id, question_number)
);

CREATE TABLE question_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  section_name VARCHAR(100),
  question_start INTEGER,
  question_end INTEGER,
  completion_percentage INTEGER DEFAULT 0,
  status ENUM('not_started', 'in_progress', 'complete') DEFAULT 'not_started'
);

CREATE TABLE answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES questions(id),
  transcript TEXT,
  processed_content TEXT,
  key_quotes TEXT[],
  chapter_mappings INTEGER[],
  file_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  upload_type ENUM('transcript', 'research', 'youtube', 'summary', 'other'),
  original_filename VARCHAR(255),
  stored_path VARCHAR(255),
  content_text TEXT,
  analysis JSONB,
  chapter_mappings INTEGER[],
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE voice_dna (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  category ENUM('phrase', 'rhythm', 'teaching', 'story', 'quote'),
  pattern TEXT NOT NULL,
  context VARCHAR(255),
  source_upload UUID REFERENCES uploads(id),
  frequency INTEGER DEFAULT 1,
  confidence_score DECIMAL(3,2) DEFAULT 0.50,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE voice_confidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  aspect VARCHAR(50),
  current_score INTEGER DEFAULT 0,
  target_score INTEGER DEFAULT 95,
  transcripts_analyzed INTEGER DEFAULT 0,
  last_updated TIMESTAMP DEFAULT NOW()
);

CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  quote_text TEXT NOT NULL,
  category VARCHAR(100),
  source_upload UUID REFERENCES uploads(id),
  chapter_suggested INTEGER[],
  social_media_ready BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  description TEXT,
  chapters_appearing INTEGER[],
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE chapter_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID REFERENCES chapters(id),
  content_type ENUM('story', 'principle', 'exercise', 'quote', 'research'),
  content TEXT,
  source_upload UUID REFERENCES uploads(id),
  source_question UUID REFERENCES questions(id),
  added_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID REFERENCES chapters(id),
  version INTEGER DEFAULT 1,
  content TEXT,
  word_count INTEGER,
  quality_score DECIMAL(3,2),
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## API Endpoints

```
# PROJECTS
POST   /api/projects                    # Create new project
GET    /api/projects                    # List user's projects
GET    /api/projects/:id                # Get project details
PUT    /api/projects/:id                # Update project
DELETE /api/projects/:id                # Delete project
GET    /api/projects/:id/dashboard      # Get dashboard data

# CHAPTERS
GET    /api/projects/:id/chapters       # List all chapters
GET    /api/chapters/:id                # Get chapter details
PUT    /api/chapters/:id                # Update chapter
POST   /api/chapters/:id/draft          # Generate AI draft
GET    /api/chapters/:id/content        # Get chapter content inventory

# QUESTIONS
GET    /api/projects/:id/questions      # List all questions
GET    /api/questions/:id               # Get question with prep guide
POST   /api/questions/:id/answer        # Submit answer
GET    /api/projects/:id/questions/next # Get next unanswered question

# UPLOADS
POST   /api/projects/:id/uploads        # Upload content
GET    /api/projects/:id/uploads        # List uploads
GET    /api/uploads/:id                 # Get upload details
DELETE /api/uploads/:id                 # Delete upload

# VOICE DNA
GET    /api/projects/:id/voice-dna      # Get voice profile
POST   /api/projects/:id/voice-dna/analyze  # Analyze new transcript

# QUOTES
GET    /api/projects/:id/quotes         # List quotes
POST   /api/quotes                      # Add quote
GET    /api/projects/:id/quotes/export  # Export for social media

# AI ACTIONS
POST   /api/ai/analyze-content          # Analyze uploaded content
POST   /api/ai/generate-chapter         # Generate chapter draft
POST   /api/ai/generate-prep-guide      # Create interview prep
POST   /api/ai/extract-quotes           # Extract quotes from transcript
POST   /api/ai/transcribe               # Transcribe audio file
```

---

# USER INTERFACE WIREFRAMES

## 1. Dashboard (Home)

```
┌────────────────────────────────────────────────────────────┐
│  [Logo]  StoryForge               [Projects ▼] [Profile ▼] │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Identity Theft: Reclaiming Who I Am                       │
│  ────────────────────────────────────────────────────      │
│                                                            │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │ Overall Progress │  │  Questions       │               │
│  │                  │  │                  │               │
│  │   ████████░░     │  │   93/284         │               │
│  │      47%         │  │   answered       │               │
│  └──────────────────┘  └──────────────────┘               │
│                                                            │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │ Chapters Ready   │  │  Voice DNA       │               │
│  │                  │  │                  │               │
│  │   6/14           │  │   82%            │               │
│  │   to draft       │  │   confidence     │               │
│  └──────────────────┘  └──────────────────┘               │
│                                                            │
│  RECOMMENDED NEXT ACTION                                   │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Answer Faith Journey Questions (Q91-115)           │  │
│  │  This will unlock Chapters 7, 8, and 13             │  │
│  │                                                      │  │
│  │  [Start Recording →]  [View Prep Guide]             │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                            │
│  CHAPTER STATUS                                            │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ Ch 1  ████████████████████  ✅ Complete             │  │
│  │ Ch 2  ████████████████████  ✅ Complete             │  │
│  │ Ch 3  ████████████████████  ✅ Complete             │  │
│  │ Ch 4  ████████████████░░░░  Ready to Draft          │  │
│  │ Ch 5  ████████████████░░░░  Ready to Draft          │  │
│  │ Ch 6  ████████████████░░░░  Ready to Draft          │  │
│  │ Ch 7  ████████████░░░░░░░░  60% - Needs Q91-100     │  │
│  │ ...                                                  │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                            │
│  RECENT ACTIVITY                                           │
│  • 2 hours ago: Uploaded voice transcript                  │
│  • Yesterday: Chapter 3 marked complete                    │
│  • 3 days ago: Generated interview prep for Q91-115        │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

## 2. Question Interview Page

```
┌────────────────────────────────────────────────────────────┐
│  [← Back]   Faith Journey (Q91-115)        [Skip] [Save]  │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Question 91 of 115                    ░░░░░░░░░░ 0%      │
│                                                            │
│  ┌─────────────────────────────────────────────────────┐  │
│  │                                                      │  │
│  │  What did you believe about God BEFORE prison?      │  │
│  │                                                      │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                            │
│  MEMORY PROMPTS                                            │
│  • When you prayed as a kid, who were you talking to?     │
│  • Was God loving? Angry? Distant?                        │
│  • Did you feel like you had to EARN God's love?          │
│                                                            │
│  START WITH: "The God I grew up with was..."              │
│                                                            │
│  ┌─────────────────────────────────────────────────────┐  │
│  │                                                      │  │
│  │        [Record Audio]    [Type Answer]              │  │
│  │                                                      │  │
│  │   ─────────────────────────────────────────────     │  │
│  │   Or drag & drop a file here                        │  │
│  │                                                      │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                            │
│  This question feeds: Chapter 7, Chapter 13               │
│                                                            │
│  [← Previous]              [Next Question →]              │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

## 3. Upload & Process Page

```
┌────────────────────────────────────────────────────────────┐
│  [← Back]   Upload Content                                │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌─────────────────────────────────────────────────────┐  │
│  │                                                      │  │
│  │     Drag & drop files here                          │  │
│  │                                                      │  │
│  │     or click to browse                               │  │
│  │                                                      │  │
│  │     Supported: .mp3, .m4a, .pdf, .docx, .txt        │  │
│  │                                                      │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                            │
│  Or paste a URL:                                           │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ https://youtube.com/watch?v=...                     │  │
│  └─────────────────────────────────────────────────────┘  │
│  [Import from YouTube]                                     │
│                                                            │
│  ───────────────────────────────────────────────────────  │
│                                                            │
│  PROCESSING: faith_journey_transcript.mp3                  │
│                                                            │
│  ✅ Uploaded                                               │
│  ✅ Transcribed                                            │
│  ⏳ Analyzing content...                                   │
│  ○ Mapping to chapters                                     │
│  ○ Extracting quotes                                       │
│  ○ Updating dashboard                                      │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

## 4. Voice DNA Profile

```
┌────────────────────────────────────────────────────────────┐
│  [← Back]   Voice DNA Profile                             │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  OVERALL CONFIDENCE: 82%                                   │
│  ████████████████░░░░                                      │
│  Transcripts analyzed: 15 | Goal: 95%                      │
│                                                            │
│  ───────────────────────────────────────────────────────  │
│                                                            │
│  BREAKDOWN                                                 │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Signature Phrases  ████████████████████░░  90%      │ │
│  │ Speech Rhythms     █████████████████░░░░░  85%      │ │
│  │ Story Structure    ████████████████████░░  90%      │ │
│  │ Teaching Voice     █████████████████░░░░░  85%      │ │
│  │ Vulnerability      ████████████████░░░░░░  80%      │ │
│  │ Theological Voice  █████████████████░░░░░  85%      │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ───────────────────────────────────────────────────────  │
│                                                            │
│  SIGNATURE PHRASES DETECTED                                │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ "Man," (exclamation)                    │ 47 uses   │ │
│  │ "I tell you"                            │ 31 uses   │ │
│  │ "See, the thing is..."                  │ 28 uses   │ │
│  │ "Do you see what I'm saying?"           │ 24 uses   │ │
│  │ "Let me be transparent..."              │ 19 uses   │ │
│  │ "That did something to me"              │ 15 uses   │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  STORY STRUCTURE PATTERN                                   │
│  1. Set scene with sensory details                        │
│  2. Include actual dialogue                                │
│  3. Name the emotion felt                                  │
│  4. State the lesson/insight                               │
│  5. Connect to reader's life                               │
│                                                            │
│  TOP QUOTES                                                │
│  • "If I can erase your identity, I can erase your power."│
│  • "Knowledge without action is just an insight."          │
│  • "The kingdom of God is within you."                     │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

# IMPLEMENTATION ROADMAP

## Phase 1: MVP (4-6 weeks)
**Goal: Core book writing flow works end-to-end**

- [ ] User authentication (Supabase Auth)
- [ ] Project creation with basic info
- [ ] Chapter structure setup (14 chapters default)
- [ ] Question bank with manual tracking
- [ ] File upload (transcripts only)
- [ ] Basic AI analysis (Claude API)
- [ ] Simple dashboard with progress

**Deliverable:** User can create project, answer questions, upload transcripts, see progress

---

## Phase 2: Voice DNA (3-4 weeks)
**Goal: AI learns author's voice**

- [ ] Transcript analysis pipeline
- [ ] Voice DNA extraction algorithm
- [ ] Pattern database and frequency tracking
- [ ] Voice confidence scoring
- [ ] AI-generated chapters using Voice DNA

**Deliverable:** System writes chapters that sound like the author

---

## Phase 3: Content Intelligence (3-4 weeks)
**Goal: Smart content organization**

- [ ] Multi-type content ingestion (PDF, YouTube, etc.)
- [ ] Auto-categorization by chapter
- [ ] Gap analysis and recommendations
- [ ] Quote extraction and categorization
- [ ] Interview prep guide generation

**Deliverable:** All content automatically organized and analyzed

---

## Phase 4: Polish & Scale (2-3 weeks)
**Goal: Production-ready**

- [ ] Competitive analysis feature
- [ ] Beta reader export
- [ ] Manuscript assembly
- [ ] Payment integration (Stripe)
- [ ] Performance optimization
- [ ] Mobile responsive design

**Deliverable:** Ready for public launch

---

# UNIQUE VALUE PROPOSITIONS

1. **Voice DNA Learning** - No other tool learns your speech patterns to this depth
2. **Structured Interview Process** - 200+ questions guide you through your entire book
3. **Progress Accountability** - Can't skip ahead until chapters have enough content
4. **RAG-Powered Context** - AI always has full context of your entire book
5. **Market Gap Analysis** - Built-in competitive research
6. **Story → Principle → Practice** - Proven chapter structure for transformation books

---

# KEY FILES REFERENCE

- `storyforge/docs/StoryForge_PRD.md` - This document (full feature spec)
- `storyforge/src/types/database.ts` - TypeScript types
- `storyforge/supabase/migrations/` - Database schema
- `storyforge/src/app/api/` - API endpoints
- `storyforge/src/components/` - UI components

---

*This PRD captures the complete vision for StoryForge. The system should feel like having a patient, organized ghostwriter who never loses your work and always knows exactly where you are in the process.*
