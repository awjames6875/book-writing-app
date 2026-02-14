"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Plus, Trash2, GripVertical, Loader2 } from "lucide-react";
import WizardLayout from "@/components/wizard/WizardLayout";
import WizardNav from "@/components/wizard/WizardNav";
import { useWizard } from "@/hooks/useWizard";
import { InterviewQuestion } from "@/lib/wizard-store";
import { Button } from "@/components/ui/button";

// Mock AI-generated questions based on book type
function generateMockQuestions(bookType?: string): InterviewQuestion[] {
  const base: Array<{ text: string; chapter: string; theme: string }> = bookType === "memoir"
    ? [
        { text: "What was the defining moment that changed the course of your life?", chapter: "Chapter 1: The Turning Point", theme: "Origin" },
        { text: "Who were the people who shaped who you are today?", chapter: "Chapter 2: The People", theme: "Relationships" },
        { text: "What is the hardest thing you've ever had to overcome?", chapter: "Chapter 3: The Struggle", theme: "Adversity" },
        { text: "What did you learn about yourself during your darkest moments?", chapter: "Chapter 3: The Struggle", theme: "Self-Discovery" },
        { text: "How did your identity change through this experience?", chapter: "Chapter 4: Transformation", theme: "Identity" },
        { text: "What would you tell your younger self if you could?", chapter: "Chapter 5: Wisdom", theme: "Reflection" },
        { text: "What do you want the reader to walk away feeling?", chapter: "Chapter 6: The Message", theme: "Purpose" },
        { text: "What's the one thing people misunderstand about your story?", chapter: "Chapter 1: The Turning Point", theme: "Truth" },
      ]
    : [
        { text: "What problem does your book solve for the reader?", chapter: "Chapter 1: The Problem", theme: "Purpose" },
        { text: "What's your unique perspective on this topic?", chapter: "Chapter 2: Your Approach", theme: "Differentiation" },
        { text: "Can you share a story that illustrates your main point?", chapter: "Chapter 3: Stories", theme: "Evidence" },
        { text: "What are the 3-5 key principles you want to convey?", chapter: "Chapter 4: Framework", theme: "Framework" },
        { text: "What common mistakes do people make in this area?", chapter: "Chapter 5: Pitfalls", theme: "Warnings" },
        { text: "What practical steps can the reader take immediately?", chapter: "Chapter 6: Action", theme: "Application" },
        { text: "How has this topic personally impacted your life?", chapter: "Chapter 7: Personal", theme: "Credibility" },
        { text: "What does success look like for someone who follows your advice?", chapter: "Chapter 8: Vision", theme: "Outcome" },
      ];

  return base.map((q, i) => ({
    id: crypto.randomUUID(),
    text: q.text,
    chapter: q.chapter,
    theme: q.theme,
    isCustom: false,
    status: "unanswered" as const,
  }));
}

export default function Step4Page() {
  const { project, loading, update, next, prev } = useWizard(4);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [generating, setGenerating] = useState(false);
  const [customQuestion, setCustomQuestion] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    if (project) {
      if (project.questions.length > 0) {
        setQuestions(project.questions);
      }
    }
  }, [project]);

  const generateQuestions = async () => {
    setGenerating(true);
    // Simulate AI delay
    await new Promise((r) => setTimeout(r, 1500));
    const generated = generateMockQuestions(project?.bookType);
    setQuestions(generated);
    update({ questions: generated });
    setGenerating(false);
  };

  const addCustom = () => {
    if (!customQuestion.trim()) return;
    const q: InterviewQuestion = {
      id: crypto.randomUUID(),
      text: customQuestion,
      chapter: "Custom",
      theme: "Custom",
      isCustom: true,
      status: "unanswered",
    };
    const updated = [...questions, q];
    setQuestions(updated);
    update({ questions: updated });
    setCustomQuestion("");
    setShowAdd(false);
  };

  const removeQuestion = (id: string) => {
    const updated = questions.filter((q) => q.id !== id);
    setQuestions(updated);
    update({ questions: updated });
  };

  const handleNext = () => {
    update({ questions, currentStep: 5 });
    next();
  };

  if (loading) return null;

  // Group by chapter
  const grouped = questions.reduce<Record<string, InterviewQuestion[]>>((acc, q) => {
    (acc[q.chapter] = acc[q.chapter] || []).push(q);
    return acc;
  }, {});

  return (
    <WizardLayout currentStep={4}>
      <div className="space-y-8 py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Your Question Bank
          </h1>
          <p className="text-lg text-gray-500">
            AI generates interview questions based on your sources and book type. You can add your own too.
          </p>
        </motion.div>

        {questions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center py-12"
          >
            <Sparkles className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-6">
              Let AI analyze your sources and generate targeted interview questions.
            </p>
            <Button
              variant="gradient"
              size="lg"
              onClick={generateQuestions}
              disabled={generating}
              className="flex items-center gap-2 mx-auto"
            >
              {generating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Generate Questions
                </>
              )}
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Actions */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 font-medium">
                {questions.length} questions across {Object.keys(grouped).length} sections
              </p>
              <button
                onClick={() => setShowAdd(!showAdd)}
                className="flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add custom
              </button>
            </div>

            {/* Custom question input */}
            <AnimatePresence>
              {showAdd && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customQuestion}
                      onChange={(e) => setCustomQuestion(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addCustom()}
                      placeholder="Type your question..."
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      autoFocus
                    />
                    <Button variant="gradient" onClick={addCustom}>
                      Add
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Questions grouped by chapter */}
            {Object.entries(grouped).map(([chapter, qs], gi) => (
              <motion.div
                key={chapter}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: gi * 0.05 }}
              >
                <h3 className="text-sm font-bold text-purple-600 uppercase tracking-wider mb-3">
                  {chapter}
                </h3>
                <div className="space-y-2">
                  {qs.map((q, qi) => (
                    <div
                      key={q.id}
                      className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-200 group hover:border-purple-200 transition-colors"
                    >
                      <span className="text-sm font-bold text-gray-300 mt-0.5 w-6">
                        {qi + 1}
                      </span>
                      <p className="flex-1 text-gray-900">{q.text}</p>
                      <div className="flex items-center gap-1">
                        {q.isCustom && (
                          <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
                            Custom
                          </span>
                        )}
                        <button
                          onClick={() => removeQuestion(q.id)}
                          className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}

            {/* Regenerate */}
            <div className="text-center pt-4">
              <button
                onClick={generateQuestions}
                disabled={generating}
                className="text-sm text-gray-500 hover:text-purple-600 transition-colors"
              >
                {generating ? "Regenerating..." : "Regenerate all questions"}
              </button>
            </div>
          </div>
        )}
      </div>

      <WizardNav
        onNext={handleNext}
        onPrev={prev}
        nextDisabled={questions.length === 0}
      />
    </WizardLayout>
  );
}
