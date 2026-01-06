'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Plus } from 'lucide-react'
import { Character } from './CharacterCard'

const ROLE_SUGGESTIONS = [
  'Protagonist',
  'Mentor',
  'Family Member',
  'Friend',
  'Colleague',
  'Antagonist',
  'Supporting Character',
  'Historical Figure',
  'Expert/Authority'
]

interface AddCharacterDialogProps {
  projectId: string
  character?: Character | null
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSave: (character: Character) => void
  mode?: 'add' | 'edit'
}

export function AddCharacterDialog({
  projectId,
  character,
  open,
  onOpenChange,
  onSave,
  mode = 'add'
}: AddCharacterDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [description, setDescription] = useState('')
  const [chaptersAppearing, setChaptersAppearing] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen
  const setIsOpen = isControlled ? onOpenChange! : setInternalOpen

  // Reset form when dialog opens or character changes
  useEffect(() => {
    if (isOpen) {
      if (character && mode === 'edit') {
        setName(character.name)
        setRole(character.role ?? '')
        setDescription(character.description ?? '')
        setChaptersAppearing(character.chapters_appearing?.join(', ') ?? '')
        setNotes(character.notes ?? '')
      } else {
        setName('')
        setRole('')
        setDescription('')
        setChaptersAppearing('')
        setNotes('')
      }
    }
  }, [isOpen, character, mode])

  const parseChapters = (input: string): number[] | null => {
    if (!input.trim()) return null
    const chapters = input
      .split(',')
      .map(s => parseInt(s.trim(), 10))
      .filter(n => !isNaN(n))
    return chapters.length > 0 ? chapters : null
  }

  const handleSave = async () => {
    if (!name.trim()) return
    setSaving(true)

    try {
      const payload = {
        name: name.trim(),
        role: role.trim() || null,
        description: description.trim() || null,
        chapters_appearing: parseChapters(chaptersAppearing),
        notes: notes.trim() || null
      }

      const url = mode === 'edit' && character
        ? `/api/characters/${character.id}`
        : `/api/projects/${projectId}/characters`

      const method = mode === 'edit' ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const { character: savedCharacter } = await response.json()
        onSave(savedCharacter)
        setIsOpen(false)
      }
    } finally {
      setSaving(false)
    }
  }

  const dialogContent = (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>{mode === 'edit' ? 'Edit Character' : 'Add Character'}</DialogTitle>
        <DialogDescription>
          {mode === 'edit'
            ? 'Update this character or person mentioned in your book.'
            : 'Add a character or person mentioned in your book.'}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        {/* Name */}
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">Name *</label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Character name..."
          />
        </div>

        {/* Role */}
        <div className="space-y-2">
          <label htmlFor="role" className="text-sm font-medium">Role</label>
          <Input
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g., Mentor, Family Member..."
            list="role-suggestions"
          />
          <datalist id="role-suggestions">
            {ROLE_SUGGESTIONS.map(r => (
              <option key={r} value={r} />
            ))}
          </datalist>
          <p className="text-xs text-muted-foreground">
            Suggestions: {ROLE_SUGGESTIONS.slice(0, 4).join(', ')}...
          </p>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">Description</label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of this character..."
            rows={3}
          />
        </div>

        {/* Chapters Appearing */}
        <div className="space-y-2">
          <label htmlFor="chapters" className="text-sm font-medium">Chapters Appearing</label>
          <Input
            id="chapters"
            value={chaptersAppearing}
            onChange={(e) => setChaptersAppearing(e.target.value)}
            placeholder="e.g., 1, 3, 5"
          />
          <p className="text-xs text-muted-foreground">
            Enter chapter numbers separated by commas
          </p>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label htmlFor="notes" className="text-sm font-medium">Notes</label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional notes about this character..."
            rows={2}
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving || !name.trim()}>
          {saving ? 'Saving...' : mode === 'edit' ? 'Save Changes' : 'Add Character'}
        </Button>
      </DialogFooter>
    </DialogContent>
  )

  // If controlled (edit mode), just render content
  if (isControlled) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {dialogContent}
      </Dialog>
    )
  }

  // If uncontrolled (add mode), render with trigger
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Character
        </Button>
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  )
}
