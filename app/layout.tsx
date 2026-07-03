import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GrainOverlay } from "./components/atmosphere/GrainOverlay";
import { AuroraBackground } from "./components/atmosphere/AuroraBackground";
import { CloudLayer } from "./components/atmosphere/CloudLayer";
import { SmoothScroll } from "./components/SmoothScroll";
import { GsapProvider } from "./components/motion/GsapProvider";
import { Navbar } from "./components/chrome/Navbar";
import { Analytics } from "./components/Analytics";
import { SiteFooter } from "./components/chrome/SiteFooter";
import { PerfBenchmark } from "./components/PerfBenchmark";
import { PERF_GUESS_SCRIPT } from "@/lib/perfTier";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "You found a clue. · Otti",
  description:
    "Otti isn't lost. He's searching — for hidden places, stories, and people who love adventures. Something is coming 08.05.2026.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://tripotter.net"),
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
      <head>
        {/* Pre-paint device-capability guess (see lib/perfTier.ts) — sets
            data-perf="lite" on <html> before hydration for phones that can't
            sustain the full blur/parallax/smooth-scroll stack, so there's no
            flash of the heavy version before it downgrades. */}
        <script dangerouslySetInnerHTML={{ __html: PERF_GUESS_SCRIPT }} />
      </head>
      <body className="min-h-full bg-noir-950 text-ink">
        <PerfBenchmark />
        <Analytics />
        <AuroraBackground />
        <CloudLayer />
        <GrainOverlay />
        <SmoothScroll>
          <GsapProvider>
            <Navbar />
            <div className="relative z-10">{children}</div>
            <SiteFooter />
          </GsapProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
