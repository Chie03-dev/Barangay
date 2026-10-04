import { useEffect, useState } from "react";

/**
 * True when decorative, endlessly-looping motion should be suppressed.
 *
 * Covers two cases that both make an already-expensive frame much worse:
 *
 * - `prefers-reduced-motion` - the resident has asked the OS to stop
 *   non-essential animation.
 * - `pointer: coarse` - a touch device. Phones re-rasterise the whole
 *   viewport whenever anything above them changes, so a handful of
 *   concurrent loops is enough to hold the frame rate well under 60fps.
 *
 * Returns `false` during SSR and the first render so markup matches on
 * both sides, then settles in an effect. Animations are opt-in via the
 * returned flag rather than removed from the tree, so layout never shifts.
 */
export function useCalmMotion() {
  const [calm, setCalm] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");

    const sync = () => setCalm(reduced.matches || coarse.matches);

    sync();
    reduced.addEventListener("change", sync);
    coarse.addEventListener("change", sync);
    return () => {
      reduced.removeEventListener("change", sync);
      coarse.removeEventListener("change", sync);
    };
  }, []);

  return calm;
}