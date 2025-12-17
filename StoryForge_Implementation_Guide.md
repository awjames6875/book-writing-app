# STORYFORGE - Claude Code Implementation Guide
## Quick Reference for Building the App

---

# QUICK START COMMANDS

```bash
# 1. Create Next.js project
npx create-next-app@latest storyforge --typescript --tailwind --app --src-dir --eslint

cd storyforge

# 2. Install core dependencies
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs @supabase/ssr
npm install @anthropic-ai/sdk openai
npm install zod react-hook-form @hookform/resolvers
npm install lucide-react

# 3. Install UI components (shadcn)
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input textarea dialog tabs toast

# 4. Install audio/file handling
npm install react-dropzone

# 5. Set up Supabase locally
npx supabase init
npx supabase start
```

---

# ENVIRONMENT VARIABLES

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_local_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

# DATABASE SETUP

## Run this SQL in Supabase SQL Editor:

```sql
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ENUMS
CREATE TYPE project_status AS ENUM ('draft', 'in_progress', 'review', 'complete');
CREATE TYPE chapter_status AS ENUM ('not_started', 'in_progress', 'ready_to_write', 'drafted', 'complete');
CREATE TYPE question_status AS ENUM ('unanswered', 'partial', 'complete');
CREATE TYPE source_type AS ENUM ('pdf', 'youtube', 'article', 'audio', 'text');
CREATE TYPE source_status AS ENUM ('uploading', 'processing', 'ready', 'failed');
CREATE TYPE recording_status AS ENUM ('uploading', 'transcribing', 'processed', 'failed');
CREATE TYPE content_type AS ENUM ('story', 'insight', 'quote', 'framework', 'exercise', 'other');

-- TABLES

-- Users (extends Supabase auth)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    target_word_count INTEGER DEFAULT 50000,
    status project_status DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chapters
CREATE TABLE public.chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    target_word_count INTEGER DEFAULT 5000,
    current_word_count INTEGER DEFAULT 0,
    status chapter_status DEFAULT 'not_started',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Questions
CREATE TABLE public.questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    chapter_id UUID REFERENCES public.chapters(id) ON DELETE SET NULL,
    source_id UUID, -- FK added after sources table
    text TEXT NOT NULL,
    status question_status DEFAULT 'unanswered',
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
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
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add FK to questions
ALTER TABLE public.questions 
ADD CONSTRAINT fk_question_source 
FOREIGN KEY (source_id) REFERENCES public.sources(id) ON DELETE SET NULL;

-- Source Chunks (for RAG)
CREATE TABLE public.source_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID NOT NULL REFERENCES public.sources(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    embedding VECTOR(1536),
    chunk_index INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recordings
CREATE TABLE public.recordings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT,
    audio_url TEXT NOT NULL,
    duration_seconds INTEGER,
    status recording_status DEFAULT 'uploading',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transcripts
CREATE TABLE public.transcripts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recording_id UUID NOT NULL REFERENCES public.recordings(id) ON DELETE CASCADE,
    raw_text TEXT NOT NULL,
    word_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content Blocks (extracted from transcripts/sources)
CREATE TABLE public.content_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    chapter_id UUID REFERENCES public.chapters(id) ON DELETE SET NULL,
    question_id UUID REFERENCES public.questions(id) ON DELETE SET NULL,
    transcript_id UUID REFERENCES public.transcripts(id) ON DELETE SET NULL,
    content_type content_type DEFAULT 'other',
    raw_text TEXT NOT NULL,
    polished_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Voice Profile
CREATE TABLE public.voice_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID UNIQUE NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    style_guide TEXT,
    signature_phrases JSONB DEFAULT '[]',
    frameworks JSONB DEFAULT '[]',
    tone_notes TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chapter Drafts
CREATE TABLE public.chapter_drafts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    content TEXT NOT NULL,
    word_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(chapter_id, version)
);

-- Chat Sessions (Source Brain)
CREATE TABLE public.chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT DEFAULT 'New Chat',
    source_ids JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat Messages
CREATE TABLE public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    citations JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX idx_questions_project ON public.questions(project_id);
CREATE INDEX idx_questions_status ON public.questions(status);
CREATE INDEX idx_content_blocks_chapter ON public.content_blocks(chapter_id);
CREATE INDEX idx_source_chunks_embedding ON public.source_chunks 
    USING ivfflat (embedding vector_cosine_ops);

-- ROW LEVEL SECURITY
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recordings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users own their profile" ON public.profiles
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users own their projects" ON public.projects
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users access their project data" ON public.chapters
    FOR ALL USING (project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid()));

CREATE POLICY "Users access their questions" ON public.questions
    FOR ALL USING (project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid()));

CREATE POLICY "Users access their sources" ON public.sources
    FOR ALL USING (project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid()));

CREATE POLICY "Users access their recordings" ON public.recordings
    FOR ALL USING (project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid()));

-- FUNCTIONS

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update project timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

# PROJECT STRUCTURE

```
storyforge/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   └── projects/
│   │   │       ├── page.tsx              # List projects
│   │   │       └── [id]/
│   │   │           ├── page.tsx          # Project dashboard
│   │   │           ├── questions/page.tsx
│   │   │           ├── record/page.tsx
│   │   │           ├── sources/page.tsx
│   │   │           ├── chat/page.tsx     # Source Brain
│   │   │           └── chapters/
│   │   │               ├── page.tsx
│   │   │               └── [chapterId]/page.tsx
│   │   ├── api/
│   │   │   ├── projects/route.ts
│   │   │   ├── questions/route.ts
│   │   │   ├── recordings/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/process/route.ts
│   │   │   ├── sources/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts
│   │   │   │       └── generate-questions/route.ts
│   │   │   ├── chat/route.ts
│   │   │   └── chapters/
│   │   │       ├── route.ts
│   │   │       └── [id]/generate/route.ts
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/                    # shadcn components
│   │   ├── AudioRecorder.tsx
│   │   ├── QuestionList.tsx
│   │   ├── SourceUploader.tsx
│   │   ├── SourceChat.tsx
│   │   ├── ChapterEditor.tsx
│   │   └── ProgressDashboard.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── middleware.ts
│   │   ├── ai/
│   │   │   ├── claude.ts
│   │   │   ├── whisper.ts
│   │   │   └── embeddings.ts
│   │   └── utils.ts
│   ├── services/
│   │   ├── transcription.ts
│   │   ├── source-processing.ts
│   │   ├── question-generation.ts
│   │   └── chapter-writing.ts
│   └── types/
│       └── database.ts
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
└── package.json
```

---

# KEY IMPLEMENTATION FILES

## 1. Supabase Client Setup

```typescript
// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

