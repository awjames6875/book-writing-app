"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Mic, Square, RotateCcw, Sparkles, Loader2 } from "lucide-react";
import WizardLayout from "@/components/wizard/WizardLayout";
import WizardNav from "@/components/wizard/WizardNav";
import { useWizard } from "@/hooks/useWizard";
import { VoiceDNA } from "@/lib/wizard-store";
import { Button } from "@/components/ui/button";

export default function Step3Page() {
  const { project, loading, update, next, prev } = useWizard(3);
  const [voiceDNA, setVoiceDNA] = useState<VoiceDNA>({ status: "idle" });
  const [seconds, setSeconds] = useState(0);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (project?.voiceDNA) setVoiceDNA(project.voiceDNA);
  }, [project]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorder.current = recorder;
      chunks.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        stream.getTracks().forEach((t) => t.stop());

        const updated: VoiceDNA = {
          ...voiceDNA,
          recordingUrl: url,
          recordingDuration: seconds,
          status: "complete",
          // In production, we'd send to /api/transcribe then /api/analyze-voice
          // For now, show a mock analysis
          analysis: {
            vocabularyLevel: "Conversational with occasional elevated language",
            avgSentenceLength: "12-18 words — punchy and direct",
            tone: "Warm, authentic, motivational",
            colloquialisms: ["real talk", "here's the thing", "at the end of the day"],
            rhythm: "Short bursts followed by reflective pauses",
            metaphorUse: "Frequent — uses journey and transformation metaphors",
            summary:
              "You have a conversational, direct voice with warmth and authenticity. You favor short, punchy sentences peppered with motivational energy. Your natural rhythm alternates between rapid-fire insights and reflective pauses. You lean on transformation metaphors and speak like you're having a one-on-one conversation with a close friend.",
          },
        };
        setVoiceDNA(updated);
        update({ voiceDNA: updated });
      };

      recorder.start();
      setSeconds(0);
      setVoiceDNA({ ...voiceDNA, status: "recording" });

      timerRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } catch (err) {
      console.error("Microphone access denied:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
      mediaRecorder.current.stop();
    }
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const resetRecording = () => {
    setVoiceDNA({ status: "idle" });
    setSeconds(0);
    update({ voiceDNA: { status: "idle" } });
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const handleNext = () => {
    update({ voiceDNA, currentStep: 4 });
    next();
  };

  if (loading) return null;

  return (
    <WizardLayout currentStep={3}>
      <div className="space-y-8 py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Capture your Voice DNA
          </h1>
          <p className="text-lg text-gray-500">
            Record yourself talking about your book topic for ~2 minutes. The AI will analyze your unique voice.
          </p>
        </motion.div>

        {/* Recording area */}
        {voiceDNA.status !== "complete" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center py-12"
          >
            <div className="relative">
              <button
                onClick={voiceDNA.status === "recording" ? stopRecording : startRecording}
                className={`w-32 h-32 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
                  voiceDNA.status === "recording"
                    ? "bg-red-500 hover:bg-red-600 animate-pulse"
                    : "bg-gradient-to-br from-purple-600 to-pink-600 hover:scale-105"
                }`}
              >
                {voiceDNA.status === "recording" ? (
                  <Square className="h-10 w-10 text-white" />
                ) : (
                  <Mic className="h-10 w-10 text-white" />
                )}
              </button>
              {voiceDNA.status === "recording" && (
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-red-300"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              )}
            </div>

            <p className="text-4xl font-bold text-gray-900 mt-6 font-mono">
              {formatTime(seconds)}
            </p>
            <p className="text-gray-400 mt-2">
              {voiceDNA.status === "recording"
                ? "Recording... talk naturally about your book topic"
                : "Tap to start recording"}
            </p>
            {seconds > 0 && voiceDNA.status === "recording" && (
              <p className="text-sm text-purple-500 mt-1">
                {seconds < 120 ? `${120 - seconds}s until recommended minimum` : "✓ Great length!"}
              </p>
            )}
          </motion.div>
        ) : (
          /* Voice Profile Result */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="h-6 w-6" />
                <h2 className="text-xl font-bold">Your Voice Profile</h2>
              </div>
              <p className="text-purple-100 leading-relaxed">
                {voiceDNA.analysis?.summary}
              </p>
            </div>

            <div className="grid gap-4">
              {[
                { label: "Tone", value: voiceDNA.analysis?.tone },
                { label: "Vocabulary", value: voiceDNA.analysis?.vocabularyLevel },
                { label: "Sentence Style", value: voiceDNA.analysis?.avgSentenceLength },
                { label: "Rhythm", value: voiceDNA.analysis?.rhythm },
                { label: "Metaphor Use", value: voiceDNA.analysis?.metaphorUse },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-200">
                  <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-500">{item.label}</p>
                    <p className="text-gray-900">{item.value}</p>
                  </div>
                </div>
              ))}

              {voiceDNA.analysis?.colloquialisms && voiceDNA.analysis.colloquialisms.length > 0 && (
                <div className="p-4 bg-white rounded-xl border border-gray-200">
                  <p className="text-sm font-semibold text-gray-500 mb-2">Your Signature Phrases</p>
                  <div className="flex flex-wrap gap-2">
                    {voiceDNA.analysis.colloquialisms.map((phrase) => (
                      <span
                        key={phrase}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                      >
                        &ldquo;{phrase}&rdquo;
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="text-center">
              <button
                onClick={resetRecording}
                className="text-sm text-gray-500 hover:text-purple-600 flex items-center gap-2 mx-auto transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                Record again
              </button>
            </div>
          </motion.div>
        )}
      </div>

      <WizardNav
        onNext={handleNext}
        onPrev={prev}
        nextLabel={voiceDNA.status === "complete" ? "Continue" : "Skip for now"}
      />
    </WizardLayout>
  );
}
