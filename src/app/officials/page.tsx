"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Shield,
  Users,
  FileText,
  FileCheck,
  AlertCircle,
  Clock,
  CheckCircle2,
  ChevronRight,
  Search,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn, glass } from "@/lib/utils";
import {
  Skeleton,
  SkeletonCard,
  SkeletonCircle,
  SkeletonHeading,
} from "@/components/Skeleton";
import { type DocumentData, type DocumentType } from "@/lib/document-generator";

/* ------------------------------------------------------------------ */
/*  Mock data — resident-created forms the barangay office acts on    */
/* ------------------------------------------------------------------ */

type SubmissionStatus = "pending" | "review" | "approved" | "rejected";

type ResidentForm = {
  id: string;
  reference: string;
  resident: string;
  address: string;
  type: string;
  status: SubmissionStatus;
  createdAt: string;
  purpose?: string;
  notes?: string;
};

const RESIDENT_FORMS: ResidentForm[] = [
  {
    id: "sub-101",
    reference: "BRGY-2026-0142",
    resident: "Liza D. Reyes",
    address: "Purok 1, Rizal St.",
    type: "Barangay Clearance",
    status: "pending",
    createdAt: "2 hours ago",
    purpose: "Employment",
    notes: "First-time job applicant; cedula on file.",
  },
  {
    id: "sub-102",
    reference: "BRGY-2026-0141",
    resident: "Arnold B. Cruz",
    address: "Purok 3, Mabini St.",
    type: "Certificate of Indigency",
    status: "review",
    createdAt: "5 hours ago",
    purpose: "Scholarship application",
    notes: "Income certification needed from employer.",
  },
  {
    id: "sub-103",
    reference: "BRGY-2026-0140",
    resident: "Mara S. Villanueva",
    address: "Purok 2, Bonifacio St.",
    type: "Certificate of Residency",
    status: "approved",
    createdAt: "Yesterday",
    purpose: "Passport application",
    notes: "Ready for release at Window 2.",
  },
  {
    id: "sub-104",
    reference: "BRGY-2026-0139",
    resident: "Dexter L. Manalo",
    address: "Purok 4, Aguinaldo St.",
    type: "Incident / Blotter Report",
    status: "pending",
    createdAt: "Yesterday",
    purpose: "Lost wallet report",
    notes: "Blotter log updated; waiting on blotter signature.",
  },
  {
    id: "sub-105",
    reference: "BRGY-2026-0138",
    resident: "Carla M. Dimaculangan",
    address: "Purok 1, Rizal St.",
    type: "Business Permit (New)",
    status: "rejected",
    createdAt: "Oct 20, 2026",
    purpose: "Sari-sari store",
    notes: "Requires barangay business clearance first.",
  },
  {
    id: "sub-106",
    reference: "BRGY-2026-0137",
    resident: "Benjie R. Ocampo",
    address: "Purok 5, Del Pilar St.",
    type: "Barangay Clearance",
    status: "pending",
    createdAt: "Oct 19, 2026",
    purpose: "NBI clearance",
    notes: "Pending police clearance cross-check.",
  },
];

const STATUS_LABEL: Record<SubmissionStatus, string> = {
  pending: "Pending",
  review: "Under Review",
  approved: "Approved",
  rejected: "Rejected",
};

const STATUS_CLASS: Record<SubmissionStatus, string> = {
  pending:
    "border border-amber-200/50 bg-amber-50/60 text-amber-700 dark:border-amber-800/30 dark:bg-amber-900/20 dark:text-amber-400",
  review:
    "border border-blue-200/50 bg-blue-50/60 text-blue-700 dark:border-blue-800/30 dark:bg-blue-900/20 dark:text-blue-400",
  approved:
    "border border-emerald-200/50 bg-emerald-50/60 text-emerald-700 dark:border-emerald-800/30 dark:bg-emerald-900/20 dark:text-emerald-400",
  rejected:
    "border border-rose-200/50 bg-rose-50/60 text-rose-700 dark:border-rose-800/30 dark:bg-rose-900/20 dark:text-rose-400",
};

const STATUS_ICON: Record<SubmissionStatus, LucideIcon> = {
  pending: Clock,
  review: Shield,
  approved: CheckCircle2,
  rejected: AlertCircle,
};

