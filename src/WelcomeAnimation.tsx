"use client";

import { useState, useCallback, useEffect } from "react";
import { Shield, Check } from "lucide-react";

export type WelcomeMode = "dark" | "light";
export type WelcomeStatus = "production" | "maintenance" | "development";

export interface WelcomeAnimationProps {
  mode?: WelcomeMode;
  status?: WelcomeStatus;
  clientName?: string;
  onComplete?: () => void;
}

// Get message based on status
function getMessage(status: WelcomeStatus): string {
  switch (status) {
    case "production":
      return "Created by";
    case "maintenance":
      return "Maintained by";
    case "development":
      return "Under Development by";
  }
}

// Get colors based on mode
function getColors(mode: WelcomeMode) {
  if (mode === "dark") {
    return {
      bg: "bg-black",
      text: "text-white",
      textMuted: "text-white/60",
      textSubtle: "text-white/40",
      iconBg: "bg-white",
      iconColor: "text-black",
      dot: "bg-white/50",
    };
  }
  return {
    bg: "bg-white",
    text: "text-black",
    textMuted: "text-black/60",
    textSubtle: "text-black/40",
    iconBg: "bg-black",
    iconColor: "text-white",
    dot: "bg-black/50",
  };
}

function getStorageKey(clientName: string): string {
  return `synchouse_welcome_${clientName.toLowerCase().replace(/\s+/g, "_")}`;
}

// Check if animation should show
export function shouldShowWelcomeAnimation(clientName: string): boolean | null {
  if (typeof window === "undefined") return null;
  return !localStorage.getItem(getStorageKey(clientName));
}

// Reset animation (for testing)
export function resetWelcomeAnimation(clientName: string): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(getStorageKey(clientName));
  }
}

export function WelcomeAnimation({
  mode = "dark",
  status = "production",
  clientName = "client",
  onComplete,
}: WelcomeAnimationProps) {
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState(0);
  const [visible, setVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(false);

  const colors = getColors(mode);
  const message = getMessage(status);
  const storageKey = getStorageKey(clientName);

  // Check localStorage on mount
  useEffect(() => {
    const hasSeenAnimation = localStorage.getItem(storageKey);
    if (hasSeenAnimation) {
      setVisible(false);
      onComplete?.();
    } else {
      setShouldRender(true);
    }
  }, [storageKey, onComplete]);

  const handleComplete = useCallback(() => {
    setVisible(false);
    onComplete?.();
  }, [onComplete]);

  const startAnimation = () => {
    if (started) return;
    setStarted(true);
    localStorage.setItem(storageKey, "true");

    setTimeout(() => setPhase(1), 200);
    setTimeout(() => setPhase(2), 1000);
    setTimeout(() => setPhase(3), 2000);
    setTimeout(() => setPhase(4), 3500);
    setTimeout(() => handleComplete(), 4500);
  };

  if (!visible || !shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 w-screen h-screen flex items-center justify-center transition-all duration-700 ease-out ${colors.bg} ${
        phase >= 4 ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ width: "100vw", height: "100vh" }}
    >
      <div className="relative flex flex-col items-center justify-center">
        {/* Icon */}
        <div
          className="relative cursor-pointer"
          onClick={!started ? startAnimation : undefined}
        >
          {/* Pulse ring */}
          <div
            className={`absolute inset-0 rounded-full ${colors.iconBg} opacity-20 transition-all duration-1000 ease-out ${
              started && phase >= 1 && phase < 3
                ? "scale-[2.5] opacity-0"
                : started
                  ? "scale-100 opacity-0"
                  : "scale-100 opacity-30"
            }`}
          />

          {/* Main icon */}
          <div
            className={`relative w-24 h-24 rounded-full ${colors.iconBg} flex items-center justify-center transition-all duration-500 ease-out ${
              !started ? "hover:scale-110 active:scale-95" : ""
            }`}
          >
            <Shield
              className={`h-12 w-12 ${colors.iconColor} transition-all duration-500 ease-out ${
                phase >= 3 ? "scale-0 opacity-0 rotate-180" : "scale-100 opacity-100"
              }`}
            />
            <Check
              className={`absolute h-12 w-12 ${colors.iconColor} transition-all duration-500 ease-out ${
                phase >= 3 ? "scale-100 opacity-100" : "scale-0 opacity-0 -rotate-180"
              }`}
              strokeWidth={3}
            />
          </div>
        </div>

        {/* Click to enter */}
        <p
          className={`text-base ${colors.textSubtle} mt-3 transition-all duration-500 ease-out ${
            !started ? "opacity-100" : "opacity-0 translate-y-2"
          }`}
        >
          Click to enter
        </p>

        {/* Text content */}
        <div
          className={`text-center space-y-1 transition-all duration-700 ease-out ${
            started && phase >= 1 ? "opacity-100 mt-3" : "opacity-0 mt-2 pointer-events-none"
          }`}
        >
          <p
            className={`text-lg font-medium ${colors.textMuted} transition-all duration-500 ease-out ${
              phase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
          >
            {message}
          </p>
          <h1
            className={`text-4xl font-bold ${colors.text} transition-all duration-500 ease-out ${
              phase >= 3 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-3 scale-95"
            }`}
          >
            SyncHouse
          </h1>
        </div>

        {/* Loading dots */}
        <div
          className={`flex gap-2 mt-6 transition-all duration-500 ease-out ${
            phase >= 2 && phase < 4 ? "opacity-100" : "opacity-0"
          }`}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${colors.dot} animate-bounce`}
              style={{ animationDelay: `${i * 150}ms`, animationDuration: "1s" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
