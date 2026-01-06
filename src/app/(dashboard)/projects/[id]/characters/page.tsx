import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CharactersLibrary } from '@/components/CharactersLibrary'
import { ArrowLeft } from 'lucide-react'

export default async function CharactersPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch project
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('id, title')
    .eq('id', id)
    .single()

  if (projectError) {
    notFound()
  }

  // Fetch characters
  const { data: characters, error: charactersError } = await supabase
    .from('characters')
    .select('*')
    .eq('project_id', id)
    .order('created_at', { ascending: false })

  if (charactersError) {
    console.error('Failed to fetch characters:', charactersError)
  }

  const charactersList = characters ?? []
  const roles = [...new Set(charactersList.map(c => c.role).filter(Boolean))]
  const stats = {
    total: charactersList.length,
    roles: roles as string[]
  }

  return (
    <div className="container py-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <Link href={`/projects/${id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Project
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Characters & People</h1>
        <p className="text-muted-foreground">
          Track characters and people mentioned in {project.title}
        </p>
      </div>

      {/* Characters Library */}
      <CharactersLibrary
        projectId={id}
        initialCharacters={charactersList}
        initialStats={stats}
      />
    </div>
  )
}
