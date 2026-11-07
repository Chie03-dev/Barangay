"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Shield,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn, glass } from "@/lib/utils";
import {
  Skeleton,
  SkeletonCard,
  SkeletonCircle,
  SkeletonHeading,
} from "@/components/Skeleton";
import { useAsyncData } from "@/hooks/useAsyncData";
import { findOfficial, type Official, initials } from "@/lib/officials";

/* ------------------------------------------------------------------ */
/*  Style tokens                                                       */
/* ------------------------------------------------------------------ */

const TIER_LABEL: Record<Official["tier"], string> = {
  captain: "Punong Barangay",
  councilors: "Sangguniang Barangay",
  staff: "Appointed Official",
};

const TIER_TINT: Record<Official["tier"], string> = {
  captain:
    "border border-amber-500/20 bg-amber-50/60 text-amber-700 uppercase tracking-wide dark:border-amber-500/10 dark:bg-amber-900/10 dark:text-amber-400",
  councilors:
    "border border-emerald-500/20 bg-emerald-50/60 text-emerald-700 uppercase tracking-wide dark:border-emerald-500/10 dark:bg-emerald-900/10 dark:text-emerald-400",
  staff:
    "border border-blue-500/20 bg-blue-50/60 text-blue-700 uppercase tracking-wide dark:border-blue-500/10 dark:bg-blue-900/10 dark:text-blue-400",
};

const rowHover = "transition-colors hover:bg-slate-200/50 dark:hover:bg-slate-800/40";

const OFFICE_LOCATION = "Barangay Hall, Main Avenue";

/* ------------------------------------------------------------------ */
/*  Loading state                                                      */
/* ------------------------------------------------------------------ */

