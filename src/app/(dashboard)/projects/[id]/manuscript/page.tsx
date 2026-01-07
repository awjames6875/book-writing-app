import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { ManuscriptPreview } from '@/components/ManuscriptPreview'
import { ArrowLeft, BookOpen } from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ManuscriptPage({ params }: PageProps) {
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
        <BookOpen className="h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold">Manuscript</h1>
          <p className="text-muted-foreground">{project.title}</p>
        </div>
      </div>

      <ManuscriptPreview projectId={projectId} />
    </div>
  )
}
