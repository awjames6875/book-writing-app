import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/competitors/[id] - Get a single competitor with reviews
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

  const { data: competitor, error: bookError } = await supabase
    .from('competitor_books')
    .select('*')
    .eq('id', id)
    .single()

  if (bookError) {
    return NextResponse.json({ error: bookError.message }, { status: 404 })
  }

  const { data: reviews, error: reviewsError } = await supabase
    .from('competitor_reviews')
    .select('*')
    .eq('book_id', id)
    .order('created_at', { ascending: true })

  if (reviewsError) {
    return NextResponse.json({ error: reviewsError.message }, { status: 400 })
  }

  return NextResponse.json({ competitor, reviews })
}

// DELETE /api/competitors/[id] - Delete a competitor and its reviews
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

  // Reviews will be cascade deleted due to FK constraint
  const { error } = await supabase
    .from('competitor_books')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
