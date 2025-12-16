# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Quick Reference: Project Rules

**ALWAYS READ FIRST**: Before making any changes, review the parent-level CLAUDE.md rules:
- **Rule #1**: Think through the problem, read relevant code, write a plan to `../tasks/todo.md`
- **Rule #6**: Make every task as simple as possible—impact as little code as possible
- **Rule #8**: Never be lazy. If there's a bug, find root cause, never temporary fixes
- **Rule #9**: All code changes should impact ONLY necessary, relevant code

**The Philosophy**: Simplicity over completeness. No massive changes. No premature abstractions.

---

## Project Structure at a Glance

```
storyforge/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Auth pages (login/signup) - NOT YET BUILT
│   │   ├── (dashboard)/        # Protected dashboard routes - NOT YET BUILT
│   │   ├── api/                # Backend API routes - NOT YET BUILT
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page (currently boilerplate)
│   │   └── globals.css         # Global styles
│   ├── components/             # React components (to be built)
│   ├── lib/                    # Utilities and helpers (to be built)
│   │   ├── supabase/           # Supabase client setup
│   │   ├── ai/                 # API wrappers for Claude, Whisper, OpenAI
│   │   └── utils.ts            # Helper functions
│   ├── services/               # Business logic (to be built)
│   └── types/                  # TypeScript types (to be built)
├── .env.local                  # Environment variables (CREATE THIS)
├── next.config.ts              # Next.js config
├── tsconfig.json               # TypeScript config (has @/* alias)
├── tailwind.config.ts          # Tailwind CSS config
├── package.json                # Dependencies
└── CLAUDE.md                   # This file
```

**Currently Implemented**: Only boilerplate Next.js setup
- `src/app/layout.tsx` - Root layout with fonts
- `src/app/page.tsx` - Home page (generic starter)
- `src/app/globals.css` - Global Tailwind styles

**Not Yet Implemented**: Everything else (see parent CLAUDE.md for full architecture)

---

## Development Setup Checklist

Before you can run the dev server:

- [ ] Navigate to `storyforge/` directory
- [ ] Create `.env.local` file (copy template from parent CLAUDE.md)
- [ ] Ensure `.env.local` contains at minimum:
  - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (from `npx supabase start`)
  - `ANTHROPIC_API_KEY` (from Anthropic console)
  - `OPENAI_API_KEY` (from OpenAI console)

### First-Time Setup Steps

```bash
# 1. Install missing feature dependencies
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs @supabase/ssr
npm install @anthropic-ai/sdk openai
npm install zod react-hook-form @hookform/resolvers
npm install lucide-react react-dropzone

# 2. Set up shadcn UI
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input textarea dialog tabs toast

# 3. Create .env.local with your API keys

# 4. Start Supabase (in a separate terminal)
npx supabase start

# 5. Start dev server (in another terminal)
npm run dev
```

---

## Common Development Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Build for production
npm run start            # Start production server (after npm run build)

# Linting & Code Quality
npm run lint             # Check code for errors/warnings
npm run lint -- --fix    # Auto-fix ESLint issues (HIGHLY RECOMMENDED before commits!)
npm run lint -- --quiet  # Show only errors (hide warnings)

