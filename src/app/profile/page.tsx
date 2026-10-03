"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  User,
  ShieldCheck,
  QrCode,
  Download,
  Phone,
  MapPin,
  Mail,
  Bell,
  Moon,
  Sun,
  LogOut,
  Edit3,
  Check,
  FileText,
  ChevronRight,
  CreditCard,
  Users,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Skeleton,
  SkeletonCard,
  SkeletonCircle,
} from "@/components/Skeleton";
import { useAsyncData } from "@/hooks/useAsyncData";

/* ------------------------------------------------------------------ */
/*  Static resident data                                               */
/* ------------------------------------------------------------------ */

const RESIDENT = {
  name: "Marben",
  idNo: "BRGY-ID-2026-9821",
  address: "Purok 3, Main Avenue",
  precinct: "0412-B",
  status: "Verified Resident",
  phone: "+63 917 123 4567",
  email: "Marben@email.com",
  emergencyName: "Marben",
  emergencyPhone: "+63 918 987 6543",
  headOfHousehold: true,
  dependents: 4,
};

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

/* ------------------------------------------------------------------ */
/*  Style tokens                                                       */
/* ------------------------------------------------------------------ */

const glass =
  "rounded-3xl border border-slate-200/80 bg-white/80 shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/80 dark:shadow-none";

