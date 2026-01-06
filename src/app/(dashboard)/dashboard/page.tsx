import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

function getFirstName(user: { user_metadata?: Record<string, unknown> } | null): string {
  if (user === null) return 'there'
  const fullName = user.user_metadata?.full_name
  if (typeof fullName !== 'string' || fullName === '') return 'there'
  const parts = fullName.split(' ')
  return parts[0] ?? 'there'
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  const { count } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })

  const firstName = getFirstName(userData.user)
  const projectCount = count ?? 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {firstName}</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Ready to continue writing your book?
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Your Projects</CardTitle>
            <CardDescription>Books you&apos;re working on</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{projectCount}</p>
            <Button asChild className="mt-4 w-full">
              <Link href="/projects">View Projects</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Start</CardTitle>
            <CardDescription>Begin your writing journey</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full">
              <Link href="/projects">Create New Project</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
