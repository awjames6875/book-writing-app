"use client";

import { motion } from "framer-motion";
import { BookOpen, HelpCircle, Mic, FileText, TrendingUp, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const stats = [
  { label: "Total Projects", value: "3", icon: BookOpen, color: "from-purple-500 to-pink-500" },
  { label: "Questions Answered", value: "47", icon: HelpCircle, color: "from-blue-500 to-purple-500" },
  { label: "Recordings", value: "12", icon: Mic, color: "from-pink-500 to-red-500" },
  { label: "Sources", value: "8", icon: FileText, color: "from-indigo-500 to-purple-500" },
];

const recentProjects = [
  {
    id: "1",
    title: "My Transformation Journey",
    progress: 65,
    chapters: 8,
    wordCount: 32500,
    status: "in_progress",
  },
  {
    id: "2",
    title: "Lessons from Leadership",
    progress: 30,
    chapters: 5,
    wordCount: 15000,
    status: "in_progress",
  },
  {
    id: "3",
    title: "Finding Purpose",
    progress: 15,
    chapters: 3,
    wordCount: 7500,
    status: "draft",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your writing progress.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                    <stat.icon className="h-7 w-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Projects */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Projects</h2>
          <Link
            href="/dashboard/projects"
            className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2"
          >
            View All
            <TrendingUp className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/dashboard/projects/${project.id}`}>
                <Card className="h-full hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border-2 hover:border-purple-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="mb-2">{project.title}</CardTitle>
                        <CardDescription>
                          {project.chapters} chapters • {project.wordCount.toLocaleString()} words
                        </CardDescription>
                      </div>
                      <Sparkles className="h-5 w-5 text-purple-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
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
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium",
                          project.status === "in_progress"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-gray-100 text-gray-700"
                        )}>
                          {project.status === "in_progress" ? "In Progress" : "Draft"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-br from-purple-600 via-pink-600 to-purple-600 text-white">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Ready to continue writing?</h3>
              <p className="text-purple-100">Pick up where you left off or start something new.</p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/dashboard/record"
                className="px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                Start Recording
              </Link>
              <Link
                href="/dashboard/projects/new"
                className="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-xl font-semibold hover:bg-white/20 transition-all duration-200"
              >
                New Project
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}



