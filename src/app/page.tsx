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
    <div className="fixed bottom-6 right-6 sm:right-16 z-40 text-right mix-blend-difference">
      <h1 className="font-normal tracking-[0.15em] leading-none text-[clamp(1.8rem,3vw,2.5rem)]">
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
    <div className="space-y-4">
      {gigs.map((gig, i) => (
        <FadeIn key={`${gig.date}-${gig.event}`} delay={i * 100}>
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-sm text-white/80">{gigTitle(gig)}</span>
            <span className="text-sm tracking-[0.3em] text-[#b8ff3c] shrink-0">
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

        <section className="h-screen relative flex items-center justify-center px-6 sm:px-16">
          <FadeIn delay={200}>
            <Countdown
              targetDate={next ? next.time : null}
              label="Next set"
              thankYou={thankYou}
            />
          </FadeIn>
          <FadeIn delay={600} className="absolute bottom-[12vh] left-1/2 -translate-x-1/2">
            <a
              href="https://linktr.ee/ccil.mp3"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[clamp(0.7rem,2vw,1rem)] uppercase tracking-[0.3em] text-[#b8ff3c] hover:text-[#e8ff8a] transition-colors duration-1000"
            >
              <LinkIcon size="1em" weight="light" />
              Links
            </a>
          </FadeIn>
        </section>

        <div className="max-w-xl mx-auto px-6">
          <div className="h-[10vh]" />

          {upcoming.length > 0 && (
            <section className="pb-20">
              <FadeIn>
                <p className="text-base uppercase tracking-[0.6em] text-[#b8ff3c] mb-10">
                  Upcoming
                </p>
              </FadeIn>
              <GigList gigs={upcoming} />
            </section>
          )}

          <div className="h-[10vh]" />

          {past.length > 0 && (
            <section className="pb-20">
              <FadeIn>
                <p className="text-base uppercase tracking-[0.6em] text-[#b8ff3c] mb-10">
                  2026
                </p>
              </FadeIn>
              <GigList gigs={past} />
            </section>
          )}

          <div className="h-[10vh]" />

          <FadeIn>
            <section className="pb-20">
              <p className="text-base uppercase tracking-[0.6em] text-[#b8ff3c] mb-10">
                About
              </p>
              {content.about.map((paragraph, i) => (
                <p key={i} className={`text-sm leading-[2] text-white/80${i > 0 ? " mt-4" : ""}`}>
                  <AboutParagraph text={paragraph} />
                </p>
              ))}
            </section>
          </FadeIn>

          <div className="h-[10vh]" />

          <div className="pb-16" />
        </div>
      </div>
    </div>
  );
}
