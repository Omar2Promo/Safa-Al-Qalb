// Home.tsx
// Safa Al-Qalb — صفاء القلب
// Design: Islamic Geometric Minimalism meets Wabi-Sabi
// Parchment palette, Amiri/Lora typography, muted teal accents

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Streamdown } from "streamdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useEmotionLog, EmotionLevel } from "@/hooks/useEmotionLog";
import { seekGuidance } from "@/lib/openrouter";
import { Link } from "wouter";
import {
  Heart,
  BookOpen,
  Flame,
  CloudLightning,
  ChevronDown,
  Loader2,
  Sparkles,
} from "lucide-react";

// ─── Asset URLs ───────────────────────────────────────────────
const HERO_BG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663618470936/2CfQMPyftjStHscqN5UyDD/hero-bg-HNevbLn7q7cWKYGmHCiTCz.webp";
const ARABESQUE =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663618470936/2CfQMPyftjStHscqN5UyDD/arabesque-ornament-9ggU79RtCy2Ppo6YWm7oqr.webp";
const HEART_CALLIGRAPHY =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663618470936/2CfQMPyftjStHscqN5UyDD/heart-calligraphy-QrE8AKa2eKeJ7kEB7Zuxjk.webp";

// ─── Emotion level config ─────────────────────────────────────
const EMOTION_LEVELS: {
  id: EmotionLevel;
  label: string;
  arabic: string;
  description: string;
  icon: React.ElementType;
  colorClass: string;
  selectedClass: string;
  dotColor: string;
}[] = [
  {
    id: "mild",
    label: "Mild Annoyance",
    arabic: "ضيق خفيف",
    description:
      "A slight irritation or discomfort — something that bothers you but does not consume your thoughts.",
    icon: Heart,
    colorClass: "text-amber-600",
    selectedClass: "selected-mild",
    dotColor: "bg-amber-400",
  },
  {
    id: "irritation",
    label: "Active Irritation",
    arabic: "انزعاج نشط",
    description:
      "A persistent, recurring frustration — this feeling surfaces often and affects your peace of mind.",
    icon: Flame,
    colorClass: "text-orange-600",
    selectedClass: "selected-irritation",
    dotColor: "bg-orange-500",
  },
  {
    id: "resentment",
    label: "Deep Resentment",
    arabic: "حقد عميق",
    description:
      "A heavy, long-held bitterness — this feeling has taken root and weighs upon your heart.",
    icon: CloudLightning,
    colorClass: "text-red-700",
    selectedClass: "selected-resentment",
    dotColor: "bg-red-600",
  },
];

// ─── Fade-up motion variants ──────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.55 },
  }),
};

