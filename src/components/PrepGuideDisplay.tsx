'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Lightbulb, MessageSquare, Sparkles, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface PrepGuideDisplayProps {
  questionId: string
  questionText: string
  prepGuide: string | null
  memoryPrompts: string[] | null
  starterPhrase: string | null
  onPrepGenerated?: (prep: {
    prep_guide: string
    memory_prompts: string[]
    starter_phrase: string
  }) => void
}

export function PrepGuideDisplay({
  questionId,
  questionText,
  prepGuide,
  memoryPrompts,
  starterPhrase,
  onPrepGenerated
}: PrepGuideDisplayProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const hasPrep = prepGuide || (memoryPrompts && memoryPrompts.length > 0) || starterPhrase

  const handleGeneratePrep = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/ai/generate-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, questionText })
      })

      if (!response.ok) {
        throw new Error('Failed to generate prep')
      }

      const data = await response.json()
      toast.success('Interview prep generated!')
      onPrepGenerated?.(data)
    } catch (error) {
      toast.error('Failed to generate interview prep')
    } finally {
      setIsGenerating(false)
    }
  }

  if (!hasPrep) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Sparkles className="h-8 w-8 text-zinc-400 mb-2" />
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            No prep guide yet
          </p>
          <Button onClick={handleGeneratePrep} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Prep Guide
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Prep Guide */}
      {prepGuide && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Lightbulb className="h-4 w-4" />
              Prep Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {prepGuide}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Memory Prompts */}
      {memoryPrompts && memoryPrompts.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageSquare className="h-4 w-4" />
              Memory Prompts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {memoryPrompts.map((prompt, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400"
                >
                  <span className="text-zinc-400">-</span>
                  <span>{prompt}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Starter Phrase */}
      {starterPhrase && (
        <Card className="bg-zinc-50 dark:bg-zinc-900">
          <CardContent className="py-4">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">
              Start with:
            </p>
            <p className="text-lg font-medium italic">
              &ldquo;{starterPhrase}&rdquo;
            </p>
          </CardContent>
        </Card>
      )}

      {/* Regenerate button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleGeneratePrep}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Regenerating...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Regenerate Prep
          </>
        )}
      </Button>
    </div>
  )
}
