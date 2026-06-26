"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Optional Cloudflare Turnstile (privacy-friendly CAPTCHA). Renders nothing unless
 * NEXT_PUBLIC_TURNSTILE_SITE_KEY is set, so the form stays fully functional in dev /
 * before keys exist. Token is reported up via onToken; cleared on error/expiry.
 */
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

export const turnstileEnabled = Boolean(SITE_KEY);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    turnstile?: any;
  }
}

export function TurnstileWidget({ onToken }: { onToken: (token: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const cb = useCallback(onToken, [onToken]);

  useEffect(() => {
    if (!SITE_KEY) return;
    let cancelled = false;

    const render = () => {
      if (cancelled || !window.turnstile || !containerRef.current || widgetId.current) return;
      widgetId.current = window.turnstile.render(containerRef.current, {
        sitekey: SITE_KEY,
        theme: "dark",
        callback: (t: string) => cb(t),
        "error-callback": () => cb(""),
        "expired-callback": () => cb(""),
      });
    };

    if (window.turnstile) {
      render();
    } else {
      const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
      if (existing) {
        existing.addEventListener("load", render);
      } else {
        const s = document.createElement("script");
        s.src = SCRIPT_SRC;
        s.async = true;
        s.defer = true;
        s.onload = render;
        document.head.appendChild(s);
      }
    }

    return () => {
      cancelled = true;
      if (widgetId.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetId.current);
        } catch {
          /* widget already gone */
        }
        widgetId.current = null;
      }
    };
  }, [cb]);

  if (!SITE_KEY) return null;
  return <div ref={containerRef} className="mt-4 flex justify-center" />;
}
