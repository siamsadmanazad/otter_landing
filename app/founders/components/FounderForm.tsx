"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { PageCurtain } from "../../components/motion/PageCurtain";
import { joinFounders, type JoinPayload } from "@/lib/founders";

type Errors = Partial<Record<keyof JoinPayload, string>>;

/**
 * FounderForm — the signup form (Act 2 centerpiece). Dark glass card, warm
 * focus-glow fields, accessible labels + inline validation. On submit: proxy →
 * (L2) signup Edge Function, then a curtain wipe into /welcome with the code.
 */
export function FounderForm() {
  const router = useRouter();
  const ref = useSearchParams().get("ref") ?? undefined;

  const [v, setV] = useState<JoinPayload>({
    fullName: "",
    email: "",
    university: "",
    facebook: "",
    instagram: "",
    favoriteDestination: "",
    whyExplore: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [curtain, setCurtain] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const set = (k: keyof JoinPayload) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setV((s) => ({ ...s, [k]: e.target.value }));

  function validate(): boolean {
    const next: Errors = {};
    if (v.fullName.trim().length < 2) next.fullName = "Tell us your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) next.email = "Enter a valid email";
    if (v.university.trim().length < 2) next.university = "Your university";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;
    setBusy(true);
    try {
      const result = await joinFounders({ ...v, ref });
      setCurtain(true);
      // Let the curtain sweep before routing.
      setTimeout(() => {
        const params = new URLSearchParams({
          code: result.referralCode,
          pos: String(result.position),
        });
        router.push(`/welcome?${params.toString()}`);
      }, 720);
    } catch (err) {
      setBusy(false);
      setServerError(err instanceof Error ? err.message : "Could not join");
    }
  }

  return (
    <>
      <PageCurtain show={curtain} />
      <motion.form
        onSubmit={onSubmit}
        noValidate
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-8%" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto w-full max-w-lg rounded-3xl border border-white/10 bg-noir-800/50 p-6 backdrop-blur-xl sm:p-8"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" required error={errors.fullName} className="sm:col-span-2">
            <input className={inputCls} value={v.fullName} onChange={set("fullName")} autoComplete="name" />
          </Field>
          <Field label="Email" required error={errors.email}>
            <input className={inputCls} type="email" value={v.email} onChange={set("email")} autoComplete="email" />
          </Field>
          <Field label="University" required error={errors.university}>
            <input className={inputCls} value={v.university} onChange={set("university")} />
          </Field>
          <Field label="Facebook profile">
            <input className={inputCls} value={v.facebook} onChange={set("facebook")} placeholder="optional" />
          </Field>
          <Field label="Instagram">
            <input className={inputCls} value={v.instagram} onChange={set("instagram")} placeholder="optional" />
          </Field>
          <Field label="Favorite destination" className="sm:col-span-2">
            <input className={inputCls} value={v.favoriteDestination} onChange={set("favoriteDestination")} placeholder="optional" />
          </Field>
          <Field label="Why do you love exploring?" className="sm:col-span-2">
            <textarea className={`${inputCls} min-h-24 resize-none`} value={v.whyExplore} onChange={set("whyExplore")} placeholder="optional" />
          </Field>
        </div>

        {serverError && (
          <p className="mt-4 text-center text-sm text-sunset">{serverError}</p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="bg-signal glow-signal group mt-6 flex w-full items-center justify-center gap-3 rounded-full px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-noir-950 transition-transform active:scale-95 disabled:opacity-60"
        >
          {busy ? "Joining…" : "Join the Founders"}
          <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
        </button>
        <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-ink-faint">
          only 1000 spots · never again
        </p>
      </motion.form>
    </>
  );
}

const inputCls =
  "w-full rounded-xl border border-white/10 bg-noir-950/50 px-4 py-3 text-sm text-ink outline-none transition-all placeholder:text-ink-faint/60 focus:border-treasure/60 focus:shadow-[0_0_0_3px_rgba(255,179,71,0.12)]";

function Field({
  label,
  children,
  required,
  error,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  error?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
        {label} {required && <span className="text-treasure">*</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-sunset">{error}</span>}
    </label>
  );
}
