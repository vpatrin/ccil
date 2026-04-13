"use client";

import { useEffect, useState } from "react";
import FuzzyText from "./FuzzyText";

interface CountdownProps {
  targetDate: Date;
  label?: string;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function Countdown({ targetDate, label }: CountdownProps) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!now) return null;

  const diff = Math.max(0, targetDate.getTime() - now.getTime());
  const expired = diff === 0;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  const display = expired
    ? "SEE YOU NEXT TIME"
    : `${pad(days)} : ${pad(hours)} : ${pad(minutes)} : ${pad(seconds)}`;

  return (
    <div className="flex flex-col items-center gap-6">
      {label && !expired && (
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
      <FuzzyText
        fontSize={expired ? "clamp(1.5rem, 5vw, 3rem)" : "clamp(2.5rem, 9vw, 6rem)"}
        fontWeight={400}
        color={expired ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.85)"}
        baseIntensity={expired ? 0.06 : 0.12}
        hoverIntensity={0.4}
        fuzzRange={20}
        enableHover
        letterSpacing={expired ? 8 : 4}
      >
        {display}
      </FuzzyText>
    </div>
  );
}
