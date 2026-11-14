import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import "./globals.css";

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "ccil",
  description: "Based in Montreal, ccil shapes her sets around groove, tension, and acid touches — a sound she calls “deep groove.”",
  openGraph: {
    title: "ccil",
    description: "Montreal-based DJ — deep groove, raw & hypnotic techno, hardgroove, ghetto house & trance.",
    type: "website",
    url: "https://ccil.club",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-space-mono)] overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