# Supabase (separate terminal)
npx supabase start       # Start local Supabase emulator
npx supabase stop        # Stop Supabase
npx supabase status      # Check Supabase status
npx supabase db reset    # Reset DB to migrations
```

### ESLint Quick Reference

The project uses **30+ beginner-friendly rules** to catch bugs before runtime:

**Auto-fix before committing** (fixes 80% of issues):
```bash
npm run lint -- --fix
```

**Common ESLint Errors & Fixes:**
- `no-floating-promises` → Add `await` or `.catch()` to promises
- `eqeqeq` → Change `==` to `===` and `!=` to `!==`
- `no-console` → Remove `console.log` statements
- `prefer-const` → Change `let` to `const` for non-reassigned variables
- `no-var` → Change `var` to `const` or `let`

**For more details**, see:
- [HANDOFF.md](./HANDOFF.md) - Full ESLint rules explanation
- [PROJECT_MEMORY.md](./PROJECT_MEMORY.md) - Code patterns to follow

---

## Code Style & Patterns

### File Naming Conventions

- **Components**: `PascalCase.tsx` (e.g., `AudioRecorder.tsx`)
- **Utilities**: `kebab-case.ts` (e.g., `supabase-client.ts`)
- **Pages**: `page.tsx` in directory structure (Next.js convention)

### TypeScript

- Use strict TypeScript mode (`strict: true` in tsconfig.json)
- Define types in `src/types/database.ts` (auto-generated from DB schema)
- Use `@/` import alias instead of relative paths
- Keep types close to where they're used when possible

### React Components

- Prefer small, focused components
- Use TypeScript for prop types
- Use React hooks (`useState`, `useCallback`, `useEffect`)
- Avoid global state until absolutely necessary
- Use `useCallback` to memoize event handlers in lists

### API Routes

Location: `src/app/api/[resource]/route.ts`

Pattern:
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  // Handle request...
  return NextResponse.json({ data })
}
```

Key points:
- Import `createClient` from `@/lib/supabase/server` (NOT client)
- Validate user input with Zod before processing
- Let Supabase RLS handle authorization (don't duplicate checks)
- Return JSON responses

### Database Access

```typescript
import { createClient } from '@/lib/supabase/server'  // In API routes
import { createClient } from '@/lib/supabase/client'  // In components (client-side)

const supabase = await createClient()

// Always select specific columns when possible
const { data, error } = await supabase
  .from('projects')
  .select('id, title, created_at')  // NOT SELECT *
  .eq('user_id', userId)

if (error) throw error
return data
```

---

## AI API Patterns

### Claude API (Anthropic)

```typescript
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-20250514',  // Use latest Sonnet
  max_tokens: 2000,
  messages: [
    {
      role: 'user',
      content: 'Your prompt here'
    }
  ]
})

const text = response.content[0].type === 'text' ? response.content[0].text : ''
```

### OpenAI APIs

**Whisper (Transcription)**:
```typescript
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const transcript = await openai.audio.transcriptions.create({
  file: audioFile,
  model: 'whisper-1'
})
```

**Embeddings (Semantic Search)**:
```typescript
const embedding = await openai.embeddings.create({
  model: 'text-embedding-3-small',
  input: 'Text to embed'
})

// Store in Supabase with pgvector
await supabase.from('source_chunks').insert({
  content: text,
  embedding: embedding.data[0].embedding
})
```

---

## Testing the Application

```bash
# Terminal 1: Start Supabase
npx supabase start

# Terminal 2: Start Next.js
npm run dev

# Browser: http://localhost:3000
# You should see default Next.js home page (will be replaced by auth/landing page)
```

---

## Debugging Tips

### VSCode TypeScript Errors
If you see "Cannot find module '@/lib/...'" errors:
1. Restart VSCode TypeScript server (Cmd/Ctrl + Shift + P → "Restart TypeScript Server")
2. Ensure `tsconfig.json` has `"paths": { "@/*": ["./src/*"] }`

### Supabase Connection Issues
1. Check `.env.local` has correct `NEXT_PUBLIC_SUPABASE_URL` and key
2. Run `npx supabase status` to verify emulator is running
3. Check Supabase browser UI at http://localhost:54323

### Build Failures
1. Run `npm run lint` to check for ESLint errors
2. Run `npm run build` to see full build output
3. Check that all imports resolve (no missing dependencies)

---

## Important: Before You Start Implementing

1. **Read the parent CLAUDE.md** - Understand the architecture, database schema, and API endpoints
2. **Check the rules** - Simplicity first, no lazy fixes, impact minimal code
3. **Verify the plan** - Always get user approval for your implementation plan before coding
4. **Mark todos** - Use TodoWrite tool to track progress step-by-step
5. **Commit frequently** - After each completed todo, commit your changes

---

## Resources

- **Parent CLAUDE.md**: Architecture, database schema, API design, implementation patterns
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Claude API Docs](https://anthropic.com/docs)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
