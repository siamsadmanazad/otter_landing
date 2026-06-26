import Link from "next/link";

/** Shared reading layout for the Privacy / Terms pages. */
export function LegalShell({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <main className="relative z-10 mx-auto min-h-dvh max-w-2xl px-6 py-28">
      <Link
        href="/findotti"
        className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink-faint transition-colors hover:text-treasure"
      >
        ← TripOtter
      </Link>
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
      <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
        Last updated {updated}
      </p>
      <div className="legal-prose mt-10 space-y-6 text-sm leading-relaxed text-ink-soft [&_a]:text-treasure [&_h2]:mt-10 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-ink [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
        {children}
      </div>
    </main>
  );
}
