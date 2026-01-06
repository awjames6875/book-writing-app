'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, Trash2, Loader2, Sparkles, ExternalLink } from 'lucide-react'
import type { Tables } from '@/types/database'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type CompetitorBook = Tables<'competitor_books'>

interface CompetitorCardProps {
  competitor: CompetitorBook
}

export function CompetitorCard({ competitor }: CompetitorCardProps) {
  const router = useRouter()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const hasAnalysis = competitor.analysis_summary !== null

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    try {
      const response = await fetch(`/api/competitors/${competitor.id}/analyze`, {
        method: 'POST',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to analyze')
      }

      toast.success('Analysis complete')
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to analyze')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this competitor?')) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/competitors/${competitor.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete competitor')
      }

      toast.success('Competitor deleted')
      router.refresh()
    } catch {
      toast.error('Failed to delete competitor')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-zinc-100 p-2 dark:bg-zinc-800">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <CardTitle className="line-clamp-1 text-base">
                {competitor.title}
              </CardTitle>
              {competitor.author && (
                <CardDescription className="text-xs">
                  by {competitor.author}
                </CardDescription>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {competitor.amazon_url && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-zinc-500 hover:text-zinc-900"
                onClick={() => window.open(competitor.amazon_url!, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-zinc-500 hover:text-red-500"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {hasAnalysis ? (
          <>
            {competitor.analysis_summary && (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {competitor.analysis_summary}
              </p>
            )}

            {competitor.pain_points && competitor.pain_points.length > 0 && (
              <div>
                <h4 className="mb-2 text-xs font-medium uppercase text-zinc-500">
                  Pain Points
                </h4>
                <div className="flex flex-wrap gap-1">
                  {competitor.pain_points.slice(0, 3).map((point, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-700 dark:bg-red-900/20 dark:text-red-400"
                    >
                      {point.length > 50 ? point.slice(0, 50) + '...' : point}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {competitor.differentiation_recommendations &&
              competitor.differentiation_recommendations.length > 0 && (
                <div>
                  <h4 className="mb-2 text-xs font-medium uppercase text-zinc-500">
                    Opportunities
                  </h4>
                  <ul className="space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {competitor.differentiation_recommendations.slice(0, 2).map((rec, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-green-500">+</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <p className="mb-3 text-sm text-zinc-500">
              No analysis yet. Analyze reviews to identify market gaps.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analyze Reviews
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
