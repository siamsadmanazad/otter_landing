/**
 * Device performance tier. The site's cinematic look (large blur radii,
 * scroll-scrubbed parallax, JS smooth-scroll) is heavy on the GPU — fine on a
 * modern phone, but old/weak hardware (e.g. an A11-class iPhone) can choke on
 * it and feel broken rather than just slow. "lite" turns those specific
 * effects down/off; everything else renders identically.
 *
 * Two-stage detection so it's both instant and accurate:
 * 1. A synchronous pre-paint guess (hardwareConcurrency + iOS version parsed
 *    from the UA — old iPhone hardware is permanently capped at iOS 16, so
 *    "stuck on 16 or older" is a strong, honest proxy for old hardware).
 *    Runs as an inline <script> in <head> (PERF_GUESS_SCRIPT) before
 *    hydration, so there's no flash of the wrong tier.
 * 2. A short real frame-timing sample shortly after mount, which can
 *    downgrade further (catches weak Android devices the guess missed).
 *
 * Once lite, always lite for the session (sessionStorage) — never flips back
 * to full mid-visit, to avoid the effects popping in/out.
 */

export const PERF_ATTR = "data-perf";
export const LITE = "lite";
const STORAGE_KEY = "perfTier";

/** Inlined into <head> as a raw <script> in app/layout.tsx — keep dependency-free. */
export const PERF_GUESS_SCRIPT = `(function(){try{
var d=document.documentElement;
if(sessionStorage.getItem('${STORAGE_KEY}')==='${LITE}'){d.setAttribute('${PERF_ATTR}','${LITE}');return;}
var cores=navigator.hardwareConcurrency||8;
var m=navigator.userAgent.match(/iPhone OS (\\d+)_/);
var ios=m?parseInt(m[1],10):null;
if(cores<=4||(ios!==null&&ios<=16)){d.setAttribute('${PERF_ATTR}','${LITE}');sessionStorage.setItem('${STORAGE_KEY}','${LITE}');}
}catch(e){}})();`;

export function isLitePerf(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.getAttribute(PERF_ATTR) === LITE;
}

function markLite() {
  document.documentElement.setAttribute(PERF_ATTR, LITE);
  try {
    sessionStorage.setItem(STORAGE_KEY, LITE);
  } catch {
    // storage unavailable (private mode etc.) — attribute is still set for this page life
  }
}

/**
 * Samples ~24 real animation frames and downgrades to lite if the page can't
 * sustain them even near-idle — meaning whatever's already mounted (the
 * heavy background layers included) is genuinely taxing this device right
 * now. Call once, near the root, after mount.
 */
export function benchmarkAndMaybeDowngrade() {
  if (isLitePerf()) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const SAMPLE_FRAMES = 24;
  const JANK_THRESHOLD_MS = 22; // a healthy device idles well under this per frame
  const samples: number[] = [];
  let last = 0;
  let frame = 0;

  function tick(t: number) {
    samples.push(t - last);
    last = t;
    frame++;
    if (frame < SAMPLE_FRAMES) {
      requestAnimationFrame(tick);
      return;
    }
    const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
    if (avg > JANK_THRESHOLD_MS) markLite();
  }

  requestAnimationFrame((t) => {
    last = t;
    requestAnimationFrame(tick);
  });
}
