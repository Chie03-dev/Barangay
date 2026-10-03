"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  type MotionValue,
} from "framer-motion";
import {
  Sparkles,
  FileText,
  ShieldAlert,
  Search,
  User,
  Bell,
  ArrowRight,
  PhoneCall,
  Clock,
  Calendar,
  TrendingUp,
  CheckCircle2,
  MapPin,
  AlertCircle,
  QrCode,
  ChevronRight,
  Command,
  Zap,
  Activity,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Skeleton,
  SkeletonCard,
  SkeletonCircle,
  SkeletonHeading,
} from "@/components/Skeleton";
import { useAsyncData } from "@/hooks/useAsyncData";
import BarangayMap from "@/components/BarangayMap";
import CommunityCalendar from "@/components/CommunityCalendar";

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

const RESIDENT = { name: "Marben", address: "Purok 3, Main Avenue" };

const QUICK_ACTIONS: {
  label: string;
  desc: string;
  href: string;
  icon: LucideIcon;
  glow: "emerald" | "amber" | "blue" | "violet";
}[] = [
  {
    label: "Document Request",
    desc: "Certificates & permits",
    href: "/services",
    icon: FileText,
    glow: "emerald",
  },
  {
    label: "Incident / Blotter Report",
    desc: "File an official report",
    href: "/reports",
    icon: ShieldAlert,
    glow: "amber",
  },
  {
    label: "Track Status",
    desc: "Follow your requests",
    href: "/track",
    icon: Search,
    glow: "blue",
  },
  {
    label: "Digital ID Pass",
    desc: "Your resident QR code",
    href: "/profile",
    icon: QrCode,
    glow: "violet",
  },
];

const STATS: {
  value: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  label: string;
  icon: LucideIcon;
  glow: "emerald" | "blue" | "amber";
}[] = [
  {
    value: 1248,
    label: "Documents Processed",
    icon: TrendingUp,
    glow: "emerald",
  },
  {
    value: 99.4,
    decimals: 1,
    suffix: "%",
    label: "Approval Rate",
    icon: CheckCircle2,
    glow: "blue",
  },
  {
    value: 24,
    prefix: "< ",
    label: "Avg Resolution (hrs)",
    icon: Clock,
    glow: "amber",
  },
];

const ANNOUNCEMENTS = [
  {
    text: "Free Community Health Check & Dental Mission on Oct 10",
    place: "Barangay Hall",
  },
  {
    text: "Purok 3 Water Main Maintenance Scheduled for Oct 5",
    place: "Purok 3",
  },
  {
    text: "Barangay Youth Sports League Registration Open",
    place: "Court A",
  },
];

const ACTIVE_REQUEST = {
  code: "BRGY-2026-8942",
  document: "Barangay Clearance",
  status: "Ready for Pick-up",
  window: "Window 2",
  stage: 4,
  total: 4,
};

/* ------------------------------------------------------------------ */
/*  Styling helpers                                                    */
/* ------------------------------------------------------------------ */

const glass =
  "rounded-3xl border border-slate-200/80 bg-white/80 shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/80 dark:shadow-none";

const GLOW: Record<string, string> = {
  emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
};

