"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import FadeIn from "@/components/FadeIn";
import Countdown from "@/components/Countdown";
import { Link as LinkIcon } from "@phosphor-icons/react";
import content from "@/content.json";
import { gigTitle, splitGigs, type Gig } from "@/lib/gigs";

const Dither = dynamic(() => import("@/components/Dither"), { ssr: false });

const WAVE_COLOR: [number, number, number] = [0.3, 0.3, 0.4];
const GIGS = content.gigs as Gig[];

function Waveform() {
  const segments = 80;
  const height = 100;
  const step = height / segments;

  const d = Array.from({ length: segments + 1 }, (_, i) => {
    const y = i * step;
    const amplitude =
      3.5 * Math.sin(i * 0.4) *
      Math.sin(i * 0.15) *
      (0.5 + 0.5 * Math.sin(i * 0.08));
    const x = 50 + amplitude;
    return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(" ");

  return (
    <div
      className="fixed left-8 sm:left-16 top-0 h-screen w-12
                 mix-blend-difference pointer-events-none select-none
                 hidden sm:block
                 opacity-0 animate-[fadeIn_1500ms_ease-out_800ms_forwards]"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        <path
          d={d}
          fill="none"
          stroke="white"
          strokeWidth="0.8"
          strokeOpacity="0.07"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function FloatingName() {
  return (
    <div className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] right-4 z-40 text-right mix-blend-difference sm:bottom-6 sm:right-16">
      <h1 className="font-normal tracking-[0.12em] leading-none text-[0.7rem] sm:text-[clamp(1.1rem,2.4vw,1.85rem)] sm:tracking-[0.15em]">
        <a
          href={content.youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/90 no-underline"
        >
          ccil
        </a>
      </h1>
    </div>
  );
}

function AboutParagraph({ text }: { text: string }) {
  const parts = text.split("T.I.T.S.");

  if (parts.length === 1) {
    return <>{text}</>;
  }

  return (
    <>
      {parts[0]}
      <a
        href={content.titsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-[#ff2bd6] underline decoration-[#ff2bd6] underline-offset-4 hover:text-[#ff70e0]"
      >
        T.I.T.S.
      </a>
      {parts.slice(1).join("T.I.T.S.")}
    </>
  );
}

function GigList({ gigs }: { gigs: Gig[] }) {
  return (
    <div className="space-y-2 sm:space-y-4">
      {gigs.map((gig, i) => (
        <FadeIn key={`${gig.date}-${gig.event}`} delay={i * 100}>
          <div className="flex items-baseline justify-between gap-3 sm:gap-4">
            <span className="min-w-0 text-[0.68rem] leading-snug text-white/80 sm:text-sm sm:leading-relaxed">
              {gigTitle(gig)}
            </span>
            <span className="shrink-0 text-[0.62rem] tracking-[0.14em] text-[#b8ff3c] sm:text-sm sm:tracking-[0.3em]">
              {gig.date}
            </span>
          </div>
        </FadeIn>
      ))}
    </div>
  );
}

export default function Home() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const { upcoming, past, next, last, isThankYouDay } = now
    ? splitGigs(GIGS, now)
    : { upcoming: [], past: [], next: null, last: null, isThankYouDay: false };

  const thankYou =
    isThankYouDay && last
      ? `thank you for having danced with me on ${last.date} ${gigTitle(last)}`
      : null;

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 z-0">
        <Dither
          waveColor={WAVE_COLOR}
          enableMouseInteraction
        />
      </div>

      <div className="relative z-10">
        <Waveform />
        <FloatingName />

        <section className="relative flex h-[100dvh] items-center justify-center px-4 sm:px-16">
          <FadeIn delay={200} className="w-full">
            <Countdown
              targetDate={next ? next.time : null}
              label="Next set"
              thankYou={thankYou}
            />
          </FadeIn>
          <FadeIn delay={600} className="absolute bottom-[max(4.5rem,calc(env(safe-area-inset-bottom)+3.5rem))] left-1/2 -translate-x-1/2 sm:bottom-[12vh]">
            <a
              href="https://linktr.ee/ccil.mp3"
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 items-center gap-2 text-xs uppercase tracking-[0.28em] text-[#b8ff3c] transition-colors duration-1000 hover:text-[#e8ff8a] sm:min-h-0 sm:text-[clamp(0.7rem,2vw,1rem)] sm:tracking-[0.3em]"
            >
              <LinkIcon size="1em" weight="light" />
              Links
            </a>
          </FadeIn>
        </section>

        <div className="mx-auto max-w-xl px-4 sm:px-6">
          <div className="h-8 sm:h-[10vh]" />

          {upcoming.length > 0 && (
            <section className="pb-8 sm:pb-20">
              <FadeIn>
                <p className="mb-4 text-xs uppercase tracking-[0.22em] text-[#b8ff3c] sm:mb-10 sm:text-base sm:tracking-[0.6em]">
                  Upcoming
                </p>
              </FadeIn>
              <GigList gigs={upcoming} />
            </section>
          )}

          <div className="h-6 sm:h-[10vh]" />

          {past.length > 0 && (
            <section className="pb-8 sm:pb-20">
              <FadeIn>
                <p className="mb-4 text-xs uppercase tracking-[0.22em] text-[#b8ff3c] sm:mb-10 sm:text-base sm:tracking-[0.6em]">
                  2026
                </p>
              </FadeIn>
              <GigList gigs={past} />
            </section>
          )}

          <div className="h-6 sm:h-[10vh]" />

          <FadeIn>
            <section className="pb-8 sm:pb-20">
              <p className="mb-4 text-xs uppercase tracking-[0.22em] text-[#b8ff3c] sm:mb-10 sm:text-base sm:tracking-[0.6em]">
                About
              </p>
              {content.about.map((paragraph, i) => (
                <p key={i} className={`text-[0.68rem] leading-[1.55] text-white/80 sm:text-sm sm:leading-[2]${i > 0 ? " mt-3 sm:mt-4" : ""}`}>
                  <AboutParagraph text={paragraph} />
                </p>
              ))}
            </section>
          </FadeIn>

          <div className="h-8 sm:h-[10vh]" />

          <div className="pb-12 sm:pb-16" />
        </div>
      </div>
    </div>
  );
}
