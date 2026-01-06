import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { analyzeReview } from '@/lib/ai/competitor-analyzer'

// GET /api/projects/[id]/competitors - List competitors for a project
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
    .from('competitor_books')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ competitors: data })
}

// POST /api/projects/[id]/competitors - Create a new competitor with reviews
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
  const { title, author, amazon_url, reviews } = body

  if (!title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 })
  }

  // Create the competitor book record
  const { data: competitor, error: bookError } = await supabase
    .from('competitor_books')
    .insert({
      project_id: projectId,
      title,
      author: author || null,
      amazon_url: amazon_url || null,
    })
    .select()
    .single()

  if (bookError) {
    return NextResponse.json({ error: bookError.message }, { status: 400 })
  }

  // If reviews are provided, analyze and insert them
  if (reviews && Array.isArray(reviews) && reviews.length > 0) {
    const reviewRecords = []

    for (const review of reviews) {
      if (!review.review_text || review.review_text.trim().length === 0) {
        continue
      }

      // Analyze each review for pain points
      let painPoints: string[] = []
      try {
        const analysis = await analyzeReview(review.review_text)
        painPoints = analysis.pain_points
      } catch {
        // Continue without analysis if it fails
      }

      reviewRecords.push({
        book_id: competitor.id,
        rating: review.rating || null,
        review_text: review.review_text.trim(),
        pain_points: painPoints,
      })
    }

    if (reviewRecords.length > 0) {
      const { error: reviewError } = await supabase
        .from('competitor_reviews')
        .insert(reviewRecords)

      if (reviewError) {
        // Log but don't fail the request
        console.error('Failed to insert reviews:', reviewError)
      }
    }
  }

  return NextResponse.json({ competitor }, { status: 201 })
}
