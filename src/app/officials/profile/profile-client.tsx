"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ChevronRight,
  Clock,
  FileText,
  LogOut,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Shield,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn, glass } from "@/lib/utils";
import {
  Skeleton,
  SkeletonCard,
  SkeletonCircle,
} from "@/components/Skeleton";
import { useAsyncData } from "@/hooks/useAsyncData";
import { findOfficial, type Official, initials } from "@/lib/officials";
import { OFFICIAL_SESSION_COOKIE } from "@/lib/auth";

/* ------------------------------------------------------------------ */
/*  Style tokens                                                       */
/* ------------------------------------------------------------------ */

const rowHover = "transition-colors hover:bg-slate-200/50 dark:hover:bg-slate-800/40";

const OFFICE_LOCATION = "Barangay Hall, Main Avenue";

/* ------------------------------------------------------------------ */
/*  Loading state                                                      */
/* ------------------------------------------------------------------ */

export function ProfileSkeleton() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-4 py-10 pb-32" id="main-content">
      {/* Header */ }
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-11 w-11 shrink-0" rounded="rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-24" rounded="rounded-lg" />
            <Skeleton className="h-3.5 w-52" rounded="rounded-md" />
          </div>
        </div>
        <Skeleton className="h-11 w-20 shrink-0" rounded="rounded-3xl" />
      </div>

      {/* ID card */ }
      <div className="relative overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-800 p-6 shadow-2xl mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-11 w-11 bg-white/20 dark:bg-white/10" rounded="rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-36 bg-white/20 dark:bg-white/10" rounded="rounded-md" />
              <Skeleton className="h-3.5 w-32 bg-white/20 dark:bg-white/10" rounded="rounded-md" />
            </div>
          </div>
          <Skeleton className="h-7 w-32 shrink-0 bg-white/20 dark:bg-white/10" rounded="rounded-full" />
        </div>

        <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
          <Skeleton className="mx-auto h-24 w-24 shrink-0 bg-white/20 dark:bg-white/10 sm:mx-0" rounded="rounded-2xl" />
          <div className="flex-1 space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between gap-4">
                <Skeleton className="h-3 w-24 bg-white/20 dark:bg-white/10" rounded="rounded-md" />
                <Skeleton className="h-3.5 w-36 bg-white/20 dark:bg-white/10" rounded="rounded-md" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center gap-4 border-t border-white/15 pt-5 sm:flex-row">
          <Skeleton className="h-16 w-16 bg-white/20 dark:bg-white/10" rounded="rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-40 bg-white/20 dark:bg-white/10" rounded="rounded-md" />
            <Skeleton className="h-3 w-48 bg-white/20 dark:bg-white/10" rounded="rounded-md" />
          </div>
          <Skeleton className="h-11 w-full shrink-0 bg-white/20 dark:bg-white/10 sm:w-40" rounded="rounded-xl" />
        </div>
      </div>

      {/* Details section */}
      <SkeletonCard className="mt-6">
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-4 w-4" rounded="rounded-md" />
          <Skeleton className="h-4 w-56" rounded="rounded-md" />
        </div>
        <div className="mt-4 space-y-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-3 py-3">
              <SkeletonCircle className="h-9 w-9" rounded="rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-2.5 w-28" rounded="rounded-md" />
                <Skeleton className="h-3.5 w-44" rounded="rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </SkeletonCard>

      {/* Committees section */}
      <SkeletonCard className="mt-6">
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-4 w-4" rounded="rounded-md" />
          <Skeleton className="h-4 w-48" rounded="rounded-md" />
        </div>
        <div className="mt-4 space-y-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-4 px-3 py-3">
              <Skeleton className="h-3 w-32" rounded="rounded-full" />
            </div>
          ))}
        </div>
      </SkeletonCard>

      {/* About section */}
      <SkeletonCard className="mt-6">
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-4 w-4" rounded="rounded-md" />
          <Skeleton className="h-4 w-48" rounded="rounded-md" />
        </div>
        <div className="mt-2">
          <Skeleton className="h-10 w-full" rounded="rounded-lg" />
          <Skeleton className="mt-2 h-4 w-3/4" rounded="rounded-md" />
        </div>
      </SkeletonCard>

      {/* Quick actions section */}
      <SkeletonCard className="mt-6">
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-4 w-4" rounded="rounded-md" />
          <Skeleton className="h-4 w-48" rounded="rounded-md" />
        </div>
        <div className="mt-4 grid gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-center gap-2 rounded-xl border border-slate-200/60 bg-slate-50/80 px-3 py-3 dark:border-slate-800 dark:bg-slate-800/40">
              <Skeleton className="h-4 w-4 shrink-0" rounded="rounded-lg" />
              <Skeleton className="h-4 w-20" rounded="rounded-md" />
            </div>
          ))}
        </div>
      </SkeletonCard>
    </main>
  );
}



