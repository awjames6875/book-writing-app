"use client";

import { motion } from "framer-motion";
import { Plus, BookOpen, Search, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const projects = [
  {
    id: "1",
    title: "My Transformation Journey",
    description: "A memoir about overcoming challenges and finding purpose",
    progress: 65,
    chapters: 8,
    wordCount: 32500,
    targetWords: 50000,
    status: "in_progress",
    updatedAt: "2 days ago",
  },
  {
    id: "2",
    title: "Lessons from Leadership",
    description: "Insights from 20 years of leading teams",
    progress: 30,
    chapters: 5,
    wordCount: 15000,
    targetWords: 50000,
    status: "in_progress",
    updatedAt: "1 week ago",
  },
  {
    id: "3",
    title: "Finding Purpose",
    description: "A guide to discovering your life's mission",
    progress: 15,
    chapters: 3,
    wordCount: 7500,
    targetWords: 50000,
    status: "draft",
    updatedAt: "2 weeks ago",
  },
];

export default function ProjectsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Projects</h1>
          <p className="text-gray-600">Manage your book projects and track progress</p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button variant="gradient" size="lg" className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filter
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link href={`/dashboard/projects/${project.id}`}>
              <Card className="h-full hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border-2 hover:border-purple-200 group">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <BookOpen className="h-6 w-6 text-purple-600 group-hover:scale-110 transition-transform" />
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium",
                      project.status === "in_progress"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-100 text-gray-700"
                    )}>
                      {project.status === "in_progress" ? "In Progress" : "Draft"}
                    </span>
                  </div>
                  <CardTitle className="mb-2">{project.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold text-gray-900">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                        className="h-2.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Chapters</p>
                      <p className="font-semibold text-gray-900">{project.chapters}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Words</p>
                      <p className="font-semibold text-gray-900">{project.wordCount.toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Updated {project.updatedAt}</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

