# Auto Character Detection Feature

## Task Overview
Build an AI-powered feature that automatically detects and extracts character/people names from transcripts and sources.

## Plan

### Files to Create
1. `src/lib/ai/character-detector.ts` - Claude-powered name extraction
2. `src/app/api/projects/[id]/detect-characters/route.ts` - API endpoint
3. `src/components/DetectCharactersButton.tsx` - Button component with results display

### Files to Modify
1. `src/components/CharactersLibrary.tsx` - Add detect button to the UI

---

## Todo Items

- [ ] Create `src/lib/ai/character-detector.ts`
  - Function `detectCharacters(content: string)` using Claude API
  - Returns array of `{ name, role?, context }` objects
  - Follow pattern from `content-analyzer.ts`

- [ ] Create `src/app/api/projects/[id]/detect-characters/route.ts`
  - POST endpoint with auth check
  - Fetch transcripts (via recordings) and sources for project
  - Combine text content
  - Call detectCharacters()
  - Return detected characters (no auto-save)

- [ ] Create `src/components/DetectCharactersButton.tsx`
  - Client component with loading state
  - Shows detected results in a list
  - Each result has "Add" button to save character

- [ ] Update `src/components/CharactersLibrary.tsx`
  - Import and add DetectCharactersButton component
  - Pass onSave handler for adding detected characters

- [ ] Run build to verify no errors

---

## Review
(To be completed after implementation)
