'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, Sparkles, Loader2, Lightbulb, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'
import type { Tables } from '@/types/database'

type Question = Tables<'questions'>

interface InterviewPrepQuestionProps {
  question: Question
}

export function InterviewPrepQuestion({ question: initialQuestion }: InterviewPrepQuestionProps) {
  const [question, setQuestion] = useState(initialQuestion)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const hasPrep = question.prep_guide ||
    (question.memory_prompts && question.memory_prompts.length > 0) ||
    question.starter_phrase

  const handleGeneratePrep = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/ai/generate-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: question.id,
          questionText: question.text,
          context: question.context_notes
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate prep')
      }

      const data = await response.json()
      setQuestion({
        ...question,
        prep_guide: data.prep_guide,
        memory_prompts: data.memory_prompts,
        starter_phrase: data.starter_phrase
      })
      setIsExpanded(true)
      toast.success('Interview prep generated!')
    } catch (error) {
      toast.error('Failed to generate interview prep')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-base font-medium">
              {question.text}
            </CardTitle>
            {question.section && (
              <p className="mt-1 text-xs text-zinc-500">
                Section: {question.section}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasPrep ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleGeneratePrep}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Prep
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      {isExpanded && hasPrep && (
        <CardContent className="space-y-4 border-t pt-4">
          {/* Prep Guide */}
          {question.prep_guide && (
            <div>
              <div className="flex items-center gap-2 text-sm font-medium mb-1">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                Prep Guide
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {question.prep_guide}
              </p>
            </div>
          )}

          {/* Memory Prompts */}
          {question.memory_prompts && question.memory_prompts.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-sm font-medium mb-1">
                <MessageSquare className="h-4 w-4 text-blue-500" />
                Memory Prompts
              </div>
              <ul className="space-y-1">
                {question.memory_prompts.map((prompt, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400"
                  >
                    <span className="text-zinc-400">-</span>
                    <span>{prompt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Starter Phrase */}
          {question.starter_phrase && (
            <div className="rounded-lg bg-zinc-50 dark:bg-zinc-900 p-3">
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                Start with:
              </p>
              <p className="font-medium italic">
                &ldquo;{question.starter_phrase}&rdquo;
              </p>
            </div>
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
                Regenerate
              </>
            )}
          </Button>
        </CardContent>
      )}
    </Card>
  )
}
