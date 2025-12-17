import { createClient } from '@/lib/supabase/server'
import { ProjectCard } from '@/components/ProjectCard'
import { CreateProjectDialog } from '@/components/CreateProjectDialog'

export default async function ProjectsPage() {
  const supabase = await createClient()

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('updated_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            Manage your book projects
          </p>
        </div>
        <CreateProjectDialog />
      </div>

      {projects && projects.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <h3 className="text-lg font-medium">No projects yet</h3>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Create your first book project to get started
          </p>
          <div className="mt-4">
            <CreateProjectDialog />
          </div>
        </div>
      )}
    </div>
  )
}
