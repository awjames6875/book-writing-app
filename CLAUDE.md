# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workflow Rules

1. Think through the problem, read relevant code, write a plan to `tasks/todo.md`
2. Get user approval before implementing
3. Mark todos as complete as you go
4. Provide high-level explanations of changes
5. Add a review section to `tasks/todo.md` when done
6. **SIMPLICITY**: Every change should impact as little code as possible
7. **NO LAZY FIXES**: Find root causes, no temporary fixes
8. Follow KISS, DRY, YAGNI principles
9. **TOOL USE SUMMARIES**: After completing a task that involves tool use, provide a quick summary of the work done
10. **IMPLEMENT BY DEFAULT**: Implement changes rather than only suggesting them. If intent is unclear, infer the most useful action and proceed using tools to discover missing details. Infer whether a tool call is intended and act accordingly.
11. **PARALLEL TOOL CALLS**: If calling multiple tools with no dependencies, make all independent calls in parallel. If calls depend on previous results, call them sequentially. Never use placeholders or guess missing parameters.
12. **NO SPECULATION**: Never speculate about code you haven't opened. Read files before answering questions about them. Investigate relevant files BEFORE answering codebase questions. Give grounded, hallucination-free answers.
13. **NO OVER-ENGINEERING**: Only make changes directly requested or clearly necessary. Keep solutions simple. Don't add features, refactoring, or improvements beyond what was asked. Don't create abstractions for one-time operations.
14. **EXPLORE BEFORE EDITING**: ALWAYS read and understand relevant files before proposing code edits. Review codebase style, conventions, and abstractions before implementing new features.
15. **GENERAL SOLUTIONS**: Write general-purpose solutions, not test-specific hacks. Don't hard-code values. If tests are incorrect, inform the user rather than working around them.
16. **STATE TRACKING**: For complex tasks, track progress in structured formats. Use git for state tracking. Focus on incremental progress - steady advances on a few things at a time.
17. **CLEAN UP**: Remove temporary files, scripts, or helper files created during iteration at the end of the task.
18. **THOROUGH RESEARCH**: For complex research, develop competing hypotheses, track confidence levels, self-critique your approach, and break down tasks systematically.

---

## Project Overview

**StoryForge** is an AI-powered book writing assistant that transforms voice recordings and raw content into polished, publishable manuscripts while maintaining the author's authentic voice.

**Full PRD**: See [storyforge/docs/StoryForge_PRD.md](storyforge/docs/StoryForge_PRD.md) for complete feature specs, database schema, API endpoints, and UI wireframes.

### Core Features (10)
1. **Project Dashboard** - Progress tracking, chapter status, next actions
2. **Master Question Tracker** - 200+ interview questions mapped to chapters
3. **Interview Prep System** - Memory prompts, starter phrases, recording checklists
4. **Voice DNA Learning** - Extract speech patterns, signature phrases, teaching style
5. **Chapter Status Tracking** - Content percentage, ready-to-draft detection
6. **Content Ingestion Engine** - Multi-type uploads (voice, PDF, YouTube, etc.)
7. **AI Ghostwriting Engine** - Generate chapters using Voice DNA
8. **Competitive Analysis** - Amazon 3-star review analysis, market gap identification
9. **Gold Quotes Database** - Extract and categorize memorable lines
10. **Character/People Tracker** - Track people mentioned across chapters

---

## Development Commands

All commands run from `storyforge/` directory:

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm run lint         # ESLint check
npm run lint -- --fix  # Auto-fix lint issues

# Supabase (separate terminal, requires Docker Desktop)
npx supabase start   # Start local emulator
npx supabase stop    # Stop emulator
npx supabase status  # Check status
npx supabase db reset  # Reset to migrations
```

---

## Environment Variables

Create `storyforge/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from npx supabase start>
SUPABASE_SERVICE_ROLE_KEY=<from npx supabase start>
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript 5, Tailwind CSS 4
- **Backend**: Next.js API routes, Supabase (PostgreSQL + Auth + Storage)
- **AI**: Claude API (content generation), OpenAI Whisper (transcription), OpenAI Embeddings (semantic search)
- **UI**: shadcn/ui components, Lucide icons

