"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  X,
  HeartPulse,
  Users,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Category = "health" | "assembly" | "deadline";

type EventItem = {
  id: string;
  day: number;
  month: number;
  year: number;
  title: string;
  time: string;
  category: Category;
};

const CATEGORY_META: Record<
  Category,
  { label: string; dot: string; icon: typeof HeartPulse }
> = {
  health: {
    label: "Health",
    dot: "bg-emerald-500",
    icon: HeartPulse,
  },
  assembly: {
    label: "Assembly",
    dot: "bg-blue-500",
    icon: Users,
  },
  deadline: {
    label: "Deadline",
    dot: "bg-amber-500",
    icon: FileText,
  },
};

const EVENTS: EventItem[] = [
  {
    id: "e1",
    day: 10,
    month: 10,
    year: 2026,
    title: "Free Health Check & Dental Mission",
    time: "8:00 AM - 12:00 NN",
    category: "health",
  },
  {
    id: "e2",
    day: 5,
    month: 10,
    year: 2026,
    title: "Purok 3 Water Main Maintenance",
    time: "6:00 AM - 10:00 AM",
    category: "deadline",
  },
  {
    id: "e3",
    day: 15,
    month: 10,
    year: 2026,
    title: "General Assembly - All Puroks",
    time: "4:00 PM",
    category: "assembly",
  },
  {
    id: "e4",
    day: 20,
    month: 10,
    year: 2026,
    title: "Youth Sports League Registration Closes",
    time: "5:00 PM",
    category: "deadline",
  },
  {
    id: "e5",
    day: 12,
    month: 11,
    year: 2026,
    title: "Barangay Council Regular Session",
    time: "9:00 AM",
    category: "assembly",
  },
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const glass =
  "rounded-3xl border border-slate-200/80 bg-white/80 shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/80 dark:shadow-none";
/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function CommunityCalendar() {
  // Resolved after mount so server and client markup always match.
  const [today, setToday] = useState<Date | null>(null);
  const [cursor, setCursor] = useState<{ y: number; m: number } | null>(null);
  const [selected, setSelected] = useState<{
    d: number;
    m: number;
    y: number;
  } | null>(null);

  if (today === null && cursor === null) {
    const now = new Date();
    setToday(now);
    setCursor({ y: now.getFullYear(), m: now.getMonth() });
  }

  const year = cursor?.y ?? 1970;
  const month = cursor?.m ?? 0;

  const monthLabel = useMemo(
    () =>
      new Date(year, month, 1).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
    [year, month],
  );

  // Leading blanks + days in month, padded to full weeks so height is stable.
  const cells = useMemo(() => {
    const firstWeekday = new Date(year, month, 1).getDay();
    const days = new Date(year, month + 1, 0).getDate();
    const list: (number | null)[] = Array.from(
      { length: firstWeekday },
      () => null,
    );
    for (let d = 1; d <= days; d += 1) list.push(d);
    while (list.length % 7 !== 0) list.push(null);
    return list;
  }, [year, month]);

  const eventsFor = (day: number) =>
    EVENTS.filter((e) => e.year === year && e.month === month && e.day === day);

  const selectedEvents = selected
    ? EVENTS.filter(
        (e) =>
          e.year === selected.y &&
          e.month === selected.m &&
          e.day === selected.d,
      )
    : [];

  function shiftMonth(delta: number) {
    const d = new Date(year, month + delta, 1);
    setCursor({ y: d.getFullYear(), m: d.getMonth() });
  }
  return (
    <section className={cn(glass, "flex flex-col p-6")}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <CalendarDays className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <h2 className="text-sm font-semibold">Community Calendar</h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Upcoming events and deadlines
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            aria-label="Previous month"
            className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </button>
          <span className="min-w-28 text-center text-xs font-semibold">
            {monthLabel}
          </span>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            aria-label="Next month"
            className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>

      {/* Weekday row */}
      <div className="mt-5 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="pb-1 text-center text-[10px] font-semibold uppercase tracking-wide text-slate-400"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Day grid with a sliding month transition */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${year}-${month}`}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="grid grid-cols-7 gap-1"
          >
            {cells.map((day, index) => {
              if (day === null) return <div key={`blank-${index}`} />;

              const dayEvents = eventsFor(day);
              const isToday =
                today !== null &&
                today.getFullYear() === year &&
                today.getMonth() === month &&
                today.getDate() === day;
              const isSelected =
                selected?.d === day &&
                selected.m === month &&
                selected.y === year;

              return (
                <button
                  key={day}
                  type="button"
                  disabled={dayEvents.length === 0}
                  onClick={() =>
                    setSelected({ d: day, m: month, y: year })
                  }
                  aria-label={
                    dayEvents.length > 0
                      ? `${day} - ${dayEvents.length} event(s)`
                      : `${day}`
                  }
                  className={cn(
                    "relative flex aspect-square flex-col items-center justify-center rounded-xl text-xs transition-colors",
                    dayEvents.length > 0
                      ? "cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                      : "cursor-default text-slate-400 dark:text-slate-600",
                    isToday && "ring-1 ring-emerald-500",
                    isSelected && "bg-emerald-500/15",
                  )}
                >
                  <span
                    className={cn(
                      "font-medium",
                      isToday && "text-emerald-600 dark:text-emerald-400",
                    )}
                  >
                    {day}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="mt-0.5 flex gap-0.5">
                      {dayEvents.map((e) => (
                        <span
                          key={e.id}
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            CATEGORY_META[e.category].dot,
                          )}
                        />
                      ))}
                    </span>
                  )}
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Category legend */}
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-200/60 pt-4 dark:border-slate-800">
        {(Object.keys(CATEGORY_META) as Category[]).map((key) => (
          <span
            key={key}
            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400"
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                CATEGORY_META[key].dot,
              )}
            />
            {CATEGORY_META[key].label}
          </span>
        ))}
      </div>

      {/* Event modal */}
      <AnimatePresence>
        {selected && selectedEvents.length > 0 && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={`Events on ${selected.m + 1}/${selected.d}`}
              className={cn(glass, "w-full max-w-sm p-6 shadow-2xl")}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    {new Date(
                      selected.y,
                      selected.m,
                      selected.d,
                    ).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <h3 className="mt-0.5 text-base font-semibold">
                    {selectedEvents.length}{" "}
                    {selectedEvents.length === 1 ? "event" : "events"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  aria-label="Close"
                  className="shrink-0 rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </div>

              <ul className="mt-4 space-y-2">
                {selectedEvents.map((event) => {
                  const meta = CATEGORY_META[event.category];
                  const Icon = meta.icon;
                  return (
                    <li
                      key={event.id}
                      className="flex items-start gap-3 rounded-xl border border-slate-200/70 p-3 dark:border-slate-800"
                    >
                      <span
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white",
                          meta.dot,
                        )}
                      >
                        <Icon className="h-4 w-4" aria-hidden />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold">{event.title}</p>
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                          {event.time} · {meta.label}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}