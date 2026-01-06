import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChapterCard } from '@/components/ChapterCard'
import { CreateChapterDialog } from '@/components/CreateChapterDialog'
import { ProjectStats } from '@/components/ProjectStats'
import { VoiceDnaViewer } from '@/components/VoiceDnaViewer'
import { VoiceConfidenceDashboard } from '@/components/VoiceConfidenceDashboard'

const statusLabels: Record<string, string> = {
  draft: 'Draft',
  in_progress: 'In Progress',
  review: 'Review',
  complete: 'Complete',
}

interface Chapter {
  id: string
  current_word_count: number | null
}

function calculateWordCount(chapters: Chapter[] | null): number {
  if (chapters === null) return 0
  return chapters.reduce((sum, ch) => sum + (ch.current_word_count ?? 0), 0)
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error !== null) {
    notFound()
  }

  const { data: chapters } = await supabase
    .from('chapters')
    .select('*')
    .eq('project_id', id)
    .order('order_index', { ascending: true })

  const { count: totalQuestions } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true })
    .eq('project_id', id)

  const { count: answeredQuestions } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true })
    .eq('project_id', id)
    .eq('status', 'complete')

  const currentWordCount = calculateWordCount(chapters)

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
          </div>
          <h1 className="mt-1 text-3xl font-bold">{project.title}</h1>
          {project.description !== null && project.description !== '' && (
            <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
              {project.description}
            </p>
          )}
          <div className="mt-3 flex items-center gap-3">
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm dark:bg-zinc-800">
              {statusLabels[project.status ?? 'draft']}
            </span>
            <span className="text-sm text-zinc-500">
              Target: {(project.target_word_count ?? 50000).toLocaleString()} words
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <ProjectStats
        chaptersCount={chapters?.length ?? 0}
        questionsAnswered={answeredQuestions ?? 0}
        questionsTotal={totalQuestions ?? 0}
        currentWordCount={currentWordCount}
        targetWordCount={project.target_word_count ?? 50000}
      />

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="outline" asChild>
            <Link href={`/projects/${id}/questions`}>Manage Questions</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/projects/${id}/prep`}>Interview Prep</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/projects/${id}/record`}>Record Session</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/projects/${id}/sources`}>View Sources</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/projects/${id}/chat`}>Chat with Sources</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/projects/${id}/quotes`}>Gold Quotes</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/projects/${id}/characters`}>Characters</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/projects/${id}/gaps`}>Gap Analysis</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/projects/${id}/mapping`}>Map Content</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/projects/${id}/competitors`}>Competitors</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Voice DNA */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Voice DNA</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <VoiceConfidenceDashboard projectId={id} />
          </div>
          <div className="lg:col-span-2">
            <VoiceDnaViewer projectId={id} />
          </div>
        </div>
      </div>

      {/* Chapters */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Chapters</h2>
          <CreateChapterDialog projectId={id} />
        </div>

        {chapters && chapters.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {chapters.map((chapter) => (
              <ChapterCard key={chapter.id} chapter={chapter} projectId={id} />
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <h3 className="text-lg font-medium">No chapters yet</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Create your first chapter to start organizing your book
              </p>
              <div className="mt-4">
                <CreateChapterDialog projectId={id} />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
