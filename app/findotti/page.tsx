/**
 * /findotti — Act 1: the clue. (L0 starter — full cinematic hero lands in L1.)
 * Mystery only: no rankings, no features, no app name.
 */
export default function FindOttiPage() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="mb-6 font-mono text-xs uppercase tracking-[0.4em] text-signal-2/80">
        // signal detected
      </p>

      <h1 className="text-balance text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl">
        YOU FOUND
        <br />
        <span className="text-signal">A CLUE.</span>
      </h1>

      <p className="mt-8 max-w-md font-mono text-sm leading-relaxed text-ink-soft">
        Otti isn&apos;t lost. He&apos;s searching — for hidden places, stories,
        and people who love adventures.
      </p>

      <p className="mt-10 font-mono text-xs uppercase tracking-[0.3em] text-ink-faint">
        something is coming · 08.05.2026
      </p>
    </main>
  );
}
