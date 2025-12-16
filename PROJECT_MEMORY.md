# Project Memory

> **What is this file?**
> This is your project's persistent memory. Add any instructions, reminders, or patterns you want AI assistants (Claude, Copilot, Cursor) to remember EVERY TIME they work on this project.

---

## Core Coding Rules (From Parent CLAUDE.md)

### The Golden Rules

**Rule #1**: Think through the problem → Read code → Write plan to `../tasks/todo.md` → Get user approval → THEN code

**Rule #6**: Make every change AS SIMPLE AS POSSIBLE. Impact minimal code. Simplicity over complexity. Always.

**Rule #8**: 🚨 DO NOT BE LAZY. NEVER BE LAZY. If there's a bug, find the ROOT CAUSE and fix it properly. NO temporary fixes. You are a senior developer. NEVER BE LAZY.

**Rule #9**: ALL code changes should impact ONLY necessary, relevant code and NOTHING ELSE. Impact as little code as humanly possible. Your goal is to NOT introduce bugs. **IT'S ALL ABOUT SIMPLICITY.**

### The Philosophy

**Simplicity first. Every single time.**
- Don't over-engineer
- Don't add features beyond what's requested
- Don't refactor unrelated code
- Don't add "nice to have" improvements
- Trust the framework and libraries
- Validate only at system boundaries (user input, external APIs)

---

## Always Remember

### Workflow Rules
- [ ] ✅ **Run `npm run lint` before committing** (catches bugs early)
- [ ] ✅ **Check TypeScript with `npm run build`** (verifies no type errors)
- [ ] ✅ **Read parent CLAUDE.md before starting ANY task** (project philosophy)
- [ ] ✅ **Create plan in `../tasks/todo.md` before coding** (think first, code second)
- [ ] ✅ **Get user approval on plan before implementing** (avoid wasted work)
- [ ] ✅ **Mark todos as complete as you go** (track progress)
- [ ] ⚠️ Remove all `console.log` before committing (caught by ESLint)
- [ ] ⚠️ Handle ALL promises with try/catch or .catch() (caught by ESLint)

### ESLint Auto-Fix
```bash
npm run lint -- --fix
```
**Run this before committing!** Fixes 80% of issues automatically.

---

## Code Patterns to Follow

### Promises: ALWAYS Handle Them
```typescript
// ✅ GOOD - Async/await with try/catch
async function fetchUser() {
  try {
    const response = await fetch('/api/user')
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch user:', error)
    throw error
  }
}

// ✅ GOOD - .catch() handler
fetch('/api/user')
  .then(res => res.json())
  .catch(error => console.error(error))

// ❌ BAD - Floating promise (ESLint error!)
fetch('/api/user')  // No await, no .catch()
```

### Equality: Always Use ===
```typescript
// ✅ GOOD
if (count === 0) {}
if (user !== null) {}

// ❌ BAD (ESLint error!)
if (count == 0) {}   // Type coercion can cause bugs
if (user != null) {}
```

### Variables: Prefer const
```typescript
// ✅ GOOD
const userName = 'Alice'
const items = [1, 2, 3]
let count = 0  // Only when you need to reassign

// ❌ BAD (ESLint warning)
let userName = 'Alice'  // Should be const
var count = 0           // Should be const or let
```

### Types: Avoid 'any'
```typescript
// ✅ GOOD - Use specific types
function formatUser(user: { name: string; age: number }) {
  return `${user.name} (${user.age})`
}

// ⚠️ WARNING - Use unknown + type guard instead
function formatUser(user: any) {  // ESLint warns
  return `${user.name} (${user.age})`
}

// ✅ BETTER - Use unknown with type guard
function formatUser(user: unknown) {
  if (typeof user === 'object' && user !== null && 'name' in user) {
    return `${(user as { name: string }).name}`
  }
  throw new Error('Invalid user')
}
```

### React Hooks: Complete Dependencies
```typescript
// ✅ GOOD
useEffect(() => {
  fetchUser(userId)
}, [userId])  // Include all dependencies

// ⚠️ WARNING (ESLint catches this)
useEffect(() => {
  fetchUser(userId)
}, [])  // Missing userId - stale closure bug!
```

### Imports: Use @ Alias
```typescript
// ✅ GOOD
import { Button } from '@/components/ui/button'
import { getUserData } from '@/services/user'

// ❌ AVOID
import { Button } from '../../../components/ui/button'
```

---

## Things to Avoid

### 🚫 Never Do These

- ❌ **Never use `any` type** without a comment explaining why (ESLint warns)
- ❌ **Never commit `console.log`** statements (ESLint warns)
- ❌ **Never commit `debugger`** statements (ESLint errors)
- ❌ **Never use `eval()`** (ESLint errors - security risk)
- ❌ **Never use `==` or `!=`** (use `===` and `!==` - ESLint errors)
- ❌ **Never use `var`** (use `const` or `let` - ESLint errors)
- ❌ **Never ignore promise rejections** (handle with try/catch - ESLint errors)
- ❌ **Never use array index as React key** (breaks on reorder - ESLint warns)
- ❌ **Never create functions in JSX** (`onClick={() => {}}` - ESLint warns)

