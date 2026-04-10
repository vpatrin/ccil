"use client";

import { useState } from "react";
import FaultyTerminal from "@/components/FaultyTerminal";
import Flashlight from "@/components/Flashlight";
import Navigation from "@/components/Navigation";

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 z-0">
        <FaultyTerminal
          scale={1.5}
          gridMul={[2, 1]}
          digitSize={1.2}
          timeScale={0.3}
          scanlineIntensity={0.3}
          glitchAmount={0.5}
          flickerAmount={0.4}
          noiseAmp={0.6}
          curvature={0.08}
          tint="#2d04fb"
          mouseReact
          mouseStrength={0.2}
          pageLoadAnimation
          brightness={0.12}
          spotlightRadius={0}
          spotlightOpacity={0}
        />
      </div>

      <Flashlight radius={500} intensity={0.3} color="160,140,255" />

      <div className="relative z-30">
        <Navigation />

        <main className="min-h-screen flex items-center justify-center px-6">
          <div className="w-full max-w-sm">
            {sent ? (
              <p className="text-[9px] uppercase tracking-[0.5em] text-white/40">
                Received
              </p>
            ) : (
              <>
                <p className="text-[8px] uppercase tracking-[0.6em] text-white/50 mb-10">
                  Contact
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSent(true);
                  }}
                  className="space-y-8"
                >
                  <input
                    type="text"
                    required
                    placeholder="Name"
                    className="w-full bg-transparent border-b border-white/[0.08] pb-3 text-xs text-white/70 placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors duration-1000"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email"
                    className="w-full bg-transparent border-b border-white/[0.08] pb-3 text-xs text-white/70 placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors duration-1000"
                  />
                  <textarea
                    required
                    rows={3}
                    placeholder="Message"
                    className="w-full bg-transparent border-b border-white/[0.08] pb-3 text-xs text-white/70 placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors duration-1000 resize-none"
                  />
                  <button
                    type="submit"
                    className="text-[9px] uppercase tracking-[0.4em] text-white/25 hover:text-white/50 transition-colors duration-1000 cursor-pointer"
                  >
                    Send
                  </button>
                </form>
                <p className="mt-20 text-[9px] tracking-[0.3em] text-white/15">
                  ccil.mp3@gmail.com
                </p>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
