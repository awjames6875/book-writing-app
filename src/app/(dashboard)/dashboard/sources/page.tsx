"use client";

import { motion } from "framer-motion";
import { Plus, FileText, Youtube, Link as LinkIcon, Upload, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const sources = [
  {
    id: "1",
    title: "The Power of Now",
    type: "pdf",
    summary: "A guide to spiritual enlightenment through present-moment awareness",
    concepts: ["Mindfulness", "Present Moment", "Ego"],
    date: "1 week ago",
    status: "ready",
  },
  {
    id: "2",
    title: "How to Build Better Habits",
    type: "youtube",
    summary: "A comprehensive video on habit formation and behavior change",
    concepts: ["Habits", "Behavior Change", "Systems"],
    date: "2 weeks ago",
    status: "ready",
  },
  {
    id: "3",
    title: "Article: Leadership Principles",
    type: "article",
    summary: "Key principles for effective leadership in modern organizations",
    concepts: ["Leadership", "Management", "Team Building"],
    date: "3 weeks ago",
    status: "ready",
  },
  {
    id: "4",
    title: "Personal Notes",
    type: "text",
    summary: "Research notes and insights from various sources",
    concepts: ["Personal Insights", "Research"],
    date: "1 month ago",
    status: "ready",
  },
];

const typeConfig = {
  pdf: { icon: FileText, color: "from-red-500 to-pink-500", label: "PDF" },
  youtube: { icon: Youtube, color: "from-red-600 to-red-500", label: "YouTube" },
  article: { icon: LinkIcon, color: "from-blue-500 to-indigo-500", label: "Article" },
  text: { icon: FileText, color: "from-gray-500 to-gray-600", label: "Text" },
};

export default function SourcesPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Source Library</h1>
          <p className="text-gray-600">Upload and manage your research materials</p>
        </div>
        <Button variant="gradient" size="lg" className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add Source
        </Button>
      </div>

      {/* Upload Options */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { icon: Upload, label: "Upload PDF", color: "from-red-500 to-pink-500" },
          { icon: Youtube, label: "YouTube URL", color: "from-red-600 to-red-500" },
          { icon: LinkIcon, label: "Article URL", color: "from-blue-500 to-indigo-500" },
          { icon: FileText, label: "Text Input", color: "from-gray-500 to-gray-600" },
        ].map((option, index) => (
          <motion.div
            key={option.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-purple-200 group">
              <CardContent className="p-6 text-center">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <option.icon className="h-7 w-7 text-white" />
                </div>
                <p className="font-semibold text-gray-900">{option.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search sources..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Sources Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {sources.map((source, index) => {
          const typeInfo = typeConfig[source.type as keyof typeof typeConfig];
          const TypeIcon = typeInfo.icon;

          return (
            <motion.div
              key={source.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-purple-200">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${typeInfo.color} flex items-center justify-center`}>
                      <TypeIcon className="h-6 w-6 text-white" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      {typeInfo.label}
                    </span>
                  </div>
                  <CardTitle className="mb-2">{source.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{source.summary}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Key Concepts:</p>
                    <div className="flex flex-wrap gap-2">
                      {source.concepts.map((concept) => (
                        <span
                          key={concept}
                          className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700"
                        >
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Added {source.date}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}



