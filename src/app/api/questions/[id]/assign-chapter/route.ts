import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// PATCH /api/questions/[id]/assign-chapter - Assign question to chapter
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id: questionId } = await params

  const { data: user } = await supabase.auth.getUser()
  if (!user.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { chapter_id } = body

  // chapter_id can be null (to unassign) or a valid UUID
  if (chapter_id !== null && typeof chapter_id !== 'string') {
    return NextResponse.json({ error: 'Invalid chapter_id' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('questions')
    .update({ chapter_id: chapter_id || null })
    .eq('id', questionId)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ question: data })
}
