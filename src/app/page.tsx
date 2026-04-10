"use client";

import FaultyTerminal from "@/components/FaultyTerminal";
import Flashlight from "@/components/Flashlight";
import Navigation from "@/components/Navigation";

const UPCOMING = [
  { date: "18.04", venue: "TBA" },
  { date: "08.05", venue: "TBA" },
  { date: "09.05", venue: "TBA" },
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
        <FaultyTerminal
          scale={1.5}
          gridMul={[2, 1]}
          digitSize={1.2}
          timeScale={0.5}
          scanlineIntensity={0.3}
          glitchAmount={0.8}
          flickerAmount={0.6}
          noiseAmp={0.8}
          curvature={0.1}
          tint="#2d04fb"
          mouseReact
          mouseStrength={0.3}
          pageLoadAnimation
          brightness={0.15}
          spotlightRadius={0}
          spotlightOpacity={0}
        />
      </div>

      <Flashlight radius={500} intensity={0.3} color="160,140,255" />

      <div className="relative z-30">
        <Navigation />

        {/* Hero — name bottom right */}
        <section className="h-screen flex items-end justify-end px-6 sm:px-16 pb-[10vh]">
          <div className="text-right">
            <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-normal tracking-[0.15em] leading-none text-white/90">
              ccil
            </h1>
            <p className="text-[9px] tracking-[0.3em] text-white/30 mt-3">
              Solamente bangers
            </p>
          </div>
        </section>

        {/* Content — centered, Linear-style */}
        <div className="max-w-xl mx-auto px-6">

          <div className="h-[20vh]" />

          {/* Upcoming */}
          <section className="pb-20">
            <p className="text-[8px] uppercase tracking-[0.6em] text-white/50 mb-6">
              Upcoming
            </p>
            <div className="space-y-4">
              {UPCOMING.map((gig, i) => (
                <div key={i} className="flex items-baseline justify-between">
                  <span className="text-sm text-white/90">
                    {gig.venue}
                  </span>
                  <span className="text-[9px] tracking-[0.3em] text-white/30">
                    {gig.date}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Past */}
          <section className="pb-20">
            <p className="text-[8px] uppercase tracking-[0.6em] text-white/30 mb-6">
              2026
            </p>
            <div className="space-y-4">
              {PAST.map((gig, i) => (
                <div key={i} className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-4">
                    <span className="text-sm text-white/60">
                      {gig.venue}
                    </span>
                    <span className="text-[9px] tracking-[0.3em] text-white/20">
                      {gig.location}
                    </span>
                  </div>
                  <span className="text-[9px] tracking-[0.3em] text-white/15">
                    {gig.date}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <div className="h-[10vh]" />

          {/* About */}
          <section className="pb-20">
            <p className="text-[8px] uppercase tracking-[0.6em] text-white/50 mb-6">
              About
            </p>
            <p className="text-xs leading-[2] text-white/50">
              Groove, tension, acid touches. Based in Montreal, shaping sets around hard and ghetto house, hardgroove, trance, bounce, and raw techno — building energy progressively while keeping space for surprise.
            </p>
            <p className="text-xs leading-[2] text-white/35 mt-4">
              Less interested in constant drops, more in movement and pacing. DJing as an ongoing research process: refining a personal language while staying sensitive to the room.
            </p>
          </section>

          <div className="h-[10vh]" />

          {/* Links */}
          <footer className="pb-16 flex items-baseline gap-8">
            <a href="https://soundcloud.com/ccil_mp3" target="_blank" rel="noopener noreferrer" className="text-[9px] tracking-[0.3em] text-white/30 hover:text-white/60 transition-colors duration-1000">
              Soundcloud
            </a>
            <a href="#" className="text-[9px] tracking-[0.3em] text-white/30 hover:text-white/60 transition-colors duration-1000">
              Instagram
            </a>
            <a href="mailto:ccil.mp3@gmail.com" className="text-[9px] tracking-[0.3em] text-white/30 hover:text-white/60 transition-colors duration-1000">
              Booking
            </a>
          </footer>

        </div>
      </div>
    </div>
  );
}