---

## Project Structure

```
storyforge/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Auth pages (login)
│   │   │   └── login/page.tsx
│   │   ├── (dashboard)/         # Protected routes
│   │   │   ├── dashboard/page.tsx
│   │   │   └── projects/
│   │   │       ├── page.tsx     # Projects list
│   │   │       └── [id]/
│   │   │           ├── page.tsx # Project detail
│   │   │           └── record/  # Recording studio
│   │   ├── api/                 # API routes
│   │   │   ├── projects/        # CRUD projects + chapters
│   │   │   ├── recordings/      # Audio upload + transcription
│   │   │   └── auth/callback/
│   │   ├── layout.tsx
│   │   ├── page.tsx             # Landing page
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                  # shadcn components
│   │   ├── AudioRecorder.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── ChapterCard.tsx
│   │   ├── QuestionSelector.tsx
│   │   └── RecordingsList.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts        # Browser client
│   │   │   ├── server.ts        # Server client
│   │   │   └── middleware.ts
│   │   ├── ai/
│   │   │   └── whisper.ts       # Transcription
│   │   └── utils.ts
│   └── types/
│       └── database.ts          # DB types
├── supabase/
│   └── migrations/
└── package.json
```

---

## Key Patterns

### API Routes

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('id, title, created_at')

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ projects: data })
}
```

### Supabase Client Usage

- **API routes**: `import { createClient } from '@/lib/supabase/server'`
- **Components**: `import { createClient } from '@/lib/supabase/client'`
- Use RLS for authorization, select specific columns

### AI APIs

**Claude**:
```typescript
import Anthropic from '@anthropic-ai/sdk'
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 2000,
  messages: [{ role: 'user', content: 'prompt' }]
})
```

**Whisper** (transcription):
```typescript
import OpenAI from 'openai'
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const transcript = await openai.audio.transcriptions.create({
  file: audioFile,
  model: 'whisper-1'
})
```

---

## Database Schema

Core tables (all have RLS enabled):

- **projects**: id, user_id, title, description, target_word_count, status
- **chapters**: id, project_id, title, order_index, target_word_count, status
- **questions**: id, project_id, chapter_id, text, status (unanswered/partial/complete)
- **recordings**: id, project_id, title, audio_url, duration_seconds, status
- **transcripts**: id, recording_id, raw_text, word_count
- **sources**: id, project_id, title, source_type, file_url, summary
- **source_chunks**: id, source_id, content, embedding (vector)
- **content_blocks**: id, project_id, chapter_id, content_type, raw_text
- **voice_profiles**: id, project_id, style_guide, signature_phrases (JSONB)
- **chapter_drafts**: id, chapter_id, version, content, word_count

---

## Naming Conventions

- **Components**: `PascalCase.tsx` (e.g., `AudioRecorder.tsx`)
- **Utils/libs**: `kebab-case.ts` (e.g., `supabase-client.ts`)
- **Variables**: `camelCase`, descriptive (e.g., `totalWordCount`)
- **Booleans**: prefix with is/has/should (e.g., `isRecording`)
- **Functions**: verb prefix (e.g., `calculateTotal`, `fetchProjects`)
- **Constants**: `UPPER_SNAKE_CASE`

Use `@/` import alias instead of relative paths.

---

## Implementation Status

### Implemented (~25%)
- Auth flow (Google OAuth via Supabase Auth)
- Dashboard with project list
- Project CRUD with chapters
- Recording studio with audio capture
- Transcription via Whisper API
- Question bank management
- Basic progress stats

### Not Yet Implemented
- Voice DNA System (pattern extraction, confidence scoring)
- Content Ingestion Engine (PDF, YouTube, multi-type processing)
- Gold Quotes Database
- Character/People Tracker
- Competitive Analysis Engine
- Interview Prep System (memory prompts, starter phrases)
- AI Ghostwriting Engine (chapter generation with Voice DNA)
- RAG Chat Interface ("talk to your sources")
- Manuscript Assembly
- Content Block Mapping (auto-map to chapters)
- Gap Analysis (missing content per chapter)
- Export System (beta reader guide, DOCX)

See PRD for full feature roadmap and implementation phases.