const RING: Record<string, string> = {
  emerald: "shadow-emerald-500/20",
  amber: "shadow-amber-500/20",
  blue: "shadow-blue-500/20",
  violet: "shadow-violet-500/20",
};
/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function DashboardPage() {
  const [today, setToday] = useState("");

  // Aggregated dashboard feed - replace the loader body with a real fetch.
  const { isLoading } = useAsyncData(() => STATS, { delay: 600 });

  // Rendered client-side only, so the server and client markup always match.
  useEffect(() => {
    setToday(
      new Date().toLocaleDateString("en-PH", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    );
  }, []);

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 pb-32">
      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <>
          <HeroBanner today={today} />

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
        {/* Tile 1 - Quick Action Hub */}
        <section className={cn(glass, "p-6 md:col-span-2")}>
          <TileHeading
            icon={Zap}
            title="Quick Action Hub"
            hint="Jump straight into a service"
          />

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {QUICK_ACTIONS.map((action) => (
              <TiltCard key={action.href} {...action} />
            ))}
          </div>
        </section>

        {/* Tile 2 - Live LGU impact stats */}
        <section className={cn(glass, "flex flex-col p-6")}>
          <TileHeading
            icon={Activity}
            title="LGU Impact"
            hint="This fiscal year"
          />

          <div className="mt-5 flex flex-1 flex-col justify-around gap-5">
            {STATS.map((stat, index) => (
              <StatRow key={stat.label} stat={stat} delay={index * 0.12} />
            ))}
          </div>
        </section>

        {/* Tile 3 - Announcements marquee */}
        <section className={cn(glass, "flex flex-col overflow-hidden p-6")}>
          <div className="flex items-start justify-between gap-3">
            <TileHeading
              icon={Bell}
              title="Announcements"
              hint="Official barangay updates"
            />
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-1 text-[11px] font-bold text-red-600 dark:text-red-400">
              <motion.span
                animate={{ opacity: [1, 0.25, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="h-1.5 w-1.5 rounded-full bg-red-500"
              />
              LIVE
            </span>
          </div>

          <Marquee />
        </section>

        {/* Tile 4 - Active request quick pass */}
        <section className={cn(glass, "p-6")}>
          <TileHeading
            icon={FileText}
            title="Active Request"
            hint="Most recent submission"
          />

          <div className="mt-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {ACTIVE_REQUEST.code}
                </p>
                <p className="mt-1 truncate font-semibold">
                  {ACTIVE_REQUEST.document}
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                </motion.span>
                {ACTIVE_REQUEST.status}
              </span>
            </div>

            {/* Progress bar */}
            <div className="mt-6">
              <div className="relative h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{
                    delay: 0.3,
                    duration: 1.1,
                    ease: "easeOut",
                  }}
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                />
                <motion.div
                  animate={{ opacity: [0, 0.7, 0] }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{ left: "100%" }}
                  className="absolute inset-y-0 w-8 -translate-x-full rounded-full bg-white/60"
                />
              </div>
              <div className="mt-2 flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Stage {ACTIVE_REQUEST.stage} of {ACTIVE_REQUEST.total}</span>
                <span>{ACTIVE_REQUEST.window}</span>
              </div>
            </div>

            <Link href="/track" className="mt-5 inline-block">
              <motion.span
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-colors hover:bg-emerald-500"
              >
                Track Full Status
                <ArrowRight className="h-4 w-4" aria-hidden />
              </motion.span>
            </Link>
          </div>
        </section>

        {/* Tile 5 - Hotline dispatcher */}
        <HotlineTile />

        {/* Tile 6 - Barangay map (spans 2 columns on desktop) */}
        <div className="md:col-span-2">
          <BarangayMap />
        </div>

        {/* Tile 7 - Community calendar */}
        <CommunityCalendar />
      </div>
        </>
      )}
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  Loading skeleton                                                    */
/* ------------------------------------------------------------------ */

function DashboardSkeleton() {
  return (
    <div role="status" aria-busy="true" aria-label="Loading dashboard">
      {/* Hero */}
      <SkeletonCard className="relative overflow-hidden p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1 space-y-4">
            <Skeleton className="h-7 w-40" rounded="rounded-full" />
            <Skeleton className="h-10 w-80" rounded="rounded-lg" />
            <div className="flex gap-5">
              <Skeleton className="h-4 w-48" rounded="rounded-md" />
              <Skeleton className="h-4 w-40" rounded="rounded-md" />
            </div>
          </div>
          <Skeleton className="h-16 w-full shrink-0 lg:w-80" rounded="rounded-2xl" />
        </div>
      </SkeletonCard>

      {/* Bento grid - mirrors the real 3-column layout */}
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
        {/* Quick actions (2 cols) */}
        <SkeletonCard className="md:col-span-2">
          <SkeletonHeading />
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-2xl border border-slate-200/60 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40"
              >
                <Skeleton className="h-11 w-11 shrink-0" rounded="rounded-xl" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-4 w-36" rounded="rounded-md" />
                  <Skeleton className="h-3 w-28" rounded="rounded-md" />
                </div>
                <Skeleton className="h-4 w-4 shrink-0" rounded="rounded-md" />
              </div>
            ))}
          </div>
        </SkeletonCard>

        {/* Stats */}
        <SkeletonCard>
          <SkeletonHeading />
          <div className="mt-5 space-y-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-11 w-11 shrink-0" rounded="rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-24" rounded="rounded-md" />
                  <Skeleton className="h-3 w-32" rounded="rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </SkeletonCard>

        {/* Announcements */}
        <SkeletonCard>
          <div className="flex items-start justify-between gap-3">
            <SkeletonHeading />
            <Skeleton className="h-6 w-14 shrink-0" rounded="rounded-full" />
          </div>
          <div className="mt-5 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-2xl border border-slate-200/60 p-4 dark:border-slate-800/60"
              >
                <Skeleton className="h-8 w-8 shrink-0" rounded="rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-full" rounded="rounded-md" />
                  <Skeleton className="h-3 w-20" rounded="rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </SkeletonCard>

        {/* Active request */}
        <SkeletonCard>
          <SkeletonHeading />
          <div className="mt-5 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <Skeleton className="h-3 w-32" rounded="rounded-md" />
                <Skeleton className="h-4 w-48" rounded="rounded-md" />
              </div>
              <Skeleton className="h-7 w-28 shrink-0" rounded="rounded-full" />
            </div>
            <Skeleton className="h-2 w-full" rounded="rounded-full" />
            <div className="flex justify-between">
              <Skeleton className="h-3 w-20" rounded="rounded-md" />
              <Skeleton className="h-3 w-16" rounded="rounded-md" />
            </div>
            <Skeleton className="h-11 w-40" rounded="rounded-xl" />
          </div>
        </SkeletonCard>

        {/* Hotline */}
        <SkeletonCard>
          <div className="flex items-center gap-2.5">
            <SkeletonCircle className="h-9 w-9" />
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-32" rounded="rounded-md" />
              <Skeleton className="h-3 w-24" rounded="rounded-md" />
            </div>
          </div>
          <Skeleton className="mt-4 h-4 w-full" rounded="rounded-md" />
          <div className="mt-5 space-y-2.5">
            {[0, 1].map((i) => (
              <Skeleton key={i} className="h-16 w-full" rounded="rounded-xl" />
            ))}
          </div>
          <Skeleton className="mt-5 h-11 w-full" rounded="rounded-xl" />
        </SkeletonCard>

        {/* Map (2 columns) */}
        <div className="md:col-span-2">
          <SkeletonCard>
            <SkeletonHeading />
            <Skeleton className="mt-5 aspect-4/3 w-full" rounded="rounded-2xl" />
            <div className="mt-4 space-y-1.5">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-11 w-full" rounded="rounded-xl" />
              ))}
            </div>
          </SkeletonCard>
        </div>

        {/* Calendar */}
        <SkeletonCard>
          <div className="flex items-start justify-between gap-3">
            <SkeletonHeading />
            <div className="flex items-center gap-1">
              <Skeleton className="h-7 w-7" rounded="rounded-lg" />
              <Skeleton className="h-3 w-24" rounded="rounded-md" />
              <Skeleton className="h-7 w-7" rounded="rounded-lg" />
            </div>
          </div>
          <div className="mt-5 grid grid-cols-7 gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-2.5" rounded="rounded-md" />
            ))}
          </div>
          <div className="mt-2 grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, i) => (
              <Skeleton
                key={i}
                className="aspect-square"
                rounded="rounded-xl"
              />
            ))}
          </div>
          <Skeleton className="mt-4 h-3 w-40" rounded="rounded-md" />
        </SkeletonCard>
      </div>
    </div>
  );
}
/* ------------------------------------------------------------------ */
/*  Hero banner with mouse spotlight                                   */
/* ------------------------------------------------------------------ */

