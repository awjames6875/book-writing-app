"use client";

import * as React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Loader2, CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

interface BookContext {
  bookType: string;
  targetAudience: string;
  mainMessage: string;
  uniqueQualification: string;
  toneStyle: string;
}

interface ProjectContextWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  initialContext?: BookContext | null;
  onSave?: () => void;
}

const STEPS = [
  { id: 1, title: "Book Type", description: "What type of book are you writing?" },
  { id: 2, title: "Target Audience", description: "Who will read this book?" },
  { id: 3, title: "Main Message", description: "What transformation should readers get?" },
  { id: 4, title: "Your Expertise", description: "What makes you qualified to write this?" },
  { id: 5, title: "Tone & Style", description: "How should your book sound?" }
];

export function ProjectContextWizard({ open, onOpenChange, projectId, initialContext, onSave }: ProjectContextWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [formData, setFormData] = useState<BookContext>({
    bookType: initialContext?.bookType || "",
    targetAudience: initialContext?.targetAudience || "",
    mainMessage: initialContext?.mainMessage || "",
    uniqueQualification: initialContext?.uniqueQualification || "",
    toneStyle: initialContext?.toneStyle || ""
  });

  const handleNext = () => { if (currentStep < STEPS.length) setCurrentStep(currentStep + 1); };
  const handleBack = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/projects/" + projectId + "/context", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookContext: formData }),
      });
      if (!response.ok) throw new Error("Failed to save context");
      setIsSaved(true);
      setTimeout(() => { onSave?.(); onOpenChange(false); setIsSaved(false); setCurrentStep(1); }, 1500);
    } catch (error) {
      console.error("Error saving context:", error);
      toast.error("Failed to save book context. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isStepComplete = () => {
    switch (currentStep) {
      case 1: return formData.bookType.trim() !== "";
      case 2: return formData.targetAudience.trim() !== "";
      case 3: return formData.mainMessage.trim() !== "";
      case 4: return formData.uniqueQualification.trim() !== "";
      case 5: return formData.toneStyle.trim() !== "";
      default: return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <Label htmlFor="bookType">What type of book is this?</Label>
            <Select id="bookType" value={formData.bookType} onChange={(e) => setFormData({ ...formData, bookType: e.target.value })}>
              <option value="">Choose a book type...</option>
              <option value="memoir">Memoir</option>
              <option value="business">Business</option>
              <option value="self-help">Self-Help</option>
              <option value="how-to">How-To / Educational</option>
              <option value="fiction">Fiction</option>
              <option value="biography">Biography</option>
              <option value="motivational">Motivational</option>
              <option value="other">Other</option>
            </Select>
            <p className="text-sm text-gray-500">This helps AI understand your book genre and structure</p>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <Label htmlFor="targetAudience">Who is your target audience?</Label>
            <Textarea id="targetAudience" value={formData.targetAudience} onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })} placeholder="e.g., Aspiring entrepreneurs, parents of teens..." rows={4} />
            <p className="text-sm text-gray-500">Describe who will benefit most from reading your book</p>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <Label htmlFor="mainMessage">What is the main message or transformation?</Label>
            <Textarea id="mainMessage" value={formData.mainMessage} onChange={(e) => setFormData({ ...formData, mainMessage: e.target.value })} placeholder="e.g., Readers will learn how to overcome fear..." rows={5} />
            <p className="text-sm text-gray-500">What should readers know, feel, or be able to do after reading?</p>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <Label htmlFor="uniqueQualification">What makes you uniquely qualified?</Label>
            <Textarea id="uniqueQualification" value={formData.uniqueQualification} onChange={(e) => setFormData({ ...formData, uniqueQualification: e.target.value })} placeholder="e.g., 20 years of experience..." rows={5} />
            <p className="text-sm text-gray-500">Share your expertise, experience, or unique perspective</p>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <Label htmlFor="toneStyle">What tone and style do you want?</Label>
            <Select id="toneStyle" value={formData.toneStyle} onChange={(e) => setFormData({ ...formData, toneStyle: e.target.value })}>
              <option value="">Choose a tone...</option>
              <option value="conversational">Conversational - Like talking to a friend</option>
              <option value="professional">Professional - Clear and authoritative</option>
              <option value="inspirational">Inspirational - Uplifting and motivating</option>
              <option value="academic">Academic - Formal and research-based</option>
              <option value="humorous">Humorous - Light and entertaining</option>
              <option value="storytelling">Storytelling - Narrative and engaging</option>
            </Select>
            <p className="text-sm text-gray-500">This affects how AI will help generate content in your voice</p>
          </div>
        );
      default: return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle>{isSaved ? "Context Saved!" : "Set Book Context"}</DialogTitle>
          <DialogDescription>{isSaved ? "Your book context has been saved successfully." : "Answer these questions so AI knows how to help with your book."}</DialogDescription>
        </DialogHeader>
        {!isSaved && (
          <>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                {STEPS.map((step, index) => (
                  <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center">
                      <div className={"w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors " + (currentStep >= step.id ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-500")}>{step.id}</div>
                      <span className="text-xs mt-1 text-gray-600 text-center">{step.title}</span>
                    </div>
                    {index < STEPS.length - 1 && <div className={"flex-1 h-1 mx-2 transition-colors " + (currentStep > step.id ? "bg-purple-600" : "bg-gray-200")} />}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className="my-6">
              <h3 className="text-lg font-semibold mb-2">{STEPS[currentStep - 1].title}</h3>
              <p className="text-gray-600 mb-4">{STEPS[currentStep - 1].description}</p>
              {renderStepContent()}
            </div>
            <DialogFooter>
              {currentStep > 1 && <Button variant="outline" onClick={handleBack} disabled={isLoading}><ChevronLeft className="h-4 w-4 mr-1" />Back</Button>}
              {currentStep < STEPS.length ? (
                <Button variant="gradient" onClick={handleNext} disabled={!isStepComplete()}>Next<ChevronRight className="h-4 w-4 ml-1" /></Button>
              ) : (
                <Button variant="gradient" onClick={handleSave} disabled={!isStepComplete() || isLoading}>
                  {isLoading ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</>) : (<><CheckCircle2 className="h-4 w-4 mr-2" />Save Context</>)}
                </Button>
              )}
            </DialogFooter>
          </>
        )}
        {isSaved && (
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <p className="text-gray-600">Redirecting...</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
