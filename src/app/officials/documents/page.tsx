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
  Download,
  Printer,
  type LucideIcon,
} from "lucide-react";
import { cn, glass } from "@/lib/utils";
import {
  Skeleton,
  SkeletonCard,
  SkeletonCircle,
  SkeletonHeading,
} from "@/components/Skeleton";
import {
  generateDocument,
  type DocumentData,
  type DocumentType,
  type Format,
} from "@/lib/document-generator";

/* ------------------------------------------------------------------ */
/*  Mock data — resident-created document requests                    */
/* ------------------------------------------------------------------ */

type RequestStatus = "pending" | "review" | "approved" | "rejected";

type DocumentRequest = {
  id: string;
  reference: string;
  resident: string;
  address: string;
  document: string;
  type: string;
  status: RequestStatus;
  createdAt: string;
  purpose?: string;
  notes?: string;
  window?: string;
};

const DOCUMENT_REQUESTS: DocumentRequest[] = [
  {
    id: "req-101",
    reference: "BRGY-2026-8942",
    resident: "Liza D. Reyes",
    address: "Purok 1, Rizal St.",
    document: "Barangay Clearance",
    type: "Barangay Clearance",
    status: "approved",
    createdAt: "2 hours ago",
    purpose: "Employment",
    notes: "First-time job applicant; cedula on file.",
    window: "Window 2",
  },
  {
    id: "req-102",
    reference: "BRGY-2026-4102",
    resident: "Arnold B. Cruz",
    address: "Purok 3, Mabini St.",
    document: "Certificate of Indigency",
    type: "Certificate of Indigency",
    status: "review",
    createdAt: "5 hours ago",
    purpose: "Scholarship application",
    notes: "Income certification needed from employer.",
    window: "Window 1",
  },
  {
    id: "req-103",
    reference: "BRGY-2026-1089",
    resident: "Mara S. Villanueva",
    address: "Purok 2, Bonifacio St.",
    document: "Certificate of Residency",
    type: "Certificate of Residency",
    status: "approved",
    createdAt: "Yesterday",
    purpose: "Passport application",
    notes: "Ready for release at Window 2.",
    window: "Window 2",
  },
  {
    id: "req-104",
    reference: "BRGY-2026-0139",
    resident: "Dexter L. Manalo",
    address: "Purok 4, Aguinaldo St.",
    document: "Incident / Blotter Report",
    type: "Incident / Blotter Report",
    status: "pending",
    createdAt: "Yesterday",
    purpose: "Lost wallet report",
    notes: "Blotter log updated; waiting on blotter signature.",
  },
  {
    id: "req-105",
    reference: "BRGY-2026-0138",
    resident: "Carla M. Dimaculangan",
    address: "Purok 1, Rizal St.",
    document: "Business Permit (New)",
    type: "Business Permit (New)",
    status: "rejected",
    createdAt: "Oct 20, 2026",
    purpose: "Sari-sari store",
    notes: "Requires barangay business clearance first.",
  },
  {
    id: "req-106",
    reference: "BRGY-2026-0137",
    resident: "Benjie R. Ocampo",
    address: "Purok 5, Del Pilar St.",
    document: "Barangay Clearance",
    type: "Barangay Clearance",
    status: "pending",
    createdAt: "Oct 19, 2026",
    purpose: "NBI clearance",
    notes: "Pending police clearance cross-check.",
  },
];

const STATUS_LABEL: Record<RequestStatus, string> = {
  pending: "Pending",
  review: "Under Review",
  approved: "Approved",
  rejected: "Rejected",
};

const STATUS_CLASS: Record<RequestStatus, string> = {
  pending:
    "border border-amber-200/50 bg-amber-50/60 text-amber-700 dark:border-amber-800/30 dark:bg-amber-900/20 dark:text-amber-400",
  review:
    "border border-blue-200/50 bg-blue-50/60 text-blue-700 dark:border-blue-800/30 dark:bg-blue-900/20 dark:text-blue-400",
  approved:
    "border border-emerald-200/50 bg-emerald-50/60 text-emerald-700 dark:border-emerald-800/30 dark:bg-emerald-900/20 dark:text-emerald-400",
  rejected:
    "border border-rose-200/50 bg-rose-50/60 text-rose-700 dark:border-rose-800/30 dark:bg-rose-900/20 dark:text-rose-400",
};

