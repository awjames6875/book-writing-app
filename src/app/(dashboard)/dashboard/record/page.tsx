"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mic, Square, Play, Upload, FileAudio } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function RecordPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const handleStartRecording = () => {
    setIsRecording(true);
    // Simulate recording time
    const interval = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
    // Store interval for cleanup
    (window as any).recordingInterval = interval;
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if ((window as any).recordingInterval) {
      clearInterval((window as any).recordingInterval);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const recentRecordings = [
    {
      id: "1",
      title: "Chapter 1 Questions",
      duration: "5:32",
      date: "2 days ago",
      status: "processed",
    },
    {
      id: "2",
      title: "Personal Story",
      duration: "8:15",
      date: "1 week ago",
      status: "processed",
    },
    {
      id: "3",
      title: "Transformation Journey",
      duration: "12:45",
      date: "2 weeks ago",
      status: "processing",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Recording Studio</h1>
        <p className="text-gray-600">Record your answers and let AI transcribe and analyze them</p>
      </div>

      {/* Recording Interface */}
      <Card className="bg-gradient-to-br from-purple-600 via-pink-600 to-purple-600 text-white border-0 shadow-2xl">
        <CardContent className="p-12">
          <div className="text-center space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Ready to Record</h2>
              <p className="text-purple-100 text-lg">
                Click the button below to start recording your answers
              </p>
            </div>

            {/* Recording Button */}
            <div className="flex flex-col items-center gap-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                className={`relative w-32 h-32 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
                  isRecording
                    ? "bg-red-500 hover:bg-red-600 animate-pulse"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                {isRecording ? (
                  <Square className="h-12 w-12 text-white" />
                ) : (
                  <Mic className="h-12 w-12 text-purple-600" />
                )}
                {isRecording && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-white/30"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                )}
              </motion.button>

              {/* Timer */}
              {isRecording && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl font-bold"
                >
                  {formatTime(recordingTime)}
                </motion.div>
              )}

              {/* Status */}
              <div className="text-center">
                {isRecording ? (
                  <p className="text-lg font-medium">Recording in progress...</p>
                ) : (
                  <p className="text-purple-100">Click to start recording</p>
                )}
              </div>
            </div>

            {/* Upload Option */}
            <div className="pt-8 border-t border-white/20">
              <Button
                variant="outline"
                size="lg"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 flex items-center gap-2 mx-auto"
              >
                <Upload className="h-5 w-5" />
                Upload Audio File
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Recordings */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Recordings</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentRecordings.map((recording, index) => (
            <motion.div
              key={recording.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                      <FileAudio className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{recording.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span>{recording.duration}</span>
                        <span>•</span>
                        <span>{recording.date}</span>
                      </div>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          recording.status === "processed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {recording.status === "processed" ? "Processed" : "Processing..."}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}



