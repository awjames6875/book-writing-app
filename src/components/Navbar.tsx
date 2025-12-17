import Link from 'next/link'
import { UserMenu } from './UserMenu'

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-zinc-950">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-xl font-bold">
            StoryForge
          </Link>
          <nav className="hidden items-center gap-4 md:flex">
            <Link
              href="/dashboard"
              className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Dashboard
            </Link>
            <Link
              href="/projects"
              className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Projects
            </Link>
          </nav>
        </div>
        <UserMenu />
      </div>
    </header>
  )
}
