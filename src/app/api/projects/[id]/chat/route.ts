import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateRagResponse } from '@/lib/ai/rag-chat'
import { Json } from '@/types/database'

// GET: List chat sessions for a project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params
  const supabase = await createClient()

  const { data: user } = await supabase.auth.getUser()
  if (!user.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify project access
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('id')
    .eq('id', projectId)
    .single()

  if (projectError || !project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }

  // Get all chat sessions for this project
  const { data: sessions, error } = await supabase
    .from('chat_sessions')
    .select('id, title, created_at, updated_at')
    .eq('project_id', projectId)
    .order('updated_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ sessions })
}

// POST: Send a message and get AI response
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params
  const supabase = await createClient()

  const { data: user } = await supabase.auth.getUser()
  if (!user.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify project access
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('id')
    .eq('id', projectId)
    .single()

  if (projectError || !project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }

  const body = await request.json()
  const { message, sessionId } = body

  if (!message || typeof message !== 'string') {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 })
  }

  let currentSessionId = sessionId

  // Create a new session if none provided
  if (!currentSessionId) {
    const title = message.slice(0, 50) + (message.length > 50 ? '...' : '')
    const { data: newSession, error: sessionError } = await supabase
      .from('chat_sessions')
      .insert({
        project_id: projectId,
        title
      })
      .select('id')
      .single()

    if (sessionError || !newSession) {
      return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
    }

    currentSessionId = newSession.id
  }

  // Get conversation history for context
  const { data: historyMessages } = await supabase
    .from('chat_messages')
    .select('role, content')
    .eq('session_id', currentSessionId)
    .order('created_at', { ascending: true })
    .limit(10)

  const conversationHistory = (historyMessages || []).map(msg => ({
    role: msg.role as 'user' | 'assistant',
    content: msg.content
  }))

  // Save the user message
  const { error: userMsgError } = await supabase
    .from('chat_messages')
    .insert({
      session_id: currentSessionId,
      role: 'user',
      content: message
    })

  if (userMsgError) {
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
  }

  // Generate RAG response
  try {
    const { answer, citations } = await generateRagResponse(
      projectId,
      message,
      conversationHistory
    )

    // Save the assistant message
    const { data: assistantMessage, error: assistantMsgError } = await supabase
      .from('chat_messages')
      .insert({
        session_id: currentSessionId,
        role: 'assistant',
        content: answer,
        citations: citations as unknown as Json
      })
      .select('id, role, content, citations, created_at')
      .single()

    if (assistantMsgError) {
      return NextResponse.json({ error: 'Failed to save response' }, { status: 500 })
    }

    // Update session's updated_at
    await supabase
      .from('chat_sessions')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', currentSessionId)

    return NextResponse.json({
      sessionId: currentSessionId,
      message: assistantMessage
    })
  } catch (error) {
    console.error('RAG chat error:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}
