'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CharacterCard, Character } from './CharacterCard'
import { AddCharacterDialog } from './AddCharacterDialog'

interface CharactersLibraryProps {
  projectId: string
  initialCharacters: Character[]
  initialStats: {
    total: number
    roles: string[]
  }
}

export function CharactersLibrary({ projectId, initialCharacters, initialStats }: CharactersLibraryProps) {
  const [characters, setCharacters] = useState<Character[]>(initialCharacters)
  const [stats, setStats] = useState(initialStats)
  const [filterRole, setFilterRole] = useState<string | null>(null)
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null)

  const filteredCharacters = filterRole
    ? characters.filter(c => c.role === filterRole)
    : characters

  // Get unique roles from current characters
  const roles = [...new Set(characters.map(c => c.role).filter(Boolean))] as string[]

  const handleEdit = useCallback((character: Character) => {
    setEditingCharacter(character)
  }, [])

  const handleDelete = useCallback(async (characterId: string) => {
    if (!confirm('Are you sure you want to delete this character?')) return

    try {
      const response = await fetch(`/api/characters/${characterId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setCharacters(prev => prev.filter(c => c.id !== characterId))
        setStats(prev => ({
          ...prev,
          total: prev.total - 1
        }))
      }
    } catch (error) {
      console.error('Failed to delete character:', error)
    }
  }, [])

  const handleSaveNew = useCallback((character: Character) => {
    setCharacters(prev => [character, ...prev])
    setStats(prev => ({
      total: prev.total + 1,
      roles: character.role && !prev.roles.includes(character.role)
        ? [...prev.roles, character.role]
        : prev.roles
    }))
  }, [])

  const handleSaveEdit = useCallback((updatedCharacter: Character) => {
    setCharacters(prev => prev.map(c => c.id === updatedCharacter.id ? updatedCharacter : c))
    setEditingCharacter(null)
  }, [])

  if (characters.length === 0) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Characters & People</CardTitle>
            <CardDescription>No characters tracked yet</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Track the characters and people mentioned in your book to maintain consistency
              and keep notes about their appearances across chapters.
            </p>
            <AddCharacterDialog projectId={projectId} onSave={handleSaveNew} />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Stats and Add Button */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Characters</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{roles.length}</div>
            <div className="text-sm text-muted-foreground">Unique Roles</div>
          </div>
        </div>
        <AddCharacterDialog projectId={projectId} onSave={handleSaveNew} />
      </div>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={filterRole === null ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => setFilterRole(null)}
        >
          All ({characters.length})
        </Badge>
        {roles.map(role => (
          <Badge
            key={role}
            variant={filterRole === role ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setFilterRole(role)}
          >
            {role} ({characters.filter(c => c.role === role).length})
          </Badge>
        ))}
      </div>

      {/* Character cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredCharacters.map(character => (
          <CharacterCard
            key={character.id}
            character={character}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Edit dialog */}
      <AddCharacterDialog
        projectId={projectId}
        character={editingCharacter}
        open={editingCharacter !== null}
        onOpenChange={(open) => !open && setEditingCharacter(null)}
        onSave={handleSaveEdit}
        mode="edit"
      />
    </div>
  )
}
