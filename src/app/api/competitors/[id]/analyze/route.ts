import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { analyzeCompetitorReviews } from '@/lib/ai/competitor-analyzer'

// POST /api/competitors/[id]/analyze - Trigger AI analysis of reviews
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await params

  const { data: user } = await supabase.auth.getUser()
  if (!user.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get the competitor book
  const { data: competitor, error: bookError } = await supabase
    .from('competitor_books')
    .select('*')
    .eq('id', id)
    .single()

  if (bookError) {
    return NextResponse.json({ error: 'Competitor not found' }, { status: 404 })
  }

  // Get all reviews for this book
  const { data: reviews, error: reviewsError } = await supabase
    .from('competitor_reviews')
    .select('review_text, rating, pain_points')
    .eq('book_id', id)

  if (reviewsError) {
    return NextResponse.json({ error: reviewsError.message }, { status: 400 })
  }

  if (!reviews || reviews.length === 0) {
    return NextResponse.json(
      { error: 'No reviews to analyze' },
      { status: 400 }
    )
  }

  // Run the AI analysis
  try {
    const analysis = await analyzeCompetitorReviews(
      competitor.title,
      competitor.author,
      reviews
    )

    // Update the competitor book with analysis results
    const { data: updated, error: updateError } = await supabase
      .from('competitor_books')
      .update({
        analysis_summary: analysis.analysis_summary,
        pain_points: analysis.pain_points,
        missing_topics: analysis.missing_topics,
        reader_expectations: analysis.reader_expectations,
        differentiation_recommendations: analysis.differentiation_recommendations,
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 })
    }

    return NextResponse.json({ competitor: updated, analysis })
  } catch (error) {
    console.error('Analysis failed:', error)
    return NextResponse.json(
      { error: 'Failed to analyze reviews' },
      { status: 500 }
    )
  }
}
