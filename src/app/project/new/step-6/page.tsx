"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, BookOpen, Loader2, MessageSquare, Check, ChevronDown, ChevronUp } from "lucide-react";
import WizardLayout from "@/components/wizard/WizardLayout";
import WizardNav from "@/components/wizard/WizardNav";
import { useWizard } from "@/hooks/useWizard";
import { ChapterDraft } from "@/lib/wizard-store";
import { Button } from "@/components/ui/button";

const mockChapters: Omit<ChapterDraft, "id">[] = [
  {
    title: "Chapter 1: The Turning Point",
    content: `There's a moment in everyone's life when the ground shifts. For me, it wasn't dramatic — no lightning bolt, no near-death experience. It was quieter than that. It was the kind of moment you almost miss if you're not paying attention.

I was sitting in my car outside the office, engine still running, staring at the building I'd walked into every day for years. And something just... clicked. Or maybe it broke. Here's the thing — I'd been living someone else's version of my life for so long that I'd forgotten what mine was supposed to look like.

That's what this book is about. Not the Hollywood version of transformation where everything changes overnight. The real version. The messy, awkward, sometimes painful version where you have to tear down everything you thought you knew about yourself before you can start building something true.

Real talk — it's not easy. But at the end of the day, it's the most important work you'll ever do.`,
    status: "draft",
    version: 1,
  },
  {
    title: "Chapter 2: The People Who Shaped Me",
    content: `You don't become who you are in isolation. Every person who crosses your path leaves a mark — some visible, some hidden so deep you don't even know they're there.

My grandmother used to say, "Baby, you can't pour from an empty cup." At the time, I thought she was talking about rest. Now I understand she was talking about identity. You have to know who you are — truly know it — before you can give anything meaningful to the world.

The people in this chapter aren't all heroes. Some of them hurt me. Some of them loved me in the only way they knew how, which wasn't always the way I needed. But every single one of them taught me something I carry to this day.`,
    status: "draft",
    version: 1,
  },
];

export default function Step6Page() {
  const { project, loading, update, prev } = useWizard(6);
  const [chapters, setChapters] = useState<ChapterDraft[]>([]);
  const [generating, setGenerating] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [feedbackTarget, setFeedbackTarget] = useState<string | null>(null);

  useEffect(() => {
    if (project?.chapters) setChapters(project.chapters);
  }, [project]);

  const generateChapters = async () => {
    setGenerating(true);
    // Simulate AI generation
    await new Promise((r) => setTimeout(r, 3000));
    const generated: ChapterDraft[] = mockChapters.map((c) => ({
      ...c,
      id: crypto.randomUUID(),
    }));
    setChapters(generated);
    update({ chapters: generated });
    setGenerating(false);
    setExpandedId(generated[0]?.id || null);
  };

  const submitFeedback = (chapterId: string) => {
    if (!feedback.trim()) return;
    const updated = chapters.map((c) =>
      c.id === chapterId
        ? { ...c, feedback: [...(c.feedback || []), feedback] }
        : c
    );
    setChapters(updated);
    update({ chapters: updated });
    setFeedback("");
    setFeedbackTarget(null);
  };

  if (loading) return null;

  return (
    <WizardLayout currentStep={6}>
      <div className="space-y-8 py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Your Ghost Writer
          </h1>
          <p className="text-lg text-gray-500">
            AI drafts chapters using your answers, sources, and Voice DNA — sounding like <em>you</em>.
          </p>
        </motion.div>

        {chapters.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center py-12"
          >
            {generating ? (
              <div className="space-y-6">
                <div className="relative w-24 h-24 mx-auto">
                  <div className="absolute inset-0 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin" />
                  <Sparkles className="absolute inset-0 m-auto h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">Writing your chapters...</p>
                  <p className="text-gray-500 mt-1">
                    Combining your voice, answers, and sources into authentic prose.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <BookOpen className="h-12 w-12 text-purple-400 mx-auto" />
                <div>
                  <p className="text-gray-500 mb-6">
                    Ready to generate chapter drafts from your interview answers and Voice DNA.
                  </p>
                  <Button
                    variant="gradient"
                    size="lg"
                    onClick={generateChapters}
                    className="flex items-center gap-2 mx-auto"
                  >
                    <Sparkles className="h-5 w-5" />
                    Generate Chapter Drafts
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="space-y-4">
            {chapters.map((chapter, index) => (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
              >
                {/* Header */}
                <button
                  onClick={() => setExpandedId(expandedId === chapter.id ? null : chapter.id)}
                  className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900">{chapter.title}</p>
                      <p className="text-sm text-gray-500">
                        {chapter.content.split(" ").length} words • Version {chapter.version}
                      </p>
                    </div>
                  </div>
                  {expandedId === chapter.id ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </button>

                {/* Content */}
                <AnimatePresence>
                  {expandedId === chapter.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 space-y-4">
                        <div className="prose prose-gray max-w-none">
                          {chapter.content.split("\n\n").map((paragraph, i) => (
                            <p key={i} className="text-gray-700 leading-relaxed">
                              {paragraph}
                            </p>
                          ))}
                        </div>

                        {/* Feedback */}
                        {chapter.feedback && chapter.feedback.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-500 uppercase">Your feedback:</p>
                            {chapter.feedback.map((f, i) => (
                              <div key={i} className="text-sm bg-purple-50 text-purple-700 px-3 py-2 rounded-lg">
                                {f}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Feedback input */}
                        {feedbackTarget === chapter.id ? (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={feedback}
                              onChange={(e) => setFeedback(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && submitFeedback(chapter.id)}
                              placeholder="e.g. Make the opening more dramatic..."
                              className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              autoFocus
                            />
                            <Button variant="gradient" size="sm" onClick={() => submitFeedback(chapter.id)}>
                              Send
                            </Button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setFeedbackTarget(chapter.id)}
                            className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
                          >
                            <MessageSquare className="h-4 w-4" />
                            Give feedback on this chapter
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}

            {/* Summary */}
            <div className="text-center pt-6 space-y-3">
              <div className="flex items-center justify-center gap-2 text-green-600">
                <Check className="h-5 w-5" />
                <span className="font-medium">
                  {chapters.length} chapters drafted • {chapters.reduce((sum, c) => sum + c.content.split(" ").length, 0)} words
                </span>
              </div>
              <p className="text-sm text-gray-400">
                Give feedback on each chapter and regenerate to refine. Your book is taking shape!
              </p>
            </div>
          </div>
        )}
      </div>

      <WizardNav
        onNext={() => {
          // For now, go to dashboard
          window.location.href = "/dashboard";
        }}
        onPrev={prev}
        nextLabel="Finish & Go to Dashboard"
        showNext={chapters.length > 0}
      />
    </WizardLayout>
  );
}
