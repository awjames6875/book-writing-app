# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**See parent `../CLAUDE.md` for full project documentation.**

---

## Quick Reference

```bash
# Development (run from this directory)
npm run dev          # http://localhost:3000
npm run build        # Production build
npm run lint -- --fix  # Auto-fix lint issues before committing

# Supabase (separate terminal)
npx supabase start   # Start local DB (requires Docker Desktop)
npx supabase stop
```

---

## Required Environment Variables

Create `.env.local` in this directory:

```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from npx supabase start>
SUPABASE_SERVICE_ROLE_KEY=<from npx supabase start>
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Import Patterns

```typescript
// API routes - use server client
import { createClient } from '@/lib/supabase/server'

// Components - use browser client
import { createClient } from '@/lib/supabase/client'

// Always use @/ alias for imports
import { cn } from '@/lib/utils'
```

---

## Key Directories

- `src/app/(auth)/` - Login/signup pages
- `src/app/(dashboard)/` - Protected pages (dashboard, projects, recording)
- `src/app/api/` - Backend routes (projects, recordings, transcription)
- `src/components/` - React components
- `src/lib/supabase/` - Supabase client setup
- `src/lib/ai/` - AI API wrappers (Whisper)
- `src/types/` - TypeScript types

---

## Debugging

**TypeScript module errors**: Restart TS server (Cmd/Ctrl+Shift+P -> "Restart TypeScript Server")

**Supabase issues**: Run `npx supabase status`, check http://localhost:54323

**Build failures**: Run `npm run lint` first to check for errors
