'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, BookOpen, Download } from 'lucide-react'

interface ExportPanelProps {
  projectId: string
}

export function ExportPanel({ projectId }: ExportPanelProps) {
  const handleExport = (format: 'docx' | 'markdown' | 'beta-guide') => {
    window.open(`/api/projects/${projectId}/export/${format}`, '_blank')
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            DOCX
          </CardTitle>
          <CardDescription>
            Microsoft Word format, ready for editing and printing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => handleExport('docx')} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Download DOCX
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Markdown
          </CardTitle>
          <CardDescription>
            Plain text format, perfect for version control and editing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => handleExport('markdown')} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Download Markdown
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Beta Reader Guide
          </CardTitle>
          <CardDescription>
            Feedback guide with chapter-by-chapter questions for beta readers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => handleExport('beta-guide')} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Download Guide
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
