"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Youtube, Link as LinkIcon, HardDrive, FileText, X, Check, Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import WizardLayout from "@/components/wizard/WizardLayout";
import WizardNav from "@/components/wizard/WizardNav";
import { useWizard } from "@/hooks/useWizard";
import { ProjectSource } from "@/lib/wizard-store";
import { Button } from "@/components/ui/button";

export default function Step2Page() {
  const { project, loading, update, next, prev } = useWizard(2);
  const [sources, setSources] = useState<ProjectSource[]>([]);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [articleUrl, setArticleUrl] = useState("");
  const [showYoutube, setShowYoutube] = useState(false);
  const [showArticle, setShowArticle] = useState(false);

  useEffect(() => {
    if (project) setSources(project.sources);
  }, [project]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newSources: ProjectSource[] = acceptedFiles.map((file) => {
        const ext = file.name.split(".").pop()?.toLowerCase() || "txt";
        const type = ext === "pdf" ? "pdf" : ext === "docx" ? "docx" : "txt";
        return {
          id: crypto.randomUUID(),
          type,
          name: file.name,
          status: "ready" as const,
          fileSize: file.size,
          addedAt: new Date().toISOString(),
          summary: "Pending AI analysis...",
        };
      });
      const updated = [...sources, ...newSources];
      setSources(updated);
      update({ sources: updated });
    },
    [sources, update]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
    },
  });

  const addYoutubeSource = () => {
    if (!youtubeUrl.trim()) return;
    const source: ProjectSource = {
      id: crypto.randomUUID(),
      type: "youtube",
      name: youtubeUrl,
      url: youtubeUrl,
      status: "ready",
      addedAt: new Date().toISOString(),
      summary: "Pending transcription & analysis...",
    };
    const updated = [...sources, source];
    setSources(updated);
    update({ sources: updated });
    setYoutubeUrl("");
    setShowYoutube(false);
  };

  const addArticleSource = () => {
    if (!articleUrl.trim()) return;
    const source: ProjectSource = {
      id: crypto.randomUUID(),
      type: "article",
      name: articleUrl,
      url: articleUrl,
      status: "ready",
      addedAt: new Date().toISOString(),
      summary: "Pending scraping & analysis...",
    };
    const updated = [...sources, source];
    setSources(updated);
    update({ sources: updated });
    setArticleUrl("");
    setShowArticle(false);
  };

  const removeSource = (id: string) => {
    const updated = sources.filter((s) => s.id !== id);
    setSources(updated);
    update({ sources: updated });
  };

  const handleNext = () => {
    update({ sources, currentStep: 3 });
    next();
  };

  if (loading) return null;

  const typeIcons: Record<string, typeof FileText> = {
    pdf: FileText,
    docx: FileText,
    txt: FileText,
    youtube: Youtube,
    article: LinkIcon,
    gdrive: HardDrive,
  };

  return (
    <WizardLayout currentStep={2}>
      <div className="space-y-8 py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Feed your Source Brain
          </h1>
          <p className="text-lg text-gray-500">
            Upload research, notes, transcripts — anything that informs your book.
          </p>
        </motion.div>

        {/* Drop zone */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
              isDragActive
                ? "border-purple-500 bg-purple-50"
                : "border-gray-300 hover:border-purple-300 hover:bg-purple-50/30"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700">
              {isDragActive ? "Drop files here..." : "Drag & drop files, or click to browse"}
            </p>
            <p className="text-sm text-gray-400 mt-2">PDF, DOCX, TXT — up to 10MB each</p>
          </div>
        </motion.div>

        {/* Other source types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-3"
        >
          <button
            onClick={() => setShowYoutube(!showYoutube)}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-gray-200 hover:border-red-300 hover:bg-red-50/30 transition-all"
          >
            <Youtube className="h-6 w-6 text-red-500" />
            <span className="text-sm font-medium text-gray-700">YouTube</span>
          </button>
          <button
            onClick={() => setShowArticle(!showArticle)}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all"
          >
            <LinkIcon className="h-6 w-6 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">Article URL</span>
          </button>
          <button
            disabled
            className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-gray-200 opacity-50 cursor-not-allowed"
          >
            <HardDrive className="h-6 w-6 text-gray-400" />
            <span className="text-sm font-medium text-gray-400">Google Drive</span>
            <span className="text-xs text-gray-400">Coming soon</span>
          </button>
        </motion.div>

        {/* YouTube input */}
        <AnimatePresence>
          {showYoutube && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex gap-2">
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                />
                <Button variant="gradient" onClick={addYoutubeSource}>
                  Add
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Article input */}
        <AnimatePresence>
          {showArticle && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex gap-2">
                <input
                  type="url"
                  value={articleUrl}
                  onChange={(e) => setArticleUrl(e.target.value)}
                  placeholder="https://example.com/article..."
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
                <Button variant="gradient" onClick={addArticleSource}>
                  Add
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Source list */}
        {sources.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              {sources.length} source{sources.length !== 1 ? "s" : ""} added
            </h3>
            {sources.map((source) => {
              const Icon = typeIcons[source.type] || FileText;
              return (
                <div
                  key={source.id}
                  className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 shadow-sm"
                >
                  <Icon className="h-5 w-5 text-purple-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{source.name}</p>
                    <p className="text-xs text-gray-400">{source.type.toUpperCase()}</p>
                  </div>
                  {source.status === "ready" && <Check className="h-4 w-4 text-green-500" />}
                  {source.status === "processing" && <Loader2 className="h-4 w-4 text-purple-500 animate-spin" />}
                  <button onClick={() => removeSource(source.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </motion.div>
        )}
      </div>

      <WizardNav
        onNext={handleNext}
        onPrev={prev}
        nextLabel={sources.length === 0 ? "Skip for now" : "Continue"}
      />
    </WizardLayout>
  );
}
