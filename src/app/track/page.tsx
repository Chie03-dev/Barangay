"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  Clock,
  CheckCircle2,
  FileText,
  QrCode,
  ChevronRight,
  AlertCircle,
  Filter,
  StickyNote,
  Copy,
  Check,
  Building,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Skeleton,
  SkeletonCard,
  SkeletonCircle,
  SkeletonHeading,
} from "@/components/Skeleton";
import { useAsyncData } from "@/hooks/useAsyncData";

/* ------------------------------------------------------------------ */
/*  Types & mock data                                                  */
/* ------------------------------------------------------------------ */

type StageKey = "received" | "review" | "approved" | "pickup";

type RequestItem = {
  code: string;
  document: string;
  status: string;
  stage: number;
  date: string;
  fee: string;
  note: string;
  window: string;
};

const REQUESTS: RequestItem[] = [
  {
    code: "BRGY-2026-8942",
    document: "Barangay Clearance",
    status: "Ready for Pick-up",
    stage: 4,
    date: "Oct 2, 2026",
    fee: "\u20B150",
    note: "Available at Window 2",
    window: "Window 2",
  },
  {
    code: "BRGY-2026-4102",
    document: "Certificate of Indigency",
    status: "Under Review",
    stage: 2,
    date: "Oct 3, 2026",
    fee: "Free",
    note: "Evaluating proof of residency",
    window: "Window 1",
  },
  {
    code: "BRGY-2026-1089",
    document: "Barangay Business Permit",
    status: "Approved & Signed",
    stage: 3,
    date: "Sep 28, 2026",
    fee: "\u20B1200",
    note: "Signed by Captain Cruz",
    window: "Window 3",
  },
];

const FILTERS = ["All", "In Progress", "Ready for Pickup", "Completed"] as const;
type FilterKey = (typeof FILTERS)[number];

const STAGES: { key: StageKey; label: string; desc: string }[] = [
  { key: "received", label: "Request Received", desc: "Submitted successfully" },
  { key: "review", label: "Under Review", desc: "Staff verification" },
  { key: "approved", label: "Approved & Signed", desc: "Official signature appended" },
  { key: "pickup", label: "Ready for Pick-up", desc: "Available at Barangay Hall" },
];

function matchesFilter(item: RequestItem, filter: FilterKey) {
  switch (filter) {
    case "In Progress":
      return item.stage > 1 && item.stage < 4;
    case "Ready for Pickup":
      return item.stage === 4;
    case "Completed":
      return item.stage >= 4;
    default:
      return true;
  }
}

/* ------------------------------------------------------------------ */
/*  Style tokens                                                       */
/* ------------------------------------------------------------------ */

const glass =
  "rounded-3xl border border-slate-200/80 bg-white/80 shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/80 dark:shadow-none";

