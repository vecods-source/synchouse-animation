"use client";

import { useState, useCallback } from "react";
import { Shield, Check } from "lucide-react";

// =============================================================================
// TEMPLATE VARIABLES - Change these per project/client
// =============================================================================
const TEMPLATE_VARS = {
  // Client/Project name
  clientName: "CLIENT_NAME",

  // Language: "en" (English) or "ar" (Arabic with RTL)
  language: "en" as "en" | "ar",

  // Project status - changes the tagline text
  // Options: "production" | "development" | "warranty" | "maintenance" | "custom"
  status: "production" as "production" | "development" | "warranty" | "maintenance" | "custom",

  // Custom tagline (only used when status is "custom")
  // Provide both languages
  customTagline: {
    en: "Protected by",
    ar: "محمي بواسطة",
  },

  // Maintenance configuration
  maintenance: {
    // Is maintenance free for this client?
    isFree: true,

    // Period of maintenance (e.g., "3 Months", "6 Months", "1 Year", "" or "0" for none)
    // If empty or "0", feature badges will NOT be shown
    period: {
      en: "3 Months",
      ar: "3 أشهر",
    },

    // Price value in QAR (shown only when isFree is true, to show value they're getting)
    price: "500 QAR",

    // Features included
    features: [
      "Bug Fixes",
      "Security Updates",
      "Performance Monitoring",
    ],
  },

  // Support level
  supportLevel: "24/7",
};
// =============================================================================

// =============================================================================
// TRANSLATIONS
// =============================================================================
const TRANSLATIONS = {
  en: {
    clickToEnter: "Click to enter",
    subtitle: "Your trusted technology partner",
    statusTaglines: {
      production: "Protected by",
      development: "Under Development by",
      warranty: "Under Warranty by",
      maintenance: "Maintenance Plan by",
    },
    free: "Free",
    worth: "Worth",
    maintenanceIncluded: "Maintenance Included",
    support: "Support",
  },
  ar: {
    clickToEnter: "انقر للدخول",
    subtitle: "شريكك التقني الموثوق",
    statusTaglines: {
      production: "محمي بواسطة",
      development: "قيد التطوير بواسطة",
      warranty: "تحت الضمان من",
      maintenance: "خطة الصيانة من",
    },
    free: "مجاناً",
    worth: "بقيمة",
    maintenanceIncluded: "الصيانة مشمولة",
    support: "دعم",
  },
};
// =============================================================================

// Get current language translations
function t() {
  return TRANSLATIONS[TEMPLATE_VARS.language];
}

// Check if RTL (Arabic)
function isRTL(): boolean {
  return TEMPLATE_VARS.language === "ar";
}

// Get tagline based on status and language
function getTagline(): string {
  const translations = t();
  if (TEMPLATE_VARS.status === "custom") {
    return TEMPLATE_VARS.customTagline[TEMPLATE_VARS.language];
  }
  return translations.statusTaglines[TEMPLATE_VARS.status] || translations.statusTaglines.production;
}

// Get maintenance period in current language
function getPeriod(): string {
  const period = TEMPLATE_VARS.maintenance.period;
  if (typeof period === "string") {
    return period;
  }
  return period[TEMPLATE_VARS.language] || period.en;
}

// Check if period is valid (not empty or "0")
function hasMaintenance(): boolean {
  const period = getPeriod().trim();
  return period !== "" && period !== "0";
}

// Build features array based on maintenance config
function buildFeatures() {
  // If no maintenance period, return empty array (no badges shown)
  if (!hasMaintenance()) {
    return [];
  }

  const features: { text: string; highlight: boolean }[] = [];
  const { maintenance, supportLevel } = TEMPLATE_VARS;
  const translations = t();
  const period = getPeriod();

  if (maintenance.isFree) {
    // Free maintenance: show "Free X Months" highlighted + price value
    features.push({
      text: `${translations.free} ${period}`,
      highlight: true
    });
    features.push({
      text: `${translations.worth} ${maintenance.price}`,
      highlight: false
    });
  } else {
    // Paid maintenance: just show "Maintenance Included"
    features.push({
      text: translations.maintenanceIncluded,
      highlight: false
    });
  }

  // Always show support level
  features.push({
    text: `${translations.support} ${supportLevel}`,
    highlight: false
  });

  return features;
}