### Performance & Security
- ⚠️ Avoid `dangerouslySetInnerHTML` (XSS risk - ESLint warns)
- ⚠️ Don't pass strings to `setTimeout`/`setInterval` (ESLint errors)
- ⚠️ Don't use Function constructor (ESLint errors)
- ⚠️ Don't create complex functions (>15 branches - ESLint warns)
- ⚠️ Don't deeply nest code (>4 levels - ESLint warns)

---

## Project-Specific Patterns

### API Routes: Use Server Supabase Client
```typescript
// ✅ GOOD - Server-side
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  // Use supabase...
}

// ❌ WRONG - Client-side in API route
import { createClient } from '@/lib/supabase/client'  // Don't do this!
```

### Database Queries: Select Specific Columns
```typescript
// ✅ GOOD
const { data } = await supabase
  .from('users')
  .select('id, name, email')

// ❌ AVOID
const { data } = await supabase
  .from('users')
  .select('*')  // Fetches unnecessary data
```

### Components: Named Exports
```typescript
// ✅ GOOD
export function Button() {}

// ❌ AVOID
export default function Button() {}
```

---

## Custom Instructions

### When Adding Features

1. **Read parent CLAUDE.md** - Understand project philosophy
2. **Write plan to ../tasks/todo.md** - Think before coding
3. **Get user approval** - Don't waste effort
4. **Create types first** (in `@/types/database.ts`)
5. **Write minimal code** - Simplicity first
6. **Run `npm run lint -- --fix`** - Catch bugs
7. **Test locally** - `npm run dev`
8. **Build to verify** - `npm run build`

### When Fixing Bugs

1. **Find ROOT CAUSE** - Don't be lazy (Rule #8!)
2. **Read related code** - Understand context
3. **Write failing test** (if applicable)
4. **Fix with minimal change** - Impact least code possible
5. **Run linter** - `npm run lint -- --fix`
6. **Verify fix** - Test manually + `npm run build`

### Before Pushing Code

- [ ] ✅ Run `npm run lint` → No errors
- [ ] ✅ Run `npm run build` → Builds successfully
- [ ] ✅ Test changes locally → Works as expected
- [ ] ✅ Remove all `console.log` and `debugger`
- [ ] ✅ All imports use `@/` alias
- [ ] ✅ All promises are handled (no floating promises)
- [ ] ✅ Changed code follows simplicity rule (minimal impact)

---

## User-Specific "Remember This" Items

> **Add your own custom instructions below this line!**
> Examples: "Always add a comment above complex regex", "Test with Chrome AND Safari", "Ping @username before deploying", etc.

---

### Example: Workflow Reminders
<!-- Uncomment and modify as needed -->
<!-- - [ ] Always run database migrations before testing features -->
<!-- - [ ] Ask user before changing database schema -->
<!-- - [ ] Update API documentation after adding endpoints -->

---

### Example: Team Preferences
<!-- Add your team's preferences here -->
<!-- - Prefer Zod for validation over manual checks -->
<!-- - Use React Hook Form for all forms -->
<!-- - Write unit tests for utility functions -->

---

### Example: Deployment Checklist
<!-- Add your deployment steps -->
<!-- - [ ] Run `npm run build` locally first -->
<!-- - [ ] Check `.env.local` is NOT committed -->
<!-- - [ ] Verify Supabase migrations are applied -->
<!-- - [ ] Test on staging before production -->

---

## Known Issues & Gotchas

### TypeScript & ESLint
- **Issue**: ESLint strict-boolean-expressions warns on `if (user)` for optional types
  - **Fix**: Use explicit checks: `if (user !== null && user !== undefined)`

- **Issue**: Boolean naming convention requires `is/has/should/can` prefix
  - **Fix**: Rename `active` → `isActive`, `loading` → `isLoading`

### Next.js App Router
- **Issue**: `'use client'` needed for browser APIs (useState, useEffect, etc.)
  - **Fix**: Add `'use client'` at top of component file

- **Issue**: Server components can't use state or effects
  - **Fix**: Move interactivity to separate client component

### Supabase
- **Issue**: Row Level Security (RLS) blocks queries if not enabled
  - **Fix**: Enable RLS policies in Supabase dashboard or migrations

---

## Quick Reference: Common Commands

```bash
# Development
npm run dev              # Start dev server (port 3000)
npm run lint             # Check code
npm run lint -- --fix    # Auto-fix code
npm run build            # Verify TypeScript + build

# Database
npx supabase start       # Start local DB
npx supabase stop        # Stop local DB
npx supabase db reset    # Reset to migrations

# Debugging
npm run lint -- --quiet  # Show only errors (hide warnings)
```

---

## How to Use This File

1. **Add instructions as you discover patterns** - "Remember to do X when Y"
2. **Update after retrospectives** - "We learned Z should always happen"
3. **Document project-specific quirks** - "API expects dates in format X"
4. **Share team conventions** - "We prefer pattern A over pattern B"

**AI assistants will read this file automatically!** Claude, Copilot, and Cursor will follow these instructions when working on your project.

---

**Last updated**: {{ ADD DATE HERE WHEN YOU MODIFY THIS FILE }}
