'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Wand2, Check, X } from 'lucide-react'

interface QualityCheck {
  criterion: string
  passed: boolean
  notes: string
}

interface GeneratedDraft {
  id: string
  content: string
  word_count: number
  version: number
}

interface ChapterGeneratorProps {
  chapterId: string
  chapterTitle: string
  hasContent: boolean
  onDraftGenerated?: (draft: GeneratedDraft) => void
}

export function ChapterGenerator({
  chapterId,
  chapterTitle,
  hasContent,
  onDraftGenerated,
}: ChapterGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedDraft, setGeneratedDraft] = useState<GeneratedDraft | null>(null)
  const [qualityChecks, setQualityChecks] = useState<QualityCheck[]>([])
  const [overallScore, setOverallScore] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch(`/api/chapters/${chapterId}/generate`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to generate chapter')
      }

      const data = await response.json()
      setGeneratedDraft(data.draft)
      setQualityChecks(data.qualityChecks)
      setOverallScore(data.overallScore)
      onDraftGenerated?.(data.draft)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            AI Chapter Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Generate a draft for &quot;{chapterTitle}&quot; using your Voice DNA profile
            and mapped content blocks.
          </p>

          {!hasContent && (
            <p className="text-sm text-amber-600">
              Note: No content blocks are mapped to this chapter. The AI will generate
              content based on the chapter title and description only.
            </p>
          )}

          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Chapter...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Draft
              </>
            )}
          </Button>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </CardContent>
      </Card>

      {generatedDraft && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Quality Score</span>
                <Badge variant={overallScore >= 70 ? 'default' : 'secondary'}>
                  {overallScore}%
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {qualityChecks.map((check, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 text-sm"
                  >
                    {check.passed ? (
                      <Check className="h-4 w-4 text-green-600 mt-0.5" />
                    ) : (
                      <X className="h-4 w-4 text-red-600 mt-0.5" />
                    )}
                    <div>
                      <p className={check.passed ? 'text-green-700' : 'text-red-700'}>
                        {check.criterion}
                      </p>
                      {check.notes && (
                        <p className="text-muted-foreground text-xs">{check.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Generated Draft (v{generatedDraft.version})</span>
                <Badge variant="outline">{generatedDraft.word_count} words</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap font-sans text-sm">
                  {generatedDraft.content}
                </pre>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
