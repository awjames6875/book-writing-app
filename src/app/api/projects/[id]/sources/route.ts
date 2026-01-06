import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/projects/[id]/sources - List sources for a project
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
    .from('sources')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ sources: data })
}

// POST /api/projects/[id]/sources - Create a new source
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
  const { title, source_type, raw_content, file_url, original_url } = body

  if (!title || !source_type) {
    return NextResponse.json(
      { error: 'title and source_type are required' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('sources')
    .insert({
      project_id: projectId,
      title,
      source_type,
      raw_content: raw_content || null,
      file_url: file_url || null,
      original_url: original_url || null,
      status: raw_content ? 'processing' : 'uploading',
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ source: data }, { status: 201 })
}