function HeroBanner({ today }: { today: string }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set(event.clientX - rect.left);
    mouseY.set(event.clientY - rect.top);
  }

  const background = useTransform(
    [mouseX, mouseY],
    ([x, y]) =>
      `radial-gradient(320px circle at ${x}px ${y}px, rgba(16,185,129,0.16), transparent 70%)`,
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 24 }}
      onMouseMove={handleMove}
      className={cn(glass, "relative overflow-hidden p-8")}
    >
      {/* Spotlight layer */}
      <motion.div
        aria-hidden
        style={{ background }}
        className="pointer-events-none absolute inset-0"
      />
      {/* Static ambience */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl"
      />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <motion.span
              animate={{ scale: [1, 1.2, 1], rotate: [0, 12, 0] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
            </motion.span>
            Resident Portal
          </span>

          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Mabuhay, {RESIDENT.name}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" aria-hidden />
              {/* Empty on the server render, filled after mount. */}
              <span suppressHydrationWarning>{today || " "}</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4" aria-hidden />
              {RESIDENT.address}
            </span>
          </div>
        </div>

        {/* Cmd+K search trigger */}
        <button
          type="button"
          className="group relative w-full overflow-hidden rounded-2xl border border-slate-200/70 bg-white/70 px-5 py-4 text-left shadow-sm transition-colors hover:border-emerald-400 dark:border-slate-800 dark:bg-slate-900/60 lg:w-80"
        >
          {/* Shimmer sweep */}
          <motion.span
            aria-hidden
            animate={{ x: ["-120%", "220%"] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute inset-0 -z-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent"
          />
          <span className="relative flex items-center gap-3">
            <Search className="h-4 w-4 text-slate-400" aria-hidden />
            <span className="flex-1 text-sm text-slate-400">
              Search services, requests...
            </span>
            <kbd className="inline-flex items-center gap-1 rounded-lg border border-slate-200/70 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <Command className="h-3 w-3" aria-hidden />
              K
            </kbd>
          </span>
        </button>
      </div>
    </motion.section>
  );
}
/* ------------------------------------------------------------------ */
/*  Tile heading                                                       */
/* ------------------------------------------------------------------ */

function TileHeading({
  icon: Icon,
  title,
  hint,
}: {
  icon: LucideIcon;
  title: string;
  hint?: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <div>
        <h2 className="text-sm font-semibold">{title}</h2>
        {hint && (
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  3D tilt card                                                       */
/* ------------------------------------------------------------------ */

function TiltCard({
  label,
  desc,
  href,
  icon: Icon,
  glow,
}: {
  label: string;
  desc: string;
  href: string;
  icon: LucideIcon;
  glow: "emerald" | "amber" | "blue" | "violet";
}) {
  const rotateX = useSpring(useMotionValue(0), { stiffness: 300, damping: 20 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 300, damping: 20 });

  function handleMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(-y * 12);
    rotateY.set(x * 12);
  }

  function handleLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
    >
      <Link href={href} className="group block h-full">
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className={cn(
            "flex h-full items-center gap-4 rounded-2xl border border-slate-200/60 bg-white/60 p-4 transition-shadow duration-300 group-hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/50",
            RING[glow],
          )}
        >
          <span
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
              GLOW[glow],
            )}
          >
            <Icon className="h-5 w-5" aria-hidden />
          </span>

          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold">{label}</span>
            <span className="mt-0.5 block truncate text-xs text-slate-500 dark:text-slate-400">
              {desc}
            </span>
          </span>

          <ChevronRight
            className="h-4 w-4 shrink-0 text-slate-400 transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden
          />
        </motion.div>
      </Link>
    </motion.div>
  );
}
/* ------------------------------------------------------------------ */
/*  Number ticker                                                      */
/* ------------------------------------------------------------------ */

function NumberTicker({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const [display, setDisplay] = useState(prefix + (0).toFixed(decimals) + suffix);

  useEffect(() => {
    const unsubscribe = motionValue.on("change", (latest) => {
      setDisplay(prefix + latest.toFixed(decimals) + suffix);
    });
    const controls = animateValue(motionValue, value, 1.4);
    return () => {
      unsubscribe();
      controls.stop();
    };
    // Intentionally runs once on mount for the intro roll.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, decimals]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
    </span>
  );
}

/** Drives a MotionValue from 0 to `target` with an easeOut ramp. */
function animateValue(
  motionValue: MotionValue<number>,
  target: number,
  duration: number,
) {
  const id = window.setTimeout(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      motionValue.set(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, 150);
  return { stop: () => window.clearTimeout(id) };
}

/* ------------------------------------------------------------------ */
/*  Stat row                                                           */
/* ------------------------------------------------------------------ */

function StatRow({
  stat,
  delay,
}: {
  stat: (typeof STATS)[number];
  delay: number;
}) {
  const Icon = stat.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: delay + 0.2, duration: 0.4 }}
      className="flex items-center gap-4"
    >
      <span
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
          GLOW[stat.glow],
        )}
      >
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-2xl font-bold leading-tight">
          <NumberTicker
            value={stat.value}
            decimals={stat.decimals}
            prefix={stat.prefix}
            suffix={stat.suffix}
          />
        </p>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          {stat.label}
        </p>
      </div>
    </motion.div>
  );
}
/* ------------------------------------------------------------------ */
/*  Announcement marquee                                               */
/* ------------------------------------------------------------------ */

function Marquee() {
  // Duplicated so the -50% translate loops seamlessly.
  const items = [...ANNOUNCEMENTS, ...ANNOUNCEMENTS];

  return (
    <div className="relative mt-5 flex-1 overflow-hidden">
      {/* Fade masks */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-white/90 to-transparent dark:from-slate-900/90"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-white/90 to-transparent dark:from-slate-900/90"
      />

      <motion.div
        animate={{ y: ["0%", "-50%"] }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "linear",
        }}
        className="flex flex-col"
      >
        {items.map((item, index) => (
          <motion.div
            key={`${item.text}-${index}`}
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="mb-3 flex items-start gap-3 rounded-2xl border border-slate-200/60 bg-white/50 p-4 dark:border-slate-800/60 dark:bg-slate-900/40"
          >
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Bell className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium leading-snug">{item.text}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {item.place}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hotline dispatcher tile                                            */
/* ------------------------------------------------------------------ */

function HotlineTile() {
  return (
    <section
      className={cn(
        glass,
        "relative overflow-hidden border-amber-500/40 p-6 shadow-xl shadow-amber-500/10",
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl"
      />

      <div className="relative">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
            <PhoneCall className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <h2 className="text-sm font-semibold">Hotline &amp; Desk</h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Emergency dispatch
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          For active emergencies or urgent concerns, call the desk directly.
        </p>

        <div className="mt-5 space-y-2.5">
          <HotlineLink
            href="tel:+0288880000"
            label="Barangay Emergency Desk"
            number="(02) 8888-0000"
            tone="amber"
          />
          <HotlineLink
            href="tel:911"
            label="National Emergency"
            number="911"
            tone="red"
          />
        </div>

        <Link href="/reports" className="mt-5 block">
          <motion.span
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300/80 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-800 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:hover:border-emerald-500/60 dark:hover:bg-slate-800 dark:hover:text-emerald-300"
          >
            <ShieldAlert className="h-4 w-4" aria-hidden />
            File a Non-Emergency Report
          </motion.span>
        </Link>
      </div>
    </section>
  );
}

function HotlineLink({
  href,
  label,
  number,
  tone,
}: {
  href: string;
  label: string;
  number: string;
  tone: "amber" | "red";
}) {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={cn(
        "flex items-center justify-between gap-3 rounded-xl border px-4 py-3 transition-colors",
        tone === "amber"
          ? "border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20"
          : "border-red-500/40 bg-red-500/10 hover:bg-red-500/20",
      )}
    >
      <span className="min-w-0">
        <span className="block text-xs font-medium text-slate-600 dark:text-slate-300">
          {label}
        </span>
        <span
          className={cn(
            "block font-mono text-base font-bold",
            tone === "amber"
              ? "text-amber-700 dark:text-amber-400"
              : "text-red-700 dark:text-red-400",
          )}
        >
          {number}
        </span>
      </span>
      <AlertCircle
        className={cn(
          "h-4 w-4 shrink-0",
          tone === "amber"
            ? "text-amber-600 dark:text-amber-400"
            : "text-red-600 dark:text-red-400",
        )}
        aria-hidden
      />
    </motion.a>
  );
}