const slide = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const transition = { duration: 0.3, ease: "easeOut" as const };
/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function TrackPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("All");
  const [activeCode, setActiveCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Mock request feed - replace the loader body with a real fetch.
  const { data: requests, isLoading } = useAsyncData(() => REQUESTS, {
    delay: 650,
  });

  const visible = useMemo(() => {
    if (!requests) return [];
    const q = query.trim().toLowerCase();
    return requests.filter((item) => {
      const matchesQuery =
        q === "" ||
        item.code.toLowerCase().includes(q) ||
        item.document.toLowerCase().includes(q);
      return matchesQuery && matchesFilter(item, filter);
    });
  }, [requests, query, filter]);

  const active = useMemo(
    () => requests?.find((r) => r.code === activeCode) ?? null,
    [requests, activeCode],
  );

  async function handleCopy(code: string) {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // Clipboard may be unavailable (insecure context) - fail silently.
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-10 pb-32">
      {isLoading ? (
        <TrackSkeleton />
      ) : (
        <>
          {/* Header */}
      <header className="mb-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        >
          <Clock className="h-6 w-6" aria-hidden />
        </motion.div>
        <h1 className="text-3xl font-bold tracking-tight">Track Requests</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Follow the live status of your document requests.
        </p>
      </header>

      {/* Search & filter bar */}
      <div className={cn(glass, "mb-6 p-4 sm:p-5")}>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by reference code or document name..."
            aria-label="Search requests"
            className="h-11 w-full rounded-xl border border-slate-200/70 bg-white/80 pl-11 pr-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-900/60 dark:focus:border-emerald-500"
          />
        </div>

        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
          {FILTERS.map((item) => {
            const isActive = filter === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                aria-pressed={isActive}
                className={cn(
                  "relative shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-emerald-800 dark:text-emerald-300"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="track-filter-pill"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute inset-0 -z-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40"
                  />
                )}
                {item}
              </button>
            );
          })}
        </div>
      </div>
{/* Request list + detail panel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section aria-label="Your requests">
          <AnimatePresence mode="popLayout">
            {visible.map((item) => (
              <RequestCard
                key={item.code}
                item={item}
                isActive={activeCode === item.code}
                onSelect={() => setActiveCode(item.code)}
              />
            ))}
          </AnimatePresence>

          {visible.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                glass,
                "flex flex-col items-center p-10 text-center",
              )}
            >
              <AlertCircle
                className="mb-3 h-8 w-8 text-slate-300"
                aria-hidden
              />
              <p className="font-medium">No requests found</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Try a different reference code or filter.
              </p>
            </motion.div>
          )}
        </section>

        {/* Detail panel */}
        <section aria-label="Request timeline">
          <AnimatePresence mode="wait">
            {active ? (
              <motion.div
                key={active.code}
                {...slide}
                transition={transition}
                className="space-y-4"
              >
                <Timeline item={active} />
                {active.stage === 4 && (
                  <PickupPass
                    item={active}
                    copied={copied}
                    onCopy={() => handleCopy(active.code)}
                  />
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={cn(
                  glass,
                  "flex h-full min-h-64 flex-col items-center justify-center p-10 text-center",
                )}
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <FileText className="h-7 w-7" aria-hidden />
                </div>
                <p className="font-semibold">Select a request</p>
                <p className="mt-1 max-w-xs text-sm text-slate-500 dark:text-slate-400">
                  Tap any request on the left to view its live progress
                  timeline.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
        </>
      )}
    </main>
  );
}
/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/*  Loading skeleton                                                    */
/* ------------------------------------------------------------------ */

function TrackSkeleton() {
  return (
    <div role="status" aria-busy="true" aria-label="Loading requests">
      {/* Header */}
      <div className="mb-8 text-center">
        <Skeleton className="mx-auto mb-3 h-12 w-12" rounded="rounded-xl" />
        <Skeleton className="mx-auto h-8 w-56" rounded="rounded-lg" />
        <Skeleton className="mx-auto mt-3 h-4 w-72" rounded="rounded-md" />
      </div>

      {/* Search & filter bar */}
      <SkeletonCard className="mb-6">
        <Skeleton className="h-11 w-full" rounded="rounded-xl" />
        <div className="mt-4 flex items-center gap-2">
          <Skeleton className="h-4 w-4 shrink-0" rounded="rounded-md" />
          {[68, 96, 132, 88].map((w, i) => (
            <Skeleton
              key={i}
              className="h-8 shrink-0"
              rounded="rounded-full"
              // Inline width avoids an arbitrary-value class per item.
              style={{ width: w }}
            />
          ))}
        </div>
      </SkeletonCard>

      {/* List + detail columns */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="mb-3 flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-md shadow-slate-200/40 dark:border-slate-800/50 dark:bg-slate-900/80 dark:shadow-none"
            >
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3 w-28" rounded="rounded-md" />
                  <Skeleton className="h-4 w-24" rounded="rounded-full" />
                </div>
                <Skeleton className="h-4 w-48" rounded="rounded-md" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-3 w-24" rounded="rounded-md" />
                  <Skeleton className="h-3 w-8" rounded="rounded-md" />
                </div>
              </div>
              <Skeleton className="h-8 w-8 shrink-0" rounded="rounded-full" />
            </div>
          ))}
        </div>

        {/* Detail placeholder */}
        <SkeletonCard className="min-h-96">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-3 w-32" rounded="rounded-md" />
              <Skeleton className="h-5 w-52" rounded="rounded-lg" />
            </div>
            <Skeleton className="h-7 w-24 shrink-0" rounded="rounded-full" />
          </div>

          <Skeleton className="mt-3 h-8 w-full" rounded="rounded-xl" />

          {/* Four timeline nodes, mirroring the real stage list */}
          <div className="mt-6 space-y-0">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <SkeletonCircle className="h-9 w-9" />
                  {i < 3 && (
                    <Skeleton
                      className="mt-1 w-0.5 flex-1"
                      rounded="rounded-full"
                    />
                  )}
                </div>
                <div className={cn("pb-6", i === 3 && "pb-0")}>
                  <Skeleton className="h-4 w-40" rounded="rounded-md" />
                  <Skeleton className="mt-2 h-3 w-52" rounded="rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </SkeletonCard>
      </div>
    </div>
  );
}
/*  Request card                                                       */
/* ------------------------------------------------------------------ */

function statusTone(stage: number) {
  if (stage === 4) {
    return "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400";
  }
  if (stage === 3) {
    return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
  }
  return "bg-amber-500/10 text-amber-700 dark:text-amber-400";
}

function RequestCard({
  item,
  isActive,
  onSelect,
}: {
  item: RequestItem;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      layout
      type="button"
      onClick={onSelect}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      aria-pressed={isActive}
      className={cn(
        "mb-3 flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-colors",
        isActive
          ? "border-emerald-500 bg-emerald-500/5 shadow-lg shadow-emerald-500/10"
          : "border-slate-200/80 bg-white/80 shadow-md shadow-slate-200/40 hover:border-slate-300 hover:shadow-lg dark:border-slate-800/50 dark:bg-slate-900/80 dark:shadow-none dark:hover:border-slate-700",
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            {item.code}
          </span>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[11px] font-semibold",
              statusTone(item.stage),
            )}
          >
            {item.status}
          </span>
        </div>
        <p className="mt-1 truncate font-semibold">{item.document}</p>
        <div className="mt-1.5 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            {item.date}
          </span>
          <span className="font-semibold">{item.fee}</span>
        </div>
      </div>

      <motion.span
        animate={{ x: isActive ? 2 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors",
          isActive
            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            : "bg-slate-100 text-slate-400 dark:bg-slate-800",
        )}
      >
        <ChevronRight className="h-4 w-4" aria-hidden />
      </motion.span>
    </motion.button>
  );
}
/* ------------------------------------------------------------------ */
/*  Vertical timeline                                                  */
/* ------------------------------------------------------------------ */

function Timeline({ item }: { item: RequestItem }) {
  return (
    <div className={cn(glass, "p-6")}>
      <div className="mb-1 flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            {item.code}
          </p>
          <h2 className="mt-0.5 text-lg font-bold">{item.document}</h2>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-3 py-1 text-xs font-semibold",
            statusTone(item.stage),
          )}
        >
          Stage {item.stage} of 4
        </span>
      </div>

      <div className="mt-2 flex items-start gap-2 rounded-xl bg-amber-500/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-300">
        <StickyNote
          className="mt-0.5 h-3.5 w-3.5 shrink-0"
          aria-hidden
        />
        <span>{item.note}</span>
      </div>

      <ol className="mt-6">
        {STAGES.map((stage, index) => {
          const isDone = index + 1 < item.stage;
          const isCurrent = index + 1 === item.stage;
          const isLast = index === STAGES.length - 1;

          return (
            <li key={stage.key} className="flex gap-4">
              {/* Rail */}
              <div className="flex flex-col items-center">
                <motion.span
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: index * 0.08,
                    type: "spring",
                    stiffness: 400,
                    damping: 18,
                  }}
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2",
                    (isDone || isCurrent) &&
                      "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                    !isDone &&
                      !isCurrent &&
                      "border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-600",
                    isCurrent && "animate-pulse",
                  )}
                >
                  {isDone ? (
                    <CheckCircle2 className="h-5 w-5" aria-hidden />
                  ) : isCurrent ? (
                    <Clock className="h-5 w-5" aria-hidden />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-current" />
                  )}
                </motion.span>

                {!isLast && (
                  <div className="relative w-0.5 flex-1">
                    <div
                      className={cn(
                        "absolute inset-0 rounded-full",
                        isDone
                          ? "bg-emerald-500"
                          : "border-l-2 border-dashed border-slate-300 dark:border-slate-700",
                      )}
                    />
                  </div>
                )}
              </div>

              {/* Label */}
              <div className={cn("pb-6", isLast && "pb-0")}>
                <p
                  className={cn(
                    "text-sm font-semibold transition-colors",
                    isDone || isCurrent
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-slate-400 dark:text-slate-600",
                  )}
                >
                  {stage.label}
                </p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {stage.desc}
                </p>
                {isCurrent && (
                  <p className="mt-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    Currently at the {item.window}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
/* ------------------------------------------------------------------ */
/*  Digital pickup pass                                               */
/* ------------------------------------------------------------------ */

const QR_PATTERN = [
  "111111100101101111111",
  "100000101110101000001",
  "101110100011101011101",
  "101110101101101011101",
  "101110100110101011101",
  "100000101010101000001",
  "111111101010101111111",
  "000000001110100000000",
  "101011111001111010101",
  "011100001110001101110",
  "110011101011101001011",
  "001101010110010111000",
  "111011101001111010110",
  "000000001101000001001",
  "111111101011101110101",
  "100000100110001010010",
  "101110101011111011101",
  "101110100101000010110",
  "101110101110111001011",
  "100000101001010110100",
  "111111101101101011101",
];

function PickupPass({
  item,
  copied,
  onCopy,
}: {
  item: RequestItem;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 24 }}
      className={cn(glass, "overflow-hidden")}
    >
      {/* Pass header */}
      <div className="flex items-center justify-between gap-3 bg-emerald-600 px-5 py-3 text-white">
        <div className="flex items-center gap-2">
          <QrCode className="h-5 w-5" aria-hidden />
          <span className="text-sm font-semibold">Digital Pick-up Pass</span>
        </div>
        <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold">
          Valid
        </span>
      </div>

      <div className="p-5">
        <div className="flex flex-col items-center gap-5 sm:flex-row">
          {/* QR preview */}
          <div className="relative shrink-0 rounded-2xl border border-slate-200/60 bg-white p-3 shadow-inner dark:border-slate-800 dark:bg-slate-950">
            <div
              className="grid h-32 w-32 grid-cols-[repeat(21,minmax(0,1fr))] gap-px"
              role="img"
              aria-label={`QR code for ${item.code}`}
            >
              {QR_PATTERN.flatMap((row, y) =>
                row.split("").map((cell, x) => (
                  <span
                    key={`${y}-${x}`}
                    className={cn(
                      "aspect-square",
                      cell === "1" ? "bg-slate-900" : "bg-transparent",
                    )}
                  />
                )),
              )}
            </div>
            {/* Corner accents */}
            <QrCode
              className="pointer-events-none absolute -bottom-2 -right-2 h-6 w-6 text-emerald-500"
              aria-hidden
            />
          </div>

          {/* Pass details */}
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              {item.document}
            </p>
            <p className="mt-1 font-mono text-lg font-bold text-emerald-700 dark:text-emerald-400">
              {item.code}
            </p>

            <p className="mt-3 flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
              <Building
                className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                aria-hidden
              />
              <span>
                Present this pass or Reference Code at{" "}
                <strong className="font-semibold">{item.window}</strong> of the
                Barangay Hall.
              </span>
            </p>

            <motion.button
              type="button"
              onClick={onCopy}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className={cn(
                "mt-4 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors",
                copied
                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                  : "bg-emerald-600 text-white hover:bg-emerald-500",
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={copied ? "copied" : "copy"}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" aria-hidden />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" aria-hidden />
                      Copy Reference Code
                    </>
                  )}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        <p className="mt-5 flex items-center justify-center gap-2 border-t border-slate-200/60 pt-4 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
          Claim within 15 days of release. Bring a valid ID.
        </p>
      </div>
    </motion.div>
  );
}