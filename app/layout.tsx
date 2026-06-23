import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GrainOverlay } from "./components/atmosphere/GrainOverlay";
import { AuroraBackground } from "./components/atmosphere/AuroraBackground";
import { SmoothScroll } from "./components/SmoothScroll";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "You found a clue. · Otti",
  description:
    "Otti isn't lost. He's searching — for hidden places, stories, and people who love adventures. Something is coming 08.05.2026.",
  metadataBase: new URL("https://tripotter.com"),
  openGraph: {
    title: "You found a clue.",
    description: "Otti is searching. Become a Founding Explorer.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-noir-950 text-ink">
        <AuroraBackground />
        <GrainOverlay />
        <SmoothScroll>
          <div className="relative z-10">{children}</div>
        </SmoothScroll>
      </body>
    </html>
  );
}