const DOCUMENT_TYPE_MAP: Record<string, DocumentType | null> = {
  "Barangay Clearance": "clearance",
  "Certificate of Indigency": "indigency",
  "Certificate of Residency": "residency",
  "Business Permit (New)": "business",
};

const FILTERS: { key: SubmissionStatus | "all"; label: string }[] = [
  { key: "all", label: "All submissions" },
  { key: "pending", label: "Pending" },
  { key: "review", label: "Under review" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

const QUICK_ACTIONS: {
  label: string;
  desc: string;
  icon: LucideIcon;
  href?: string;
  onClick?: () => void;
  glow: "emerald" | "amber" | "blue" | "violet";
}[] = [
  {
    label: "Review Pending Forms",
    desc: "Submissions awaiting your action",
    icon: Shield,
    onClick: () => {},
    glow: "amber",
  },
  {
    label: "Issue Certificate",
    desc: "Clearances, indigency, residency",
    icon: FileCheck,
    onClick: () => {
      const el = document.getElementById("submissions");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    },
    glow: "emerald",
  },
  {
    label: "Broadcast Announcement",
    desc: "Purok advisories and alerts",
    icon: AlertCircle,
    onClick: () => {},
    glow: "blue",
  },
  {
    label: "Officials Directory",
    desc: "Council and staff contacts",
    icon: Users,
    href: "/officials/directory",
    glow: "violet",
  },
];

/* ------------------------------------------------------------------ */
/*  Dashboard                                                         */
/* ------------------------------------------------------------------ */

export default function OfficialsDashboard() {
  const hour = new Date().getHours();
  const submissionsRef = useRef<HTMLDivElement>(null);

  const [forms, setForms] = useState<ResidentForm[]>([]);
  const [filter, setFilter] = useState<SubmissionStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [detail, setDetail] = useState<ResidentForm | null>(null);
  const [confirm, setConfirm] = useState<{
    submission: ResidentForm;
    action: "approve" | "reject";
  } | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);
  const [toast, setToast] = useState<{ title: string; message: string } | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  // Simulate fetching resident-created forms from the backend.
  useEffect(() => {
    const id = setTimeout(() => {
      setForms(RESIDENT_FORMS);
      setLoading(false);
    }, 600);
    return () => clearTimeout(id);
  }, []);

  const filtered = useMemo(() => {
    return forms.filter((f) => {
      const matchFilter = filter === "all" || f.status === filter;
      const q = query.toLowerCase();
      const matchQuery =
        !q ||
        f.reference.toLowerCase().includes(q) ||
        f.resident.toLowerCase().includes(q) ||
        f.type.toLowerCase().includes(q) ||
        f.address.toLowerCase().includes(q);
      return matchFilter && matchQuery;
    });
  }, [forms, filter, query]);

  const stats = useMemo(() => {
    return {
      pending: forms.filter((f) => f.status === "pending").length,
      review: forms.filter((f) => f.status === "review").length,
      approved: forms.filter((f) => f.status === "approved").length,
      total: forms.length,
    };
  }, [forms]);

  const showToast = useCallback((title: string, message: string) => {
    setToast({ title, message });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const handleApprove = useCallback(
    (submission: ResidentForm) => setConfirm({ submission, action: "approve" }),
    []
  );

  const handleReject = useCallback(
    (submission: ResidentForm) => setConfirm({ submission, action: "reject" }),
    []
  );

  const handleConfirm = useCallback(() => {
    if (!confirm) return;
    const { submission, action } = confirm;
    setProcessing(submission.id);
    setTimeout(() => {
      setForms((current) =>
        current.map((f) =>
          f.id === submission.id
            ? { ...f, status: action === "approve" ? "approved" : "rejected" }
            : f
        )
      );
      setToast(
        action === "approve"
          ? { title: "Form approved", message: `${submission.reference} is ready for release.` }
          : { title: "Form rejected", message: `${submission.reference} has been declined.` }
      );
      setConfirm(null);
      setProcessing(null);
    }, 700);
  }, [confirm]);

  const handleCancel = useCallback(() => setConfirm(null), []);

  const handleStatusAction = useCallback((submission: ResidentForm) => {
    setProcessing(submission.id);
    setTimeout(() => {
      setForms((current) =>
        current.map((f) =>
          f.id === submission.id && f.status === "rejected"
            ? { ...f, status: "pending" }
            : f
        )
      );
      setToast({
        title: "Status updated",
        message: `${submission.reference} marked as ${
          submission.status === "approved"
            ? "released for pick-up"
            : submission.status === "rejected"
            ? "re-opened for review"
            : "under review"
        }.`,
      });
      setProcessing(null);
      setDetail(null);
    }, 600);
  }, []);

  const handlePrintDocument = useCallback(
    (submission: ResidentForm) => {
      const docType = DOCUMENT_TYPE_MAP[submission.type];
      if (!docType) return;
      setProcessing(submission.id);
      try {
        const params = new URLSearchParams({
          reference: submission.reference,
          type: docType,
          residentName: submission.resident,
          residentAddress: submission.address,
          issuedDate: submission.createdAt,
          purpose: submission.purpose ?? "",
          remarks: submission.notes ?? "",
          hasId: "false",
        });
        const win = window.open(`/documents/print?${params.toString()}`, "_blank");
        if (win) win.focus();
      } finally {
        setProcessing(null);
      }
    },
    []
  );

  const dismissToast = useCallback(() => setToast(null), []);

  if (loading) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 pb-32">
        <div className="mb-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} className="h-24">
              <SkeletonHeading />
            </SkeletonCard>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 pb-32" id="main-content">
      {/* Hero banner */}
      <section className={cn(glass, "relative overflow-hidden p-8 mb-6")}>
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl"
        />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
              <Shield className="h-3.5 w-3.5" aria-hidden />
              Officials Portal
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Officials Dashboard
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Review resident-created forms and act on them from one place.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Shield className="h-7 w-7" aria-hidden />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Punong Barangay
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Marben Clyde Maglangit
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Clock}
          label="Pending submissions"
          value={stats.pending}
          hint="Awaiting your action"
          glow="amber"
        />
        <StatCard
          icon={Shield}
          label="Under review"
          value={stats.review}
          hint="Being evaluated"
          glow="blue"
        />
        <StatCard
          icon={CheckCircle2}
          label="Approved"
          value={stats.approved}
          hint="Ready for release"
          glow="emerald"
        />
        <StatCard
          icon={FileText}
          label="Total filed"
          value={stats.total}
          hint="Resident-created forms"
          glow="violet"
        />
      </div>

      {/* Quick actions */}
      <section className={cn(glass, "p-5 mt-6")}>
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Quick actions
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {QUICK_ACTIONS.map((action) => {
              const GLOW: Record<string, string> = {
                emerald:
                  "bg-emerald-50/60 text-emerald-700 border-emerald-200/50 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30",
                amber:
                  "bg-amber-50/60 text-amber-700 border-amber-200/50 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30",
                blue:
                  "bg-blue-50/60 text-blue-700 border-blue-200/50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30",
                violet:
                  "bg-violet-50/60 text-violet-700 border-violet-200/50 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-800/30",
              };
              return (
                <Link
                  key={action.label}
                  href={action.href ?? "#"}
                  onClick={action.onClick ? (e) => { e.preventDefault(); action.onClick?.(); } : undefined}
                  className={cn(
                    glass,
                    "group relative flex flex-col gap-2 rounded-xl p-4",
                    GLOW[action.glow],
                    "hover:border-slate-300/60 dark:hover:border-slate-700/60 transition-colors",
                    action.href ? "" : "cursor-pointer"
                  )}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/60 text-slate-600 dark:bg-white/10 dark:text-slate-400 group-hover:bg-emerald-50 dark:group-hover:bg-slate-800/40 transition-colors">
                    <action.icon className="h-5 w-5 shrink-0" aria-hidden />
                  </div>
                  <h3 className="text-sm font-semibold">{action.label}</h3>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{action.desc}</p>
                  {action.href && (
                    <ChevronRight className="mt-auto h-4 w-4 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" aria-hidden />
                  )}
                </Link>
              );
            })}
          </div>
        </section>

        {/* Resident-created submissions */}
        <section
          ref={submissionsRef}
          className={cn(glass, "mt-6 flex flex-col gap-4 p-6")}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
              <div>
                <h2 className="text-base font-semibold">Resident submissions</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Forms filed by residents through the portal, awaiting your review.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <Search className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
              <input
                type="search"
                placeholder="Search reference, resident, or form type…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full lg:w-64 h-9 rounded-lg border border-slate-300 bg-transparent px-3 text-sm outline-none transition-colors focus:border-emerald-500 dark:border-slate-700 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-emerald-400"
              />
            </div>
            <div className="flex gap-1 overflow-x-auto no-scrollbar">
              {FILTERS.map((f) => {
                const active = filter === f.key;
                return (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setFilter(f.key)}
                    className={cn(
                      "shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors hover:opacity-80",
                      active
                        ? "border-emerald-500 bg-emerald-50/60 text-emerald-700 dark:border-emerald-400 dark:bg-emerald-900/20 dark:text-emerald-400"
                        : "border-slate-300 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                    )}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.length === 0 ? (
              <div className={cn(glass, "col-span-full rounded-3xl p-12 text-center")}>
                <AlertCircle className="mx-auto h-8 w-8 text-slate-400" aria-hidden />
                <h3 className="mt-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
                  No submissions found
                </h3>
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                  Try clearing your search or status filter.
                </p>
              </div>
            ) : (
              filtered.map((submission) => (
                <SubmissionCard
                  key={submission.id}
                  submission={submission}
                  processing={processing === submission.id}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onOpen={setDetail}
                />
              ))
            )}
          </div>
        </section>

      {/* Submission detail dialog */}
      <AnimatePresence>
        {detail && (
            <SubmissionDialog
              submission={detail}
              onClose={() => setDetail(null)}
              onApprove={handleApprove}
              onReject={handleReject}
              onStatusChange={handleStatusAction}
              onPrint={handlePrintDocument}
              processing={processing === detail.id}
            />
        )}
      </AnimatePresence>

      {/* Approve / reject confirmation dialog */}
      <AnimatePresence>
        {confirm && (
          <ConfirmDialog
            submission={confirm.submission}
            action={confirm.action}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            processing={processing === confirm.submission.id}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border bg-white/90 p-4 shadow-xl dark:border-slate-700 dark:bg-slate-900/90 backdrop-blur-sm"
        >
          <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden />
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {toast.title}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {toast.message}
            </p>
          </div>
          <button
            type="button"
            onClick={dismissToast}
            className="rounded-sm p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </motion.div>
      )}
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  Stat card                                                         */
/* ------------------------------------------------------------------ */

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  glow,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  hint: string;
  glow: "emerald" | "amber" | "blue" | "violet";
}) {
  const GLOW: Record<string, string> = {
    emerald:
      "text-emerald-600 dark:text-emerald-400 bg-emerald-50/60 border-emerald-200/50 dark:bg-emerald-900/20 dark:border-emerald-800/30",
    amber:
      "text-amber-600 dark:text-amber-400 bg-amber-50/60 border-amber-200/50 dark:bg-amber-900/20 dark:border-amber-800/30",
    blue:
      "text-blue-600 dark:text-blue-400 bg-blue-50/60 border-blue-200/50 dark:bg-blue-900/20 dark:border-blue-800/30",
    violet:
      "text-violet-600 dark:text-violet-400 bg-violet-50/60 border-violet-200/50 dark:bg-violet-900/20 dark:border-violet-800/30",
  };
  return (
    <div className={cn(glass, "p-5")}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
          <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{hint}</p>
        </div>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl border", GLOW[glow])}>
          <Icon className="h-5 w-5 shrink-0" aria-hidden />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Submission card                                                   */
/* ------------------------------------------------------------------ */

function SubmissionCard({
  submission,
  processing,
  onApprove,
  onReject,
  onOpen,
}: {
  submission: ResidentForm;
  processing: boolean;
  onApprove: (s: ResidentForm) => void;
  onReject: (s: ResidentForm) => void;
  onOpen: (s: ResidentForm) => void;
}) {
  const StatusIcon = STATUS_ICON[submission.status];
  const isPending = submission.status === "pending";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        glass,
        "group relative flex flex-col rounded-2xl border border-slate-200/60 p-5 transition-all duration-300 hover:shadow-xl dark:border-slate-800/60",
      )}
    >
      {/* Header: reference + status */}
      <div className="flex items-center justify-between gap-3">
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold tabular-nums",
            "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
          )}
        >
          {submission.reference}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
            STATUS_CLASS[submission.status],
          )}
        >
          <StatusIcon className="h-3 w-3 shrink-0" aria-hidden />
          {STATUS_LABEL[submission.status]}
        </span>
      </div>

      {/* Body */}
      <div className="mt-3 flex-1">
        <h3 className="text-base font-semibold leading-snug">
          {submission.type}
        </h3>
        <div className="mt-2 space-y-1">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {submission.resident}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {submission.address}
          </p>
          {submission.purpose && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium text-slate-400">Purpose: </span>
              {submission.purpose}
            </p>
          )}
        </div>
      </div>

      {/* Footer actions */}
      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onOpen(submission)}
          disabled={processing}
          className={cn(
            "flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200/70 px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-60 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800",
          )}
        >
          <ChevronRight className="h-4 w-4" aria-hidden />
          Details
        </button>
        {isPending ? (
          <>
            <button
              type="button"
              onClick={() => onApprove(submission)}
              disabled={processing}
              className={cn(
                "flex h-9 items-center justify-center gap-1.5 rounded-lg bg-amber-600 px-3 text-xs font-semibold text-white shadow-lg shadow-amber-600/25 transition-colors disabled:opacity-70 disabled:cursor-not-allowed hover:bg-amber-500",
              )}
            >
              {processing ? "…" : "Approve"}
            </button>
            <button
              type="button"
              onClick={() => onReject(submission)}
              disabled={processing}
              className={cn(
                "flex h-9 items-center justify-center gap-1.5 rounded-lg border border-rose-200/60 bg-rose-50/60 px-3 text-xs font-semibold text-rose-700 transition-colors disabled:opacity-60 hover:bg-rose-100 dark:hover:bg-rose-900/20",
              )}
            >
              Reject
            </button>
          </>
        ) : (
          <span className="ml-auto text-xs text-slate-400 dark:text-slate-500">
            {submission.createdAt}
          </span>
        )}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Submission detail dialog                                          */
