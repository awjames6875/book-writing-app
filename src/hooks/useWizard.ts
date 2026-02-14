"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  WizardProject,
  getCurrentProject,
  createProject,
  updateProject,
} from "@/lib/wizard-store";

export function useWizard(requiredStep?: number) {
  const router = useRouter();
  const [project, setProject] = useState<WizardProject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let p = getCurrentProject();
    if (!p) {
      p = createProject();
    }
    setProject(p);
    setLoading(false);
  }, []);

  const update = useCallback(
    (updates: Partial<WizardProject>) => {
      if (!project) return;
      const updated = updateProject(project.id, updates);
      if (updated) setProject(updated);
    },
    [project]
  );

  const goToStep = useCallback(
    (step: number) => {
      if (project) {
        updateProject(project.id, { currentStep: step });
      }
      router.push(`/project/new/step-${step}`);
    },
    [project, router]
  );

  const next = useCallback(() => {
    const nextStep = (project?.currentStep || 1) + 1;
    if (nextStep <= 6) goToStep(nextStep);
  }, [project, goToStep]);

  const prev = useCallback(() => {
    const prevStep = (project?.currentStep || 2) - 1;
    if (prevStep >= 1) goToStep(prevStep);
  }, [project, goToStep]);

  return { project, loading, update, goToStep, next, prev };
}