const rowHover = "transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40";
/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ProfilePage() {
  const router = useRouter();
  // Starts true so server markup matches the dark-first default; the head
  // script and the mount effect keep it in sync without a flash.
  const [isDark, setIsDark] = useState(true);
  const [docAlerts, setDocAlerts] = useState(true);
  const [broadcasts, setBroadcasts] = useState(true);
  const [signedOut, setSignedOut] = useState(false);

  // Resident record - replace the loader body with a real fetch.
  const { isLoading } = useAsyncData(() => RESIDENT, { delay: 550 });
  // Skip until the theme has actually been resolved once, so the mount
  // effect's value isn't clobbered by the initial `false` state.
  const hasResolved = useRef(false);
  // Only an explicit tap from the user should create a stored preference;
  // OS-driven changes should keep following the system.
  const isUserChoice = useRef(false);

  // Initial theme: a stored choice always wins. First-time visitors (no
  // stored value) get dark mode, which is the portal's primary mode.
  useEffect(() => {
    let initial: boolean;
    try {
      const stored = localStorage.getItem("theme");
      initial = stored ? stored === "dark" : true;
    } catch {
      initial = true;
    }
    setIsDark(initial);
    document.documentElement.classList.toggle("dark", initial);
    hasResolved.current = true;
  }, []);

  // Apply the class always; persist only on explicit user choice.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    if (!hasResolved.current || !isUserChoice.current) return;
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {
      // Storage unavailable (private mode) - theme just won't persist.
    }
  }, [isDark]);

  // No OS listener: the default is a deliberate product choice (dark), not
  // a mirror of the system setting, so OS changes must not override it.
  // Once the user taps the toggle, the stored value governs from then on.

  function handleThemeToggle() {
    isUserChoice.current = true;
    setIsDark((prev) => !prev);
  }

  function handleSignOut() {
    setSignedOut(true);
    // Mock auth teardown - clear the session here.
    setTimeout(() => router.push("/login"), 700);
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-4 py-10 pb-32">
      {isLoading ? (
        <ProfileSkeleton />
      ) : (
        <>
          {/* Header */}
      <header className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          >
            <User className="h-5 w-5" aria-hidden />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Resident credentials &amp; app preferences
            </p>
          </div>
        </div>

        <motion.button
          type="button"
          onClick={handleThemeToggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          aria-pressed={isDark}
          className={cn(glass, "relative flex h-11 w-20 items-center p-1.5")}
        >
          <motion.span
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full shadow-sm",
              isDark
                ? "ml-auto bg-slate-800 text-emerald-400"
                : "bg-emerald-500 text-white",
            )}
          >
            {isDark ? (
              <Moon className="h-4 w-4" aria-hidden />
            ) : (
              <Sun className="h-4 w-4" aria-hidden />
            )}
          </motion.span>
          <span className="sr-only">{isDark ? "Dark" : "Light"} mode</span>
        </motion.button>
      </header>

      <ResidentIdCard />

      {/* Personal & household details */}
      <section className={cn(glass, "mt-6 p-6")}>
        <CardTitle icon={Users} title="Personal & Household Details" />

        <div className="mt-4 space-y-1">
          <DetailRow
            icon={Smartphone}
            label="Contact Number"
            value={RESIDENT.phone}
          />
          <DetailRow icon={Mail} label="Email Address" value={RESIDENT.email} />
          <DetailRow
            icon={Phone}
            label="Emergency Contact"
            value={`${RESIDENT.emergencyName} - ${RESIDENT.emergencyPhone}`}
          />
          <DetailRow
            icon={Users}
            label="Household Head"
            value={`${RESIDENT.headOfHousehold ? "Yes" : "No"} (${RESIDENT.dependents} Dependents registered)`}
          />
          <DetailRow
            icon={CreditCard}
            label="Official ID No."
            value={RESIDENT.idNo}
          />
          <DetailRow icon={MapPin} label="Address" value={RESIDENT.address} />
        </div>

        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-300/80 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-800 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:hover:border-emerald-500/60 dark:hover:bg-slate-800 dark:hover:text-emerald-300"
        >
          <Edit3 className="h-4 w-4" aria-hidden />
          Edit Details
        </motion.button>
      </section>
{/* Preferences */}
      <section className={cn(glass, "mt-6 p-6")}>
        <CardTitle icon={Bell} title="App Preferences" />

        <div className="mt-4 space-y-1">
          <ToggleRow
            icon={Bell}
            label="Document Status Alerts"
            hint="Get notified when a request changes status"
            enabled={docAlerts}
            onToggle={() => setDocAlerts((prev) => !prev)}
          />
          <ToggleRow
            icon={ShieldCheck}
            label="Community Emergency Broadcasts"
            hint="Receive urgent alerts from the barangay"
            enabled={broadcasts}
            onToggle={() => setBroadcasts((prev) => !prev)}
          />
        </div>
      </section>

      {/* Quick links */}
      <section className={cn(glass, "mt-6 p-6")}>
        <CardTitle icon={FileText} title="Quick Links" />

        <div className="mt-4 space-y-1">
          <QuickLink
            href="/track"
            icon={FileText}
            label="My Submitted Requests"
          />
          <QuickLink
            href="/reports"
            icon={ShieldCheck}
            label="Reported Incidents Log"
          />
        </div>
      </section>

      {/* Danger zone */}
      <section className={cn(glass, "mt-6 p-6")}>
        <motion.button
          type="button"
          onClick={handleSignOut}
          disabled={signedOut}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-700 transition-colors hover:bg-red-500/20 disabled:opacity-60 dark:text-red-300"
        >
          {signedOut ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{
                  repeat: Infinity,
                  duration: 0.9,
                  ease: "linear",
                }}
                className="h-4 w-4 rounded-full border-2 border-red-400/40 border-t-red-500"
              />
              Signing out...
            </>
          ) : (
            <>
              <LogOut className="h-4 w-4" aria-hidden />
              Sign Out
            </>
          )}
        </motion.button>
      </section>
        </>
      )}
    </main>
  );
}
/* ------------------------------------------------------------------ */
/*  Loading skeleton                                                    */
/* ------------------------------------------------------------------ */

