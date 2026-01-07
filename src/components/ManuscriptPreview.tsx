'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Download, FileText, BookOpen } from 'lucide-react'

interface ManuscriptStats {
  totalWordCount: number
  chapterCount: number
  chaptersWithDrafts: number
}

interface ManuscriptPreviewProps {
  projectId: string
}

export function ManuscriptPreview({ projectId }: ManuscriptPreviewProps) {
  const [manuscript, setManuscript] = useState<string>('')
  const [stats, setStats] = useState<ManuscriptStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchManuscript() {
      try {
        const response = await fetch(`/api/projects/${projectId}/manuscript`)
        if (!response.ok) throw new Error('Failed to fetch manuscript')

        const data = await response.json()
        setManuscript(data.manuscript)
        setStats(data.stats)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchManuscript()
  }, [projectId])

  const handleDownloadMarkdown = () => {
    window.open(`/api/projects/${projectId}/export/markdown`, '_blank')
  }

  const handleDownloadDocx = () => {
    window.open(`/api/projects/${projectId}/export/docx`, '_blank')
  }

  const handleDownloadBetaGuide = () => {
    window.open(`/api/projects/${projectId}/export/beta-guide`, '_blank')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{stats?.totalWordCount.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total Words</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{stats?.chaptersWithDrafts}/{stats?.chapterCount}</p>
            <p className="text-sm text-muted-foreground">Chapters with Drafts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">
              {stats?.chapterCount ? Math.round((stats.chaptersWithDrafts / stats.chapterCount) * 100) : 0}%
            </p>
            <p className="text-sm text-muted-foreground">Complete</p>
          </CardContent>
        </Card>
      </div>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Options
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button onClick={handleDownloadDocx} variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Download DOCX
          </Button>
          <Button onClick={handleDownloadMarkdown} variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Download Markdown
          </Button>
          <Button onClick={handleDownloadBetaGuide} variant="outline">
            <BookOpen className="mr-2 h-4 w-4" />
            Beta Reader Guide
          </Button>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Manuscript Preview</span>
            {stats?.chaptersWithDrafts === 0 && (
              <Badge variant="secondary">No drafts yet</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-[600px] overflow-y-auto border rounded-lg p-4 bg-muted/30">
            <pre className="whitespace-pre-wrap font-sans text-sm">
              {manuscript || 'No content available. Generate chapter drafts to see your manuscript.'}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
