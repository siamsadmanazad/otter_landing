type LenisLike = { scrollTo: (target: string | HTMLElement, opts?: Record<string, unknown>) => void };

/**
 * scrollToHash — jumps to an in-page element via Lenis (if mounted), so it
 * doesn't fight Lenis's own scroll-position tracking the way a native
 * `<a href="#id">` anchor jump does (Lenis drives scroll on every frame; a
 * native jump changes window.scrollY behind its back, and Lenis then snaps
 * back to its own stale position on the next tick — this is why plain hash
 * anchors silently "don't work" on a Lenis-smooth-scrolled page).
 *
 * Uses `immediate: true` (an instant jump, not an animated tween) rather than
 * Lenis's default smooth animation: an in-flight tween is one more thing that
 * can be interrupted or desync from GSAP ScrollTrigger's pin recalculation
 * (this page pins a hero section) mid-scroll. An instant jump has nothing to
 * interrupt — reliability over a nicety here. Falls back to a plain instant
 * scroll if Lenis isn't mounted/enabled.
 */
export function scrollToHash(hash: string): boolean {
  const id = hash.replace(/^#/, "");
  const el = document.getElementById(id);
  if (!el) return false;

  const lenis = (window as unknown as { __lenis?: LenisLike }).__lenis;
  if (lenis?.scrollTo) {
    lenis.scrollTo(el, { offset: 0, immediate: true });
  } else {
    el.scrollIntoView({ behavior: "auto", block: "start" });
  }
  return true;
}
