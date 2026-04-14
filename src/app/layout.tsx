import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import "./globals.css";

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "CCIL",
  description: "Groove, tension, acid touches. Montreal-based DJ shaping sets around hard house, hardgroove, trance, bounce, and raw techno.",
  openGraph: {
    title: "CCIL",
    description: "Montreal-based DJ — hard house, hardgroove, trance, bounce, raw techno.",
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
