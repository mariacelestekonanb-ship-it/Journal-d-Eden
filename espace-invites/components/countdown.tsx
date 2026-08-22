"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site-config";

function getTimeLeft(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const UNITS = [
  { key: "days", label: "jours" },
  { key: "hours", label: "heures" },
  { key: "minutes", label: "minutes" },
  { key: "seconds", label: "secondes" },
] as const;

export function Countdown() {
  const target = new Date(siteConfig.weddingDate);
  const [timeLeft, setTimeLeft] = useState<ReturnType<
    typeof getTimeLeft
  > | null>(null);

  useEffect(() => {
    setTimeLeft(getTimeLeft(target));
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(target));
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteConfig.weddingDate]);

  return (
    <div className="-mt-16 grid grid-cols-4 gap-1.5 rounded-[22px] border border-ink/[0.06] bg-white p-4.5 shadow-[0_4px_8px_rgba(20,30,10,0.05),0_16px_30px_rgba(20,30,10,0.08)]">
      {UNITS.map((unit, i) => (
        <div
          key={unit.key}
          className={`text-center ${i > 0 ? "border-l border-ink/[0.08]" : ""}`}
        >
          <div className="text-2xl font-extrabold tabular-nums text-olive">
            {timeLeft ? String(timeLeft[unit.key]).padStart(2, "0") : "—"}
          </div>
          <div className="mt-0.5 text-[9px] tracking-[0.1em] text-ink-faint uppercase">
            {unit.label}
          </div>
        </div>
      ))}
    </div>
  );
}
