import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { SourceCard } from '@/components/SourceCard'
import { AddSourceDialog } from '@/components/AddSourceDialog'

export default async function SourcesPage({
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

  const { data: sources } = await supabase
    .from('sources')
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
          <h1 className="mt-1 text-3xl font-bold">Sources</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Upload and manage your research materials, notes, and content.
          </p>
        </div>
        <AddSourceDialog projectId={id} />
      </div>

      {/* Sources List */}
      {sources && sources.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {sources.map((source) => (
            <SourceCard key={source.id} source={source} />
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-medium">No sources yet</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Add your first source to start building your content library
            </p>
            <div className="mt-4">
              <AddSourceDialog projectId={id} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
