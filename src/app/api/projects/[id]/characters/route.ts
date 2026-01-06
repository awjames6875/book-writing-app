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

  // Get filter params
  const { searchParams } = new URL(request.url)
  const role = searchParams.get('role')

  // Build query
  let query = supabase
    .from('characters')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  // Apply role filter if provided
  if (role) {
    query = query.eq('role', role)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  // Calculate stats
  const totalCharacters = data?.length ?? 0
  const roles = [...new Set(data?.map(c => c.role).filter(Boolean))]

  return NextResponse.json({
    characters: data ?? [],
    stats: {
      total: totalCharacters,
      roles: roles
    }
  })
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
  const { name, role, description, chapters_appearing, notes } = body

  if (!name || name.trim() === '') {
    return NextResponse.json({ error: 'Character name is required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('characters')
    .insert({
      project_id: projectId,
      name: name.trim(),
      role: role ?? null,
      description: description ?? null,
      chapters_appearing: chapters_appearing ?? null,
      notes: notes ?? null
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ character: data })
}