export function ProfileSkeleton() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 pb-32" id="main-content">
      <div className="mb-8 flex items-center gap-2">
        <ArrowLeft className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
        <Skeleton className="h-6 w-24" />
      </div>
      <SkeletonCard className="mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8">
          <div className="lg:col-span-4 flex items-center">
            <SkeletonCircle className="h-48 w-48 sm:h-56 sm:w-56" />
          </div>
          <div className="lg:col-span-8 space-y-3">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3.5 w-1/2" />
            <Skeleton className="h-4 w-2/3 sm:w-1/2" />
          </div>
        </div>
      </SkeletonCard>
      <section className={cn(glass, "p-6 sm:p-8")}>
        <SkeletonHeading />
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-12 w-full sm:w-48" />
          <Skeleton className="h-12 w-full sm:w-48" />
          <Skeleton className="h-12 w-full sm:w-48" />
          <Skeleton className="h-12 w-full sm:w-48" />
        </div>
      </section>
      <section className={cn(glass, "p-6 sm:p-8")}>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10 w-full sm:w-3/4" />
          ))}
        </div>
      </section>
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

  // Falls back to the Punong Barangay when no `id` (or an unknown one) is given.
  const { isLoading, data: official } = useAsyncData(
    () => findOfficial(queryId),
    { delay: 600, deps: [queryId] },
  );

  const goBack = useCallback(() => router.push("/officials/directory"), [
    router,
  ]);

  const [photoFailed, setPhotoFailed] = useState(false);

  if (isLoading || !official) return <ProfileSkeleton />;

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 pb-32" id="main-content">
      <button
        type="button"
        onClick={goBack}
        className="mb-8 inline-flex items-center gap-2 rounded-lg border border-slate-200/60 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200/70 dark:border-slate-800/60 dark:bg-slate-800/40 dark:text-slate-300 dark:hover:bg-slate-800/60 sm:mb-10"
      >
        <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
        Back to directory
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-8"
      >
        {/* Hero: portrait, name, role, bio */}
        <article className={cn(glass, "p-6 sm:p-8")}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 flex flex-col items-center lg:items-start">
              <div className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 h-48 w-48 sm:h-56 sm:w-56 mb-4 sm:mb-0 lg:mb-6">
                {photoFailed ? (
                  <span className="text-3xl font-bold text-slate-500 dark:text-slate-400">
                    {initials(official.name)}
                  </span>
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
              <p className="text-sm text-center text-slate-500 dark:text-slate-400 lg:text-left">
                {official.hours}
              </p>
            </div>
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center gap-3">
                <span className={TIER_TINT[official.tier]}>
                  {TIER_LABEL[official.tier]}
                </span>
                {official.tenure && (
                  <span className="h-9 flex items-center gap-1.5 rounded-lg border border-slate-200/60 bg-slate-100/60 px-3 text-xs font-medium text-slate-500 dark:border-slate-800/60 dark:bg-slate-800/30 dark:text-slate-400">
                    <Clock className="h-3 w-3 shrink-0" aria-hidden />
                    Term {official.tenure}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {official.name}
              </h1>
              <h2 className="mt-1 text-lg font-medium text-emerald-600 dark:text-emerald-400">
                {official.role}
              </h2>
              <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed sm:text-lg">
                {official.bio}
              </p>
            </div>
          </div>
        </article>

        {/* Committees & portfolios */}
        <section className={cn(glass, "p-6 sm:p-8")}>
          <div className="mb-4 flex items-center gap-2">
            <Users className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Committees &amp; portfolios
            </h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {official.committees.map((c) => (
              <span
                key={c}
                className="rounded-full border border-slate-200/60 bg-slate-100 px-4 py-1.5 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
              >
                {c}
              </span>
            ))}
          </div>
        </section>

        {/* Office contact */}
        <section className={cn(glass, "p-6 sm:p-8")}>
          <div className="mb-4 flex items-center gap-2">
            <Shield className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Office contact
            </h3>
          </div>
          <dl className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            <ContactRow
              icon={Phone}
              label="Mobile"
              value={official.contact}
              href={`tel:${official.contact.replace(/\s/g, "")}`}
            />
            <ContactRow
              icon={Mail}
              label="Email"
              value={official.email}
              href={`mailto:${official.email}`}
            />
            <ContactRow
              icon={MapPin}
              label="Location"
              value={OFFICE_LOCATION}
            />
            <ContactRow icon={Clock} label="Office hours" value={official.hours} />
          </dl>
        </section>

        {/* Quick actions */}
        <section className={cn(glass, "p-6 sm:p-8")}>
          <div className="mb-4 flex items-center gap-2">
            <MessageCircle className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Quick actions
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <ActionButton
              href={`tel:${official.contact.replace(/\s/g, "")}`}
              label="Call office"
              icon={Phone}
            />
            <ActionButton
              href={`mailto:${official.email}`}
              label="Send email"
              icon={Mail}
            />
            <ActionButton
              href={`sms:${official.contact.replace(/\s/g, "")}`}
              label="Send message"
              icon={MessageCircle}
            />
            <ActionButton
              href="/officials/directory"
              label="View directory"
              icon={Users}
            />
          </div>
        </section>

        {/* Services handled */}
        <section className={cn(glass, "p-6 sm:p-8")}>
          <div className="mb-4 flex items-center gap-2">
            <FileText className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Services handled
            </h3>
          </div>
          <div className="grid gap-3">
            {official.services.map((service) => (
              <div key={service} className={cn(glass, "flex items-center justify-between p-4")}>
                <span className="text-sm font-medium">{service}</span>
                <span className="rounded-full border border-emerald-500/20 bg-emerald-50/60 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:border-emerald-500/10 dark:bg-emerald-900/10 dark:text-emerald-400">
                  Available
                  <CheckCircle2 className="ml-1.5 h-3 w-3 shrink-0" aria-hidden />
                </span>
              </div>
            ))}
          </div>
        </section>
      </motion.div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  Contact row                                                        */
/* ------------------------------------------------------------------ */

function ContactRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3 rounded-xl px-3 py-3 border border-transparent", rowHover)}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
        {href ? (
          <a
            href={href}
            className="mt-0.5 block truncate text-sm font-medium text-slate-600 underline underline-offset-4 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400"
          >
            {value}
          </a>
        ) : (
          <p className="mt-0.5 truncate text-sm font-medium text-slate-600 dark:text-slate-300">
            {value}
          </p>
        )}
      </div>
      {href && (
        <ChevronRight className="shrink-0 text-slate-400 h-4 w-4 motion-safe:transition-transform hover:motion-safe:translate-x-0.5" aria-hidden />
      )}
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
