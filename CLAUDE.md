# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Current Project Status

**The `storyforge/` directory contains a bare Next.js 16 scaffold.** Core features are not yet implemented.

### What's Installed
- Next.js 16.0.10, React 19.2.1, TypeScript 5
- Tailwind CSS 4 (styling)
- ESLint 9 (linting)

### What's NOT Yet Installed
Before implementing features, install these dependencies (see Quick Start Commands below):
- Supabase client (`@supabase/supabase-js`, `@supabase/auth-helpers-nextjs`)
- AI APIs (`@anthropic-ai/sdk`, `openai`)
- Form handling (`zod`, `react-hook-form`)
- UI components (`lucide-react`, shadcn/ui)
- File handling (`react-dropzone`)

---

## Project Overview

**StoryForge** is an AI-powered book writing system designed to help authors (particularly memoir and transformation book writers) overcome the blank page problem. The app uses voice-first workflows, AI content processing, and intelligent source integration to guide authors from ideas to finished manuscripts.

**Key Philosophy**: Authors don't have a writing problem—they have an extraction and organization problem. The system helps surface, organize, and synthesize their existing knowledge into book chapters.

---

## Quick Start: Local Development Setup

```bash
# 1. Navigate to project
cd storyforge

# 2. Install core feature dependencies (not yet done)
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs @supabase/ssr
npm install @anthropic-ai/sdk openai
npm install zod react-hook-form @hookform/resolvers
npm install lucide-react
npm install react-dropzone

# 3. Set up shadcn UI components (initialize + add specific components)
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input textarea dialog tabs toast

# 4. Create .env.local file at project root
# See "Environment Variables" section below for required keys

# 5. Set up Supabase locally (requires Supabase CLI)
npx supabase init     # One-time setup
npx supabase start    # Start emulator (separate terminal)

# 6. Run development server (separate terminal)
npm run dev
# App runs on http://localhost:3000
```

**Note**: Steps 2-3 are not yet completed. Install them as you begin implementing features.

---

## Development Commands

```bash
# Navigate to storyforge directory first
cd storyforge

# Development
npm run dev              # Start Next.js dev server (http://localhost:3000)
npm run build            # Build for production
npm run start            # Start production server (after build)
npm run lint             # Run ESLint

# Database (requires Supabase CLI installed globally)
npx supabase init        # Initialize Supabase locally (one-time setup)
npx supabase start       # Start Supabase emulator
npx supabase stop        # Stop Supabase
npx supabase status      # Check Supabase status
npx supabase db reset    # Reset local database to migrations
```

---

## Environment Variables

Create a `.env.local` file at `storyforge/.env.local`:

