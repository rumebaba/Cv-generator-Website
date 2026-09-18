export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function scrollToTop(behavior: ScrollBehavior = 'smooth'): void {
  if (typeof window === 'undefined') return;
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : behavior });
}

export function scrollToRef(
  ref: React.RefObject<HTMLElement | null>,
  behavior: ScrollBehavior = 'smooth'
): void {
  if (typeof window === 'undefined') return;
  const resolvedBehavior: ScrollBehavior = prefersReducedMotion() ? 'auto' : behavior;
  if (ref.current) {
    const top = ref.current.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: Math.max(top, 0), behavior: resolvedBehavior });
  } else {
    scrollToTop(resolvedBehavior);
  }
}
