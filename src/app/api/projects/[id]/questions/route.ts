import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/projects/[id]/questions - List questions for a project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id: projectId } = await params

  const { data: user } = await supabase.auth.getUser()
  if (!user.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('project_id', projectId)
    .order('order_index', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ questions: data })
}

// POST /api/projects/[id]/questions - Create a new question
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id: projectId } = await params

  const { data: user } = await supabase.auth.getUser()
  if (!user.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { text, chapter_id } = body

  if (!text) {
    return NextResponse.json({ error: 'Question text is required' }, { status: 400 })
  }

  // Get next order_index
  const { data: lastQuestion } = await supabase
    .from('questions')
    .select('order_index')
    .eq('project_id', projectId)
    .order('order_index', { ascending: false })
    .limit(1)
    .single()

  const nextOrderIndex = (lastQuestion?.order_index ?? -1) + 1

  const { data, error } = await supabase
    .from('questions')
    .insert({
      project_id: projectId,
      chapter_id: chapter_id || null,
      text,
      order_index: nextOrderIndex,
      status: 'unanswered',
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ question: data }, { status: 201 })
}
