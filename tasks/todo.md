# RAG Chat Interface Implementation

## Tasks

- [x] Create database migration for chat_sessions and chat_messages tables
- [x] Create RAG chat implementation in src/lib/ai/rag-chat.ts
- [x] Create API route for chat POST/GET at projects/[id]/chat
- [x] Create API route for session messages at chat/sessions/[id]
- [x] Create ChatMessage component
- [x] Create ChatInterface component
- [x] Create chat page at projects/[id]/chat
- [x] Add Chat with Sources button to project page
- [x] Run build and fix any errors

---

## Review

### Summary

Implemented the complete RAG Chat Interface feature for StoryForge. This feature allows users to "talk to their sources" - asking questions and receiving AI-generated answers with citations from their uploaded research materials.

### Files Created

**Database Migration**
- `supabase/migrations/006_chat_sessions.sql` - Creates:
  - `chat_sessions` table: id, project_id, title, source_ids, created_at, updated_at
  - `chat_messages` table: id, session_id, role, content, citations, created_at
  - Indexes and RLS policies for both tables
  - Update trigger for chat_sessions.updated_at

**AI Utilities**
- `src/lib/ai/rag-chat.ts` - Contains:
  - `generateEmbedding()` - Creates embeddings using OpenAI text-embedding-3-small
  - `findRelevantChunks()` - Queries source_chunks by vector similarity (with text fallback)
  - `generateRagResponse()` - Combines relevant chunks with Claude to generate answers with citations

**API Routes**
- `src/app/api/projects/[id]/chat/route.ts` - GET (list sessions), POST (send message with RAG)
- `src/app/api/chat/sessions/[id]/route.ts` - GET (session messages), DELETE (session)

**UI Components**
- `src/components/ChatMessage.tsx` - Message bubble component displaying:
  - User/assistant avatar icons
  - Message content with different styling per role
  - Collapsible citations panel with source snippets
  - Timestamp

- `src/components/ChatInterface.tsx` - Full chat UI with:
  - Session sidebar with history and delete buttons
  - "New Chat" button to start fresh conversation
  - Message list with auto-scroll
  - Input form with send button
  - Loading states for messages and sessions

**Page**
- `src/app/(dashboard)/projects/[id]/chat/page.tsx` - Features:
  - Breadcrumb navigation
  - Page header showing source count
  - ChatInterface component

### Files Modified

- `src/app/(dashboard)/projects/[id]/page.tsx` - Added "Chat with Sources" button to Quick Actions

### Database Schema

```typescript
chat_sessions: {
  id: string
  project_id: string
  title: string | null
  source_ids: Json | null  // Array of source IDs to filter context
  created_at: string | null
  updated_at: string | null
}

chat_messages: {
  id: string
  session_id: string
  role: string  // 'user' | 'assistant'
  content: string
  citations: Json | null  // Array of {chunkId, sourceId, sourceTitle, snippet}
  created_at: string | null
}
```

### Routes Available

- `/projects/[id]/chat` - Chat page (protected)
- `/api/projects/[id]/chat` - API endpoint (GET sessions, POST message)
- `/api/chat/sessions/[id]` - API endpoint (GET messages, DELETE session)

### Workflow

1. User navigates to "Chat with Sources" from project page
2. User types a question in the input field
3. System generates embedding for the question using OpenAI
4. System queries source_chunks by vector similarity to find relevant content
5. System sends question + relevant chunks to Claude for response generation
6. Claude generates answer based ONLY on provided source context
7. Response is displayed with collapsible citations showing source snippets
8. Conversation history is maintained per session for context
9. User can view past sessions in sidebar and continue conversations

### Key Design Decisions

1. **Vector Search with Fallback**: Attempts pgvector RPC first, then falls back to simple text-based retrieval if vector search isn't available
2. **Session Management**: Chats are organized into sessions for conversation continuity
3. **Citation Display**: Citations are collapsible to keep UI clean while preserving source transparency
4. **Conversation History**: API includes last 10 messages for context when generating responses
5. **Auto-title**: New sessions are automatically titled with the first 50 chars of the initial message

### Build Status

Build completed successfully with no errors. All new routes are properly registered:
- `/api/projects/[id]/chat`
- `/api/chat/sessions/[id]`
- `/projects/[id]/chat`
