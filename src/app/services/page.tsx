"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  FileText,
  ShieldCheck,
  Building2,
  UserCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Upload,
  Zap,
  Target,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

const STEPS = [
  { id: 1, label: "Document", icon: FileText },
  { id: 2, label: "Details", icon: UserCheck },
  { id: 3, label: "Review", icon: ShieldCheck },
] as const;

type DocumentId = "clearance" | "indigency" | "residency" | "business";

type DocumentOption = {
  id: DocumentId;
  name: string;
  description: string;
  processing: string;
  fee: string;
  feeValue: number;
  icon: LucideIcon;
};

const DOCUMENTS: DocumentOption[] = [
  {
    id: "clearance",
    name: "Barangay Clearance",
    description: "Proof of good standing within the barangay.",
    processing: "1 Day",
    fee: "\u20B150",
    feeValue: 50,
    icon: ShieldCheck,
  },
  {
    id: "indigency",
    name: "Certificate of Indigency",
    description: "Certifies your current financial status.",
    processing: "Same Day",
    fee: "Free",
    feeValue: 0,
    icon: Building2,
  },
  {
    id: "residency",
    name: "Certificate of Residency",
    description: "Verifies your address and length of stay.",
    processing: "1 Day",
    fee: "\u20B150",
    feeValue: 50,
    icon: UserCheck,
  },
  {
    id: "business",
    name: "Barangay Business Permit",
    description: "Required to operate a business locally.",
    processing: "2-3 Days",
    fee: "\u20B1200",
    feeValue: 200,
    icon: FileText,
  },
];

const PURPOSES = [
  "Employment",
  "Scholarship",
  "Bank Account",
  "Government ID",
  "Legal",
] as const;

const RESIDENT_NAME = "Marben";

/* ------------------------------------------------------------------ */
/*  Shared style tokens                                                */
/* ------------------------------------------------------------------ */

const slide = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

const stepTransition = { duration: 0.3, ease: "easeOut" as const };

const card =
  "rounded-2xl border border-slate-200/70 bg-white/70 p-5 text-left shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900/50";

const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold shadow-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50";

const secondaryButton =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300/80 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-800 transition-colors hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-800 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:hover:border-emerald-500/60 dark:hover:bg-slate-800 dark:hover:text-emerald-300";

const fieldLabel =
  "mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300";

const inputClass =
  "w-full rounded-xl border border-slate-200/70 bg-white/80 px-4 py-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-900/60 dark:focus:border-emerald-500";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatPeso(value: number) {
  return value === 0 ? "Free" : `\u20B1${value}`;
}

