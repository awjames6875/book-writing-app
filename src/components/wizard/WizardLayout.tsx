"use client";

import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

const steps = [
  { num: 1, label: "Project" },
  { num: 2, label: "Sources" },
  { num: 3, label: "Voice DNA" },
  { num: 4, label: "Questions" },
  { num: 5, label: "Interview" },
  { num: 6, label: "Ghostwrite" },
];

interface WizardLayoutProps {
  currentStep: number;
  children: React.ReactNode;
}

export default function WizardLayout({ currentStep, children }: WizardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium hidden sm:inline">Dashboard</span>
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <span className="font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              StoryForge
            </span>
          </div>
          <span className="text-sm text-gray-400 font-medium">
            {currentStep}/6
          </span>
        </div>
      </header>

      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-100">
        <div
          className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / 6) * 100}%` }}
        />
      </div>

      {/* Step indicators (mobile: dots, desktop: labels) */}
      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {steps.map((step) => (
            <div key={step.num} className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  step.num < currentStep
                    ? "bg-purple-600 text-white"
                    : step.num === currentStep
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-110"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {step.num < currentStep ? "✓" : step.num}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block ${
                  step.num === currentStep ? "text-purple-600" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 pb-24">
        {children}
      </main>
    </div>
  );
}
