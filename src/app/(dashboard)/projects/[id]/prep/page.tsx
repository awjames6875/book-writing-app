import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SectionProgress } from '@/components/SectionProgress'
import { InterviewPrepQuestion } from './InterviewPrepQuestion'

export default async function InterviewPrepPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('id, title')
    .eq('id', id)
    .single()

  if (projectError) {
    notFound()
  }

  // Get question sections
  const { data: sections } = await supabase
    .from('question_sections')
    .select('*')
    .eq('project_id', id)
    .order('question_start', { ascending: true })

  // Get all questions for this project
  const { data: questions } = await supabase
    .from('questions')
    .select('*')
    .eq('project_id', id)
    .order('order_index', { ascending: true })

  // Calculate section stats
  const sectionsWithStats = sections?.map(section => {
    const sectionQuestions = questions?.filter(
      q => q.order_index >= section.question_start && q.order_index <= section.question_end
    ) || []
    const preparedCount = sectionQuestions.filter(q => q.prep_guide !== null).length
    const completionPercentage = sectionQuestions.length > 0
      ? Math.round((preparedCount / sectionQuestions.length) * 100)
      : 0

    return {
      ...section,
      questions: sectionQuestions,
      questionCount: sectionQuestions.length,
      preparedCount,
      calculatedCompletion: completionPercentage
    }
  }) || []

  // Get questions not in any section
  const questionsInSections = sections?.flatMap(s =>
    Array.from({ length: s.question_end - s.question_start + 1 }, (_, i) => s.question_start + i)
  ) || []
  const unsectionedQuestions = questions?.filter(
    q => !questionsInSections.includes(q.order_index)
  ) || []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <Link
            href="/projects"
            className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            Projects
          </Link>
          <span className="text-zinc-300">/</span>
          <Link
            href={`/projects/${id}`}
            className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            {project.title}
          </Link>
          <span className="text-zinc-300">/</span>
        </div>
        <h1 className="mt-1 text-3xl font-bold">Interview Prep</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Prepare for your recording sessions with memory prompts and starter phrases.
        </p>
      </div>

      {/* Section Progress Overview */}
      {sectionsWithStats.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Sections</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sectionsWithStats.map((section) => (
              <SectionProgress
                key={section.id}
                sectionName={section.section_name}
                completionPercentage={section.calculatedCompletion}
                status={section.status as 'not_started' | 'in_progress' | 'complete'}
                questionCount={section.questionCount}
              />
            ))}
          </div>
        </div>
      )}

      {/* Questions by Section */}
      {sectionsWithStats.map((section) => (
        <div key={section.id} className="space-y-4">
          <h2 className="text-xl font-semibold">{section.section_name}</h2>
          <div className="space-y-4">
            {section.questions.map((question) => (
              <InterviewPrepQuestion key={question.id} question={question} />
            ))}
          </div>
        </div>
      ))}

      {/* Unsectioned Questions */}
      {unsectionedQuestions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            {sectionsWithStats.length > 0 ? 'Other Questions' : 'Questions'}
          </h2>
          <div className="space-y-4">
            {unsectionedQuestions.map((question) => (
              <InterviewPrepQuestion key={question.id} question={question} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!questions || questions.length === 0) && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-medium">No questions yet</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Add questions to your project to start preparing for interviews
            </p>
            <Link
              href={`/projects/${id}/questions`}
              className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Manage Questions
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
