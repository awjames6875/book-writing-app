'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Quote } from './QuoteCard'

interface EditQuoteDialogProps {
  quote: Quote | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (quoteId: string, updates: Partial<Quote>) => Promise<void>
}

const CATEGORY_SUGGESTIONS = [
  'Identity',
  'Transformation',
  'Faith',
  'Leadership',
  'Relationships',
  'Success',
  'Struggle',
  'Wisdom',
  'Inspiration',
  'Humor'
]

export function EditQuoteDialog({ quote, open, onOpenChange, onSave }: EditQuoteDialogProps) {
  const [category, setCategory] = useState(quote?.category ?? '')
  const [socialMediaReady, setSocialMediaReady] = useState(quote?.social_media_ready ?? false)
  const [saving, setSaving] = useState(false)

  // Reset form when quote changes
  if (quote && category !== (quote.category ?? '') && !saving) {
    setCategory(quote.category ?? '')
    setSocialMediaReady(quote.social_media_ready)
  }

  const handleSave = async () => {
    if (!quote) return
    setSaving(true)
    try {
      await onSave(quote.id, {
        category: category || null,
        social_media_ready: socialMediaReady
      })
      onOpenChange(false)
    } finally {
      setSaving(false)
    }
  }

  if (!quote) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Quote</DialogTitle>
          <DialogDescription>
            Update the category and social media status for this quote.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Quote preview */}
          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm italic">&ldquo;{quote.quote_text}&rdquo;</p>
          </div>

          {/* Category input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Enter category..."
              list="category-suggestions"
            />
            <datalist id="category-suggestions">
              {CATEGORY_SUGGESTIONS.map(cat => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
            <p className="text-xs text-muted-foreground">
              Suggestions: {CATEGORY_SUGGESTIONS.slice(0, 5).join(', ')}...
            </p>
          </div>

          {/* Social media ready toggle */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Social Media Ready</label>
              <p className="text-xs text-muted-foreground">
                Mark as ready for social media sharing
              </p>
            </div>
            <Button
              type="button"
              variant={socialMediaReady ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSocialMediaReady(!socialMediaReady)}
            >
              {socialMediaReady ? 'Yes' : 'No'}
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
