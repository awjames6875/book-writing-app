import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/sources/[id] - Get source details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await params

  const { data: user } = await supabase.auth.getUser()
  if (!user.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('sources')
    .select('*, projects!inner(user_id)')
    .eq('id', id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Source not found' }, { status: 404 })
  }

  // Verify ownership
  if (data.projects.user_id !== user.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({ source: data })
}

// DELETE /api/sources/[id] - Delete source and storage file
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await params

  const { data: user } = await supabase.auth.getUser()
  if (!user.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get source to check ownership and get file_url
  const { data: source, error: fetchError } = await supabase
    .from('sources')
    .select('*, projects!inner(user_id)')
    .eq('id', id)
    .single()

  if (fetchError || !source) {
    return NextResponse.json({ error: 'Source not found' }, { status: 404 })
  }

  if (source.projects.user_id !== user.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Delete file from storage if exists
  if (source.file_url) {
    await supabase.storage.from('sources').remove([source.file_url])
  }

  // Delete source record
  const { error: deleteError } = await supabase
    .from('sources')
    .delete()
    .eq('id', id)

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
