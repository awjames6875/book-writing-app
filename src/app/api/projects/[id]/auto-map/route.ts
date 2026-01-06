import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { mapContentBlocksBatch } from '@/lib/ai/content-mapper'

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

  // Get unmapped content blocks
  const { data: blocks, error: blocksError } = await supabase
    .from('content_blocks')
    .select('id, raw_text')
    .eq('project_id', projectId)
    .is('chapter_id', null)

  if (blocksError) {
    return NextResponse.json({ error: blocksError.message }, { status: 400 })
  }

  if (!blocks || blocks.length === 0) {
    return NextResponse.json({
      message: 'No unmapped blocks found',
      mapped: 0,
      suggestions: []
    })
  }

  // Get chapters for mapping
  const { data: chapters, error: chaptersError } = await supabase
    .from('chapters')
    .select('id, title, description, order_index')
    .eq('project_id', projectId)
    .order('order_index', { ascending: true })

  if (chaptersError) {
    return NextResponse.json({ error: chaptersError.message }, { status: 400 })
  }

  if (!chapters || chapters.length === 0) {
    return NextResponse.json({
      message: 'No chapters available for mapping',
      mapped: 0,
      suggestions: []
    })
  }

  // Get AI suggestions for mapping
  const suggestions = await mapContentBlocksBatch(blocks, chapters)

  // Auto-apply mappings with high confidence (>= 70%)
  let mappedCount = 0
  for (const suggestion of suggestions) {
    if (suggestion.chapterId && suggestion.confidence >= 70) {
      const { error: updateError } = await supabase
        .from('content_blocks')
        .update({ chapter_id: suggestion.chapterId })
        .eq('id', suggestion.blockId)

      if (!updateError) {
        mappedCount++
      }
    }
  }

  return NextResponse.json({
    message: `Auto-mapped ${mappedCount} of ${blocks.length} blocks`,
    mapped: mappedCount,
    suggestions: suggestions.map(s => ({
      ...s,
      applied: s.chapterId !== null && s.confidence >= 70
    }))
  })
}