/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function OfficialProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [queryId, setQueryId] = useState<string | undefined>(
    searchParams.get("id") || undefined,
  );

  const { isLoading, data: official } = useAsyncData(
    () => findOfficial(queryId),
    { delay: 600, deps: [queryId] },
  );

  const goBack = useCallback(() => router.push("/officials/directory"), [
    router,
  ]);

  const [photoFailed, setPhotoFailed] = useState(false);
  const [signedOut, setSignedOut] = useState(false);

  function handleSignOut() {
    setSignedOut(true);
    document.cookie = `${OFFICIAL_SESSION_COOKIE}=; path=/; max-age=0; samesite=lax`;
    router.push("/login");
    router.refresh();
  }

  if (isLoading || !official) return <ProfileSkeleton />;

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-4 py-10 pb-32" id="main-content">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <motion.button
            type="button"
            onClick={goBack}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            aria-label="Back to directory"
            className="flex items-center justify-center w-11 h-11 rounded-xl bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200/70 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-800/60"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden />
          </motion.button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Official Profile</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Official credentials &amp; office information
            </p>
          </div>
        </div>
      </header>

      {/* Official ID card */}
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
              src="/logo.png"
              alt="Barangay crest"
              className="h-11 w-11 rounded-full bg-white/10 p-1 ring-1 ring-white/30"
            />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-100">
                Barangay Official ID
              </p>
              <p className="mt-0.5 font-mono text-sm font-bold">{official.id}</p>
            </div>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-semibold ring-1 ring-white/30">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
            Verified Official
          </span>
        </div>

        {/* Body */}
        <div className="relative mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
          {/* Avatar */}
          <div className="relative mx-auto shrink-0 sm:mx-0">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white/15 text-3xl font-bold ring-1 ring-white/30 backdrop-blur-sm">
              {photoFailed ? (
                <span className="text-slate-200">{initials(official.name)}</span>
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={official.photo}
                  alt={`Portrait of ${official.name}`}
                  onError={() => setPhotoFailed(true)}
                  className="h-full w-full object-cover"
                />
              )}
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
              <dt className="text-emerald-100/80">Official Name</dt>
              <dd className="truncate font-bold">{official.name}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-2.5">
              <dt className="text-emerald-100/80">Position</dt>
              <dd className="font-semibold">{official.role}</dd>
            </div>
            {official.tenure && (
              <div className="flex items-center justify-between gap-4">
                <dt className="text-emerald-100/80">Term</dt>
                <dd className="font-mono font-semibold">{official.tenure}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Footer */}
        <div className="relative mt-6 flex flex-col items-center gap-4 border-t border-white/15 pt-5 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-white p-1.5">
              <Clock className="h-5 w-5 text-emerald-950" aria-hidden />
            </div>
            <div>
              <p className="text-xs font-semibold">Office Hours</p>
              <p className="text-[11px] text-emerald-100/70">{official.hours}</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Details */}
      <SkeletonCard className="mt-6">
        <CardTitle icon={Shield} title="Office Contact" />
        <div className="mt-4 space-y-1">
          <DetailRow
            icon={Phone}
            label="Mobile"
            value={official.contact}
          />
          <DetailRow
            icon={Mail}
            label="Email"
            value={official.email}
          />
          <DetailRow
            icon={MapPin}
            label="Location"
            value={OFFICE_LOCATION}
          />
          <DetailRow
            icon={Clock}
            label="Office Hours"
            value={official.hours}
          />
        </div>
      </SkeletonCard>

      {/* Committees */}
      <SkeletonCard className="mt-6">
        <CardTitle icon={Users} title="Committees &amp; Portfolios" />
        <div className="mt-4 flex flex-wrap gap-3">
          {official.committees.map((c) => (
            <span
              key={c}
              className="rounded-full border border-slate-200/60 bg-slate-100 px-4 py-1.5 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
            >
              {c}
            </span>
          ))}
        </div>
      </SkeletonCard>

      {/* About */}
      <SkeletonCard className="mt-6">
        <CardTitle icon={FileText} title="About the Office" />
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {official.bio}
        </p>
      </SkeletonCard>

      {/* Quick actions */}
      <SkeletonCard className="mt-6">
        <CardTitle icon={MessageCircle} title="Quick Actions" />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <ActionButton
            href={`tel:${official.contact.replace(/\s/g, "")}`}
            label="Call"
            icon={Phone}
          />
          <ActionButton
            href={`mailto:${official.email}`}
            label="Email"
            icon={Mail}
          />
          <ActionButton
            href={`sms:${official.contact.replace(/\s/g, "")}`}
            label="Message"
            icon={MessageCircle}
          />
          <ActionButton
            href="/officials/directory"
            label="Directory"
            icon={Users}
          />
        </div>
      </SkeletonCard>

      {/* Sign out */}
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
    </main>
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
        <p className="mt-0.5 truncate text-sm font-medium text-slate-600 dark:text-slate-300">
          {value}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Quick action                                                       */
/* ------------------------------------------------------------------ */

function ActionButton({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center justify-center gap-2 rounded-xl border border-slate-200/60 bg-slate-50/80 px-3 py-3 text-sm font-medium text-slate-600 transition-colors",
        rowHover,
        "hover:bg-slate-200/70 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300 dark:hover:bg-slate-800/60",
      )}
    >
      <Icon className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" aria-hidden />
      <span className="truncate">{label}</span>
    </Link>
  );
}
