"use client";

import { useState } from "react";
import { FileText, Youtube, Link as LinkIcon, Upload, ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AddSourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onSourceAdded?: () => void;
}

type SourceType = "text" | "pdf" | "youtube" | "website" | null;

export function AddSourceDialog({
  open,
  onOpenChange,
  projectId,
  onSourceAdded,
}: AddSourceDialogProps) {
  const [selectedType, setSelectedType] = useState<SourceType>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [textTitle, setTextTitle] = useState("");
  const [textContent, setTextContent] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const handleClose = () => {
    setSelectedType(null);
    setError(null);
    setTextTitle("");
    setTextContent("");
    setYoutubeUrl("");
    setWebsiteUrl("");
    setPdfFile(null);
    onOpenChange(false);
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      if (selectedType === "text") {
        if (!textTitle.trim() || !textContent.trim()) {
          setError("Please provide both title and content");
          setLoading(false);
          return;
        }

        const response = await fetch("/api/sources/text", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId,
            title: textTitle,
            content: textContent,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to add text source");
        }
      } else if (selectedType === "youtube") {
        if (!youtubeUrl.trim()) {
          setError("Please provide a YouTube URL");
          setLoading(false);
          return;
        }

        const response = await fetch("/api/sources/youtube", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId,
            url: youtubeUrl,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to add YouTube source");
        }
      } else if (selectedType === "website") {
        if (!websiteUrl.trim()) {
          setError("Please provide a website URL");
          setLoading(false);
          return;
        }

        const response = await fetch("/api/sources/url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId,
            url: websiteUrl,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to add website source");
        }
      } else if (selectedType === "pdf") {
        if (!pdfFile) {
          setError("Please select a PDF file");
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append("file", pdfFile);
        formData.append("projectId", projectId);

        const response = await fetch("/api/sources/pdf", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to upload PDF");
        }
      }

      // Success
      onSourceAdded?.();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const sourceTypes = [
    {
      type: "text" as SourceType,
      icon: FileText,
      label: "Text Input",
      color: "from-gray-500 to-gray-600",
    },
    {
      type: "pdf" as SourceType,
      icon: Upload,
      label: "Upload PDF",
      color: "from-red-500 to-pink-500",
    },
    {
      type: "youtube" as SourceType,
      icon: Youtube,
      label: "YouTube URL",
      color: "from-red-600 to-red-500",
    },
    {
      type: "website" as SourceType,
      icon: LinkIcon,
      label: "Article URL",
      color: "from-blue-500 to-indigo-500",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Source</DialogTitle>
          <DialogDescription>
            Choose a source type and provide the content for your book research
          </DialogDescription>
        </DialogHeader>

        {!selectedType ? (
          <div className="grid grid-cols-2 gap-4 my-6">
            {sourceTypes.map((source) => {
              const Icon = source.icon;
              return (
                <button
                  key={source.type}
                  onClick={() => setSelectedType(source.type)}
                  className="p-6 border-2 border-gray-200 rounded-xl hover:border-purple-400 hover:shadow-lg transition-all duration-200 text-center group"
                >
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${source.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <p className="font-semibold text-gray-900">{source.label}</p>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="my-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedType(null)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to source types
            </Button>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {selectedType === "text" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Source title"
                    value={textTitle}
                    onChange={(e) => setTextTitle(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Paste your text content here..."
                    className="min-h-[200px]"
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                  />
                </div>
              </div>
            )}

            {selectedType === "youtube" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="youtube-url">YouTube URL</Label>
                  <Input
                    id="youtube-url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  We will extract the video title and transcript automatically.
                </p>
              </div>
            )}

            {selectedType === "website" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="website-url">Website URL</Label>
                  <Input
                    id="website-url"
                    placeholder="https://example.com/article"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  We will extract the article content automatically.
                </p>
              </div>
            )}

            {selectedType === "pdf" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="pdf-file">PDF File</Label>
                  <Input
                    id="pdf-file"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                  />
                </div>
                {pdfFile && (
                  <p className="text-sm text-gray-500">
                    Selected: {pdfFile.name}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {selectedType && (
          <DialogFooter>
            <Button variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Adding..." : "Add Source"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
