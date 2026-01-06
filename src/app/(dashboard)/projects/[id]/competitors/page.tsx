import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { CompetitorCard } from '@/components/CompetitorCard'
import { AddCompetitorDialog } from '@/components/AddCompetitorDialog'

export default async function CompetitorsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('id, title')
    .eq('id', id)
    .single()

  if (projectError) {
    notFound()
  }

  const { data: competitors } = await supabase
    .from('competitor_books')
    .select('*')
    .eq('project_id', id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Link
              href="/projects"
              className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              Projects
            </Link>
            <span className="text-zinc-300">/</span>
            <Link
              href={`/projects/${id}`}
              className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              {project.title}
            </Link>
            <span className="text-zinc-300">/</span>
          </div>
          <h1 className="mt-1 text-3xl font-bold">Competitive Analysis</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Analyze competing books to identify market gaps and differentiation opportunities.
          </p>
        </div>
        <AddCompetitorDialog projectId={id} />
      </div>

      {/* Competitors List */}
      {competitors && competitors.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {competitors.map((competitor) => (
            <CompetitorCard key={competitor.id} competitor={competitor} />
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-medium">No competitors yet</h3>
            <p className="mt-1 max-w-md text-center text-sm text-zinc-600 dark:text-zinc-400">
              Add competing books and paste their 3-star Amazon reviews to identify
              what readers want but aren&apos;t getting.
            </p>
            <div className="mt-4">
              <AddCompetitorDialog projectId={id} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Summary */}
      {competitors && competitors.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Market Insights</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <h3 className="mb-3 text-sm font-medium text-zinc-500">
                  Common Pain Points
                </h3>
                <ul className="space-y-2">
                  {competitors
                    .flatMap((c) => c.pain_points || [])
                    .slice(0, 5)
                    .map((point, i) => (
                      <li
                        key={i}
                        className="text-sm text-zinc-600 dark:text-zinc-400"
                      >
                        {point}
                      </li>
                    ))}
                  {competitors.every((c) => !c.pain_points || c.pain_points.length === 0) && (
                    <li className="text-sm text-zinc-400">
                      Run analysis on competitors to see pain points
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="mb-3 text-sm font-medium text-zinc-500">
                  Missing Topics
                </h3>
                <ul className="space-y-2">
                  {competitors
                    .flatMap((c) => c.missing_topics || [])
                    .slice(0, 5)
                    .map((topic, i) => (
                      <li
                        key={i}
                        className="text-sm text-zinc-600 dark:text-zinc-400"
                      >
                        {topic}
                      </li>
                    ))}
                  {competitors.every((c) => !c.missing_topics || c.missing_topics.length === 0) && (
                    <li className="text-sm text-zinc-400">
                      Run analysis on competitors to see missing topics
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="mb-3 text-sm font-medium text-zinc-500">
                  Differentiation Opportunities
                </h3>
                <ul className="space-y-2">
                  {competitors
                    .flatMap((c) => c.differentiation_recommendations || [])
                    .slice(0, 5)
                    .map((rec, i) => (
                      <li
                        key={i}
                        className="text-sm text-zinc-600 dark:text-zinc-400"
                      >
                        {rec}
                      </li>
                    ))}
                  {competitors.every(
                    (c) =>
                      !c.differentiation_recommendations ||
                      c.differentiation_recommendations.length === 0
                  ) && (
                    <li className="text-sm text-zinc-400">
                      Run analysis on competitors to see opportunities
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
