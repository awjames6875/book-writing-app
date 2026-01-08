'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ProjectContextWizard } from '@/components/ProjectContextWizard'
import { Settings2 } from 'lucide-react'

interface BookContext {
  bookType: string
  targetAudience: string
  mainMessage: string
  uniqueQualification: string
  toneStyle: string
}

interface BookContextButtonProps {
  projectId: string
  bookContext: BookContext | null
}

export function BookContextButton({ projectId, bookContext }: BookContextButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        <Settings2 className="mr-2 h-4 w-4" />
        {bookContext ? 'Edit Book Context' : 'Set Book Context'}
      </Button>
      <ProjectContextWizard
        open={isOpen}
        onOpenChange={setIsOpen}
        projectId={projectId}
        initialContext={bookContext}
        onSave={() => window.location.reload()}
      />
    </>
  )
}
