'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { QuoteCard, Quote } from './QuoteCard'
import { EditQuoteDialog } from './EditQuoteDialog'

interface QuotesLibraryProps {
  projectId: string
  initialQuotes: Quote[]
  initialStats: {
    total: number
    socialMediaReady: number
  }
}

export function QuotesLibrary({ projectId, initialQuotes, initialStats }: QuotesLibraryProps) {
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes)
  const [stats, setStats] = useState(initialStats)
  const [filter, setFilter] = useState<'all' | 'social'>('all')
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null)

  const filteredQuotes = filter === 'social'
    ? quotes.filter(q => q.social_media_ready)
    : quotes

  // Get unique categories
  const categories = [...new Set(quotes.map(q => q.category).filter(Boolean))]

  const handleEdit = useCallback((quote: Quote) => {
    setEditingQuote(quote)
  }, [])

  const handleDelete = useCallback(async (quoteId: string) => {
    if (!confirm('Are you sure you want to delete this quote?')) return

    try {
      const response = await fetch(`/api/quotes/${quoteId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setQuotes(prev => prev.filter(q => q.id !== quoteId))
        setStats(prev => ({
          total: prev.total - 1,
          socialMediaReady: quotes.find(q => q.id === quoteId)?.social_media_ready
            ? prev.socialMediaReady - 1
            : prev.socialMediaReady
        }))
      }
    } catch (error) {
      console.error('Failed to delete quote:', error)
    }
  }, [quotes])

  const handleSave = useCallback(async (quoteId: string, updates: Partial<Quote>) => {
    const response = await fetch(`/api/quotes/${quoteId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })

    if (response.ok) {
      const { quote: updatedQuote } = await response.json()
      setQuotes(prev => prev.map(q => q.id === quoteId ? updatedQuote : q))

      // Update social media ready count
      const oldQuote = quotes.find(q => q.id === quoteId)
      if (oldQuote && oldQuote.social_media_ready !== updatedQuote.social_media_ready) {
        setStats(prev => ({
          ...prev,
          socialMediaReady: updatedQuote.social_media_ready
            ? prev.socialMediaReady + 1
            : prev.socialMediaReady - 1
        }))
      }
    }
  }, [quotes])

  if (quotes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gold Quotes</CardTitle>
          <CardDescription>No quotes collected yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Record and analyze transcripts to automatically extract memorable quotes.
            Quotes with high confidence scores will be marked as social media ready.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="flex gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Total Quotes</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600">{stats.socialMediaReady}</div>
          <div className="text-sm text-muted-foreground">Social Ready</div>
        </div>
      </div>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={filter === 'all' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => setFilter('all')}
        >
          All ({quotes.length})
        </Badge>
        <Badge
          variant={filter === 'social' ? 'default' : 'outline'}
          className="cursor-pointer bg-green-600"
          onClick={() => setFilter('social')}
        >
          Social Media Ready ({stats.socialMediaReady})
        </Badge>
        {categories.map(cat => (
          <Badge key={cat} variant="outline" className="text-muted-foreground">
            {cat}
          </Badge>
        ))}
      </div>

      {/* Quote cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredQuotes.map(quote => (
          <QuoteCard
            key={quote.id}
            quote={quote}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Edit dialog */}
      <EditQuoteDialog
        quote={editingQuote}
        open={editingQuote !== null}
        onOpenChange={(open) => !open && setEditingQuote(null)}
        onSave={handleSave}
      />
    </div>
  )
}
