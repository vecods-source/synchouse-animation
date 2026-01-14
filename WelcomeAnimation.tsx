"use client";

import { useState, useEffect, useCallback } from "react";
import { Shield, Check } from "lucide-react";

const WELCOME_ANIM_KEY = "lazla_welcome_anim_shown";

// Check if animation should show (synchronous check for SSR safety)
export function shouldShowWelcomeAnimation(): boolean | null {
  if (typeof window === "undefined") return null;
  return !localStorage.getItem(WELCOME_ANIM_KEY);
}

// Professional business intro sound using Web Audio API
function playIntroSound() {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = audioCtx.currentTime;

    // Create a master gain for overall volume
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.6, now);
    masterGain.connect(audioCtx.destination);

    // Create reverb-like effect with delay
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

    // Deep, warm pad foundation (C3)
    createTone(130.81, 0, 2.5, 0.15, "sine");

    // Subtle fifth harmony (G3)
    createTone(196.00, 0.1, 2.3, 0.08, "sine");

    // First chord tone - warm (E4)
    createTone(329.63, 0.3, 1.8, 0.12, "sine");

    // Second chord tone - resolution (G4)
    createTone(392.00, 0.5, 1.6, 0.10, "sine");

    // Soft high accent (C5) - the "ding"
    createTone(523.25, 0.7, 1.4, 0.08, "sine");

    // Final resolution tone (E5)
    createTone(659.25, 0.9, 1.2, 0.06, "sine");

    // Subtle sub-bass warmth
    const subBass = audioCtx.createOscillator();
    const subGain = audioCtx.createGain();
    subBass.type = "sine";
    subBass.frequency.setValueAtTime(65.41, now); // C2
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
}

export function WelcomeAnimation({ onComplete }: WelcomeAnimationProps) {
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

    // Mark as seen
    localStorage.setItem(WELCOME_ANIM_KEY, "true");

    // Play synthesized intro sound
    playIntroSound();

    // Phase transitions
    setTimeout(() => setPhase(1), 200);
    setTimeout(() => setPhase(2), 1200);
    setTimeout(() => setPhase(3), 2500);
    setTimeout(() => setPhase(4), 4000);
    setTimeout(() => handleComplete(), 5500);
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
          Click to enter
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
            Protected by
          </p>
          <h1
            className={`text-4xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent transition-all duration-600 ease-out delay-100 ${
              phase >= 2 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-3 scale-95"
            }`}
          >
            SyncHouse
          </h1>
          <p
            className={`text-sm text-muted-foreground transition-all duration-600 ease-out delay-200 ${
              phase >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
          >
            Your trusted technology partner
          </p>
        </div>

        {/* Loading dots */}
        <div
          className={`flex gap-2 mt-3 transition-all duration-500 ease-out ${
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
