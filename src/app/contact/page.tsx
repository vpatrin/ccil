"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

import Navigation from "@/components/Navigation";

const Dither = dynamic(() => import("@/components/Dither"), { ssr: false });

const fieldClass = "w-full bg-transparent border-b border-white/[0.08] pb-3 text-xs text-white/70 placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors duration-1000";

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 z-0">
        <Dither
          waveColor={[0.3, 0.3, 0.4]}
          waveSpeed={0.03}
          waveFrequency={3}
          waveAmplitude={0.3}
          colorNum={4}
          pixelSize={2}
          enableMouseInteraction
          mouseRadius={1}
        />
      </div>

      <div className="relative z-10">
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
                    className={fieldClass}
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email"
                    className={fieldClass}
                  />
                  <textarea
                    required
                    rows={3}
                    placeholder="Message"
                    className={`${fieldClass} resize-none`}
                  />
                  <button
                    type="submit"
                    className="text-[9px] uppercase tracking-[0.4em] text-white/25 hover:text-white/50 transition-colors duration-1000 cursor-pointer"
                  >
                    Send
                  </button>
                </form>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
