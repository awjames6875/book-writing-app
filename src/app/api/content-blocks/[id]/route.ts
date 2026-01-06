import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id: blockId } = await params

  const { data: user } = await supabase.auth.getUser()
  if (!user.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { chapter_id } = body

  // Validate that the user owns the content block
  const { data: block, error: fetchError } = await supabase
    .from('content_blocks')
    .select('id, project_id')
    .eq('id', blockId)
    .single()

  if (fetchError || !block) {
    return NextResponse.json({ error: 'Content block not found' }, { status: 404 })
  }

  // Update the chapter assignment
  const { data: updatedBlock, error: updateError } = await supabase
    .from('content_blocks')
    .update({ chapter_id: chapter_id ?? null })
    .eq('id', blockId)
    .select()
    .single()

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 })
  }

  return NextResponse.json({ block: updatedBlock })
}
