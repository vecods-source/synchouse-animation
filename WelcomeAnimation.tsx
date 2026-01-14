"use client";

import { useState, useCallback } from "react";
import { Shield, Check } from "lucide-react";

// =============================================================================
// TEMPLATE VARIABLES - Change these per project/client
// =============================================================================
const TEMPLATE_VARS = {
  // Client/Project name
  clientName: "CLIENT_NAME",

  // Free period offer
  freePeriod: "3 Months",

  // Maintenance features included
  maintenanceFeatures: [
    "Bug Fixes",
    "Security Updates",
    "Performance Monitoring",
  ],

  // Support level
  supportLevel: "24/7",
};
// =============================================================================

// =============================================================================
// TEMPLATE CONFIGURATION - Customize these values for each project
// =============================================================================
const CONFIG = {
  // Storage key for localStorage (change per project to avoid conflicts)
  storageKey: `synchouse_welcome_${TEMPLATE_VARS.clientName.toLowerCase().replace(/\s+/g, '_')}`,

  // Branding (SyncHouse - don't change)
  brandName: "SyncHouse",
  tagline: "Protected by",
  subtitle: "Your trusted technology partner",

  // Feature badges - built from TEMPLATE_VARS
  features: [
    { text: `Free ${TEMPLATE_VARS.freePeriod}`, highlight: true },
    { text: "Maintenance Included", highlight: false },
    { text: `${TEMPLATE_VARS.supportLevel} Support`, highlight: false },
  ],

  // UI Text
  clickToEnterText: "Click to enter",

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
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background transition-all duration-700 ease-out ${
        phase >= 4 ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
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
            className={`text-4xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent transition-all duration-600 ease-out delay-100 ${
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
