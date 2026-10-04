"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Bell,
  Building,
  Calendar,
  CheckCircle2,
  Clock,
  Crown,
  FileText,
  Home,
  Lock,
  Mail,
  MapPin,
  Navigation,
  ShieldCheck,
  User,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Glyph pool                                                         */
/* ------------------------------------------------------------------ */

/**
 * A rotating trail of the same glyphs the portal already uses, drawn at
 * low opacity so they read as texture rather than UI.
 *
 * These are deliberately the same icons as the real nav and tiles: the
 * effect reinforces what the page is about instead of decorating it with
 * unrelated shapes. Lucide glyphs are stroked paths on a 24x24 grid, so
 * they stay crisp at any size and add no image weight.
 */
const GLYPHS: { Icon: LucideIcon; tint: string }[] = [
  { Icon: Home, tint: "text-emerald-500/45 dark:text-emerald-400/45" },
  { Icon: FileText, tint: "text-blue-500/40 dark:text-blue-400/40" },
  { Icon: Clock, tint: "text-slate-400/45" },
  { Icon: User, tint: "text-violet-500/40 dark:text-violet-400/40" },
  { Icon: Users, tint: "text-emerald-500/40 dark:text-emerald-400/40" },
  { Icon: Calendar, tint: "text-amber-500/40 dark:text-amber-400/40" },
  { Icon: Bell, tint: "text-amber-500/40 dark:text-amber-400/40" },
  { Icon: MapPin, tint: "text-emerald-500/45 dark:text-emerald-400/45" },
  { Icon: Navigation, tint: "text-cyan-500/40 dark:text-cyan-400/40" },
  { Icon: Building, tint: "text-slate-400/45" },
  { Icon: ShieldCheck, tint: "text-emerald-500/45 dark:text-emerald-400/45" },
  { Icon: Crown, tint: "text-amber-500/45 dark:text-amber-400/45" },
  { Icon: CheckCircle2, tint: "text-emerald-500/45 dark:text-emerald-400/45" },
  { Icon: Zap, tint: "text-amber-500/45 dark:text-amber-400/45" },
  { Icon: Mail, tint: "text-blue-500/40 dark:text-blue-400/40" },
  { Icon: Lock, tint: "text-slate-400/45" },
  { Icon: Activity, tint: "text-cyan-500/40 dark:text-cyan-400/40" },
  { Icon: AlertTriangle, tint: "text-amber-500/40 dark:text-amber-400/40" },
];

/** Interactive elements - the trail stays away from these. */
const CONTENT_SELECTOR =
  "a, button, input, textarea, select, label, img, [role='dialog']";

/** How long a single glyph lives before fading out (ms). */
const LIFETIME = 1400;
/** Max simultaneous glyphs, so it never becomes a wall of icons. */
const MAX_GLYPHS = 7;
/** Pointer travel (px) before a new glyph is emitted. */
const STEP = 90;
/** Glyph box, in px. Matches the clamp maths below. */
const BOX = 30;

type Bubble = {
  id: number;
  Icon: LucideIcon;
  tint: string;
  x: number;
  y: number;
  /** Slow drift so the trail does not look like a rigid grid. */
  spin: number;
};

let uid = 0;
/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AmbientGlyphTrail() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const last = useRef<{ x: number; y: number } | null>(null);
  const glyphIndex = useRef(0);
  const raf = useRef<number | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Expire bubbles on one shared interval instead of a timer per bubble.
  useEffect(() => {
    timer.current = setInterval(() => {
      setBubbles((prev) => (prev.length ? prev.slice(1) : prev));
    }, LIFETIME);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  useEffect(() => {
    // Respect reduced motion: no listeners, nothing pops up. Also skipped
    // on coarse pointers - this is a cursor effect, and on touch the
    // synthetic mousemove stream fires it repeatedly during scroll.
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(pointer: coarse)").matches
    )
      return;

    const emit = (x: number, y: number) => {
      const glyph = GLYPHS[glyphIndex.current % GLYPHS.length];
      glyphIndex.current += 1;

      uid += 1;
      setBubbles((prev) =>
        [
          ...prev,
          {
            id: uid,
            Icon: glyph.Icon,
            tint: glyph.tint,
            // Offset up-right of the cursor, clamped to stay on screen.
            x: Math.min(x + 14, window.innerWidth - BOX - 14),
            y: Math.max(8, Math.min(y - 10, window.innerHeight - BOX - 14)),
            // Small fixed angle so icons feel hand-scattered, not aligned.
            spin: Math.round(Math.random() * 24 - 12),
          },
        ].slice(-MAX_GLYPHS),
      );
    };

    function onMove(event: MouseEvent) {
      if (raf.current !== null) return;
      raf.current = requestAnimationFrame(() => {
        raf.current = null;
        const { clientX: x, clientY: y, target } = event;

        // Only on the page background, never over interactive content.
        const el = target as Element | null;
        if (el?.closest?.(CONTENT_SELECTOR)) return;

        const prev = last.current;
        // Emit on first move, then only once the pointer has travelled.
        if (prev && Math.hypot(x - prev.x, y - prev.y) < STEP) return;
        last.current = { x, y };
        emit(x, y);
      });
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    };
  }, []);

  // Clear the trail when the pointer leaves the window.
  const handleLeave = useCallback(() => {
    setBubbles([]);
    last.current = null;
  }, []);

  useEffect(() => {
    window.addEventListener("mouseleave", handleLeave);
    return () => window.removeEventListener("mouseleave", handleLeave);
  }, [handleLeave]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <AnimatePresence>
        {bubbles.map((bubble) => {
          const Icon = bubble.Icon;
          return (
            <motion.span
              key={bubble.id}
              initial={{ opacity: 0, scale: 0.6, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.75, y: -10 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              style={{ left: bubble.x, top: bubble.y, rotate: bubble.spin }}
              className={cn(
                // No backdrop-blur here: these animate continuously, and a
                // blurred layer that moves is re-blurred on every frame.
                "absolute flex items-center justify-center",
                bubble.tint,
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={1.75} />
            </motion.span>
          );
        })}
      </AnimatePresence>
    </div>
  );
}