/* ------------------------------------------------------------------ */

function SubmissionDialog({
  submission,
  onClose,
  onApprove,
  onReject,
  onStatusChange,
  onPrint,
  processing,
}: {
  submission: ResidentForm;
  onClose: () => void;
  onApprove: (s: ResidentForm) => void;
  onReject: (s: ResidentForm) => void;
  onStatusChange: (s: ResidentForm) => void;
  onPrint: (s: ResidentForm) => void;
  processing: boolean;
}) {
  const StatusIcon = STATUS_ICON[submission.status];
  const isPending = submission.status === "pending";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm dark:bg-slate-900/80"
          onClick={(e) => e.stopPropagation()}
        />
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md rounded-2xl border border-slate-200/60 bg-slate-50 shadow-2xl dark:border-slate-800/60 dark:bg-slate-900 overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-start gap-3">
              <StatusIcon className="h-5 w-5 shrink-0 text-slate-500 dark:text-slate-400" aria-hidden />
              <div className="flex-1">
                <h2 className="text-lg font-bold">{submission.type}</h2>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Reference {submission.reference} · {STATUS_LABEL[submission.status]}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                aria-label="Close details"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Resident
                </p>
                <p className="mt-0.5 text-sm font-semibold">{submission.resident}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Address
                </p>
                <p className="mt-0.5 text-sm">{submission.address}</p>
              </div>
              {submission.purpose && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Purpose
                  </p>
                  <p className="mt-0.5 text-sm">{submission.purpose}</p>
                </div>
              )}
              {submission.notes && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Office notes
                  </p>
                  <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
                    {submission.notes}
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Received
                </p>
                <p className="mt-0.5 text-sm">{submission.createdAt}</p>
              </div>
            </div>
            <div className="mt-8 flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-10 rounded-lg border border-slate-300 text-sm font-medium transition-colors hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                Close
              </button>
              {isPending ? (
                <>
                  <button
                    type="button"
                    onClick={() => onReject(submission)}
                    disabled={processing}
                    className={cn(
                      "flex-1 h-10 rounded-lg border border-rose-200/60 bg-rose-50/60 text-xs font-semibold text-rose-700 transition-colors disabled:opacity-60 hover:bg-rose-100 dark:hover:bg-rose-900/20"
                    )}
                  >
                    {processing ? "Rejecting…" : "Reject"}
                  </button>
                  <button
                    type="button"
                    onClick={() => onApprove(submission)}
                    disabled={processing}
                    className={cn(
                      "flex-1 h-10 rounded-lg bg-amber-600 text-xs font-semibold text-white shadow-lg shadow-amber-600/25 transition-colors disabled:opacity-70 disabled:cursor-not-allowed hover:bg-amber-500"
                    )}
                  >
                    {processing ? "Approving…" : "Approve"}
                  </button>
                </>
              ) : submission.status === "approved" ? (
                <>
                  <button
                    type="button"
                    onClick={() => onPrint(submission)}
                    disabled={processing}
                    className={cn(
                      "flex-1 h-10 rounded-lg border border-emerald-200/60 bg-emerald-50/60 text-xs font-semibold text-emerald-700 transition-colors disabled:opacity-60 hover:bg-emerald-100 dark:hover:bg-emerald-900/20"
                    )}
                  >
                    {processing ? "Printing…" : "Print Document"}
                  </button>
                  <button
                    type="button"
                    onClick={() => onStatusChange(submission)}
                    disabled={processing}
                    className={cn(
                      "flex-1 h-10 rounded-lg border border-emerald-200/60 bg-emerald-50/60 text-xs font-semibold text-emerald-700 transition-colors disabled:opacity-60 hover:bg-emerald-100 dark:hover:bg-emerald-900/20"
                    )}
                  >
                    {processing ? "Releasing…" : "Mark released"}
                  </button>
                </>
              ) : submission.status === "rejected" ? (
                <button
                  type="button"
                  onClick={() => onStatusChange(submission)}
                  disabled={processing}
                  className={cn(
                    "flex-1 h-10 rounded-lg border border-amber-200/60 bg-amber-50/60 text-xs font-semibold text-amber-700 transition-colors disabled:opacity-60 hover:bg-amber-100 dark:hover:bg-amber-900/20"
                  )}
                >
                  {processing ? "Re-opening…" : "Re-open for review"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onStatusChange(submission)}
                  disabled={processing}
                  className={cn(
                    "flex-1 h-10 rounded-lg border border-blue-200/60 bg-blue-50/60 text-xs font-semibold text-blue-700 transition-colors disabled:opacity-60 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                  )}
                >
                  {processing ? "Saving…" : "Add review notes"}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/*  Approve / reject confirmation dialog                              */
/* ------------------------------------------------------------------ */

function ConfirmDialog({
  submission,
  action,
  onConfirm,
  onCancel,
  processing,
}: {
  submission: ResidentForm;
  action: "approve" | "reject";
  onConfirm: () => void;
  onCancel: () => void;
  processing: boolean;
}) {
  const isApprove = action === "approve";
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onCancel}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm dark:bg-slate-900/80"
          onClick={(e) => e.stopPropagation()}
        />
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md rounded-2xl border border-slate-200/60 bg-slate-50 shadow-2xl dark:border-slate-800/60 dark:bg-slate-900 overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 shrink-0 text-slate-500 dark:text-slate-400" aria-hidden />
              <div className="flex-1">
                <h2 className="text-lg font-bold">
                  {isApprove ? "Approve this form?" : "Reject this form?"}
                </h2>
                <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
                  {submission.reference} — {submission.resident} ({submission.type})
                </p>
              </div>
              <button
                type="button"
                onClick={onCancel}
                className="shrink-0 rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                aria-label="Close"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>
            {submission.notes && (
              <div className="mt-6 rounded-xl border border-slate-200 bg-amber-50/50 p-4 text-sm dark:border-slate-800 dark:bg-amber-900/10">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
                  Office notes
                </p>
                <p className="mt-1">{submission.notes}</p>
              </div>
            )}
            <div className="mt-8 flex gap-2">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 h-10 rounded-lg border border-slate-300 text-sm font-medium transition-colors hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={processing}
                className={cn(
                  "flex-1 h-10 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-70 disabled:cursor-not-allowed",
                  isApprove
                    ? "bg-amber-600 shadow-lg shadow-amber-600/25 hover:bg-amber-500"
                    : "bg-rose-600 shadow-lg shadow-rose-600/25 hover:bg-rose-500"
                )}
              >
                {processing
                  ? isApprove
                    ? "Approving…"
                    : "Rejecting…"
                  : isApprove
                    ? "Approve"
                    : "Reject"}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}