function getReleaseDate(processing: string) {
  const days = processing.startsWith("Same Day")
    ? 0
    : processing === "2-3 Days"
      ? 3
      : 1;
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString("en-PH", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ServicesPage() {
  const [step, setStep] = useState(1);
  const [selectedDoc, setSelectedDoc] = useState<DocumentId | null>(null);
  const [purpose, setPurpose] = useState("");
  const [remarks, setRemarks] = useState("");
  const [hasId, setHasId] = useState(false);
  const [urgency, setUrgency] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceCode, setReferenceCode] = useState("");

  const doc = useMemo(
    () => DOCUMENTS.find((d) => d.id === selectedDoc) ?? null,
    [selectedDoc],
  );

  const canReview = Boolean(purpose);

  function resetForm() {
    setStep(1);
    setSelectedDoc(null);
    setPurpose("");
    setRemarks("");
    setHasId(false);
    setUrgency(false);
    setIsSubmitting(false);
    setReferenceCode("");
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    // Mock submission - replace with the real API call.
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setReferenceCode(`BRGY-2026-${Math.floor(1000 + Math.random() * 9000)}`);
    setIsSubmitting(false);
    setStep(4);
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-4 py-10 pb-32">
      {/* Page header */}
      <header className="mb-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        >
          <Building2 className="h-6 w-6" aria-hidden />
        </motion.div>
        <h1 className="text-3xl font-bold tracking-tight">
          Request a Document
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Apply for a barangay certificate or permit in a few easy steps.
        </p>
      </header>

      {/* Stepper is hidden once the success screen shows */}
      {step < 4 && <Stepper currentStep={step} onStepClick={setStep} />}

      <div className="mt-8">
        <AnimatePresence mode="wait">
          {/* ------------------------- Step 1: Document ------------------------ */}
          {step === 1 && (
            <motion.section
              key="step-1"
              {...slide}
              transition={stepTransition}
              aria-label="Select document type"
            >
              <h2 className="mb-1 text-lg font-semibold">
                1. Select Document Type
              </h2>
              <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
                Choose the document you would like to request.
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {DOCUMENTS.map((item) => (
                  <DocumentCard
                    key={item.id}
                    item={item}
                    isSelected={selectedDoc === item.id}
                    onSelect={() => setSelectedDoc(item.id)}
                  />
                ))}
              </div>

              <div className="mt-8 flex justify-end">
                <motion.button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!selectedDoc}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    primaryButton,
                    "bg-emerald-600 text-white shadow-emerald-600/20 hover:bg-emerald-500",
                  )}
                >
                  Next Step
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </motion.button>
              </div>
            </motion.section>
          )}
{/* -------------------------- Step 2: Details ------------------------ */}
          {step === 2 && (
            <motion.section
              key="step-2"
              {...slide}
              transition={stepTransition}
              aria-label="Request details"
            >
              <h2 className="mb-1 text-lg font-semibold">
                2. Request Details &amp; Purpose
              </h2>
              <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
                Tell us how you will use the document.
              </p>

              <div className="space-y-6 rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/80 dark:shadow-none">
                <fieldset>
                  <legend className={fieldLabel}>
                    Purpose <span className="text-red-500">*</span>
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {PURPOSES.map((item) => {
                      const isActive = purpose === item;
                      return (
                        <motion.button
                          key={item}
                          type="button"
                          onClick={() => setPurpose(item)}
                          whileTap={{ scale: 0.95 }}
                          aria-pressed={isActive}
                          className={cn(
                            "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                            isActive
                              ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                              : "border-slate-200/70 bg-white/70 text-slate-600 hover:border-emerald-300 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300",
                          )}
                        >
                          {item}
                        </motion.button>
                      );
                    })}
                  </div>
                </fieldset>

                <div>
                  <label htmlFor="remarks" className={fieldLabel}>
Additional Remarks or Specific Details
                  </label>
                  <textarea
                    id="remarks"
                    rows={4}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="e.g. Needed for a job application at Makati City Hall..."
                    className={cn(inputClass, "resize-none")}
                  />
                </div>
<div>
                  <span className={fieldLabel}>Valid ID (Required)</span>
                  <motion.label
                    htmlFor="valid-id"
                    whileHover={{ scale: 1.01 }}
                    className={cn(
                      "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors",
                      hasId
                        ? "border-emerald-500 bg-emerald-500/5"
                        : "border-slate-300 hover:border-emerald-400 dark:border-slate-700",
                    )}
                  >
                    <input
                      id="valid-id"
                      type="file"
                      accept="image/*,.pdf"
                      className="sr-only"
                      onChange={() => setHasId(true)}
                    />
                    {hasId ? (
                      <>
                        <CheckCircle2
                          className="mb-2 h-7 w-7 text-emerald-600 dark:text-emerald-400"
                          aria-hidden
                        />
                        <span className="text-sm font-semibold">
                          ID uploaded - click to replace
                        </span>
                      </>
                    ) : (
                      <>
                        <Upload
                          className="mb-2 h-7 w-7 text-slate-400"
                          aria-hidden
                        />
                        <span className="text-sm font-semibold">
                          Drop your Valid ID here
                        </span>
                        <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          or click to browse (PNG, JPG, PDF)
                        </span>
                      </>
                    )}
                  </motion.label>
                </div>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200/70 px-4 py-3 dark:border-slate-800">
                  <input
                    type="checkbox"
                    checked={urgency}
                    onChange={(e) => setUrgency(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 accent-emerald-600"
                  />
                  <span className="text-sm">
                    This is urgent - I need the document within 24 hours.
                  </span>
                  <Zap
                    className="ml-auto h-4 w-4 shrink-0 text-amber-500"
                    aria-hidden
                  />
                </label>
              </div>

              <StepActions
                onBack={() => setStep(1)}
                onNext={() => setStep(3)}
                nextDisabled={!canReview}
                nextLabel="Continue to Review"
              />
            </motion.section>
          )}
{/* --------------------------- Step 3: Review ------------------------ */}
          {step === 3 && doc && (
            <motion.section
              key="step-3"
              {...slide}
              transition={stepTransition}
              aria-label="Review and submit"
            >
              <h2 className="mb-1 text-lg font-semibold">
                3. Review &amp; Submit
              </h2>
              <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
                Please verify the details below before submitting.
              </p>

              <div className="space-y-4 rounded-2xl border border-slate-200/50 bg-white/70 p-6 shadow-2xl backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/60">
                <SummaryRow icon={FileText} label="Document">
                  <p className="font-semibold">{doc.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Fee: {formatPeso(doc.feeValue)}
                  </p>
                </SummaryRow>

                <SummaryRow icon={UserCheck} label="Resident Name">
                  {RESIDENT_NAME}
                </SummaryRow>

                <SummaryRow icon={Target} label="Target Purpose">
                  <p className="font-semibold">{purpose}</p>
                  {remarks && (
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      &ldquo;{remarks}&rdquo;
                    </p>
                  )}
                </SummaryRow>

                <SummaryRow icon={Clock} label="Processing Time">
                  <p className="font-semibold">{doc.processing}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Estimated release: {getReleaseDate(doc.processing)}
                    {urgency && (
                      <span className="ml-1 font-semibold text-amber-600 dark:text-amber-400">
                        • Rush
                      </span>
                    )}
                  </p>
                </SummaryRow>

                <SummaryRow icon={ShieldCheck} label="Valid ID">
                  {hasId ? "Attached" : "Not yet attached"}
                </SummaryRow>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <motion.button
                  type="button"
                  onClick={() => setStep(2)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={secondaryButton}
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                  Back
                </motion.button>

                <motion.button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    primaryButton,
                    "bg-emerald-600 text-white shadow-emerald-600/20 hover:bg-emerald-500",
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.9,
                          ease: "linear",
                        }}
                        className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white"
                      />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Request
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.section>
          )}
{/* -------------------------- Step 4: Success ------------------------ */}
          {step === 4 && (
            <motion.section
              key="step-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              aria-label="Request submitted"
              className="mx-auto max-w-xl text-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: [0, 1.15, 1], rotate: [-30, 8, 0] }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10"
              >
                <CheckCircle2
                  className="h-12 w-12 text-emerald-600 dark:text-emerald-400"
                  aria-hidden
                />
              </motion.div>

              <h2 className="text-2xl font-bold">Request Submitted!</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Your {doc?.name ?? "document"} request has been received.
                Please bring your valid ID when claiming.
              </p>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.35 }}
                className="mx-auto mt-6 inline-flex flex-col items-center rounded-2xl border border-emerald-500/40 bg-emerald-500/5 px-8 py-5"
              >
                <span className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Reference Number
                </span>
                <span className="mt-1 font-mono text-xl font-bold text-emerald-700 dark:text-emerald-400">
                  {referenceCode}
                </span>
              </motion.div>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.35 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto"
                >
                  <Link
                    href="/track"
                    className={cn(
                      primaryButton,
                      "w-full bg-emerald-600 text-white shadow-emerald-600/20 hover:bg-emerald-500",
                    )}
                  >
                    Track Status
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </motion.div>

                <motion.button
                  type="button"
                  onClick={resetForm}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.35 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(secondaryButton, "w-full sm:w-auto")}
                >
                  File Another Request
                </motion.button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
/* ------------------------------------------------------------------ */
/*  Stepper                                                            */
/* ------------------------------------------------------------------ */

function Stepper({
  currentStep,
  onStepClick,
}: {
  currentStep: number;
  onStepClick: (step: number) => void;
}) {
  return (
    <nav aria-label="Progress" className="mx-auto max-w-2xl">
      <ol className="flex items-center">
        {STEPS.map((stepItem, index) => {
          const Icon = stepItem.icon;
          const isActive = currentStep === stepItem.id;
          const isComplete = currentStep > stepItem.id;
          const clickable = stepItem.id < currentStep;

          return (
            <li
              key={stepItem.id}
              className={cn(
                "flex items-center",
                index < STEPS.length - 1 && "flex-1",
              )}
            >
              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onStepClick(stepItem.id)}
                aria-current={isActive ? "step" : undefined}
                className="flex flex-col items-center gap-2 disabled:cursor-default"
              >
                <motion.span
                  animate={isActive ? { scale: 1.12 } : { scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-full border-2 transition-colors",
                    (isActive || isComplete) &&
                      "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                    !isActive &&
                      !isComplete &&
                      "border-slate-200 bg-white/70 text-slate-400 dark:border-slate-800 dark:bg-slate-900/60",
                  )}
                >
                  {isComplete ? (
                    <CheckCircle2 className="h-5 w-5" aria-hidden />
                  ) : (
                    <Icon className="h-5 w-5" aria-hidden />
                  )}
                </motion.span>
                <span
                  className={cn(
                    "text-xs font-medium transition-colors",
                    isActive || isComplete
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-slate-400",
                  )}
                >
                  {stepItem.label}
                </span>
              </button>

              {index < STEPS.length - 1 && (
                <div className="mx-3 mb-6 h-0.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <motion.div
                    initial={false}
                    animate={{ width: isComplete ? "100%" : "0%" }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="h-full bg-emerald-500"
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
/* ------------------------------------------------------------------ */
/*  Document card (Step 1)                                             */
/* ------------------------------------------------------------------ */

function DocumentCard({
  item,
  isSelected,
  onSelect,
}: {
  item: DocumentOption;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const Icon = item.icon;

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      aria-pressed={isSelected}
      className={cn(
        card,
        "relative",
        isSelected &&
          "border-emerald-500 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500",
      )}
    >
      <AnimatePresence>
        {isSelected && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 18 }}
            className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white"
          >
            <CheckCircle2 className="h-4 w-4" aria-hidden />
          </motion.span>
        )}
      </AnimatePresence>

      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
        <Icon className="h-5 w-5" aria-hidden />
      </div>

      <p className="pr-8 font-semibold">{item.name}</p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        {item.description}
      </p>

      <div className="mt-4 flex items-center justify-between text-xs">
        <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400">
          <Clock className="h-3.5 w-3.5" aria-hidden />
          {item.processing}
        </span>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 font-semibold",
            isSelected
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
          )}
        >
          {item.fee}
        </span>
      </div>
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared action row                                                  */
/* ------------------------------------------------------------------ */

function StepActions({
  onBack,
  onNext,
  nextLabel,
  nextDisabled = false,
}: {
  onBack: () => void;
  onNext: () => void;
  nextLabel: string;
  nextDisabled?: boolean;
}) {
  return (
    <div className="mt-8 flex items-center justify-between">
      <motion.button
        type="button"
        onClick={onBack}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={secondaryButton}
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back
      </motion.button>

      <motion.button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          primaryButton,
          "bg-emerald-600 text-white shadow-emerald-600/20 hover:bg-emerald-500",
        )}
      >
        {nextLabel}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </motion.button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Summary row                                                        */
/* ------------------------------------------------------------------ */

function SummaryRow({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 border-t border-slate-200/60 pt-4 first:border-t-0 first:pt-0 dark:border-slate-800">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
        <Icon className="h-4 w-4" aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <div className="mt-0.5 text-sm">{children}</div>
      </div>
    </div>
  );
}
