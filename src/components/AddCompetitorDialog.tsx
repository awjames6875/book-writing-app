'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Plus, X } from 'lucide-react'

interface AddCompetitorDialogProps {
  projectId: string
}

interface ReviewInput {
  id: string
  rating: number
  review_text: string
}

export function AddCompetitorDialog({ projectId }: AddCompetitorDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [amazonUrl, setAmazonUrl] = useState('')
  const [reviews, setReviews] = useState<ReviewInput[]>([
    { id: '1', rating: 3, review_text: '' },
  ])

  function addReview() {
    setReviews([
      ...reviews,
      { id: Date.now().toString(), rating: 3, review_text: '' },
    ])
  }

  function removeReview(id: string) {
    if (reviews.length === 1) return
    setReviews(reviews.filter((r) => r.id !== id))
  }

  function updateReview(id: string, field: keyof ReviewInput, value: string | number) {
    setReviews(
      reviews.map((r) =>
        r.id === id ? { ...r, [field]: value } : r
      )
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      toast.error('Book title is required')
      return
    }

    const validReviews = reviews.filter((r) => r.review_text.trim().length > 0)
    if (validReviews.length === 0) {
      toast.error('At least one review is required')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/projects/${projectId}/competitors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          author: author.trim() || null,
          amazon_url: amazonUrl.trim() || null,
          reviews: validReviews.map((r) => ({
            rating: r.rating,
            review_text: r.review_text.trim(),
          })),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to add competitor')
      }

      toast.success('Competitor added successfully')
      setOpen(false)
      resetForm()
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add competitor')
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setTitle('')
    setAuthor('')
    setAmazonUrl('')
    setReviews([{ id: '1', rating: 3, review_text: '' }])
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Competitor
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Competitor Book</DialogTitle>
            <DialogDescription>
              Add a competing book and paste its 3-star reviews to analyze market gaps.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Book Title *
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Atomic Habits"
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="author" className="text-sm font-medium">
                  Author
                </label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g., James Clear"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="amazonUrl" className="text-sm font-medium">
                Amazon URL (optional)
              </label>
              <Input
                id="amazonUrl"
                type="url"
                value={amazonUrl}
                onChange={(e) => setAmazonUrl(e.target.value)}
                placeholder="https://amazon.com/..."
                disabled={loading}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Reviews (paste 3-star reviews)</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addReview}
                  disabled={loading}
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Add Review
                </Button>
              </div>

              {reviews.map((review, index) => (
                <div key={review.id} className="space-y-2 rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-500">Review {index + 1}</span>
                    <div className="flex items-center gap-2">
                      <select
                        value={review.rating}
                        onChange={(e) =>
                          updateReview(review.id, 'rating', parseInt(e.target.value))
                        }
                        className="rounded border px-2 py-1 text-sm"
                        disabled={loading}
                      >
                        <option value={1}>1 star</option>
                        <option value={2}>2 stars</option>
                        <option value={3}>3 stars</option>
                        <option value={4}>4 stars</option>
                        <option value={5}>5 stars</option>
                      </select>
                      {reviews.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeReview(review.id)}
                          disabled={loading}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <Textarea
                    value={review.review_text}
                    onChange={(e) =>
                      updateReview(review.id, 'review_text', e.target.value)
                    }
                    placeholder="Paste the review text here..."
                    className="min-h-[100px]"
                    disabled={loading}
                  />
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Competitor'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
