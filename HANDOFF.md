# StoryForge - Developer Handoff Guide

This document helps you (or a new developer) get up to speed quickly when switching IDEs, starting fresh, or onboarding a team member.

---

## Quick Start Checklist

### 1. Clone & Setup
```bash
cd storyforge
npm install
```

### 2. Create Environment File
Create `.env.local` at the project root (see [Environment Variables](#environment-variables) section)

### 3. Start Supabase (separate terminal)
```bash
npx supabase start
```

Copy the printed keys to `.env.local`

### 4. Start Development Server (separate terminal)
```bash
npm run dev
```

Visit http://localhost:3000

---

## Environment Variables

Create `.env.local` in the project root with:

```env
# Supabase (from npx supabase start output)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# API Keys
ANTHROPIC_API_KEY=sk-ant-your-key-here
OPENAI_API_KEY=sk-your-key-here

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Getting Supabase Keys**: Run `npx supabase start` and copy the `ANON_KEY` and `SERVICE_ROLE_KEY` from console output.

---

## Common Development Commands

### Development
```bash
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Build for production
npm run start            # Run production build
npm run lint             # Check code for errors/warnings
npm run lint -- --fix    # Auto-fix ESLint issues
```

### Database
```bash
npx supabase start       # Start Supabase emulator
npx supabase stop        # Stop Supabase
npx supabase status      # Check status
npx supabase db reset    # Reset database to migrations
```

---

## Project Configuration

### ESLint Rules (Code Quality)

This project uses enhanced ESLint with ~30 beginner-friendly rules:

**Type Safety**
- `@typescript-eslint/no-explicit-any` (warn) - Avoid lazy `any` types
- `@typescript-eslint/no-unsafe-assignment` (error) - Block unsafe ops with `any`

**Promise Handling** (Most Important!)
- `@typescript-eslint/no-floating-promises` (error) - All promises must be handled
- `@typescript-eslint/no-misused-promises` (error) - Don't use async in callbacks
- `@typescript-eslint/await-thenable` (error) - Only await promises

**Code Quality**
- `complexity` (warn) - Functions too complex (>15 branches)
- `max-depth` (warn) - Nested code too deep (>4 levels)
- `max-lines-per-function` (warn) - Functions too long (>100 lines)
- `no-console` (warn) - Remove console.log before production
- `no-debugger` (error) - Never commit debugger statements

**Common Mistakes**
- `eqeqeq` (error) - Use `===` instead of `==`
- `no-var` (error) - Use `const`/`let`, never `var`
- `no-param-reassign` (warn) - Don't modify function parameters

**React Best Practices**
- `react-hooks/exhaustive-deps` (warn) - useEffect dependencies must be complete
- `react/jsx-no-bind` (warn) - Don't create functions in JSX
- `react/no-array-index-key` (warn) - Don't use array index as key

**Security**
- `no-eval` (error) - Never use eval()
- `no-implied-eval` (error) - No strings to setTimeout
- `react/no-danger` (warn) - Avoid dangerouslySetInnerHTML

**Naming Conventions**
- Variables & functions: `camelCase`
- Types & Interfaces: `PascalCase`
- Boolean variables: prefix with `is`, `has`, `should`, `can`

### TypeScript Configuration

- **Strict Mode**: Enabled (`strict: true`)
- **Target**: ES2017
- **Path Alias**: `@/*` maps to `src/`

### Import Alias

Instead of: `import { foo } from '../../../lib/utils'`

Use: `import { foo } from '@/lib/utils'`

Configured in `tsconfig.json`

---

## Project Structure

```
storyforge/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/             # React components (TBD)
│   ├── lib/                    # Utilities (TBD)
│   │   ├── supabase/           # Supabase clients
│   │   ├── ai/                 # AI API wrappers
│   │   └── utils.ts            # Helpers
│   ├── services/               # Business logic (TBD)
│   └── types/                  # TypeScript types (TBD)
├── .vscode/
│   ├── settings.json           # VSCode config (auto-fix)
│   └── extensions.json         # Recommended extensions
├── eslint.config.mjs           # ESLint rules
├── tsconfig.json               # TypeScript config
├── CLAUDE.md                   # AI assistant guide
├── HANDOFF.md                  # This file
├── .context.md                 # AI context memory
└── PROJECT_MEMORY.md           # "Remember this" notes
```

---

## Naming Conventions

### Files & Folders
- **Components**: `PascalCase.tsx` → `Button.tsx`, `UserProfile.tsx`
- **Utilities**: `kebab-case.ts` → `format-date.ts`, `api-client.ts`
- **Pages**: Directory structure defines routes (Next.js convention)

### Code
- **Variables**: `camelCase` → `const userName = 'Alice'`
- **Functions**: `camelCase` → `function getUserData() {}`
- **Types/Interfaces**: `PascalCase` → `interface UserProfile {}`, `type Status = '...'`
- **Booleans**: Prefix with `is/has/should/can` → `const isLoading = true`, `const hasErrors = false`
- **Constants**: `UPPER_CASE` or `camelCase` → `const MAX_RETRIES = 3`

---

## Common Tasks

### Adding a New Component

1. Create file in `src/components/` with `PascalCase.tsx`
2. Use TypeScript for props:
   ```typescript
   interface ButtonProps {
     label: string
     onClick: () => void
     disabled?: boolean
   }

   export function Button({ label, onClick, disabled }: ButtonProps) {
     return <button onClick={onClick} disabled={disabled}>{label}</button>
   }
   ```
3. Run `npm run lint -- --fix` to check for issues

### Adding an API Endpoint

1. Create file in `src/app/api/[resource]/route.ts`
2. Use NextResponse:
   ```typescript
   import { NextRequest, NextResponse } from 'next/server'

   export async function GET(request: NextRequest) {
     // Your logic
     return NextResponse.json({ data })
   }
   ```
3. Check with `npm run lint`

### Creating a Utility Function

1. Create file in `src/lib/utils/` with `kebab-case.ts`
2. Export named functions (not default):
   ```typescript
   export function formatDate(date: Date): string {
     // Implementation
   }
   ```
3. Import with alias: `import { formatDate } from '@/lib/utils/date-formatter'`

---

## IDE Setup

### VSCode (Recommended)

1. Install recommended extensions (VSCode will prompt):
   - ESLint (linting)
   - Tailwind CSS IntelliSense (styling)
   - TypeScript (language support)
   - Prettier (optional, for formatting)

2. VSCode settings (`.vscode/settings.json`) already configured for:
   - Auto-fix ESLint on save
   - Format on save
   - TypeScript validation

3. Just open the project folder and start coding!

### Other IDEs (Cursor, WebStorm, etc.)

1. Read [PROJECT_MEMORY.md](./PROJECT_MEMORY.md) for custom instructions
2. Read [.context.md](./.context.md) for architecture
3. Install ESLint extensions for your IDE
4. Run `npm run lint -- --fix` manually before committing

---

## Troubleshooting

### ESLint Error: "Cannot find module"

**Solution**: Restart TypeScript server in VSCode:
- Press `Cmd/Ctrl + Shift + P`
- Type "Restart TypeScript Server"
- Hit Enter

### Import Alias `@/*` Not Resolving

**Solution**: Verify `tsconfig.json` has:
```json
"paths": { "@/*": ["./src/*"] }
```

It should already be configured. If not, add it.

### Supabase Connection Error

**Solution**:
1. Check if Supabase is running: `npx supabase status`
2. Verify `.env.local` has correct `NEXT_PUBLIC_SUPABASE_URL`
3. Check URL is http://localhost:54321 (default local port)

### `npm run lint` Failing

**Solution**:
1. Run `npm run lint -- --fix` to auto-fix 80% of issues
2. Fix remaining errors manually
3. Most common: Change `==` to `===`, use `const`, handle promises

### Too Many ESLint Warnings

**This is normal!** The rules are educational. You can:
1. Disable specific rules in VSCode if they're too strict (temporarily)
2. Use `// eslint-disable-next-line rule-name` for exceptions (with comment)
3. Update `eslint.config.mjs` to adjust rule severity

---

## Before You Push Code

- [ ] Run `npm run lint` (no errors!)
- [ ] Run `npm run build` (builds successfully)
- [ ] Test your changes locally
- [ ] Remove any `console.log` statements
- [ ] No `debugger` statements
- [ ] All imports use `@/` alias

---

## Project Rules

See **PROJECT_MEMORY.md** for:
- "Remember to do this each time" instructions
- Workflow rules
- Code patterns to follow
- Project-specific gotchas

See **CLAUDE.md** (parent directory) for:
- Project philosophy
- Do NOT be lazy, find root causes
- Simplicity first, minimal changes

---

## Getting Help

1. **TypeScript Errors?** → Check types in `src/types/database.ts`
2. **API Question?** → See parent `CLAUDE.md` - API Endpoints Reference section
3. **Architecture Question?** → Read `.context.md` or `CLAUDE.md`
4. **Stuck on a bug?** → Check PROJECT_MEMORY.md for known issues
5. **New IDE?** → You're reading the right file! (HANDOFF.md)

---

**Happy coding! 🚀**