function ProfileSkeleton() {
  return (
    <div role="status" aria-busy="true" aria-label="Loading profile">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-11 w-11" rounded="rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-28" rounded="rounded-lg" />
            <Skeleton className="h-3.5 w-52" rounded="rounded-md" />
          </div>
        </div>
        <Skeleton className="h-11 w-20 shrink-0" rounded="rounded-3xl" />
      </div>

      {/* ID card - keeps the gradient shell so the card doesn't pop in flat */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600/90 via-emerald-800/90 to-slate-900/90 p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Skeleton
              className="h-11 w-11 bg-white/20 dark:bg-white/10"
              rounded="rounded-full"
            />
            <div className="space-y-2">
              <Skeleton
                className="h-3 w-36 bg-white/20 dark:bg-white/10"
                rounded="rounded-md"
              />
              <Skeleton
                className="h-3.5 w-32 bg-white/20 dark:bg-white/10"
                rounded="rounded-md"
              />
            </div>
          </div>
          <Skeleton
            className="h-7 w-32 shrink-0 bg-white/20 dark:bg-white/10"
            rounded="rounded-full"
          />
        </div>

        <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
          <Skeleton
            className="mx-auto h-24 w-24 shrink-0 bg-white/20 dark:bg-white/10 sm:mx-0"
            rounded="rounded-2xl"
          />
          <div className="flex-1 space-y-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4"
              >
                <Skeleton
                  className="h-3 w-24 bg-white/20 dark:bg-white/10"
                  rounded="rounded-md"
                />
                <Skeleton
                  className="h-3.5 w-36 bg-white/20 dark:bg-white/10"
                  rounded="rounded-md"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center gap-4 border-t border-white/15 pt-5 sm:flex-row">
          <Skeleton
            className="h-16 w-16 bg-white/20 dark:bg-white/10"
            rounded="rounded-lg"
          />
          <div className="flex-1 space-y-2">
            <Skeleton
              className="h-3.5 w-40 bg-white/20 dark:bg-white/10"
              rounded="rounded-md"
            />
            <Skeleton
              className="h-3 w-48 bg-white/20 dark:bg-white/10"
              rounded="rounded-md"
            />
          </div>
          <Skeleton
            className="h-11 w-full shrink-0 bg-white/20 dark:bg-white/10 sm:w-40"
            rounded="rounded-xl"
          />
        </div>
      </div>
{/* Details */}
      <SkeletonCard className="mt-6">
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-4 w-4" rounded="rounded-md" />
          <Skeleton className="h-4 w-56" rounded="rounded-md" />
        </div>
        <div className="mt-4 space-y-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-3 py-3">
              <SkeletonCircle className="h-9 w-9" rounded="rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-2.5 w-28" rounded="rounded-md" />
                <Skeleton className="h-3.5 w-44" rounded="rounded-md" />
              </div>
            </div>
          ))}
        </div>
        <Skeleton className="mt-5 h-10 w-36" rounded="rounded-xl" />
      </SkeletonCard>

      {/* Preferences */}
      <SkeletonCard className="mt-6">
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-4 w-4" rounded="rounded-md" />
          <Skeleton className="h-4 w-36" rounded="rounded-md" />
        </div>
        <div className="mt-4 space-y-1">
          {[0, 1].map((i) => (
            <div key={i} className="flex items-center gap-4 px-3 py-3">
              <SkeletonCircle className="h-9 w-9" rounded="rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-48" rounded="rounded-md" />
                <Skeleton className="h-3 w-56" rounded="rounded-md" />
              </div>
              <Skeleton className="h-6 w-11 shrink-0" rounded="rounded-full" />
            </div>
          ))}
        </div>
      </SkeletonCard>

      {/* Quick links */}
      <SkeletonCard className="mt-6">
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-4 w-4" rounded="rounded-md" />
          <Skeleton className="h-4 w-28" rounded="rounded-md" />
        </div>
        <div className="mt-4 space-y-1">
          {[0, 1].map((i) => (
            <div key={i} className="flex items-center gap-4 px-3 py-3">
              <SkeletonCircle className="h-9 w-9" rounded="rounded-lg" />
              <Skeleton className="h-3.5 w-52" rounded="rounded-md" />
              <Skeleton className="ml-auto h-4 w-4" rounded="rounded-md" />
            </div>
          ))}
        </div>
      </SkeletonCard>

      {/* Sign out */}
      <SkeletonCard className="mt-6">
        <Skeleton
          className="h-12 w-full bg-red-500/15 dark:bg-red-500/10"
          rounded="rounded-xl"
        />
      </SkeletonCard>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Virtual Resident ID card                                           */
/* ------------------------------------------------------------------ */

