"use client";

import { useEffect, useRef } from "react";

interface FlashlightProps {
  radius?: number;
  intensity?: number;
  color?: string;
}

export default function Flashlight({
  radius = 350,
  intensity = 0.12,
  color = "255,255,255",
}: FlashlightProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Offset the light source to the right of cursor for directional feel
    const onMove = (e: MouseEvent) => {
      const x = e.clientX + 80;
      const y = e.clientY - 20;
      el.style.background = `radial-gradient(ellipse ${radius}px ${radius * 0.85}px at ${x}px ${y}px, rgba(${color},${intensity}), rgba(${color},${intensity * 0.5}) 35%, rgba(${color},${intensity * 0.15}) 60%, transparent 80%)`;
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [radius, intensity, color]);

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-20 pointer-events-none"
    />
  );
}
