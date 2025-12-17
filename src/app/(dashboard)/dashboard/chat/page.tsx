"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const messages = [
  {
    id: "1",
    role: "user",
    content: "What are the key themes in my sources about transformation?",
    timestamp: "2:30 PM",
  },
  {
    id: "2",
    role: "assistant",
    content: "Based on your uploaded sources, I've identified several key themes about transformation:\n\n1. **Present Moment Awareness** - From 'The Power of Now', focusing on mindfulness and being present\n2. **Habit Formation** - From your YouTube source, the importance of building systems for change\n3. **Leadership Principles** - From your article, how transformation requires both personal and interpersonal growth\n\nWould you like me to generate interview questions based on these themes?",
    timestamp: "2:31 PM",
    citations: ["The Power of Now", "How to Build Better Habits"],
  },
  {
    id: "3",
    role: "user",
    content: "Yes, please generate questions for Chapter 2",
    timestamp: "2:32 PM",
  },
];

export default function ChatPage() {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      // Handle send message
      setInput("");
    }
  };

  return (
    <div className="space-y-8 h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Source Brain</h1>
        <p className="text-gray-600">Chat with your research sources and explore connections</p>
      </div>

      {/* Chat Container */}
      <Card className="flex-1 flex flex-col border-2 border-purple-100 shadow-xl">
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[70%] rounded-2xl p-4 ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      : "bg-gray-50 text-gray-900"
                  }`}
                >
                  <p className="whitespace-pre-wrap mb-2">{message.content}</p>
                  {message.citations && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs font-medium text-gray-600 mb-1">Sources:</p>
                      <div className="flex flex-wrap gap-2">
                        {message.citations.map((citation, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 rounded text-xs bg-white/50 text-gray-700"
                          >
                            {citation}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <p className="text-xs opacity-70 mt-2">{message.timestamp}</p>
                </div>
                {message.role === "user" && (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about your sources..."
                className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <Button
                variant="gradient"
                onClick={handleSend}
                className="px-6 flex items-center gap-2"
              >
                <Send className="h-5 w-5" />
                Send
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Powered by AI • Your sources are analyzed and ready to chat
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