// ─── Ornamental divider ───────────────────────────────────────
function Divider() {
  return (
    <div className="my-10 flex items-center gap-4">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[oklch(0.42_0.075_185/0.35)] to-transparent" />
      <img
        src={ARABESQUE}
        alt=""
        className="h-8 w-auto opacity-60"
        aria-hidden="true"
      />
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[oklch(0.42_0.075_185/0.35)] to-transparent" />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────
export default function Home() {
  const [step, setStep] = useState<"welcome" | "form" | "guidance">("welcome");
  const [selectedLevel, setSelectedLevel] = useState<EmotionLevel | null>(null);
  const [description, setDescription] = useState("");
  const [personLabel, setPersonLabel] = useState("");
  const [guidance, setGuidance] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamedText, setStreamedText] = useState("");
  const guidanceRef = useRef<HTMLDivElement>(null);

  const { addEntry } = useEmotionLog();

  // Scroll to guidance when it appears
  useEffect(() => {
    if (step === "guidance" && guidanceRef.current) {
      setTimeout(() => {
        guidanceRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    }
  }, [step]);

  async function handleSeekGuidance() {
    if (!selectedLevel) {
      toast.error("Please select how you are feeling first.");
      return;
    }
    if (!description.trim() || description.trim().length < 20) {
      toast.error("Please elaborate a little more — at least a sentence or two.");
      return;
    }

    setIsLoading(true);
    setStreamedText("");
    setGuidance("");
    setStep("guidance");

    try {
      let accumulated = "";
      const fullGuidance = await seekGuidance(
        { level: selectedLevel, description: description.trim() },
        (chunk) => {
          accumulated += chunk;
          setStreamedText(accumulated);
        }
      );

      setGuidance(fullGuidance || accumulated);

      // Save to log
      addEntry({
        level: selectedLevel,
        description: description.trim(),
        guidance: fullGuidance || accumulated,
        personLabel: personLabel.trim() || undefined,
      });

      toast.success("Your entry has been saved to your Heart Journal.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "An error occurred.";
      toast.error(`Could not fetch guidance: ${msg}`);
      setStep("form");
    } finally {
      setIsLoading(false);
    }
  }

  function handleStartOver() {
    setStep("form");
    setSelectedLevel(null);
    setDescription("");
    setPersonLabel("");
    setGuidance("");
    setStreamedText("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ─── Welcome screen ────────────────────────────────────────
  if (step === "welcome") {
    return (
      <div
        className="min-h-screen flex flex-col relative overflow-hidden"
        style={{
          backgroundImage: `url(${HERO_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Warm overlay */}
        <div className="absolute inset-0 bg-[oklch(0.975_0.012_80/0.55)]" />

        {/* Nav */}
        <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <img src={HEART_CALLIGRAPHY} alt="Qalb" className="h-9 w-9 object-contain" />
            <span className="font-['Amiri'] text-lg font-bold text-[oklch(0.22_0.025_55)]">
              Safa Al-Qalb
            </span>
          </div>
          <Link href="/journal">
            <button className="flex items-center gap-1.5 text-sm text-[oklch(0.42_0.075_185)] hover:text-[oklch(0.32_0.065_185)] transition-colors font-['Lora']">
              <BookOpen size={15} />
              Heart Journal
            </button>
          </Link>
        </nav>

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
          <motion.div
            initial="hidden"
            animate="visible"
            className="max-w-2xl mx-auto"
          >
            <motion.div variants={fadeUp} custom={0} className="mb-6">
              <img
                src={HEART_CALLIGRAPHY}
                alt="Qalb — Heart"
                className="h-28 w-28 mx-auto object-contain drop-shadow-sm"
              />
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="font-['Amiri'] text-5xl md:text-6xl font-bold text-[oklch(0.22_0.025_55)] leading-tight mb-2"
            >
              Safa Al-Qalb
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="font-arabic text-2xl text-[oklch(0.42_0.075_185)] mb-6 tracking-wide"
            >
              صفاء القلب
            </motion.p>

            <motion.p
              variants={fadeUp}
              custom={3}
              className="font-['Lora'] text-lg text-[oklch(0.35_0.025_55)] leading-relaxed mb-3 italic"
            >
              "Verily, in the remembrance of Allah do hearts find rest."
            </motion.p>
            <motion.p
              variants={fadeUp}
              custom={3.5}
              className="font-arabic text-sm text-[oklch(0.52_0.02_60)] mb-10"
            >
              — سورة الرعد ٢٨
            </motion.p>

            <motion.p
              variants={fadeUp}
              custom={4}
              className="font-['Lora'] text-base text-[oklch(0.42_0.04_60)] leading-relaxed mb-10 max-w-lg mx-auto"
            >
              A sacred space to acknowledge the feelings that weigh upon your heart,
              and to seek healing through the wisdom of the Quran, Hadith, and Sunnah.
            </motion.p>

            <motion.div variants={fadeUp} custom={5}>
              <Button
                onClick={() => setStep("form")}
                size="lg"
                className="bg-[oklch(0.42_0.075_185)] hover:bg-[oklch(0.35_0.07_185)] text-[oklch(0.97_0.008_80)] font-['Amiri'] text-lg px-10 py-6 rounded-sm shadow-md hover:shadow-lg transition-all duration-300"
              >
                Begin Your Reflection
              </Button>
            </motion.div>

            <motion.div
              variants={fadeUp}
              custom={6}
              className="mt-12 flex flex-col items-center gap-1 text-[oklch(0.52_0.02_60)]"
            >
              <span className="text-xs font-['Lora'] tracking-widest uppercase">
                Scroll to learn more
              </span>
              <ChevronDown size={16} className="animate-bounce" />
            </motion.div>
          </motion.div>
        </div>

        {/* Feature strip */}
        <div className="relative z-10 bg-[oklch(0.22_0.025_55/0.85)] backdrop-blur-sm py-8 px-6">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {[
              { icon: Heart, title: "Acknowledge", desc: "Name what you feel without judgment" },
              { icon: BookOpen, title: "Seek Guidance", desc: "Receive wisdom from Quran & Hadith" },
              { icon: Sparkles, title: "Purify", desc: "Track your journey toward a clear heart" },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.15, duration: 0.5 }}
                className="flex flex-col items-center gap-2"
              >
                <Icon size={22} className="text-[oklch(0.75_0.06_185)]" />
                <p className="font-['Amiri'] text-lg text-[oklch(0.92_0.008_80)]">{title}</p>
                <p className="font-['Lora'] text-sm text-[oklch(0.72_0.01_80)]">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── Form + Guidance screen ────────────────────────────────
  return (
    <div className="min-h-screen bg-[oklch(0.975_0.012_80)] parchment-texture">
      {/* Nav */}
      <nav className="sticky top-0 z-20 bg-[oklch(0.975_0.012_80/0.92)] backdrop-blur-sm border-b border-[oklch(0.87_0.018_75)] px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={() => setStep("welcome")}
            className="flex items-center gap-2 group"
          >
            <img src={HEART_CALLIGRAPHY} alt="" className="h-7 w-7 object-contain" />
            <span className="font-['Amiri'] text-base font-bold text-[oklch(0.22_0.025_55)] group-hover:text-[oklch(0.42_0.075_185)] transition-colors">
              Safa Al-Qalb
            </span>
            <span className="font-arabic text-sm text-[oklch(0.42_0.075_185)] hidden sm:inline">
              صفاء القلب
            </span>
          </button>
          <Link href="/journal">
            <button className="flex items-center gap-1.5 text-sm text-[oklch(0.42_0.075_185)] hover:text-[oklch(0.32_0.065_185)] transition-colors font-['Lora']">
              <BookOpen size={14} />
              Heart Journal
            </button>
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-12">
        {/* Step 1: Emotion Level */}
        <AnimatePresence>
          {(step === "form" || step === "guidance") && (
            <motion.section
              initial="hidden"
              animate="visible"
              className="mb-10"
            >
              <motion.div variants={fadeUp} custom={0} className="mb-2">
                <span className="text-xs font-['Lora'] tracking-widest uppercase text-[oklch(0.42_0.075_185)]">
                  Step 1
                </span>
              </motion.div>
              <motion.h2
                variants={fadeUp}
                custom={0.5}
                className="font-['Amiri'] text-3xl text-[oklch(0.22_0.025_55)] mb-2"
              >
                How are you feeling?
              </motion.h2>
              <motion.p
                variants={fadeUp}
                custom={1}
                className="font-['Lora'] text-sm text-[oklch(0.52_0.02_60)] mb-7 italic"
              >
                Select the level that best describes what weighs upon your heart.
              </motion.p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {EMOTION_LEVELS.map((level, i) => {
                  const Icon = level.icon;
                  const isSelected = selectedLevel === level.id;
                  return (
                    <motion.button
                      key={level.id}
                      variants={fadeUp}
                      custom={1.5 + i * 0.15}
                      onClick={() => step === "form" && setSelectedLevel(level.id)}
                      disabled={step === "guidance"}
                      className={`emotion-card rounded-sm p-5 text-left transition-all duration-400 ${
                        isSelected ? level.selectedClass : ""
                      } ${step === "guidance" ? "opacity-70 cursor-default" : ""}`}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`w-2 h-2 rounded-full ${level.dotColor}`} />
                        <Icon size={18} className={level.colorClass} />
                      </div>
                      <p className="font-['Amiri'] text-lg font-bold text-[oklch(0.22_0.025_55)] mb-1">
                        {level.label}
                      </p>
                      <p className="font-arabic text-xs text-[oklch(0.52_0.02_60)] mb-2">
                        {level.arabic}
                      </p>
                      <p className="font-['Lora'] text-xs text-[oklch(0.45_0.02_60)] leading-relaxed">
                        {level.description}
                      </p>
                    </motion.button>
                  );
                })}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        <Divider />

        {/* Step 2: Elaboration */}
        <AnimatePresence>
          {(step === "form" || step === "guidance") && (
            <motion.section
              initial="hidden"
              animate="visible"
              className="mb-10"
            >
              <motion.div variants={fadeUp} custom={0} className="mb-2">
                <span className="text-xs font-['Lora'] tracking-widest uppercase text-[oklch(0.42_0.075_185)]">
                  Step 2
                </span>
              </motion.div>
              <motion.h2
                variants={fadeUp}
                custom={0.5}
                className="font-['Amiri'] text-3xl text-[oklch(0.22_0.025_55)] mb-2"
              >
                Tell your heart's story
              </motion.h2>
              <motion.p
                variants={fadeUp}
                custom={1}
                className="font-['Lora'] text-sm text-[oklch(0.52_0.02_60)] mb-6 italic"
              >
                Describe what happened and how it made you feel. This is a private, sacred space.
              </motion.p>

              <motion.div variants={fadeUp} custom={1.5} className="mb-4">
                <label className="block font-['Lora'] text-sm text-[oklch(0.42_0.04_60)] mb-1.5">
                  Who is this feeling toward? <span className="text-[oklch(0.62_0.02_60)]">(optional — e.g., "a colleague", "a family member")</span>
                </label>
                <input
                  type="text"
                  value={personLabel}
                  onChange={(e) => setPersonLabel(e.target.value)}
                  disabled={step === "guidance"}
                  placeholder="e.g., a close friend, a coworker..."
                  className="w-full px-4 py-2.5 bg-[oklch(0.99_0.008_80)] border border-[oklch(0.87_0.018_75)] rounded-sm font-['Lora'] text-sm text-[oklch(0.22_0.025_55)] placeholder:text-[oklch(0.65_0.015_60)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.42_0.075_185)] transition-all disabled:opacity-60"
                />
              </motion.div>

              <motion.div variants={fadeUp} custom={2}>
                <label className="block font-['Lora'] text-sm text-[oklch(0.42_0.04_60)] mb-1.5">
                  Elaborate on your feeling <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={step === "guidance"}
                  placeholder="Describe the situation, what was said or done, and how it affected you. Be honest — this is between you and Allah..."
                  rows={6}
                  className="w-full px-4 py-3 bg-[oklch(0.99_0.008_80)] border border-[oklch(0.87_0.018_75)] rounded-sm font-['Lora'] text-sm text-[oklch(0.22_0.025_55)] placeholder:text-[oklch(0.65_0.015_60)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.42_0.075_185)] resize-none transition-all disabled:opacity-60 leading-relaxed"
                />
                <p className="text-xs text-[oklch(0.62_0.02_60)] mt-1 font-['Lora']">
                  {description.length} characters
                </p>
              </motion.div>

              {step === "form" && (
                <motion.div variants={fadeUp} custom={2.5} className="mt-7">
                  <Button
                    onClick={handleSeekGuidance}
                    disabled={isLoading || !selectedLevel || description.trim().length < 20}
                    size="lg"
                    className="w-full sm:w-auto bg-[oklch(0.42_0.075_185)] hover:bg-[oklch(0.35_0.07_185)] text-[oklch(0.97_0.008_80)] font-['Amiri'] text-lg px-10 py-6 rounded-sm shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={18} className="mr-2 animate-spin" />
                        Seeking Guidance...
                      </>
                    ) : (
                      <>
                        <BookOpen size={18} className="mr-2" />
                        Seek Guidance
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </motion.section>
          )}
        </AnimatePresence>

        {/* Step 3: Guidance Response */}
        <AnimatePresence>
          {step === "guidance" && (
            <motion.section
              ref={guidanceRef}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Divider />

              <div className="mb-2">
                <span className="text-xs font-['Lora'] tracking-widest uppercase text-[oklch(0.42_0.075_185)]">
                  Guidance
                </span>
              </div>
              <h2 className="font-['Amiri'] text-3xl text-[oklch(0.22_0.025_55)] mb-2">
                From the Quran, Hadith & Sunnah
              </h2>
              <p className="font-['Lora'] text-sm text-[oklch(0.52_0.02_60)] mb-7 italic">
                May Allah purify your heart and grant you peace.
              </p>

              <div className="guidance-response rounded-sm p-6 mb-8">
                {isLoading && !streamedText ? (
                  <div className="flex items-center gap-3 text-[oklch(0.42_0.075_185)]">
                    <Loader2 size={20} className="animate-spin" />
                    <span className="font-['Lora'] text-sm italic">
                      Seeking wisdom from the sacred sources...
                    </span>
                  </div>
                ) : (
                  <div className="font-['Lora'] text-[oklch(0.22_0.025_55)] leading-relaxed prose prose-sm max-w-none">
                    <Streamdown>{streamedText || guidance}</Streamdown>
                    {isLoading && (
                      <span className="inline-block w-1.5 h-4 bg-[oklch(0.42_0.075_185)] animate-pulse ml-0.5 align-middle" />
                    )}
                  </div>
                )}
              </div>

              {!isLoading && (guidance || streamedText) && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <Button
                    onClick={handleStartOver}
                    variant="outline"
                    className="border-[oklch(0.42_0.075_185)] text-[oklch(0.42_0.075_185)] hover:bg-[oklch(0.42_0.075_185/0.08)] font-['Amiri'] text-base px-7 py-5 rounded-sm transition-all"
                  >
                    <Heart size={16} className="mr-2" />
                    Reflect on Another Feeling
                  </Button>
                  <Link href="/journal">
                    <Button
                      variant="outline"
                      className="border-[oklch(0.87_0.018_75)] text-[oklch(0.42_0.04_60)] hover:bg-[oklch(0.93_0.012_80)] font-['Amiri'] text-base px-7 py-5 rounded-sm transition-all w-full sm:w-auto"
                    >
                      <BookOpen size={16} className="mr-2" />
                      View Heart Journal
                    </Button>
                  </Link>
                </motion.div>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-[oklch(0.87_0.018_75)] py-8 px-6 mt-16">
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
