import Link from "next/link";

/** Minimal global footer — legal links + mark. Kept subtle so it never competes with the story. */
export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-white/8 px-6 py-8 text-center">
      <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
        <Link href="/privacy" className="transition-colors hover:text-ink-soft">
          Privacy
        </Link>
        <Link href="/terms" className="transition-colors hover:text-ink-soft">
          Terms
        </Link>
        <a href="mailto:hello@tripotter.net" className="transition-colors hover:text-ink-soft">
          Contact
        </a>
      </nav>
      <p className="mt-4 font-mono text-[10px] text-ink-faint/70">
        Built with ❤️ in Bangladesh
      </p>
      <p className="mt-1 font-mono text-[10px] text-ink-faint/70">
        © {new Date().getFullYear()} TripOtter · Launching 08.05.2026
      </p>
    </footer>
  );
}
