import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Shared glassmorphic surface.
 *
 * The blur radius is stepped down below the `sm` breakpoint on purpose.
 * `backdrop-filter` forces the compositor to re-sample and re-blur every
 * pixel behind the element on each frame, and the dashboard stacks a dozen
 * of these panels over each other plus the animated marquee, so on a phone
 * the full-radius blur alone was enough to saturate the GPU. Phone-sized
 * panels sit on near-opaque backgrounds anyway, so the larger radius bought
 * very little visually.
 */
export const glass =
  "rounded-3xl border border-slate-200/80 bg-white/80 shadow-xl shadow-slate-200/50 backdrop-blur-md sm:backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/80 dark:shadow-none";