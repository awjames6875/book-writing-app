'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2, User } from 'lucide-react'

export interface Character {
  id: string
  project_id: string
  name: string
  role: string | null
  description: string | null
  chapters_appearing: number[] | null
  notes: string | null
  created_at: string | null
  updated_at: string | null
}

interface CharacterCardProps {
  character: Character
  onEdit: (character: Character) => void
  onDelete: (characterId: string) => void
}

export function CharacterCard({ character, onEdit, onDelete }: CharacterCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Character header */}
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate">{character.name}</h3>
              {character.role && (
                <p className="text-sm text-muted-foreground">{character.role}</p>
              )}
            </div>
          </div>

          {/* Description */}
          {character.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {character.description}
            </p>
          )}

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {character.chapters_appearing && character.chapters_appearing.length > 0 && (
              <Badge variant="outline">
                Ch. {character.chapters_appearing.join(', ')}
              </Badge>
            )}
          </div>

          {/* Notes preview */}
          {character.notes && (
            <p className="text-xs text-muted-foreground italic line-clamp-1">
              Note: {character.notes}
            </p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(character)}
            >
              <Pencil className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => onDelete(character.id)}
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