function ResidentIdCard() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 24 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600/90 via-emerald-800/90 to-slate-900/90 p-6 text-white shadow-2xl backdrop-blur-xl"
    >
      {/* Decorative glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-emerald-300/10 blur-3xl"
      />

      {/* Header */}
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt="Barangay crest"
            className="h-11 w-11 rounded-full bg-white/10 p-1 ring-1 ring-white/30"
          />
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-100">
              Barangay Resident ID
            </p>
            <p className="mt-0.5 font-mono text-sm font-bold">
              {RESIDENT.idNo}
            </p>
          </div>
        </div>

        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-semibold ring-1 ring-white/30">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
          {RESIDENT.status}
        </span>
      </div>

      {/* Body */}
      <div className="relative mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
        {/* Avatar */}
        <div className="relative mx-auto shrink-0 sm:mx-0">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white/15 text-3xl font-bold ring-1 ring-white/30 backdrop-blur-sm">
            JD
          </div>
          <motion.span
            animate={{ scale: [1, 1.12, 1] }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400 text-emerald-950 shadow-lg ring-2 ring-emerald-800"
          >
            <ShieldCheck className="h-4 w-4" aria-hidden />
            <span className="sr-only">Verified</span>
          </motion.span>
        </div>

        {/* Details */}
        <dl className="min-w-0 flex-1 space-y-2.5 text-sm">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-2.5">
            <dt className="text-emerald-100/80">Resident Name</dt>
            <dd className="truncate font-bold">{RESIDENT.name}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-2.5">
            <dt className="text-emerald-100/80">Address</dt>
            <dd className="truncate font-semibold">{RESIDENT.address}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-emerald-100/80">Precinct ID</dt>
            <dd className="font-mono font-semibold">{RESIDENT.precinct}</dd>
          </div>
        </dl>
      </div>

      {/* Footer */}
      <div className="relative mt-6 flex flex-col items-center gap-4 border-t border-white/15 pt-5 sm:flex-row">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-white p-1.5">
            <div
              className="grid h-12 w-12 grid-cols-[repeat(21,minmax(0,1fr))] gap-px"
              role="img"
              aria-label={`QR code for ${RESIDENT.idNo}`}
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
          </div>
          <div>
            <p className="text-xs font-semibold">Scan at the Barangay Hall</p>
            <p className="text-[11px] text-emerald-100/70">
              Present this code for document claims
            </p>
          </div>
        </div>

        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-sm font-semibold ring-1 ring-white/30 transition-colors hover:bg-white/25 sm:ml-auto sm:w-auto"
        >
          <Download className="h-4 w-4" aria-hidden />
          Download Pass
        </motion.button>
      </div>
    </motion.section>
  );
}
/* ------------------------------------------------------------------ */
/*  Card title                                                         */
/* ------------------------------------------------------------------ */

function CardTitle({
  icon: Icon,
  title,
}: {
  icon: LucideIcon;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon
        className="h-4 w-4 text-emerald-600 dark:text-emerald-400"
        aria-hidden
      />
      <h2 className="text-base font-semibold">{title}</h2>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Detail row                                                         */
/* ------------------------------------------------------------------ */

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className={cn("flex items-center gap-4 rounded-xl px-3 py-3", rowHover)}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <p className="mt-0.5 truncate text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Spring toggle switch                                               */
/* ------------------------------------------------------------------ */

function ToggleRow({
  icon: Icon,
  label,
  hint,
  enabled,
  onToggle,
}: {
  icon: LucideIcon;
  label: string;
  hint: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={cn("flex items-center gap-4 rounded-xl px-3 py-3", rowHover)}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{label}</p>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          {hint}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={label}
        onClick={onToggle}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          enabled ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700",
        )}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={cn(
            "absolute top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow",
            enabled ? "right-0.5" : "left-0.5",
          )}
        >
          <AnimatePresence initial={false}>
            {enabled && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="text-emerald-600"
              >
                <Check className="h-3 w-3" aria-hidden />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.span>
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Quick link                                                         */
/* ------------------------------------------------------------------ */

function QuickLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-4 rounded-xl px-3 py-3",
        rowHover,
      )}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <span className="flex-1 text-sm font-medium">{label}</span>
      <motion.span
        whileHover={{ x: 3 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="text-slate-400"
      >
        <ChevronRight className="h-4 w-4" aria-hidden />
      </motion.span>
    </Link>
  );
}