```env
# Supabase (for local development, these come from `npx supabase start`)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# API Keys (get from respective services)
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...

# App configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Getting Supabase Keys**: Run `npx supabase start` and keys will be printed to console. Copy `ANON_KEY` and `SERVICE_ROLE_KEY`.

---

## Project Configuration

### TypeScript Path Aliases
The project uses `@/*` to import from `src/`:
```typescript
// Instead of: import { foo } from '../../../lib/utils'
import { foo } from '@/lib/utils'  // Cleaner!
```
This is configured in `storyforge/tsconfig.json` and Next.js handles it automatically.

---

## Architecture Overview

### High-Level System Design

StoryForge is a full-stack Next.js application with four integrated subsystems:

1. **Interview Engine**: Voice recording + transcription → content extraction
2. **Source Brain**: Upload research → AI processing → RAG chat interface
3. **Voice Guardian**: Capture author's unique voice → apply to all outputs
4. **Chapter Forge**: Gather content → generate polished drafts with author's voice

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + TypeScript + Tailwind CSS | Interactive UI components |
| **Framework** | Next.js 14 (App Router) | Full-stack with API routes and server actions |
| **Database** | Supabase (PostgreSQL) | Managed database with auth, storage, vector support |
| **Auth** | Supabase Auth + JWT | User authentication and session management |
| **Storage** | Supabase Storage | Store audio files and documents |
| **LLM** | Claude API (Anthropic) | Content analysis, generation, voice processing |
| **Transcription** | Whisper API (OpenAI) | Convert audio → text with high accuracy |
| **Embeddings** | OpenAI Embeddings | Generate vectors for semantic search (1536-dim) |
| **Vector Search** | pgvector (PostgreSQL) | Semantic search in source content |
| **Hosting** | Vercel | Optimized Next.js deployment |

### Data Architecture

The system centers around **Projects** (individual books), which contain:

- **Chapters**: Structural outline of the book
- **Questions**: Interview questions organized by chapter
- **Recordings**: Audio files of author answering questions
- **Transcripts**: Text extracted from recordings
- **Content Blocks**: Extracted stories, insights, quotes, frameworks mapped to chapters
- **Sources**: Research materials (PDFs, articles, videos, podcasts)
- **Source Chunks**: Segmented source content with embeddings for RAG
- **Voice Profile**: Author's unique voice patterns, signature phrases, style guide
- **Chapter Drafts**: Versioned outputs generated from content blocks

All data is isolated per user with Supabase Row Level Security (RLS).

---

## Project Structure

```
storyforge/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── (dashboard)/                  # Protected routes
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                  # Dashboard home
│   │   │   └── projects/
│   │   │       ├── page.tsx              # List all projects
│   │   │       └── [id]/
│   │   │           ├── page.tsx          # Project dashboard
│   │   │           ├── questions/page.tsx
│   │   │           ├── record/page.tsx   # Recording studio
│   │   │           ├── sources/page.tsx  # Source library
│   │   │           ├── chat/page.tsx     # Source Brain chat
│   │   │           └── chapters/
│   │   │               ├── page.tsx
│   │   │               └── [chapterId]/page.tsx # Chapter editor
│   │   ├── api/                          # Backend API routes
│   │   │   ├── projects/route.ts         # CRUD projects
│   │   │   ├── questions/route.ts        # CRUD questions
│   │   │   ├── recordings/
│   │   │   │   ├── route.ts              # Upload, list recordings
│   │   │   │   └── [id]/process/route.ts # Transcribe + process
│   │   │   ├── sources/
│   │   │   │   ├── route.ts              # Upload sources
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts          # Get source, delete
│   │   │   │       └── generate-questions/route.ts
│   │   │   ├── chat/route.ts             # Chat endpoint
│   │   │   └── chapters/
│   │   │       ├── route.ts              # CRUD chapters
│   │   │       └── [id]/generate/route.ts # Generate draft
│   │   ├── layout.tsx
│   │   └── page.tsx                      # Home/landing
│   │
│   ├── components/
│   │   ├── ui/                           # shadcn components
│   │   ├── AudioRecorder.tsx             # Voice recording UI
│   │   ├── QuestionList.tsx              # Question bank display
│   │   ├── SourceUploader.tsx            # File upload UI
│   │   ├── SourceChat.tsx                # RAG chat interface
│   │   ├── ChapterEditor.tsx             # Draft editing
│   │   └── ProgressDashboard.tsx         # Visual progress tracking
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts                 # Browser Supabase client
│   │   │   ├── server.ts                 # Server-side Supabase client
│   │   │   └── middleware.ts             # Auth middleware
│   │   ├── ai/
│   │   │   ├── claude.ts                 # Claude API functions
│   │   │   ├── whisper.ts                # Whisper transcription
│   │   │   └── embeddings.ts             # OpenAI embeddings
│   │   └── utils.ts                      # Helper functions
│   │
│   ├── services/
│   │   ├── transcription.ts              # Transcription pipeline
│   │   ├── source-processing.ts          # Source ingestion & chunking
│   │   ├── question-generation.ts        # Question synthesis
│   │   └── chapter-writing.ts            # Draft generation
│   │
│   └── types/
│       └── database.ts                   # TypeScript types from DB schema
│
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql        # Database schema
│
└── package.json
```

---

## Database Schema

### Core Tables

**Projects** - Book metadata
```
id, user_id, title, description, target_word_count, status, created_at, updated_at
```

**Chapters** - Book structure
```
id, project_id, title, order_index, target_word_count, current_word_count, status, created_at
```

**Questions** - Interview questions
```
id, project_id, chapter_id, source_id, text, status (unanswered/partial/complete), order_index, created_at
```

**Recordings** - Audio files
```
id, project_id, title, audio_url (Supabase Storage path), duration_seconds, status, created_at
```

**Transcripts** - Text from recordings
```
id, recording_id, raw_text, word_count, created_at
```

**Sources** - Research materials
```
id, project_id, title, source_type (pdf/youtube/article/audio/text), file_url, raw_content, summary, key_concepts (JSONB), status, created_at
```

**Source Chunks** - Segmented source content for RAG
```
id, source_id, content, embedding (vector), chunk_index, created_at
```

**Content Blocks** - Extracted content mapped to chapters
```
id, project_id, chapter_id, question_id, transcript_id, content_type (story/insight/quote/framework/exercise), raw_text, polished_text, created_at
```

**Voice Profiles** - Author voice patterns
```
id, project_id, style_guide, signature_phrases (JSONB), frameworks (JSONB), tone_notes, updated_at
```

**Chapter Drafts** - Versioned chapter outputs
```
id, chapter_id, version, content, word_count, created_at
```

**Chat Sessions & Messages** - Source Brain conversations
```
chat_sessions: id, project_id, title, source_ids (JSONB), created_at
chat_messages: id, session_id, role (user/assistant), content, citations (JSONB), created_at
```

All tables have Row Level Security enabled. Users can only access their own data.

---

## API Endpoints Reference

### Projects
- `GET /api/projects` - List user's projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project with stats
- `PATCH /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Questions
- `GET /api/projects/:id/questions` - List questions (filter by chapter/status)
- `POST /api/projects/:id/questions` - Create single question
- `POST /api/projects/:id/questions/bulk` - Import multiple questions
- `PATCH /api/questions/:id` - Update question
- `DELETE /api/questions/:id` - Delete question

### Recordings
- `POST /api/projects/:id/recordings` - Upload audio file
- `GET /api/recordings/:id` - Get recording with transcript
- `POST /api/recordings/:id/process` - Trigger transcription + AI analysis
- `GET /api/recordings/:id/process/status` - Check processing status

### Sources
- `POST /api/projects/:id/sources` - Upload new source (file or URL)
- `GET /api/projects/:id/sources` - List sources
- `GET /api/sources/:id` - Get source details with concepts
- `POST /api/sources/:id/generate-questions` - Generate questions from source
- `DELETE /api/sources/:id` - Delete source

### Chat (Source Brain)
- `POST /api/projects/:id/chat` - Create chat session
- `POST /api/chat/:session_id/messages` - Send message, get RAG response
- `GET /api/chat/:session_id/messages` - Get chat history

### Chapters
- `GET /api/projects/:id/chapters` - List chapters with status
- `POST /api/projects/:id/chapters` - Create chapter
- `POST /api/chapters/:id/generate-draft` - Generate chapter from content
- `GET /api/chapters/:id/drafts` - Get all draft versions
- `PATCH /api/chapters/:id/drafts/:version` - Update draft

---

## Key Implementation Patterns

### Authentication Flow
1. Users sign up via Supabase Auth (magic link or OAuth)
2. Profile auto-created via database trigger
3. Session maintained via JWT in cookies
4. All API routes check authentication before responding

### Recording → Processing Pipeline
1. **Upload**: Audio file → Supabase Storage
2. **Transcribe**: Whisper API converts audio → text
3. **Analyze**: Claude API identifies answered questions and extracts content
4. **Store**: Content blocks created, question statuses updated
5. **Notify**: User sees results in real-time

### Source Processing Pipeline
1. **Ingest**: Upload file or URL (PDF, article, YouTube, audio, text)
2. **Extract**: Convert to text (PDF parsing, URL scraping, video transcription)
3. **Summarize**: Claude generates executive summary
4. **Chunk**: Segment content into ~500-token pieces
5. **Embed**: Generate OpenAI embeddings for semantic search
6. **Index**: Store chunks + embeddings in pgvector
7. **Generate**: Claude creates interview questions from source

### RAG Chat Implementation
1. **User query** → Generate embedding via OpenAI
2. **Vector search** in source_chunks table (pgvector)
3. **Retrieve** top-k relevant chunks
4. **Context** → Send chunks to Claude with user query
5. **Response** → Claude answers with citations back to sources

### Chapter Generation
1. **Gather** all content blocks for chapter
2. **Load** voice profile (signature phrases, style guide, tone)
3. **Organize** by type (stories, insights, frameworks, exercises)
4. **Structure** using Story-Principle-Practice template
5. **Generate** via Claude with voice profile as system context
6. **Version** save as chapter_drafts with incremental version numbers

---

## Common Development Tasks

### Adding a New API Endpoint

1. Create route file: `src/app/api/[resource]/route.ts`
2. Import Supabase client: `import { createClient } from '@/lib/supabase/server'`
3. Check auth: Routes automatically check user context via RLS
4. Handle request: Parse body, validate input with Zod
5. Interact with DB: Use supabase client
6. Return response: `NextResponse.json(data)`

**Example**:
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('projects')
    .select('*')

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ projects: data })
}
```

### Creating a New Component

1. Use shadcn components as base (Button, Card, Input, etc.)
2. Keep components focused and small
3. Use TypeScript for type safety
4. Pass data via props, not global state initially
5. Use `useCallback` for event handlers to prevent re-renders

### Calling Claude API

```typescript
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-20250514', // Use latest Claude Sonnet
  max_tokens: 4000,
  messages: [
    {
      role: 'user',
      content: 'Your prompt here...'
    }
  ]
})

const text = response.content[0].type === 'text' ? response.content[0].text : ''
```

### Generating Embeddings for Semantic Search

```typescript
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

const embedding = await openai.embeddings.create({
  model: 'text-embedding-3-small',
  input: 'Text to embed...'
})

// Store in pgvector:
await supabase.from('source_chunks').insert({
  source_id: sourceId,
  content: chunkText,
  embedding: embedding.data[0].embedding, // Pass to pgvector
  chunk_index: index
})
```

### Semantic Search with pgvector

```typescript
const { data: results } = await supabase.rpc('match_source_chunks', {
  query_embedding: queryEmbedding,
  match_count: 10,
  match_threshold: 0.7
})
```

---

## Git Workflow

The project uses Git for version control (`.git/` already initialized).

**Before Starting Work:**
1. Read the plan in `../CLAUDE.md` (parent directory) about "DO NOT BE LAZY" and simplicity-first
2. Check with the user and verify the plan before implementing
3. Create a branch or commit directly to main (based on user preference)

**While Working:**
- Make focused commits after each complete task (not just after all work is done)
- Use clear commit messages describing the "why"
- Reference which todo items are being completed

**Key Principle**: Simplicity. Every change should impact as little code as possible.

---

## Implementation Phases

The system is built in three phases:

### Phase 1: Core MVP (Interview Engine)
- Project setup with chapters/outline
- Question bank management
- Audio recording + transcription (Whisper)
- Transcript analysis with Claude (identify answered questions, extract content)
- Progress dashboard

### Phase 2: Source Brain
- Multi-type source upload (PDF, URL, YouTube, audio)
- AI source summarization and key concept extraction
- Question generation from sources
- Vector search via pgvector
- RAG chat interface ("talk to your sources")

### Phase 3: Voice Guardian & Chapter Forge
- Author voice profile (style guide, signature phrases, frameworks)
- Chapter draft generation with voice consistency
- Export to DOCX/Markdown
- Version history and editing

---

## Important Notes & Patterns

### Simplicity First
- Keep changes focused and minimal
- Avoid over-engineering features
- Don't add error handling for impossible scenarios
- Trust framework and library guarantees
- Only validate at system boundaries (user input, external APIs)

### Database Queries
- Always select specific columns when possible (avoid `SELECT *` except in simple cases)
- Use RLS for security—let Supabase enforce user boundaries
- Batch operations when possible
- Index frequently filtered columns (already done in schema)

### AI Processing
- Claude (Sonnet 4) for reasoning and content generation
- OpenAI Whisper for transcription
- OpenAI Embeddings for semantic search
- Structure prompts with clear input/output format (usually JSON)

### State Management
- Start with component state (`useState`)
- Server-side caching where possible (server components)
- Avoid global state until absolutely necessary
- Use `useCallback` to memoize event handlers in lists

### Type Safety
- Define types from DB schema in `src/types/database.ts`
- Use Zod for runtime validation of user input
- TypeScript will catch API contract mismatches

---

## Testing the Application

```bash
# Terminal 1: Start Supabase
npx supabase start

# Terminal 2: Start Next.js
npm run dev

# In browser (http://localhost:3000):
# 1. Sign up at /signup
# 2. Create project at /projects
# 3. Add questions manually or bulk import
# 4. Record audio at /projects/[id]/record
# 5. Watch AI process transcript → questions answered
# 6. Upload source at /projects/[id]/sources
# 7. Chat with sources at /projects/[id]/chat
# 8. Generate chapter draft at /projects/[id]/chapters/[id]/generate
```

---

## Relevant Documentation

- **BookWriterApp_PRD.md**: Complete product requirements with use cases and feature specs
- **StoryForge_Implementation_Guide.md**: Quick reference with code examples and setup steps

---

## Resources & Links

- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Claude API Docs](https://anthropic.com/docs)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [pgvector Docs](https://github.com/pgvector/pgvector)
- [shadcn/ui Components](https://ui.shadcn.com)