```typescript
// src/lib/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}
```

## 2. Claude AI Setup

```typescript
// src/lib/ai/claude.ts
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function processTranscript(
  transcript: string,
  questions: { id: string; text: string }[],
  bookContext: { title: string; chapters: string[] }
) {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    messages: [
      {
        role: 'user',
        content: `You are analyzing an author interview transcript.

BOOK: ${bookContext.title}
CHAPTERS: ${bookContext.chapters.join(', ')}

QUESTIONS THE AUTHOR WAS ANSWERING:
${questions.map((q, i) => `${i + 1}. [ID: ${q.id}] ${q.text}`).join('\n')}

TRANSCRIPT:
${transcript}

Analyze this transcript and return JSON:
{
  "questions_answered": [
    {
      "question_id": "uuid",
      "status": "complete" | "partial",
      "excerpt": "relevant quote from transcript",
      "missing": "what's still needed (if partial)"
    }
  ],
  "content_blocks": [
    {
      "type": "story" | "insight" | "quote" | "framework",
      "content": "extracted content",
      "suggested_chapter": "chapter name or null"
    }
  ],
  "follow_up_questions": ["question 1", "question 2"]
}`,
      },
    ],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  return JSON.parse(text)
}

export async function generateChapterDraft(
  chapterTitle: string,
  contentBlocks: { type: string; content: string }[],
  voiceProfile: { style_guide: string; signature_phrases: string[] }
) {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8000,
    messages: [
      {
        role: 'user',
        content: `Write a book chapter using this content.

CHAPTER: ${chapterTitle}

VOICE GUIDELINES:
${voiceProfile.style_guide}

SIGNATURE PHRASES TO USE:
${voiceProfile.signature_phrases.join(', ')}

CONTENT TO INCORPORATE:
${contentBlocks.map(b => `[${b.type.toUpperCase()}]: ${b.content}`).join('\n\n')}

STRUCTURE:
1. STORY - Open with a vivid scene
2. PRINCIPLE - Teach the lesson/insight  
3. PRACTICE - Give actionable steps

