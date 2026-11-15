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

  const units = [
    { value: pad(days), suffix: "d" },
    { value: pad(hours), suffix: "h" },
    { value: pad(minutes), suffix: "m" },
    { value: pad(seconds), suffix: "s" },
  ];
  const display = showTimer
    ? `${pad(days)} : ${pad(hours)} : ${pad(minutes)} : ${pad(seconds)}`
    : "SEE YOU LATER";

  return (
    <div className="flex w-full max-w-[100vw] flex-col items-center gap-5 px-4 sm:gap-6 sm:px-6">
      {thankYou && (
        <p className="max-w-xl text-center text-xs leading-relaxed tracking-[0.08em] text-white/80 sm:text-sm sm:tracking-[0.12em]">
          {thankYou}
        </p>
      )}

      <div className="flex w-full flex-col items-center gap-4 sm:hidden">
        {label && showTimer && (
          <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[#b8ff3c]">
            {label}
          </p>
        )}
        {(showTimer || !thankYou) && (
          showTimer ? (
            <div className="grid w-full max-w-sm grid-cols-4 gap-2">
              {units.map((unit) => (
                <div key={unit.suffix} className="flex flex-col items-center gap-1">
                  <span className="font-normal tabular-nums text-[1.85rem] leading-none tracking-wide text-white/90">
                    {unit.value}
                  </span>
                  <span className="text-[0.55rem] uppercase tracking-[0.2em] text-[#b8ff3c]/80">
                    {unit.suffix}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-lg uppercase tracking-[0.18em] text-white/70">
              {display}
            </p>
          )
        )}
      </div>

      <div className="hidden flex-col items-center gap-6 sm:flex">
        {label && showTimer && (
          <FuzzyText
            fontSize="clamp(0.7rem, 2vw, 1rem)"
            fontWeight={400}
            color="#b8ff3c"
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
    </div>
  );
}
