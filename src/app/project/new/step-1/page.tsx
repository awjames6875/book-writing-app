"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Heart, Briefcase, Wand2 } from "lucide-react";
import WizardLayout from "@/components/wizard/WizardLayout";
import WizardNav from "@/components/wizard/WizardNav";
import { useWizard } from "@/hooks/useWizard";

const bookTypes = [
  { value: "self-help" as const, label: "Self-Help", icon: Wand2, desc: "Transform lives with practical wisdom" },
  { value: "memoir" as const, label: "Memoir", icon: Heart, desc: "Share your personal story" },
  { value: "business" as const, label: "Business", icon: Briefcase, desc: "Share expertise and strategies" },
  { value: "fiction" as const, label: "Fiction", icon: BookOpen, desc: "Create worlds and characters" },
];

export default function Step1Page() {
  const { project, loading, update, next } = useWizard(1);
  const [bookType, setBookType] = useState<typeof bookTypes[number]["value"] | undefined>();
  const [title, setTitle] = useState("");
  const [inspiration, setInspiration] = useState("");

  useEffect(() => {
    if (project) {
      setBookType(project.bookType);
      setTitle(project.workingTitle || "");
      setInspiration(project.styleInspiration || "");
    }
  }, [project]);

  const handleNext = () => {
    update({ bookType, workingTitle: title, styleInspiration: inspiration, currentStep: 2 });
    next();
  };

  if (loading) return null;

  return (
    <WizardLayout currentStep={1}>
      <div className="space-y-10 py-6">
        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            What kind of book are you writing?
          </h1>
          <p className="text-lg text-gray-500">Let&apos;s set up the foundation for your project.</p>
        </motion.div>

        {/* Book Type Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-4"
        >
          {bookTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setBookType(type.value)}
              className={`p-6 rounded-2xl border-2 text-left transition-all duration-200 ${
                bookType === type.value
                  ? "border-purple-500 bg-purple-50 shadow-lg scale-[1.02]"
                  : "border-gray-200 bg-white hover:border-purple-200 hover:shadow-md"
              }`}
            >
              <type.icon
                className={`h-8 w-8 mb-3 ${
                  bookType === type.value ? "text-purple-600" : "text-gray-400"
                }`}
              />
              <p className="font-bold text-gray-900">{type.label}</p>
              <p className="text-sm text-gray-500 mt-1">{type.desc}</p>
            </button>
          ))}
        </motion.div>

        {/* Working Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <label className="block text-sm font-semibold text-gray-700">
            Working title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Identity Theft: Reclaiming Who I Am"
            className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
        </motion.div>

        {/* Style Inspiration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <label className="block text-sm font-semibold text-gray-700">
            Who inspires your writing style?
          </label>
          <input
            type="text"
            value={inspiration}
            onChange={(e) => setInspiration(e.target.value)}
            placeholder="e.g. Brené Brown, Malcolm Gladwell, James Clear"
            className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
          <p className="text-sm text-gray-400">
            This helps the AI match your preferred tone and structure.
          </p>
        </motion.div>
      </div>

      <WizardNav
        onNext={handleNext}
        showPrev={false}
        nextDisabled={!bookType || !title.trim()}
      />
    </WizardLayout>
  );
}
