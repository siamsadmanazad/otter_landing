"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { PageCurtain } from "../../components/motion/PageCurtain";
import { joinFounders, readUtm, type JoinPayload } from "@/lib/founders";
import { trackLead } from "@/lib/analytics";
import { TurnstileWidget, turnstileEnabled } from "./TurnstileWidget";

type Errors = Partial<Record<keyof JoinPayload, string>>;

/**
 * FounderForm — the signup form (Act 2 centerpiece). Dark glass card, warm
 * focus-glow fields, accessible labels + inline validation. On submit: proxy →
 * (L2) signup Edge Function, then a curtain wipe into /welcome with the code.
 */
function readRefCookie(): string | undefined {
  if (typeof document === "undefined") return undefined;
  const m = document.cookie.match(/(?:^|;\s*)otti_ref=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : undefined;
}

export function FounderForm() {
  const router = useRouter();
  const sp = useSearchParams();
  // Prefer the URL ?ref (fresh click); fall back to the cookie (returning visitor).
  const ref = sp.get("ref") ?? readRefCookie();
  // Campaign attribution — captured silently from the landing URL.
  const utm = useMemo(() => readUtm(sp), [sp]);

  const [v, setV] = useState<JoinPayload>({
    fullName: "",
    email: "",
    university: "",
    facebook: "",
    instagram: "",
    favoriteDestination: "",
    whyExplore: "",
  });
  const [consent, setConsent] = useState(false);
  const [hp, setHp] = useState(""); // honeypot — real users never touch it
  const [tsToken, setTsToken] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [curtain, setCurtain] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const set = (k: keyof JoinPayload) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setV((s) => ({ ...s, [k]: e.target.value }));

  const onTsToken = useCallback((t: string) => setTsToken(t), []);

  function validate(): boolean {
    const next: Errors = {};
    if (v.fullName.trim().length < 2) next.fullName = "Tell us your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) next.email = "Enter a valid email";
    if (v.university.trim().length < 2) next.university = "Your university";
    if (!consent) next.consent = "Please agree to hear from us";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;
    if (turnstileEnabled && !tsToken) {
      setServerError("Please complete the human check.");
      return;
    }
    setBusy(true);
    try {
      const result = await joinFounders({ ...v, ref, consent, utm, hp, turnstileToken: tsToken });
      trackLead();
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
        id="founder-form"
        onSubmit={onSubmit}
        noValidate
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-8%" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto w-full max-w-xl rounded-3xl border border-white/10 bg-noir-800/50 p-7 backdrop-blur-xl sm:p-10"
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

        {/* Honeypot: off-screen, not focusable, ignored by humans. Bots that fill it are dropped. */}
        <div aria-hidden className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
          <label>
            Website
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={hp}
              onChange={(e) => setHp(e.target.value)}
            />
          </label>
        </div>

        {/* Marketing consent — required before submit, stored with a timestamp. */}
        <label className="mt-5 flex cursor-pointer items-start gap-3 text-left">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-treasure"
          />
          <span className="text-sm leading-relaxed text-ink-faint">
            Yes — email me launch news, my founder spot, and early access. No spam; unsubscribe anytime.
          </span>
        </label>
        {errors.consent && <p className="mt-1 text-left text-sm text-sunset">{errors.consent}</p>}

        {turnstileEnabled && <TurnstileWidget onToken={onTsToken} />}

        {serverError && (
          <p className="mt-4 text-center text-base text-sunset">{serverError}</p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="bg-signal glow-signal group mt-6 flex w-full items-center justify-center gap-3 rounded-full px-9 py-5 text-base font-bold uppercase tracking-[0.18em] text-noir-950 transition-transform active:scale-95 disabled:opacity-60"
        >
          {busy ? "Joining…" : "Join the Founders"}
          <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
        </button>
        <p className="mt-4 text-center font-mono text-xs uppercase tracking-[0.3em] text-ink-faint">
          free to join · takes less than 30 seconds
        </p>
        <p className="mt-1.5 text-center font-mono text-xs uppercase tracking-[0.3em] text-ink-faint">
          only 1000 spots · never again
        </p>
      </motion.form>
    </>
  );
}

const inputCls =
  "w-full rounded-xl border border-white/10 bg-noir-950/50 px-5 py-3.5 text-base text-ink outline-none transition-all placeholder:text-ink-faint/60 focus:border-treasure/60 focus:shadow-[0_0_0_3px_rgba(255,179,71,0.12)] sm:py-4";

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
      <span className="mb-1.5 block font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
        {label} {required && <span className="text-treasure">*</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-sm text-sunset">{error}</span>}
    </label>
  );
}
