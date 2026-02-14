"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WizardNavProps {
  onNext?: () => void;
  onPrev?: () => void;
  nextLabel?: string;
  prevLabel?: string;
  showPrev?: boolean;
  showNext?: boolean;
  nextDisabled?: boolean;
  loading?: boolean;
}

export default function WizardNav({
  onNext,
  onPrev,
  nextLabel = "Continue",
  prevLabel = "Back",
  showPrev = true,
  showNext = true,
  nextDisabled = false,
  loading = false,
}: WizardNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 z-40">
      <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
        {showPrev ? (
          <button
            onClick={onPrev}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            {prevLabel}
          </button>
        ) : (
          <div />
        )}
        {showNext && (
          <Button
            variant="gradient"
            size="lg"
            onClick={onNext}
            disabled={nextDisabled || loading}
            className="flex items-center gap-2 min-w-[140px]"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {nextLabel}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
