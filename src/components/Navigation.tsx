"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 sm:px-16 mix-blend-difference">
      <Link
        href="/"
        className="text-[9px] tracking-[0.5em] uppercase text-white/30 hover:text-white/60 transition-colors duration-1000"
      >
        ccil
      </Link>
      <Link
        href={pathname === "/contact" ? "/" : "/contact"}
        className="text-[8px] uppercase tracking-[0.4em] text-white/[0.12] hover:text-white/30 transition-colors duration-1000"
      >
        {pathname === "/contact" ? "Back" : "Contact"}
      </Link>
    </header>
  );
}
