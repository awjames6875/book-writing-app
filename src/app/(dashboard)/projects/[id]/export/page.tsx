import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { ExportPanel } from '@/components/ExportPanel'
import { ArrowLeft, Download } from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ExportPage({ params }: PageProps) {
  const { id: projectId } = await params
  const supabase = await createClient()

  // Get project
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('id, title, description')
    .eq('id', projectId)
    .single()

  if (projectError || !project) {
    notFound()
  }

  // Get stats for display
  const { count: chapterCount } = await supabase
    .from('chapters')
    .select('*', { count: 'exact', head: true })
    .eq('project_id', projectId)

  const { data: chapters } = await supabase
    .from('chapters')
    .select('id')
    .eq('project_id', projectId)

  const chapterIds = chapters?.map(c => c.id) || []

  const { count: draftCount } = await supabase
    .from('chapter_drafts')
    .select('*', { count: 'exact', head: true })
    .in('chapter_id', chapterIds.length > 0 ? chapterIds : ['none'])

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/projects/${projectId}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Project
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Download className="h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold">Export</h1>
          <p className="text-muted-foreground">{project.title}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-muted/50 rounded-lg p-4">
        <p className="text-sm text-muted-foreground">
          Your manuscript has <strong>{chapterCount || 0}</strong> chapters with{' '}
          <strong>{draftCount || 0}</strong> drafts available for export.
        </p>
      </div>

      <ExportPanel projectId={projectId} />
    </div>
  )
}
