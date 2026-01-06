import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { UnmappedBlocksList } from '@/components/UnmappedBlocksList'
import { ContentBlockCard } from '@/components/ContentBlockCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function ContentMappingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: projectId } = await params
  const supabase = await createClient()

  // Get project
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('id, title')
    .eq('id', projectId)
    .single()

  if (projectError || !project) {
    notFound()
  }

  // Get chapters
  const { data: chapters } = await supabase
    .from('chapters')
    .select('id, title, order_index')
    .eq('project_id', projectId)
    .order('order_index', { ascending: true })

  // Get unmapped blocks
  const { data: unmappedBlocks } = await supabase
    .from('content_blocks')
    .select('id, raw_text, polished_text, content_type, status, chapter_id, created_at')
    .eq('project_id', projectId)
    .is('chapter_id', null)
    .order('created_at', { ascending: false })

  // Get mapped blocks count per chapter
  const { data: allBlocks } = await supabase
    .from('content_blocks')
    .select('id, chapter_id')
    .eq('project_id', projectId)

  const mappedBlocksCount = allBlocks?.filter((b) => b.chapter_id !== null).length ?? 0
  const totalBlocksCount = allBlocks?.length ?? 0

  return (
    <div className="space-y-8">
      {/* Header */}
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
            href={`/projects/${projectId}`}
            className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            {project.title}
          </Link>
          <span className="text-zinc-300">/</span>
        </div>
        <h1 className="mt-1 text-3xl font-bold">Content Mapping</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Assign content blocks to chapters for your manuscript
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Total Blocks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalBlocksCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Mapped
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {mappedBlocksCount}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Unmapped
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {unmappedBlocks?.length ?? 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Unmapped Blocks */}
      <UnmappedBlocksList
        projectId={projectId}
        initialBlocks={unmappedBlocks ?? []}
        chapters={chapters ?? []}
      />

      {/* Chapters with no blocks info */}
      {chapters && chapters.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-medium">No chapters yet</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Create chapters first before mapping content
            </p>
            <Link
              href={`/projects/${projectId}`}
              className="mt-4 text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              Go to project page to create chapters
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
