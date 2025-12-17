export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            StoryForge
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            AI-powered book writing
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}
