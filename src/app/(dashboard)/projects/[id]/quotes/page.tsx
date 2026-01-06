import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { QuotesLibrary } from '@/components/QuotesLibrary'
import { ArrowLeft } from 'lucide-react'

export default async function QuotesPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch project
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('id, title')
    .eq('id', id)
    .single()

  if (projectError) {
    notFound()
  }

  // Fetch quotes
  const { data: quotes, error: quotesError } = await supabase
    .from('quotes')
    .select('*')
    .eq('project_id', id)
    .order('created_at', { ascending: false })

  if (quotesError) {
    console.error('Failed to fetch quotes:', quotesError)
  }

  const quotesList = quotes ?? []
  const stats = {
    total: quotesList.length,
    socialMediaReady: quotesList.filter(q => q.social_media_ready).length
  }

  return (
    <div className="container py-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <Link href={`/projects/${id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Project
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Gold Quotes</h1>
        <p className="text-muted-foreground">
          Memorable quotes from {project.title}
        </p>
      </div>

      {/* Quotes Library */}
      <QuotesLibrary
        projectId={id}
        initialQuotes={quotesList}
        initialStats={stats}
      />
    </div>
  )
}