Write the complete chapter in the author's voice.`,
      },
    ],
  })

  return response.content[0].type === 'text' ? response.content[0].text : ''
}
```

## 3. Whisper Transcription

```typescript
// src/lib/ai/whisper.ts
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function transcribeAudio(audioBuffer: Buffer, filename: string) {
  const file = new File([audioBuffer], filename, { type: 'audio/mp4' })
  
  const response = await openai.audio.transcriptions.create({
    file,
    model: 'whisper-1',
    response_format: 'text',
  })

  return response
}
```

## 4. Example API Route

```typescript
// src/app/api/recordings/[id]/process/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { transcribeAudio } from '@/lib/ai/whisper'
import { processTranscript } from '@/lib/ai/claude'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  
  // Get recording
  const { data: recording } = await supabase
    .from('recordings')
    .select('*, projects(title, chapters(id, title))')
    .eq('id', params.id)
    .single()

  if (!recording) {
    return NextResponse.json({ error: 'Recording not found' }, { status: 404 })
  }

  // Get audio file and transcribe
  const { data: audioData } = await supabase.storage
    .from('recordings')
    .download(recording.audio_url)
  
  const buffer = Buffer.from(await audioData!.arrayBuffer())
  const transcriptText = await transcribeAudio(buffer, 'recording.m4a')

  // Save transcript
  const { data: transcript } = await supabase
    .from('transcripts')
    .insert({
      recording_id: params.id,
      raw_text: transcriptText,
      word_count: transcriptText.split(/\s+/).length,
    })
    .select()
    .single()

  // Get questions for this project
  const { data: questions } = await supabase
    .from('questions')
    .select('id, text')
    .eq('project_id', recording.project_id)

  // Process with Claude
  const analysis = await processTranscript(
    transcriptText,
    questions || [],
    {
      title: recording.projects.title,
      chapters: recording.projects.chapters.map((c: any) => c.title),
    }
  )

  // Update question statuses
  for (const qa of analysis.questions_answered) {
    await supabase
      .from('questions')
      .update({ status: qa.status })
      .eq('id', qa.question_id)
  }

  // Create content blocks
  for (const block of analysis.content_blocks) {
    const chapter = recording.projects.chapters.find(
      (c: any) => c.title === block.suggested_chapter
    )
    
    await supabase.from('content_blocks').insert({
      project_id: recording.project_id,
      chapter_id: chapter?.id,
      transcript_id: transcript.id,
      content_type: block.type,
      raw_text: block.content,
    })
  }

  // Update recording status
  await supabase
    .from('recordings')
    .update({ status: 'processed' })
    .eq('id', params.id)

  return NextResponse.json({
    transcript_id: transcript.id,
    questions_answered: analysis.questions_answered.length,
    content_blocks_created: analysis.content_blocks.length,
    follow_up_questions: analysis.follow_up_questions,
  })
}
```

---

# BUILD ORDER

## Week 1: Foundation
1. [ ] Set up Next.js project with dependencies
2. [ ] Run database migrations in Supabase
3. [ ] Implement auth (login/signup pages)
4. [ ] Create project CRUD (list, create, view)
5. [ ] Build chapter management

## Week 2: Questions
1. [ ] Question list component with filters
2. [ ] Add/edit question functionality
3. [ ] Bulk import from CSV
4. [ ] Question-chapter assignment
5. [ ] Progress indicators

## Week 3: Recording
1. [ ] Audio recorder component
2. [ ] File upload to Supabase Storage
3. [ ] Whisper API integration
4. [ ] Transcript display/edit
5. [ ] AI processing pipeline

## Week 4: Source Brain
1. [ ] Multi-file upload (PDF, URL paste)
2. [ ] YouTube transcript extraction
3. [ ] AI summarization
4. [ ] Question generation from sources
5. [ ] RAG chat interface

---

# TESTING THE BUILD

```bash
# Start Supabase locally
npx supabase start

# Start Next.js dev server
npm run dev

# Test flow:
# 1. Sign up at /signup
# 2. Create project at /projects
# 3. Add questions manually or import
# 4. Record audio at /projects/[id]/record
# 5. Watch AI process and update questions
# 6. Upload sources at /projects/[id]/sources
# 7. Chat with sources at /projects/[id]/chat
# 8. Generate chapter at /projects/[id]/chapters/[id]
```

---

**This is your Claude Code implementation guide. Start with Week 1 tasks and iterate!**
