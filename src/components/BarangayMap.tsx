"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  HeartPulse,
  ShieldAlert,
  MapPin,
  X,
  Navigation,
} from "lucide-react";
import { cn, glass } from "@/lib/utils";
import { useCalmMotion } from "@/hooks/useCalmMotion";

type PlaceId = "hall" | "health" | "evac";

type Place = {
  id: PlaceId;
  label: string;
  detail: string;
  hours: string;
  icon: typeof Building2;
  /** Percentage coordinates inside the stylized map canvas. */
  x: number;
  y: number;
};

const PLACES: Place[] = [
  {
    id: "hall",
    label: "Barangay Hall",
    detail: "Main office - services, permits, and records",
    hours: "Mon-Fri, 8:00 AM - 5:00 PM",
    icon: Building2,
    x: 50,
    y: 46,
  },
  {
    id: "health",
    label: "Health Center",
    detail: "Community clinic and dental mission site",
    hours: "Mon-Sat, 7:00 AM - 4:00 PM",
    icon: HeartPulse,
    x: 25,
    y: 30,
  },
  {
    id: "evac",
    label: "Evacuation Center",
    detail: "Emergency shelter and relief staging area",
    hours: "Open during declared emergencies",
    icon: ShieldAlert,
    x: 73,
    y: 68,
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function BarangayMap() {
  const [activeId, setActiveId] = useState<PlaceId | null>(null);
  const calm = useCalmMotion();
  const active = PLACES.find((p) => p.id === activeId) ?? null;

  return (
    <section className={cn(glass, "flex flex-col p-6")}>
      <div className="flex items-start gap-2.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          <MapPin className="h-4 w-4" aria-hidden />
        </span>
        <div>
          <h2 className="text-sm font-semibold">Barangay Map</h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Tap a location for details
          </p>
        </div>
      </div>

      {/* Stylized map canvas */}
      <div
        className="relative mt-5 aspect-4/3 w-full overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-100 dark:border-slate-800 dark:bg-slate-950"
        role="group"
        aria-label="Barangay map"
      >
        <svg
          viewBox="0 0 100 75"
          preserveAspectRatio="none"
          aria-hidden
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <pattern
              id="map-grid"
              width="8"
              height="8"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 8 0 L 0 0 0 8"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.3"
                className="text-slate-300 dark:text-slate-800"
              />
            </pattern>
          </defs>
          <rect width="100" height="75" fill="url(#map-grid)" />

          {/* Roads */}
          <path
            d="M0 40 H100"
            strokeWidth="4"
            className="stroke-slate-300/70 dark:stroke-slate-800"
          />
          <path
            d="M50 0 V75"
            strokeWidth="3"
            className="stroke-slate-300/70 dark:stroke-slate-800"
          />
          <path
            d="M15 0 V40"
            strokeWidth="2"
            className="stroke-slate-300/50 dark:stroke-slate-800/70"
          />
          <path
            d="M78 40 V75"
            strokeWidth="2"
            className="stroke-slate-300/50 dark:stroke-slate-800/70"
          />

          {/* Green space and water */}
          <rect
            x="4"
            y="46"
            width="26"
            height="24"
            rx="3"
            className="fill-emerald-200/50 dark:fill-emerald-900/25"
          />
          <rect
            x="56"
            y="4"
            width="40"
            height="20"
            rx="3"
            className="fill-blue-200/50 dark:fill-blue-900/25"
          />
        </svg>
{/* Pins */}
        {PLACES.map((place) => {
          const isActive = activeId === place.id;
          const Icon = place.icon;

          return (
            <button
              key={place.id}
              type="button"
              onClick={() => setActiveId(isActive ? null : place.id)}
              aria-pressed={isActive}
              aria-label={place.label}
              style={{ left: `${place.x}%`, top: `${place.y}%` }}
              className="group absolute -translate-x-1/2 -translate-y-full p-1 focus:outline-none"
            >
              {/* Radar pulse on the active pin */}
              {isActive && !calm && (
                <motion.span
                  aria-hidden
                  animate={{ scale: [1, 2.4], opacity: [0.45, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                  className="absolute inset-0 -z-10 rounded-full bg-emerald-500/40 motion-reduce:hidden"
                />
              )}

              <motion.span
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
                className={cn(
                  "relative flex h-9 w-9 items-center justify-center rounded-full border-2 shadow-lg transition-colors",
                  isActive
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-white bg-white text-emerald-600 dark:border-slate-700 dark:bg-slate-800 dark:text-emerald-400",
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
              </motion.span>

              <span
                className={cn(
                  "absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-0.5 text-[10px] font-semibold transition-opacity",
                  isActive
                    ? "bg-slate-900 text-white opacity-100 dark:bg-slate-100 dark:text-slate-900"
                    : "bg-white/90 text-slate-700 opacity-0 group-hover:opacity-100 dark:bg-slate-800/90 dark:text-slate-200",
                )}
              >
                {place.label}
              </span>
            </button>
          );
        })}

        {/* Floating info panel */}
        <AnimatePresence>
          {active && (
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              className="absolute inset-x-3 bottom-3 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-xl backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/90"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{active.label}</p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {active.detail}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveId(null)}
                  aria-label="Close details"
                  className="shrink-0 rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                >
                  <X className="h-3.5 w-3.5" aria-hidden />
                </button>
              </div>
              <p className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                <Navigation className="h-3 w-3" aria-hidden />
                {active.hours}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <ul className="mt-4 space-y-1.5">
        {PLACES.map((place) => {
          const Icon = place.icon;
          const isActive = activeId === place.id;
          return (
            <li key={place.id}>
              <button
                type="button"
                onClick={() => setActiveId(isActive ? null : place.id)}
                aria-pressed={isActive}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors",
                  isActive
                    ? "bg-emerald-500/10"
                    : "hover:bg-slate-50/70 dark:hover:bg-slate-800/40",
                )}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Icon className="h-3.5 w-3.5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1 truncate text-xs font-medium">
                  {place.label}
                </span>
                <span
                  className={cn(
                    "h-2 w-2 shrink-0 rounded-full",
                    isActive
                      ? "bg-emerald-500"
                      : "bg-slate-300 dark:bg-slate-700",
                  )}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}