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
  const category = searchParams.get('category')
  const socialMediaReady = searchParams.get('socialMediaReady')

  // Build query
  let query = supabase
    .from('quotes')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  // Apply category filter if provided
  if (category) {
    query = query.eq('category', category)
  }

  // Apply social media ready filter if provided
  if (socialMediaReady === 'true') {
    query = query.eq('social_media_ready', true)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  // Calculate stats
  const totalQuotes = data?.length ?? 0
  const socialMediaReadyCount = data?.filter(q => q.social_media_ready).length ?? 0

  return NextResponse.json({
    quotes: data ?? [],
    stats: {
      total: totalQuotes,
      socialMediaReady: socialMediaReadyCount
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
  const { quote_text, category, social_media_ready } = body

  if (!quote_text || quote_text.trim() === '') {
    return NextResponse.json({ error: 'Quote text is required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('quotes')
    .insert({
      project_id: projectId,
      quote_text: quote_text.trim(),
      category: category ?? null,
      social_media_ready: social_media_ready ?? false
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ quote: data })
}
