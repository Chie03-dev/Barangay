"use client";

import { cn } from "@/lib/utils";

/**
 * Base shimmer block.
 * The base tint is a translucent neutral so it works over any surface, and
 * the highlight is theme-aware (brighter in dark mode, softer in light mode)
 * so the animation never looks washed out or too harsh.
 */
export function Skeleton({
  className,
  rounded = "rounded-xl",
  style,
}: {
  className?: string;
  rounded?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      aria-hidden
      style={style}
      className={cn(
        "relative overflow-hidden bg-slate-200/70 dark:bg-slate-800/70",
        rounded,
        className,
      )}
    >
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent motion-safe:animate-[shimmer_1.8s_infinite] dark:via-white/15" />
    </div>
  );
}

/** Circular skeleton (avatars, icon badges). */
export function SkeletonCircle({
  className,
  rounded,
}: {
  className?: string;
  /** Override the default circle, e.g. to mirror a rounded icon badge. */
  rounded?: string;
}) {
  return (
    <Skeleton
      rounded={rounded ?? "rounded-full"}
      className={cn("h-10 w-10 shrink-0", className)}
    />
  );
}

/** Multi-line text skeleton. */
export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-3", i === lines - 1 ? "w-2/3" : "w-full")}
        />
      ))}
    </div>
  );
}

/** Mirrors the shared glass card token so skeletons sit on the same surface. */
export function SkeletonCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl",
        "dark:border-slate-800/50 dark:bg-slate-900/80 dark:shadow-none",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Section heading placeholder used at the top of each tile. */
export function SkeletonHeading() {
  return (
    <div className="flex items-start gap-2.5">
      <SkeletonCircle className="h-9 w-9" />
      <div className="flex-1 space-y-2 pt-1">
        <Skeleton className="h-3.5 w-28" />
        <Skeleton className="h-2.5 w-40" />
      </div>
    </div>
  );
}