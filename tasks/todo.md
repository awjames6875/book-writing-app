# Character/People Tracker Implementation

## Plan

Implement the Character/People Tracker feature for StoryForge following existing patterns from Quotes feature.

## Tasks

- [ ] Create API route `src/app/api/projects/[id]/characters/route.ts` (GET list, POST create)
- [ ] Create API route `src/app/api/characters/[id]/route.ts` (GET single, PATCH update, DELETE)
- [ ] Create `src/components/CharacterCard.tsx` component
- [ ] Create `src/components/AddCharacterDialog.tsx` component
- [ ] Create `src/app/(dashboard)/projects/[id]/characters/page.tsx` page
- [ ] Add "Characters" button to Quick Actions in project page
- [ ] Run `npm run build` to verify no errors

## Reference Files

- API pattern: `src/app/api/projects/[id]/quotes/route.ts`, `src/app/api/quotes/[id]/route.ts`
- Component pattern: `src/components/QuoteCard.tsx`, `src/components/EditQuoteDialog.tsx`
- Page pattern: `src/app/(dashboard)/projects/[id]/quotes/page.tsx`
- Types: `src/types/database.ts` (characters table already defined)

## Database Schema (Already Exists)

```typescript
characters: {
  id: string
  project_id: string
  name: string
  role: string | null
  description: string | null
  chapters_appearing: number[] | null
  notes: string | null
  created_at: string | null
  updated_at: string | null
}
```
