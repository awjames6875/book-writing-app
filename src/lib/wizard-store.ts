// Client-side persistence for wizard state using localStorage
// Each project gets its own key. We store a "current" project ID for the active wizard.

export interface ProjectSource {
  id: string;
  type: "pdf" | "docx" | "txt" | "youtube" | "article" | "gdrive";
  name: string;
  content?: string; // extracted text
  summary?: string; // AI summary
  concepts?: string[];
  status: "uploading" | "processing" | "ready" | "error";
  url?: string;
  fileSize?: number;
  addedAt: string;
}

export interface VoiceDNA {
  recordingUrl?: string; // blob URL or stored URL
  recordingDuration?: number;
  transcript?: string;
  analysis?: {
    vocabularyLevel: string;
    avgSentenceLength: string;
    tone: string;
    colloquialisms: string[];
    rhythm: string;
    metaphorUse: string;
    summary: string;
  };
  status: "idle" | "recording" | "transcribing" | "analyzing" | "complete";
}

export interface InterviewQuestion {
  id: string;
  text: string;
  chapter: string;
  theme: string;
  isCustom: boolean;
  answer?: string; // transcribed answer
  audioUrl?: string;
  status: "unanswered" | "answered" | "skipped";
}

export interface ChapterDraft {
  id: string;
  title: string;
  content: string;
  status: "generating" | "draft" | "revised";
  feedback?: string[];
  version: number;
}

export interface WizardProject {
  id: string;
  // Step 1
  bookType?: "self-help" | "memoir" | "business" | "fiction";
  workingTitle?: string;
  styleInspiration?: string;
  // Step 2
  sources: ProjectSource[];
  // Step 3
  voiceDNA: VoiceDNA;
  // Step 4
  questions: InterviewQuestion[];
  // Step 5 — answers stored in questions
  // Step 6
  chapters: ChapterDraft[];
  // Meta
  currentStep: number;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "storyforge_wizard";
const CURRENT_KEY = "storyforge_current_project";

function getStore(): Record<string, WizardProject> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStore(store: Record<string, WizardProject>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function createProject(): WizardProject {
  const id = crypto.randomUUID();
  const project: WizardProject = {
    id,
    sources: [],
    voiceDNA: { status: "idle" },
    questions: [],
    chapters: [],
    currentStep: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const store = getStore();
  store[id] = project;
  saveStore(store);
  localStorage.setItem(CURRENT_KEY, id);
  return project;
}

export function getCurrentProject(): WizardProject | null {
  const id = typeof window !== "undefined" ? localStorage.getItem(CURRENT_KEY) : null;
  if (!id) return null;
  const store = getStore();
  return store[id] || null;
}

export function getProject(id: string): WizardProject | null {
  const store = getStore();
  return store[id] || null;
}

export function updateProject(id: string, updates: Partial<WizardProject>): WizardProject | null {
  const store = getStore();
  const project = store[id];
  if (!project) return null;
  const updated = { ...project, ...updates, updatedAt: new Date().toISOString() };
  store[id] = updated;
  saveStore(store);
  return updated;
}

export function setCurrentProject(id: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(CURRENT_KEY, id);
  }
}