// =============================================================================
// TEMPLATE CONFIGURATION - Customize these values for each project
// =============================================================================
const CONFIG = {
  // Storage key for localStorage (change per project to avoid conflicts)
  storageKey: `synchouse_welcome_${TEMPLATE_VARS.clientName.toLowerCase().replace(/\s+/g, '_')}`,

  // Branding (SyncHouse - don't change)
  brandName: "SyncHouse",
  tagline: getTagline(),
  subtitle: t().subtitle,

  // Feature badges - built from TEMPLATE_VARS
  features: buildFeatures(),

  // UI Text
  clickToEnterText: t().clickToEnter,

  // RTL support
  isRTL: isRTL(),

  // Timing (in milliseconds)
  timing: {
    phase1: 200,
    phase2: 1200,
    phase3: 2500,
    phase4: 4000,
    complete: 6500,
  },

  // Sound enabled
  soundEnabled: true,
};
// =============================================================================

// Check if animation should show (synchronous check for SSR safety)
export function shouldShowWelcomeAnimation(): boolean | null {
  if (typeof window === "undefined") return null;
  return !localStorage.getItem(CONFIG.storageKey);
}

// Reset animation (useful for testing)
export function resetWelcomeAnimation(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(CONFIG.storageKey);
  }
}

// Professional business intro sound using Web Audio API
function playIntroSound() {
  if (!CONFIG.soundEnabled) return;

  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = audioCtx.currentTime;

    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.6, now);
    masterGain.connect(audioCtx.destination);

    const createTone = (
      freq: number,
      startTime: number,
      duration: number,
      volume: number,
      type: OscillatorType = "sine"
    ) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now + startTime);
      gain.gain.setValueAtTime(0, now + startTime);
      gain.gain.linearRampToValueAtTime(volume, now + startTime + 0.02);
      gain.gain.setValueAtTime(volume, now + startTime + duration * 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, now + startTime + duration);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now + startTime);
      osc.stop(now + startTime + duration);
    };

    createTone(130.81, 0, 2.5, 0.15, "sine");
    createTone(196.00, 0.1, 2.3, 0.08, "sine");
    createTone(329.63, 0.3, 1.8, 0.12, "sine");
    createTone(392.00, 0.5, 1.6, 0.10, "sine");
    createTone(523.25, 0.7, 1.4, 0.08, "sine");
    createTone(659.25, 0.9, 1.2, 0.06, "sine");

    const subBass = audioCtx.createOscillator();
    const subGain = audioCtx.createGain();
    subBass.type = "sine";
    subBass.frequency.setValueAtTime(65.41, now);
    subGain.gain.setValueAtTime(0, now);
    subGain.gain.linearRampToValueAtTime(0.2, now + 0.1);
    subGain.gain.setValueAtTime(0.2, now + 0.5);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);
    subBass.connect(subGain);
    subGain.connect(masterGain);
    subBass.start(now);
    subBass.stop(now + 2.0);
  } catch (e) {
    console.error("Audio synthesis failed:", e);
  }
}

interface WelcomeAnimationProps {
  onComplete?: () => void;
  // Optional overrides for CONFIG values
  brandName?: string;
  tagline?: string;
  subtitle?: string;
  features?: { text: string; highlight?: boolean }[];
}

