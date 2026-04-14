"use client";

import dynamic from "next/dynamic";
import Navigation from "@/components/Navigation";
import FadeIn from "@/components/FadeIn";
import Countdown from "@/components/Countdown";
import { Link as LinkIcon } from "@phosphor-icons/react/dist/ssr/Link";

const Dither = dynamic(() => import("@/components/Dither"), { ssr: false });

const NEXT_SHOW = new Date("2026-04-18T23:00:00-04:00");
const WAVE_COLOR: [number, number, number] = [0.3, 0.3, 0.4];

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
      <h1 className="font-normal tracking-[0.15em] leading-none text-white/90 text-[clamp(1.8rem,3vw,2.5rem)]">
        ccil
      </h1>
    </div>
  );
}

const UPCOMING = [
  { date: "18.04", venue: "Le Boudoir — All Night Long" },
];

const PAST = [
  { date: "01.04", venue: "Down2Techno", location: "Red Room" },
  { date: "13.03", venue: "Dance For Peace", location: "TLM" },
  { date: "05.03", venue: "Shift Radio", location: "Live" },
  { date: "28.02", venue: "Atmos Fest Launch", location: "b2b Meen Moreen" },
  { date: "05.02", venue: "All Night Long", location: "Le Salon Daomé" },
  { date: "16.01", venue: "Nightwalkers", location: "Ottawa" },
];

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 z-0">
        <Dither
          waveColor={WAVE_COLOR}
          enableMouseInteraction
        />
      </div>

      <div className="relative z-10">
        <Navigation />
        <Waveform />
        <FloatingName />

        <section className="h-screen relative flex items-center justify-center px-6 sm:px-16">
          <FadeIn delay={200}>
            <Countdown targetDate={NEXT_SHOW} label="Next set" />
          </FadeIn>
          <FadeIn delay={600} className="absolute bottom-[12vh] left-1/2 -translate-x-1/2">
            <a
              href="https://linktr.ee/ccil.mp3"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[clamp(0.7rem,2vw,1rem)] uppercase tracking-[0.3em] text-white/60 hover:text-white/90 transition-colors duration-1000"
            >
              <LinkIcon size="1em" weight="light" />
              Links
            </a>
          </FadeIn>
        </section>

        <div className="max-w-xl mx-auto px-6">
          <div className="h-[10vh]" />

          <section className="pb-20">
            <FadeIn>
              <p className="text-base uppercase tracking-[0.6em] text-white mb-10">
                Upcoming
              </p>
            </FadeIn>
            <div className="space-y-4">
              {UPCOMING.map((gig, i) => (
                <FadeIn key={`${gig.date}-${gig.venue}`} delay={i * 120}>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-sm text-white/50">{gig.venue}</span>
                    <span className="text-sm tracking-[0.3em] text-white/50 shrink-0">
                      {gig.date}
                    </span>
                  </div>
                </FadeIn>
              ))}
            </div>
          </section>

          <div className="h-[10vh]" />

          <section className="pb-20">
            <FadeIn>
              <p className="text-base uppercase tracking-[0.6em] text-white mb-10">
                2026
              </p>
            </FadeIn>
            <div className="space-y-4">
              {PAST.map((gig, i) => (
                <FadeIn key={`${gig.date}-${gig.venue}`} delay={i * 100}>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-sm text-white/50">
                      {gig.venue} — {gig.location}
                    </span>
                    <span className="text-sm tracking-[0.3em] text-white/50 shrink-0">
                      {gig.date}
                    </span>
                  </div>
                </FadeIn>
              ))}
            </div>
          </section>

          <div className="h-[10vh]" />

          <FadeIn>
            <section className="pb-20">
              <p className="text-base uppercase tracking-[0.6em] text-white mb-10">
                About
              </p>
              <p className="text-sm leading-[2] text-white/50">
                Groove, tension, acid touches. Based in Montreal, shaping sets
                around hard and ghetto house, hardgroove, trance, bounce, and raw
                techno — building energy progressively while keeping space for
                surprise.
              </p>
              <p className="text-sm leading-[2] text-white/50 mt-4">
                Less interested in constant drops, more in movement and pacing.
                DJing as an ongoing research process: refining a personal language
                while staying sensitive to the room.
              </p>
            </section>
          </FadeIn>

          <div className="h-[10vh]" />

          <div className="pb-16" />
        </div>
      </div>
    </div>
  );
}
