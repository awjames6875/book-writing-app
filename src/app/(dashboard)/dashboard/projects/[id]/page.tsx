"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  Settings, 
  TrendingUp, 
  FileText, 
  Mic, 
  ArrowLeft,
  Sparkles
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProjectContextWizard } from "@/components/ProjectContextWizard";
import Link from "next/link";

interface BookContext {
  bookType: string;
  targetAudience: string;
  mainMessage: string;
  uniqueQualification: string;
  toneStyle: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  progress: number;
  chapters: number;
  wordCount: number;
  targetWords: number;
  status: string;
  bookContext?: BookContext | null;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [bookContext, setBookContext] = useState<BookContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const project: Project = {
    id: projectId,
    title: "My Transformation Journey",
    description: "A memoir about overcoming challenges and finding purpose",
    progress: 65,
    chapters: 8,
    wordCount: 32500,
    targetWords: 50000,
    status: "in_progress",
  };

  useEffect(() => {
    const fetchContext = async () => {
      try {
        const response = await fetch("/api/projects/" + projectId + "/context");
        if (response.ok) {
          const data = await response.json();
          setBookContext(data.bookContext);
        }
      } catch (error) {
        console.error("Error fetching context:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContext();
  }, [projectId]);

  const handleWizardSave = async () => {
    const response = await fetch("/api/projects/" + projectId + "/context");
    if (response.ok) {
      const data = await response.json();
      setBookContext(data.bookContext);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/projects">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-gray-900">{project.title}</h1>
          <p className="text-gray-600 mt-2">{project.description}</p>
        </div>
        <Button variant="outline" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Book Context</h3>
            </div>
            {bookContext ? (
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>Type:</strong> {bookContext.bookType}</p>
                <p><strong>Audience:</strong> {bookContext.targetAudience.substring(0, 100)}...</p>
                <p><strong>Tone:</strong> {bookContext.toneStyle}</p>
              </div>
            ) : (
              <p className="text-gray-600">
                Help AI understand your book by answering 5 quick questions about your vision.
              </p>
            )}
          </div>
          <Button
            variant="gradient"
            onClick={() => setIsWizardOpen(true)}
            disabled={isLoading}
          >
            {bookContext ? "Edit Context" : "Set Context"}
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-2">{project.progress}%</div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600"
                style={{ width: project.progress + "%" }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              Word Count
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {project.wordCount.toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">
              of {project.targetWords.toLocaleString()} words
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-purple-600" />
              Chapters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-2">{project.chapters}</div>
            <p className="text-sm text-gray-600">chapters created</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="h-full cursor-pointer hover:shadow-xl transition-all border-2 hover:border-purple-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Mic className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle>Record Interview</CardTitle>
                    <CardDescription>Answer questions to build your content</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="h-full cursor-pointer hover:shadow-xl transition-all border-2 hover:border-purple-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-pink-100 rounded-xl">
                    <FileText className="h-6 w-6 text-pink-600" />
                  </div>
                  <div>
                    <CardTitle>View Chapters</CardTitle>
                    <CardDescription>Manage your book structure</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>
      </div>

      <ProjectContextWizard
        open={isWizardOpen}
        onOpenChange={setIsWizardOpen}
        projectId={projectId}
        initialContext={bookContext}
        onSave={handleWizardSave}
      />
    </div>
  );
}
