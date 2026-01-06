import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id: quoteId } = await params

  const { data: user } = await supabase.auth.getUser()
  if (!user.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('quotes')
    .select('*, projects!inner(user_id)')
    .eq('id', quoteId)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  if (!data || data.projects.user_id !== user.user.id) {
    return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
  }

  return NextResponse.json({ quote: data })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id: quoteId } = await params

  const { data: user } = await supabase.auth.getUser()
  if (!user.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify ownership
  const { data: existing } = await supabase
    .from('quotes')
    .select('*, projects!inner(user_id)')
    .eq('id', quoteId)
    .single()

  if (!existing || existing.projects.user_id !== user.user.id) {
    return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
  }

  const body = await request.json()
  const { category, social_media_ready, chapter_suggested } = body

  const updates: Record<string, unknown> = {}
  if (category !== undefined) updates.category = category
  if (social_media_ready !== undefined) updates.social_media_ready = social_media_ready
  if (chapter_suggested !== undefined) updates.chapter_suggested = chapter_suggested

  const { data, error } = await supabase
    .from('quotes')
    .update(updates)
    .eq('id', quoteId)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ quote: data })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id: quoteId } = await params

  const { data: user } = await supabase.auth.getUser()
  if (!user.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify ownership
  const { data: existing } = await supabase
    .from('quotes')
    .select('*, projects!inner(user_id)')
    .eq('id', quoteId)
    .single()

  if (!existing || existing.projects.user_id !== user.user.id) {
    return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
  }

  const { error } = await supabase
    .from('quotes')
    .delete()
    .eq('id', quoteId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
