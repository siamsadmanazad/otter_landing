import Link from "next/link";

/** Minimal global footer — legal links + mark. Kept subtle so it never competes with the story. */
export function SiteFooter() {
  return (
    <footer className="relative z-10 px-6 py-10 text-center">
      {/* A soft signal hairline caps the story before the legal footer begins. */}
      <div
        aria-hidden
        className="absolute inset-x-10 top-0 h-px sm:inset-x-24"
        style={{ background: "linear-gradient(90deg, transparent, rgba(52,245,228,0.35), transparent)" }}
      />
      <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-[0.2em] text-ink-faint sm:text-sm">
        <Link href="/privacy" className="transition-colors hover:text-ink-soft">
          Privacy
        </Link>
        <Link href="/terms" className="transition-colors hover:text-ink-soft">
          Terms
        </Link>
        <a href="mailto:hello@tripotter.net" className="transition-colors hover:text-ink-soft">
          Contact
        </a>
        <a
          href="https://www.instagram.com/trip.otter"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-ink-soft"
        >
          Instagram
        </a>
        <a
          href="https://www.facebook.com/tripotter.net"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-ink-soft"
        >
          Facebook
        </a>
      </nav>
      <p className="mt-4 font-mono text-xs text-ink-faint/70">
        Built with ❤️ in Bangladesh
      </p>
      <p className="mt-1 font-mono text-xs text-ink-faint/70">
        © {new Date().getFullYear()} TripOtter · Launching 08.05.2026
      </p>
    </footer>
  );
}