const STATUS_ICON: Record<RequestStatus, LucideIcon> = {
  pending: Clock,
  review: Shield,
  approved: CheckCircle2,
  rejected: AlertCircle,
};

const FILTERS: { key: RequestStatus | "all"; label: string }[] = [
  { key: "all", label: "All requests" },
  { key: "pending", label: "Pending" },
  { key: "review", label: "Under review" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

const DOCUMENT_TYPE_MAP: Record<string, DocumentType | null> = {
  "Barangay Clearance": "clearance",
  "Certificate of Indigency": "indigency",
  "Certificate of Residency": "residency",
  "Business Permit (New)": "business",
};

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function OfficialsDocumentsPage() {
  const submissionsRef = useRef<HTMLDivElement>(null);

  const [requests, setRequests] = useState<DocumentRequest[]>([]);
  const [filter, setFilter] = useState<RequestStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [detail, setDetail] = useState<DocumentRequest | null>(null);
  const [confirm, setConfirm] = useState<{
    submission: DocumentRequest;
    action: "approve" | "reject";
  } | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);
  const [toast, setToast] = useState<{ title: string; message: string } | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => {
      setRequests(DOCUMENT_REQUESTS);
      setLoading(false);
    }, 600);
    return () => clearTimeout(id);
  }, []);

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      const matchFilter = filter === "all" || r.status === filter;
      const q = query.toLowerCase();
      const matchQuery =
        !q ||
        r.reference.toLowerCase().includes(q) ||
        r.resident.toLowerCase().includes(q) ||
        r.document.toLowerCase().includes(q) ||
        r.address.toLowerCase().includes(q);
      return matchFilter && matchQuery;
    });
  }, [requests, filter, query]);

  const stats = useMemo(() => {
    return {
      pending: requests.filter((r) => r.status === "pending").length,
      review: requests.filter((r) => r.status === "review").length,
      approved: requests.filter((r) => r.status === "approved").length,
      total: requests.length,
    };
  }, [requests]);

  const showToast = useCallback((title: string, message: string) => {
    setToast({ title, message });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const handleApprove = useCallback(
    (submission: DocumentRequest) => setConfirm({ submission, action: "approve" }),
    []
  );

  const handleReject = useCallback(
    (submission: DocumentRequest) => setConfirm({ submission, action: "reject" }),
    []
  );

  const handleConfirm = useCallback(() => {
    if (!confirm) return;
    const { submission, action } = confirm;
    setProcessing(submission.id);
    setTimeout(() => {
      setRequests((current) =>
        current.map((r) =>
          r.id === submission.id
            ? { ...r, status: action === "approve" ? "approved" : "rejected" }
            : r
        )
      );
      setToast(
        action === "approve"
          ? { title: "Request approved", message: `${submission.reference} is ready for document release.` }
          : { title: "Request rejected", message: `${submission.reference} has been declined.` }
      );
      setConfirm(null);
      setProcessing(null);
    }, 700);
  }, [confirm]);

  const handleCancel = useCallback(() => setConfirm(null), []);

  const handleStatusAction = useCallback((submission: DocumentRequest) => {
    setProcessing(submission.id);
    setTimeout(() => {
      setRequests((current) =>
        current.map((r) =>
          r.id === submission.id && r.status === "rejected"
            ? { ...r, status: "pending" }
            : r
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
    async (submission: DocumentRequest) => {
      const docType = DOCUMENT_TYPE_MAP[submission.document];
      if (!docType) return;
      setProcessing(submission.id);
      try {
        const data: DocumentData = {
          reference: submission.reference,
          type: docType,
          residentName: submission.resident,
          residentAddress: submission.address,
          issuedDate: submission.createdAt,
          purpose: submission.purpose,
          remarks: submission.notes,
          hasId: false,
        };
        const blob = await generateDocument(data, "pdf");
        const url = URL.createObjectURL(blob);
        const win = window.open(url, "_blank");
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
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl"
        />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <FileText className="h-3.5 w-3.5" aria-hidden />
              Document Requests
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Resident Documents
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Review and print resident document requests from one place.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <FileText className="h-7 w-7" aria-hidden />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Clock}
          label="Pending requests"
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
          hint="Ready to print"
          glow="emerald"
        />
        <StatCard
          icon={FileText}
          label="Total requests"
          value={stats.total}
          hint="Resident document requests"
          glow="violet"
        />
      </div>

      {/* Document requests */}
      <section
        ref={submissionsRef}
        className={cn(glass, "mt-6 flex flex-col gap-4 p-6")}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
            <div>
              <h2 className="text-base font-semibold">Document requests</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Documents filed by residents through the portal.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <Search className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
            <input
              type="search"
              placeholder="Search reference, resident, or document type…"
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
                No requests found
              </h3>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                Try clearing your search or status filter.
              </p>
            </div>
          ) : (
            filtered.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                processing={processing === request.id}
                onApprove={handleApprove}
                onReject={handleReject}
                onOpen={setDetail}
                onPrint={handlePrintDocument}
              />
            ))
          )}
        </div>
      </section>

      {/* Request detail dialog */}
      <AnimatePresence>
        {detail && (
          <RequestDialog
            request={detail}
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
/*  Request card                                                      */
/* ------------------------------------------------------------------ */

function RequestCard({
  request,
  processing,
  onApprove,
  onReject,
  onOpen,
  onPrint,
}: {
  request: DocumentRequest;
  processing: boolean;
  onApprove: (s: DocumentRequest) => void;
  onReject: (s: DocumentRequest) => void;
  onOpen: (s: DocumentRequest) => void;
  onPrint: (s: DocumentRequest) => void;
}) {
  const StatusIcon = STATUS_ICON[request.status];
  const isPending = request.status === "pending";
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
          {request.reference}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
            STATUS_CLASS[request.status],
          )}
        >
          <StatusIcon className="h-3 w-3 shrink-0" aria-hidden />
          {STATUS_LABEL[request.status]}
        </span>
      </div>

      {/* Body */}
      <div className="mt-3 flex-1">
        <h3 className="text-base font-semibold leading-snug">{request.document}</h3>
        <div className="mt-2 space-y-1">
          <p className="text-sm text-slate-600 dark:text-slate-300">{request.resident}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{request.address}</p>
          {request.purpose && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium text-slate-400">Purpose: </span>
              {request.purpose}
            </p>
          )}
        </div>
      </div>

      {/* Footer actions */}
      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onOpen(request)}
          disabled={processing}
          className={cn(
            "flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200/70 px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-60 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800",
          )}
        >
          <ChevronRight className="h-4 w-4" aria-hidden />
          Details
        </button>
        {request.status === "approved" ? (
          <>
            <button
              type="button"
              onClick={() => onPrint(request)}
              disabled={processing}
              className={cn(
                "flex h-9 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-xs font-semibold text-white shadow-lg shadow-emerald-600/25 transition-colors disabled:opacity-70 disabled:cursor-not-allowed hover:bg-emerald-500",
              )}
            >
              {processing ? "…" : (
                <>
                  <Printer className="h-3.5 w-3.5" aria-hidden /> Print
                </>
              )}
            </button>
          </>
        ) : isPending ? (
          <>
            <button
              type="button"
              onClick={() => onApprove(request)}
              disabled={processing}
              className={cn(
                "flex h-9 items-center justify-center gap-1.5 rounded-lg bg-amber-600 px-3 text-xs font-semibold text-white shadow-lg shadow-amber-600/25 transition-colors disabled:opacity-70 disabled:cursor-not-allowed hover:bg-amber-500",
              )}
            >
              {processing ? "…" : "Approve"}
            </button>
            <button
              type="button"
              onClick={() => onReject(request)}
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
            {request.createdAt}
          </span>
        )}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Request detail dialog                                             */
/* ------------------------------------------------------------------ */

function RequestDialog({
  request,
  onClose,
  onApprove,
  onReject,
  onStatusChange,
  onPrint,
  processing,
}: {
  request: DocumentRequest;
  onClose: () => void;
  onApprove: (s: DocumentRequest) => void;
  onReject: (s: DocumentRequest) => void;
  onStatusChange: (s: DocumentRequest) => void;
  onPrint: (s: DocumentRequest) => void;
  processing: boolean;
}) {
  const StatusIcon = STATUS_ICON[request.status];
  const isPending = request.status === "pending";

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
                <h2 className="text-lg font-bold">{request.document}</h2>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Reference {request.reference} · {STATUS_LABEL[request.status]}
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
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Resident</p>
                <p className="mt-0.5 text-sm font-semibold">{request.resident}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Address</p>
                <p className="mt-0.5 text-sm">{request.address}</p>
              </div>
              {request.window && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Release Window</p>
                  <p className="mt-0.5 text-sm">{request.window}</p>
                </div>
              )}
              {request.purpose && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Purpose</p>
                  <p className="mt-0.5 text-sm">{request.purpose}</p>
                </div>
              )}
              {request.notes && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Office notes</p>
                  <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">{request.notes}</p>
                </div>
              )}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Received</p>
                <p className="mt-0.5 text-sm">{request.createdAt}</p>
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
                    onClick={() => onReject(request)}
                    disabled={processing}
                    className={cn(
                      "flex-1 h-10 rounded-lg border border-rose-200/60 bg-rose-50/60 text-xs font-semibold text-rose-700 transition-colors disabled:opacity-60 hover:bg-rose-100 dark:hover:bg-rose-900/20"
                    )}
                  >
                    {processing ? "Rejecting…" : "Reject"}
                  </button>
                  <button
                    type="button"
                    onClick={() => onApprove(request)}
                    disabled={processing}
                    className={cn(
                      "flex-1 h-10 rounded-lg bg-amber-600 text-xs font-semibold text-white shadow-lg shadow-amber-600/25 transition-colors disabled:opacity-70 disabled:cursor-not-allowed hover:bg-amber-500"
                    )}
                  >
                    {processing ? "Approving…" : "Approve"}
                  </button>
                </>
              ) : request.status === "approved" ? (
                <>
                  <button
                    type="button"
                    onClick={() => onPrint(request)}
                    disabled={processing}
                    className={cn(
                      "flex-1 h-10 rounded-lg border border-emerald-200/60 bg-emerald-50/60 text-xs font-semibold text-emerald-700 transition-colors disabled:opacity-60 hover:bg-emerald-100 dark:hover:bg-emerald-900/20"
                    )}
                  >
                    {processing ? "Printing…" : (
                      <>
                        <Printer className="h-3.5 w-3.5" aria-hidden /> Print Document
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => onStatusChange(request)}
                    disabled={processing}
                    className={cn(
                      "flex-1 h-10 rounded-lg border border-emerald-200/60 bg-emerald-50/60 text-xs font-semibold text-emerald-700 transition-colors disabled:opacity-60 hover:bg-emerald-100 dark:hover:bg-emerald-900/20"
                    )}
                  >
                    {processing ? "Releasing…" : "Mark released"}
                  </button>
                </>
              ) : request.status === "rejected" ? (
                <button
                  type="button"
                  onClick={() => onStatusChange(request)}
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
                  onClick={() => onStatusChange(request)}
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
  submission: DocumentRequest;
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
                <h2 className="text-lg font-bold">{isApprove ? "Approve this request?" : "Reject this request?"}</h2>
                <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
                  {submission.reference} — {submission.resident} ({submission.document})
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
                {processing ? isApprove ? "Approving…" : "Rejecting…" : isApprove ? "Approve" : "Reject"}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
