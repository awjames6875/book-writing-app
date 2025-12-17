'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, X } from 'lucide-react'

interface Question {
  id: string
  text: string
  status: string | null
  chapter_id: string | null
}

interface QuestionSelectorProps {
  projectId: string
  selectedId: string | null
  onSelect: (questionId: string | null) => void
}

export function QuestionSelector({ projectId, selectedId, onSelect }: QuestionSelectorProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch(`/api/projects/${projectId}/questions`)
        if (res.ok) {
          const data = (await res.json()) as { questions: Question[] }
          setQuestions(data.questions ?? [])
        }
      } finally {
        setLoading(false)
      }
    }
    fetchQuestions()
  }, [projectId])

  if (loading) return null

  // Filter to unanswered/partial questions only
  const availableQuestions = questions.filter((q) => q.status !== 'complete')

  if (availableQuestions.length === 0) return null

  return (
    <Card>
      <CardContent className="py-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium">
            {selectedId ? 'Recording answer for:' : 'Select a question (optional):'}
          </span>
          {selectedId && (
            <Button variant="ghost" size="sm" onClick={() => onSelect(null)}>
              <X className="mr-1 h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
        <div className="space-y-2">
          {availableQuestions.slice(0, 5).map((question) => (
            <button
              key={question.id}
              onClick={() => onSelect(question.id === selectedId ? null : question.id)}
              className={`w-full rounded-lg border p-3 text-left text-sm transition-colors ${
                question.id === selectedId
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950'
                  : 'hover:bg-zinc-50 dark:hover:bg-zinc-800'
              }`}
            >
              <div className="flex items-start gap-2">
                {question.id === selectedId && (
                  <Check className="mt-0.5 h-4 w-4 text-indigo-600" />
                )}
                <span className="line-clamp-2">{question.text}</span>
              </div>
            </button>
          ))}
        </div>
        {availableQuestions.length > 5 && (
          <p className="mt-2 text-xs text-zinc-500">
            +{availableQuestions.length - 5} more questions
          </p>
        )}
      </CardContent>
    </Card>
  )
}