export function WelcomeAnimation({
  onComplete,
  brandName = CONFIG.brandName,
  tagline = CONFIG.tagline,
  subtitle = CONFIG.subtitle,
  features = CONFIG.features,
}: WelcomeAnimationProps) {
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState(0);
  const [visible, setVisible] = useState(true);

  const handleComplete = useCallback(() => {
    setVisible(false);
    onComplete?.();
  }, [onComplete]);

  const startAnimation = () => {
    if (started) return;
    setStarted(true);

    localStorage.setItem(CONFIG.storageKey, "true");
    playIntroSound();

    setTimeout(() => setPhase(1), CONFIG.timing.phase1);
    setTimeout(() => setPhase(2), CONFIG.timing.phase2);
    setTimeout(() => setPhase(3), CONFIG.timing.phase3);
    setTimeout(() => setPhase(4), CONFIG.timing.phase4);
    setTimeout(() => handleComplete(), CONFIG.timing.complete);
  };

  if (!visible) return null;

  return (
    <div
      dir={CONFIG.isRTL ? "rtl" : "ltr"}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background transition-all duration-700 ease-out ${
        phase >= 4 ? "opacity-0 pointer-events-none" : "opacity-100"
      } ${CONFIG.isRTL ? "font-arabic" : ""}`}
    >
      <div className="flex flex-col items-center justify-center">
        {/* Shield Icon */}
        <div
          className="relative cursor-pointer"
          onClick={!started ? startAnimation : undefined}
        >
          {/* Outer rings - smooth pulse effect */}
          <div
            className={`absolute inset-0 rounded-full bg-primary/20 transition-all duration-1000 ease-out ${
              started && phase >= 1 && phase < 3
                ? "scale-[2.5] opacity-0"
                : started
                  ? "scale-100 opacity-0"
                  : "scale-100 opacity-50"
            }`}
          />
          <div
            className={`absolute inset-0 rounded-full bg-primary/30 transition-all duration-800 ease-out delay-75 ${
              started && phase >= 1 && phase < 3
                ? "scale-[2] opacity-0"
                : started
                  ? "scale-100 opacity-0"
                  : "scale-100 opacity-40"
            }`}
          />

          {/* Main icon container */}
          <div
            className={`relative w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-xl shadow-primary/25 transition-all duration-500 ease-out ${
              !started
                ? "hover:scale-110 hover:shadow-2xl hover:shadow-primary/30 active:scale-95"
                : phase >= 1
                  ? "scale-100"
                  : "scale-95"
            }`}
          >
            <Shield
              className={`h-12 w-12 text-primary-foreground transition-all duration-600 ease-out ${
                phase >= 3 ? "scale-0 opacity-0 rotate-180" : "scale-100 opacity-100 rotate-0"
              }`}
            />
            <Check
              className={`absolute h-12 w-12 text-primary-foreground transition-all duration-600 ease-out ${
                phase >= 3 ? "scale-100 opacity-100 rotate-0" : "scale-0 opacity-0 -rotate-180"
              }`}
              strokeWidth={3}
            />
          </div>
        </div>

        {/* Click to enter text - only before animation */}
        <p
          className={`text-base text-muted-foreground mt-3 transition-all duration-500 ease-out ${
            !started ? "opacity-70" : "opacity-0 translate-y-2"
          }`}
        >
          {CONFIG.clickToEnterText}
        </p>

        {/* Text - appears after animation starts */}
        <div
          className={`text-center space-y-1 transition-all duration-700 ease-out ${
            started && phase >= 1 ? "opacity-100 mt-3" : "opacity-0 mt-2 pointer-events-none"
          }`}
        >
          <p
            className={`text-lg font-medium text-foreground/80 transition-all duration-600 ease-out ${
              phase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
          >
            {tagline}
          </p>
          <h1
            className={`text-4xl font-bold ${CONFIG.isRTL ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent transition-all duration-600 ease-out delay-100 ${
              phase >= 2 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-3 scale-95"
            }`}
          >
            {brandName}
          </h1>
          <p
            className={`text-sm text-muted-foreground transition-all duration-600 ease-out delay-200 ${
              phase >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
          >
            {subtitle}
          </p>
        </div>

        {/* Feature badges - promotional messages */}
        {features.length > 0 && (
          <div
            className={`flex flex-wrap justify-center gap-2 mt-4 max-w-sm transition-all duration-600 ease-out ${
              phase >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {features.map((feature, index) => (
              <span
                key={index}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-500 ease-out ${
                  feature.highlight
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
                style={{
                  transitionDelay: `${index * 100}ms`,
                  opacity: phase >= 3 ? 1 : 0,
                  transform: phase >= 3 ? "translateY(0)" : "translateY(10px)"
                }}
              >
                {feature.text}
              </span>
            ))}
          </div>
        )}

        {/* Loading dots */}
        <div
          className={`flex gap-2 mt-4 transition-all duration-500 ease-out ${
            phase >= 2 && phase < 4 ? "opacity-100" : "opacity-0"
          }`}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-primary/70 animate-bounce"
              style={{ animationDelay: `${i * 150}ms`, animationDuration: "1s" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
