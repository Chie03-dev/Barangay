"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Realistic snippets - Next.js server actions, wrangler config,      */
/*  and TypeScript type definitions.                                   */
/* ------------------------------------------------------------------ */

const SNIPPETS: string[][] = [
  [
    '"use server"',
    "",
    "export async function submitRequest(",
    "  input: RequestInput,",
    "): Promise<{ code: string }> {",
    "  const res = await db.blotter.create({",
    "    ...input,",
    '    status: "under_review",',
    "  });",
    '  revalidatePath("/track");',
    "  return { code: res.ref };",
    "}",
  ],
  [
    'name = "barangay-portal"',
    'main = ".open-next/worker.js"',
    'compatibility_date = "2026-10-02"',
    'compatibility_flags = [ "nodejs_compat" ]',
    "",
    "[assets]",
    'directory = ".open-next/assets"',
    'binding = "ASSETS"',
    "",
    "[observability]",
    "enabled = true",
  ],
  [
    "type Stage =",
    '  | "received"',
    '  | "review"',
    '  | "approved"',
    '  | "pickup";',
    "",
    "interface TrackEvent<T> {",
    "  readonly id: string;",
    "  stage: Stage;",
    "  payload: T;",
    "}",
  ],
  [
    "const config = {",
    "  reactStrictMode: true,",
    "} satisfies NextConfig;",
    "",
    "export default defineCloudflareConfig({",
    "  cache: {",
    "    incremental: {",
    '      tag: "brgy",',
    "    },",
    "  },",
    "});",
  ],
];

/** Interactive elements - the stream stays away from these. */
const CONTENT_SELECTOR =
  "a, button, input, textarea, select, label, img, [role='dialog']";

/** How long a single line lives before fading out (ms). */
const LIFETIME = 1400;
/** Max simultaneous lines, so it never becomes a wall of text. */
const MAX_LINES = 7;
/** Pointer travel (px) before a new line is emitted. */
const STEP = 90;

type Bubble = {
  id: number;
  text: string;
  x: number;
  y: number;
};

let uid = 0;

/** Rough syntax tinting so lines read as code, not random words. */
function tone(text: string) {
  if (text.startsWith("//") || text.startsWith("/*")) {
    return "text-slate-400/25";
  }
  if (text.includes("await") || text.startsWith("export")) {
    return "text-cyan-500/30 dark:text-cyan-400/30";
  }
  if (text.includes("| ") || text.includes("interface")) {
    return "text-blue-500/25 dark:text-blue-400/25";
  }
  return "text-emerald-500/30 dark:text-emerald-400/30";
}
/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AmbientCodeStream() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const last = useRef<{ x: number; y: number } | null>(null);
  const snippetIndex = useRef(0);
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
      const snippet = SNIPPETS[snippetIndex.current % SNIPPETS.length];
      snippetIndex.current += 1;
      const line = snippet[Math.floor(Math.random() * snippet.length)];
      // Skip blanks - they render as an invisible gap.
      if (!line.trim()) return;

      uid += 1;
      setBubbles((prev) =>
        [
          ...prev,
          {
            id: uid,
            text: line,
            // Offset up-right of the cursor, clamped to stay on screen.
            x: Math.min(x + 14, window.innerWidth - 280),
            y: Math.max(8, Math.min(y - 10, window.innerHeight - 40)),
          },
        ].slice(-MAX_LINES),
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
        {bubbles.map((bubble) => (
          <motion.span
            key={bubble.id}
            initial={{ opacity: 0, scale: 0.85, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            style={{ left: bubble.x, top: bubble.y }}
            className={cn(
              "absolute whitespace-pre rounded-md px-2 py-0.5 font-mono text-[10px] leading-relaxed backdrop-blur-[2px]",
              tone(bubble.text),
            )}
          >
            {bubble.text}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}