'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2, Share2 } from 'lucide-react'

export interface Quote {
  id: string
  project_id: string
  quote_text: string
  category: string | null
  source_transcript_id: string | null
  chapter_suggested: number[] | null
  social_media_ready: boolean
  created_at: string | null
}

interface QuoteCardProps {
  quote: Quote
  onEdit: (quote: Quote) => void
  onDelete: (quoteId: string) => void
}

export function QuoteCard({ quote, onEdit, onDelete }: QuoteCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Quote text */}
          <blockquote className="text-lg font-medium border-l-4 border-primary pl-4 py-1">
            &ldquo;{quote.quote_text}&rdquo;
          </blockquote>

          {/* Badges and metadata */}
          <div className="flex flex-wrap items-center gap-2">
            {quote.social_media_ready && (
              <Badge variant="default" className="bg-green-600">
                <Share2 className="w-3 h-3 mr-1" />
                Social Ready
              </Badge>
            )}
            {quote.category && (
              <Badge variant="secondary">{quote.category}</Badge>
            )}
            {quote.chapter_suggested && quote.chapter_suggested.length > 0 && (
              <Badge variant="outline">
                Ch. {quote.chapter_suggested.join(', ')}
              </Badge>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(quote)}
            >
              <Pencil className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => onDelete(quote.id)}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
