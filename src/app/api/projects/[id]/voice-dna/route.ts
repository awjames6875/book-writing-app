import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const VALID_CATEGORIES = ['phrase', 'rhythm', 'teaching', 'story', 'quote'] as const
type VoiceDnaCategory = typeof VALID_CATEGORIES[number]

function isValidCategory(value: string): value is VoiceDnaCategory {
  return VALID_CATEGORIES.includes(value as VoiceDnaCategory)
}

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

  // Get category filter from query params
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  // Build query
  let query = supabase
    .from('voice_dna')
    .select('*')
    .eq('project_id', projectId)
    .order('confidence_score', { ascending: false })

  // Apply category filter if provided and valid
  if (category && isValidCategory(category)) {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ patterns: data })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id: projectId } = await params

  const { data: user } = await supabase.auth.getUser()
  if (!user.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get pattern ID from query params (for deleting a single pattern)
  const { searchParams } = new URL(request.url)
  const patternId = searchParams.get('patternId')

  if (patternId) {
    // Delete single pattern
    const { error } = await supabase
      .from('voice_dna')
      .delete()
      .eq('id', patternId)
      .eq('project_id', projectId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
  } else {
    // Delete all patterns for project
    const { error } = await supabase
      .from('voice_dna')
      .delete()
      .eq('project_id', projectId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
  }

  return NextResponse.json({ success: true })
}
