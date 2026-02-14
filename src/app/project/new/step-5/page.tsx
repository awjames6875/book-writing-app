"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, SkipForward, Check, ChevronLeft, ChevronRight } from "lucide-react";
import WizardLayout from "@/components/wizard/WizardLayout";
import WizardNav from "@/components/wizard/WizardNav";
import { useWizard } from "@/hooks/useWizard";
import { InterviewQuestion } from "@/lib/wizard-store";

export default function Step5Page() {
  const { project, loading, update, next, prev } = useWizard(5);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [transcribing, setTranscribing] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (project?.questions) {
      setQuestions(project.questions);
      // Jump to first unanswered
      const firstUnanswered = project.questions.findIndex((q) => q.status === "unanswered");
      if (firstUnanswered >= 0) setCurrentIdx(firstUnanswered);
    }
  }, [project]);

  const current = questions[currentIdx];
  const answered = questions.filter((q) => q.status === "answered").length;
  const total = questions.length;

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorder.current = recorder;
      chunks.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        setTranscribing(true);

        // Simulate transcription delay
        await new Promise((r) => setTimeout(r, 1500));

        // Mock transcription
        const mockTranscript =
          "This is a mock transcription of the recorded answer. In production, this would be sent to the Whisper API for real transcription. The user's actual words would appear here, capturing their authentic voice and thoughts on the question.";

        const updated = [...questions];
        updated[currentIdx] = {
          ...updated[currentIdx],
          answer: mockTranscript,
          status: "answered",
        };
        setQuestions(updated);
        update({ questions: updated });
        setTranscribing(false);
      };

      recorder.start();
      setIsRecording(true);
      setSeconds(0);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch (err) {
      console.error("Mic access denied:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
      mediaRecorder.current.stop();
    }
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
  };

  const skipQuestion = () => {
    const updated = [...questions];
    updated[currentIdx] = { ...updated[currentIdx], status: "skipped" };
    setQuestions(updated);
    update({ questions: updated });
    goNext();
  };

  const goNext = () => {
    if (currentIdx < total - 1) setCurrentIdx(currentIdx + 1);
  };

  const goPrev = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
  };

  const handleNext = () => {
    update({ questions, currentStep: 6 });
    next();
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  if (loading || !current) return null;

  return (
    <WizardLayout currentStep={5}>
      <div className="space-y-6 py-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">
              Question {currentIdx + 1} of {total}
            </span>
            <span className="font-medium text-purple-600">
              {answered}/{total} answered
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500"
              style={{ width: `${(answered / total) * 100}%` }}
            />
          </div>
        </div>

        {/* Chapter label */}
        <p className="text-sm font-semibold text-purple-600 uppercase tracking-wider">
          {current.chapter}
        </p>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
              {current.text}
            </h2>
          </motion.div>
        </AnimatePresence>

        {/* Answer display (if answered) */}
        {current.status === "answered" && current.answer && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-green-50 border border-green-200 rounded-xl"
          >
            <div className="flex items-center gap-2 mb-2">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-sm font-semibold text-green-700">Answered</span>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">{current.answer}</p>
          </motion.div>
        )}

        {/* Recording interface */}
        {current.status !== "answered" && (
          <div className="flex flex-col items-center py-8 space-y-6">
            {transcribing ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-3"
              >
                <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto" />
                <p className="text-gray-500">Transcribing your answer...</p>
              </motion.div>
            ) : (
              <>
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`w-24 h-24 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${
                    isRecording
                      ? "bg-red-500 hover:bg-red-600 animate-pulse"
                      : "bg-gradient-to-br from-purple-600 to-pink-600 hover:scale-105"
                  }`}
                >
                  {isRecording ? (
                    <Square className="h-8 w-8 text-white" />
                  ) : (
                    <Mic className="h-8 w-8 text-white" />
                  )}
                </button>

                {isRecording && (
                  <p className="text-2xl font-bold text-gray-900 font-mono">
                    {formatTime(seconds)}
                  </p>
                )}

                <p className="text-gray-400 text-sm">
                  {isRecording ? "Recording... tap to stop" : "Tap to record your answer"}
                </p>
              </>
            )}
          </div>
        )}

        {/* Navigation between questions */}
        <div className="flex items-center justify-between pt-4">
          <button
            onClick={goPrev}
            disabled={currentIdx === 0}
            className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          {current.status === "unanswered" && !isRecording && !transcribing && (
            <button
              onClick={skipQuestion}
              className="flex items-center gap-1 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors"
            >
              <SkipForward className="h-4 w-4" />
              Skip
            </button>
          )}

          <button
            onClick={goNext}
            disabled={currentIdx === total - 1}
            className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 disabled:opacity-30 transition-colors"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Question dots */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap pt-2">
          {questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrentIdx(i)}
              className={`w-3 h-3 rounded-full transition-all ${
                i === currentIdx
                  ? "bg-purple-600 scale-125"
                  : q.status === "answered"
                  ? "bg-green-400"
                  : q.status === "skipped"
                  ? "bg-yellow-300"
                  : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      <WizardNav
        onNext={handleNext}
        onPrev={prev}
        nextLabel={answered >= total ? "Generate Chapters" : `Continue (${answered}/${total})`}
      />
    </WizardLayout>
  );
}
