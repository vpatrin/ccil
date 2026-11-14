"use client";

import { useEffect, useState } from "react";
import FuzzyText from "./FuzzyText";

interface CountdownProps {
  targetDate: Date | null;
  label?: string;
  thankYou?: string | null;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function Countdown({ targetDate, label, thankYou }: CountdownProps) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    let interval = setInterval(tick, 1000);

    const onVisibility = () => {
      if (document.hidden) {
        clearInterval(interval);
      } else {
        tick();
        interval = setInterval(tick, 1000);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  if (!now) return null;

  const diff = targetDate
    ? Math.max(0, targetDate.getTime() - now.getTime())
    : 0;
  const showTimer = Boolean(targetDate) && diff > 0;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000) / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  const display = showTimer
    ? `${pad(days)} : ${pad(hours)} : ${pad(minutes)} : ${pad(seconds)}`
    : "SEE YOU LATER";

  return (
    <div className="flex flex-col items-center gap-6 px-6">
      {thankYou && (
        <p className="max-w-xl text-center text-sm leading-relaxed tracking-[0.12em] text-white/55">
          {thankYou}
        </p>
      )}
      {label && showTimer && (
        <FuzzyText
          fontSize="clamp(0.7rem, 2vw, 1rem)"
          fontWeight={400}
          color="rgba(255,255,255,0.3)"
          baseIntensity={0.08}
          hoverIntensity={0.3}
          fuzzRange={10}
          enableHover
          letterSpacing={8}
        >
          {label.toUpperCase()}
        </FuzzyText>
      )}
      {(showTimer || !thankYou) && (
        <FuzzyText
          fontSize={showTimer ? "clamp(2.5rem, 9vw, 6rem)" : "clamp(1.5rem, 5vw, 3rem)"}
          fontWeight={400}
          color={showTimer ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.4)"}
          baseIntensity={showTimer ? 0.12 : 0.06}
          hoverIntensity={0.4}
          fuzzRange={20}
          enableHover
          letterSpacing={showTimer ? 4 : 8}
        >
          {display}
        </FuzzyText>
      )}
    </div>
  );
}
