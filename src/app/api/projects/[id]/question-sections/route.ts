import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

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
    .from('question_sections')
    .select('*')
    .eq('project_id', projectId)
    .order('question_start', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ sections: data ?? [] })
}

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
  const { section_name, question_start, question_end } = body

  if (!section_name || question_start === undefined || question_end === undefined) {
    return NextResponse.json(
      { error: 'section_name, question_start, and question_end are required' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('question_sections')
    .insert({
      project_id: projectId,
      section_name,
      question_start,
      question_end,
      completion_percentage: 0,
      status: 'not_started'
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ section: data })
}
