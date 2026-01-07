"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Filter, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";

// Mock chapters data - in production, this would come from the database
const mockChapters = [
  { id: "ch-1", title: "Chapter 1: The Awakening" },
  { id: "ch-2", title: "Chapter 2: The Struggle" },
  { id: "ch-3", title: "Chapter 3: The Transformation" },
  { id: "ch-4", title: "Chapter 4: The Message" },
];

interface Question {
  id: string;
  text: string;
  chapter_id: string | null;
  chapter: string;
  status: string;
  answeredAt?: string;
}

const questions: Question[] = [
  {
    id: "1",
    text: "What was the moment that changed everything for you?",
    chapter_id: "ch-1",
    chapter: "Chapter 1: The Awakening",
    status: "complete",
    answeredAt: "2 days ago",
  },
  {
    id: "2",
    text: "How did you feel when you first realized you needed to change?",
    chapter_id: "ch-1",
    chapter: "Chapter 1: The Awakening",
    status: "complete",
    answeredAt: "2 days ago",
  },
  {
    id: "3",
    text: "What were the biggest obstacles you faced?",
    chapter_id: "ch-2",
    chapter: "Chapter 2: The Struggle",
    status: "partial",
    answeredAt: "1 week ago",
  },
  {
    id: "4",
    text: "Who were the key people who supported you?",
    chapter_id: "ch-2",
    chapter: "Chapter 2: The Struggle",
    status: "unanswered",
  },
  {
    id: "5",
    text: "What lessons did you learn from your experience?",
    chapter_id: "ch-3",
    chapter: "Chapter 3: The Transformation",
    status: "unanswered",
  },
  {
    id: "6",
    text: "How do you want readers to feel after reading your story?",
    chapter_id: "ch-4",
    chapter: "Chapter 4: The Message",
    status: "unanswered",
  },
];

const statusConfig = {
  complete: { icon: CheckCircle2, color: "text-green-600 bg-green-50 border-green-200", label: "Complete" },
  partial: { icon: AlertCircle, color: "text-yellow-600 bg-yellow-50 border-yellow-200", label: "Partial" },
  unanswered: { icon: Circle, color: "text-gray-400 bg-gray-50 border-gray-200", label: "Unanswered" },
};

export default function QuestionsPage() {
  const [filter, setFilter] = useState<"all" | "complete" | "partial" | "unanswered">("all");
  const [questionsList, setQuestionsList] = useState(questions);

  const filteredQuestions = filter === "all"
    ? questionsList
    : questionsList.filter(q => q.status === filter);

  // Handle chapter assignment change
  const handleChapterChange = async (questionId: string, newChapterId: string) => {
    try {
      // Call the API to update the question's chapter
      const response = await fetch(`/api/questions/${questionId}/assign-chapter`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chapter_id: newChapterId === "none" ? null : newChapterId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update question chapter");
      }

      // Update local state
      setQuestionsList((prev) =>
        prev.map((q) =>
          q.id === questionId
            ? {
                ...q,
                chapter_id: newChapterId === "none" ? null : newChapterId,
                chapter:
                  newChapterId === "none"
                    ? "No chapter"
                    : mockChapters.find((ch) => ch.id === newChapterId)?.title ||
                      "Unknown",
              }
            : q
        )
      );
    } catch (error) {
      console.error("Error updating question chapter:", error);
      alert("Failed to update question chapter. Please try again.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Question Bank</h1>
          <p className="text-gray-600">Manage and track your interview questions</p>
        </div>
        <Button variant="gradient" size="lg" className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add Question
        </Button>
      </div>

      {/* Stats and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Complete</p>
                <p className="text-3xl font-bold">2</p>
              </div>
              <CheckCircle2 className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Partial</p>
                <p className="text-3xl font-bold">1</p>
              </div>
              <AlertCircle className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-gray-400 to-gray-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Unanswered</p>
                <p className="text-3xl font-bold">3</p>
              </div>
              <Circle className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Total</p>
                <p className="text-3xl font-bold">6</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search questions..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "complete", "partial", "unanswered"] as const).map((status) => (
            <Button
              key={status}
              variant={filter === status ? "gradient" : "outline"}
              onClick={() => setFilter(status)}
              className="capitalize"
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((question, index) => {
          const statusInfo = statusConfig[question.status as keyof typeof statusConfig];
          const StatusIcon = statusInfo.icon;
          
          return (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl border ${statusInfo.color}`}>
                      <StatusIcon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-lg font-semibold text-gray-900">{question.text}</p>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">Chapter:</span>
                          <Badge variant="info" className="font-medium">
                            {question.chapter || "No chapter"}
                          </Badge>
                        </div>
                        <Select
                          value={question.chapter_id || "none"}
                          onChange={(e) => handleChapterChange(question.id, e.target.value)}
                          className="text-sm h-8 w-64"
                        >
                          <option value="none">No chapter</option>
                          {mockChapters.map((chapter) => (
                            <option key={chapter.id} value={chapter.id}>
                              {chapter.title}
                            </option>
                          ))}
                        </Select>
                        {question.answeredAt && (
                          <span className="text-gray-400">• Answered {question.answeredAt}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

