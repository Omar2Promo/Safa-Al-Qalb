// Journal.tsx
// Safa Al-Qalb — Heart Journal (Emotion Log)
// Design: Islamic Geometric Minimalism meets Wabi-Sabi
// Shows all logged emotion entries with timestamps, levels, and guidance

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Streamdown } from "streamdown";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEmotionLog, EmotionEntry, EmotionLevel } from "@/hooks/useEmotionLog";
import { Link } from "wouter";
import {
  Heart,
  BookOpen,
  Trash2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Flame,
  CloudLightning,
  Calendar,
  Clock,
} from "lucide-react";

const HEART_CALLIGRAPHY =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663618470936/2CfQMPyftjStHscqN5UyDD/heart-calligraphy-QrE8AKa2eKeJ7kEB7Zuxjk.webp";
const ARABESQUE =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663618470936/2CfQMPyftjStHscqN5UyDD/arabesque-ornament-9ggU79RtCy2Ppo6YWm7oqr.webp";

const LEVEL_CONFIG: Record<
  EmotionLevel,
  { label: string; arabic: string; icon: React.ElementType; color: string; bg: string; border: string }
> = {
  mild: {
    label: "Mild Annoyance",
    arabic: "ضيق خفيف",
    icon: Heart,
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  irritation: {
    label: "Active Irritation",
    arabic: "انزعاج نشط",
    icon: Flame,
    color: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
  resentment: {
    label: "Deep Resentment",
    arabic: "حقد عميق",
    icon: CloudLightning,
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
  },
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function JournalCard({ entry, onDelete }: { entry: EmotionEntry; onDelete: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const config = LEVEL_CONFIG[entry.level];
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ duration: 0.35 }}
      className={`rounded-sm border ${config.border} bg-[oklch(0.99_0.008_80)] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300`}
    >
      {/* Card header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={`p-2 rounded-sm ${config.bg} flex-shrink-0`}>
              <Icon size={16} className={config.color} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`font-['Amiri'] text-base font-bold ${config.color}`}>
                  {config.label}
                </span>
                <span className="font-arabic text-xs text-[oklch(0.52_0.02_60)]">
                  {config.arabic}
                </span>
              </div>
              {entry.personLabel && (
                <p className="font-['Lora'] text-xs text-[oklch(0.52_0.02_60)] italic mt-0.5">
                  Toward: {entry.personLabel}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 text-[oklch(0.52_0.02_60)] hover:text-[oklch(0.42_0.075_185)] transition-colors"
              aria-label={expanded ? "Collapse" : "Expand"}
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-1.5 text-[oklch(0.52_0.02_60)] hover:text-red-600 transition-colors"
              aria-label="Delete entry"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {/* Timestamp */}
        <div className="flex items-center gap-3 mt-3 text-xs text-[oklch(0.62_0.015_60)] font-['Lora']">
          <span className="flex items-center gap-1">
            <Calendar size={11} />
            {formatDate(entry.timestamp)}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {formatTime(entry.timestamp)}
          </span>
        </div>

        {/* Description preview */}
        <p className="font-['Lora'] text-sm text-[oklch(0.35_0.025_55)] mt-3 leading-relaxed line-clamp-2">
          {entry.description}
        </p>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden"
          >
            <div className="border-t border-[oklch(0.87_0.018_75)] px-5 py-4">
              <h4 className="font-['Amiri'] text-sm font-bold text-[oklch(0.42_0.04_60)] mb-2 uppercase tracking-wider">
                Your words
              </h4>
              <p className="font-['Lora'] text-sm text-[oklch(0.35_0.025_55)] leading-relaxed mb-5">
                {entry.description}
              </p>

              <h4 className="font-['Amiri'] text-sm font-bold text-[oklch(0.42_0.075_185)] mb-2 uppercase tracking-wider">
                Guidance received
              </h4>
              <div className="guidance-response rounded-sm p-4">
                <div className="font-['Lora'] text-sm text-[oklch(0.22_0.025_55)] leading-relaxed prose prose-sm max-w-none">
                  <Streamdown>{entry.guidance}</Streamdown>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-red-100 bg-red-50 px-5 py-3"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle size={15} className="text-red-600 flex-shrink-0" />
              <p className="font-['Lora'] text-xs text-red-700 flex-1">
                Remove this entry from your Heart Journal?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onDelete(entry.id);
                    toast.success("Entry removed.");
                  }}
                  className="text-xs font-['Lora'] text-red-700 hover:text-red-900 underline"
                >
                  Remove
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="text-xs font-['Lora'] text-[oklch(0.52_0.02_60)] hover:text-[oklch(0.32_0.025_55)]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Journal() {
  const { entries, deleteEntry, clearAll } = useEmotionLog();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [filterLevel, setFilterLevel] = useState<EmotionLevel | "all">("all");

  const filtered =
    filterLevel === "all" ? entries : entries.filter((e) => e.level === filterLevel);

  const counts = {
    mild: entries.filter((e) => e.level === "mild").length,
    irritation: entries.filter((e) => e.level === "irritation").length,
    resentment: entries.filter((e) => e.level === "resentment").length,
  };

  return (
    <div className="min-h-screen bg-[oklch(0.975_0.012_80)] parchment-texture">
      {/* Nav */}
      <nav className="sticky top-0 z-20 bg-[oklch(0.975_0.012_80/0.92)] backdrop-blur-sm border-b border-[oklch(0.87_0.018_75)] px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/">
            <button className="flex items-center gap-2 group">
              <img src={HEART_CALLIGRAPHY} alt="" className="h-7 w-7 object-contain" />
              <span className="font-['Amiri'] text-base font-bold text-[oklch(0.22_0.025_55)] group-hover:text-[oklch(0.42_0.075_185)] transition-colors">
                Safa Al-Qalb
              </span>
              <span className="font-arabic text-sm text-[oklch(0.42_0.075_185)] hidden sm:inline">
                صفاء القلب
              </span>
            </button>
          </Link>
          <Link href="/">
            <button className="flex items-center gap-1.5 text-sm text-[oklch(0.42_0.075_185)] hover:text-[oklch(0.32_0.065_185)] transition-colors font-['Lora']">
              <Heart size={14} />
              New Reflection
            </button>
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <span className="text-xs font-['Lora'] tracking-widest uppercase text-[oklch(0.42_0.075_185)]">
            Your Journey
          </span>
          <h1 className="font-['Amiri'] text-4xl text-[oklch(0.22_0.025_55)] mt-1 mb-2">
            Heart Journal
          </h1>
          <p className="font-arabic text-lg text-[oklch(0.42_0.075_185)] mb-3">مجلة القلب</p>
          <p className="font-['Lora'] text-sm text-[oklch(0.52_0.02_60)] italic max-w-lg">
            A record of the feelings you have brought to light and the guidance you have received.
            Every entry is a step toward a purer heart.
          </p>
        </motion.div>

        {/* Stats */}
        {entries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
          >
            <div className="bg-[oklch(0.99_0.008_80)] border border-[oklch(0.87_0.018_75)] rounded-sm p-4 text-center">
              <p className="font-['Amiri'] text-2xl font-bold text-[oklch(0.42_0.075_185)]">
                {entries.length}
              </p>
              <p className="font-['Lora'] text-xs text-[oklch(0.52_0.02_60)] mt-0.5">
                Total Entries
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-sm p-4 text-center">
              <p className="font-['Amiri'] text-2xl font-bold text-amber-700">{counts.mild}</p>
              <p className="font-['Lora'] text-xs text-amber-600 mt-0.5">Mild</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-sm p-4 text-center">
              <p className="font-['Amiri'] text-2xl font-bold text-orange-700">{counts.irritation}</p>
              <p className="font-['Lora'] text-xs text-orange-600 mt-0.5">Irritation</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-sm p-4 text-center">
              <p className="font-['Amiri'] text-2xl font-bold text-red-700">{counts.resentment}</p>
              <p className="font-['Lora'] text-xs text-red-600 mt-0.5">Resentment</p>
            </div>
          </motion.div>
        )}

        {/* Filter + Clear */}
        {entries.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="flex items-center justify-between gap-3 mb-6 flex-wrap"
          >
            <div className="flex items-center gap-2 flex-wrap">
              {(["all", "mild", "irritation", "resentment"] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setFilterLevel(level)}
                  className={`px-3 py-1.5 rounded-sm text-xs font-['Lora'] border transition-all ${
                    filterLevel === level
                      ? "bg-[oklch(0.42_0.075_185)] text-[oklch(0.97_0.008_80)] border-[oklch(0.42_0.075_185)]"
                      : "bg-transparent text-[oklch(0.42_0.04_60)] border-[oklch(0.87_0.018_75)] hover:border-[oklch(0.42_0.075_185)]"
                  }`}
                >
                  {level === "all" ? "All" : LEVEL_CONFIG[level].label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowClearConfirm(true)}
              className="text-xs font-['Lora'] text-[oklch(0.62_0.015_60)] hover:text-red-600 flex items-center gap-1 transition-colors"
            >
              <Trash2 size={12} />
              Clear all
            </button>
          </motion.div>
        )}

        {/* Clear all confirmation */}
        <AnimatePresence>
          {showClearConfirm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-5 bg-red-50 border border-red-200 rounded-sm px-5 py-3 flex items-center gap-3"
            >
              <AlertTriangle size={15} className="text-red-600 flex-shrink-0" />
              <p className="font-['Lora'] text-xs text-red-700 flex-1">
                This will permanently delete all journal entries. This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    clearAll();
                    setShowClearConfirm(false);
                    toast.success("Heart Journal cleared.");
                  }}
                  className="text-xs font-['Lora'] text-red-700 hover:text-red-900 underline"
                >
                  Clear all
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="text-xs font-['Lora'] text-[oklch(0.52_0.02_60)]"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Entry list */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-20"
          >
            <img
              src={HEART_CALLIGRAPHY}
              alt=""
              className="h-20 w-20 mx-auto mb-5 opacity-30"
              aria-hidden
            />
            <p className="font-['Amiri'] text-2xl text-[oklch(0.52_0.02_60)] mb-2">
              {entries.length === 0 ? "Your journal is empty" : "No entries match this filter"}
            </p>
            <p className="font-['Lora'] text-sm text-[oklch(0.62_0.015_60)] italic mb-6">
              {entries.length === 0
                ? "Begin a reflection to record your first entry."
                : "Try selecting a different filter above."}
            </p>
            {entries.length === 0 && (
              <Link href="/">
                <Button className="bg-[oklch(0.42_0.075_185)] hover:bg-[oklch(0.35_0.07_185)] text-[oklch(0.97_0.008_80)] font-['Amiri'] text-base px-8 py-5 rounded-sm">
                  <Heart size={16} className="mr-2" />
                  Begin a Reflection
                </Button>
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((entry) => (
                <JournalCard key={entry.id} entry={entry} onDelete={deleteEntry} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Inspirational footer quote */}
        {entries.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-14 text-center"
          >
            <div className="my-8 flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[oklch(0.42_0.075_185/0.3)] to-transparent" />
              <img src={ARABESQUE} alt="" className="h-6 w-auto opacity-40" aria-hidden />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[oklch(0.42_0.075_185/0.3)] to-transparent" />
            </div>
            <p className="font-['Lora'] text-sm text-[oklch(0.52_0.02_60)] italic">
              "The heart that acknowledges its ailments is already on the path to healing."
            </p>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[oklch(0.87_0.018_75)] py-8 px-6 mt-10">
        <div className="max-w-3xl mx-auto text-center">
          <img src={ARABESQUE} alt="" className="h-6 w-auto mx-auto mb-4 opacity-40" aria-hidden />
          <p className="font-arabic text-sm text-[oklch(0.52_0.02_60)] mb-1">
            اللَّهُمَّ طَهِّرْ قَلْبِي
          </p>
          <p className="font-['Lora'] text-xs text-[oklch(0.62_0.015_60)] italic">
            "O Allah, purify my heart."
          </p>
        </div>
      </footer>
    </div>
  );
}
