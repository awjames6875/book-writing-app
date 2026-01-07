import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChapterGenerator } from '@/components/ChapterGenerator'
import { ArrowLeft, FileText } from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string; chapterId: string }>
}

export default async function ChapterDetailPage({ params }: PageProps) {
  const { id: projectId, chapterId } = await params
  const supabase = await createClient()

  // Get chapter with project info
  const { data: chapter, error: chapterError } = await supabase
    .from('chapters')
    .select('id, title, order_index, description, status, target_word_count, project_id')
    .eq('id', chapterId)
    .single()

  if (chapterError || !chapter) {
    notFound()
  }

  // Get content blocks for this chapter
  const { data: contentBlocks } = await supabase
    .from('content_blocks')
    .select('id, content_type, raw_text')
    .eq('chapter_id', chapterId)

  // Get existing drafts
  const { data: drafts } = await supabase
    .from('chapter_drafts')
    .select('id, version, word_count, created_at')
    .eq('chapter_id', chapterId)
    .order('version', { ascending: false })

  const latestDraft = drafts?.[0]
  const hasContent = (contentBlocks?.length || 0) > 0

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

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Chapter {chapter.order_index + 1}: {chapter.title}
          </h1>
          {chapter.description && (
            <p className="text-muted-foreground mt-2">{chapter.description}</p>
          )}
        </div>
        <Badge variant={chapter.status === 'drafted' ? 'default' : 'secondary'}>
          {chapter.status}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Chapter Info */}
        <Card>
          <CardHeader>
            <CardTitle>Chapter Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className="font-medium capitalize">{chapter.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Target Word Count</span>
              <span className="font-medium">
                {chapter.target_word_count?.toLocaleString() || 'Not set'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Content Blocks</span>
              <span className="font-medium">{contentBlocks?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Draft Versions</span>
              <span className="font-medium">{drafts?.length || 0}</span>
            </div>
          </CardContent>
        </Card>

        {/* Latest Draft */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Latest Draft
            </CardTitle>
          </CardHeader>
          <CardContent>
            {latestDraft ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Version</span>
                  <span>{latestDraft.version}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Word Count</span>
                  <span>{latestDraft.word_count?.toLocaleString() || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Created</span>
                  <span>{latestDraft.created_at ? new Date(latestDraft.created_at).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                No drafts generated yet. Use the generator below to create your first draft.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Chapter Generator */}
      <ChapterGenerator
        chapterId={chapterId}
        chapterTitle={chapter.title}
        hasContent={hasContent}
      />
    </div>
  )
}
