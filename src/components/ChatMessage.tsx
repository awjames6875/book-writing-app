'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, Bot, ChevronDown, ChevronUp, FileText } from 'lucide-react'
import { useState } from 'react'

interface Citation {
  chunkId: string
  sourceId: string
  sourceTitle: string
  snippet: string
}

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  citations?: Citation[]
  createdAt?: string
}

export function ChatMessage({ role, content, citations, createdAt }: ChatMessageProps) {
  const [showCitations, setShowCitations] = useState(false)
  const isUser = role === 'user'
  const hasCitations = citations && citations.length > 0

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser ? 'bg-blue-100 dark:bg-blue-900' : 'bg-zinc-100 dark:bg-zinc-800'
        }`}
      >
        {isUser ? (
          <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        ) : (
          <Bot className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex max-w-[80%] flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}>
        <Card
          className={`${
            isUser
              ? 'bg-blue-50 dark:bg-blue-950'
              : 'bg-zinc-50 dark:bg-zinc-900'
          }`}
        >
          <CardContent className="p-3">
            <p className="whitespace-pre-wrap text-sm">{content}</p>
          </CardContent>
        </Card>

        {/* Citations Toggle */}
        {hasCitations && (
          <div className="w-full">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCitations(!showCitations)}
              className="h-7 gap-1 px-2 text-xs text-zinc-500"
            >
              <FileText className="h-3 w-3" />
              {citations.length} source{citations.length !== 1 ? 's' : ''}
              {showCitations ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </Button>

            {showCitations && (
              <div className="mt-2 space-y-2">
                {citations.map((citation, index) => (
                  <Card key={citation.chunkId || index} className="bg-amber-50 dark:bg-amber-950/30">
                    <CardContent className="p-2">
                      <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
                        {citation.sourceTitle}
                      </p>
                      <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                        &quot;{citation.snippet}&quot;
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Timestamp */}
        {createdAt && (
          <span className="text-xs text-zinc-400">
            {new Date(createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        )}
      </div>
    </div>
  )
}
