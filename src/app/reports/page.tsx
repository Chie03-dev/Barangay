"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Volume2,
  Wrench,
  Users,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  FileText,
  MapPin,
  Calendar,
  Clock,
  Camera,
  Send,
  CheckCircle2,
  PhoneCall,
  Lock,
  Upload,
  UserX,
  ChevronRight,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types & static data                                                */
/* ------------------------------------------------------------------ */

type IncidentId =
  | "noise"
  | "infrastructure"
  | "dispute"
  | "nuisance"
  | "blotter";

type IncidentType = {
  id: IncidentId;
  icon: LucideIcon;
  title: string;
  examples: string;
  /** Blotter records route to the police desk, so they get an amber accent. */
  tone: "emerald" | "amber";
};

const INCIDENTS: IncidentType[] = [
  {
    id: "noise",
    icon: Volume2,
    title: "Noise Complaint",
    examples: "Late night sound, construction noise",
    tone: "emerald",
  },
  {
    id: "infrastructure",
    icon: Wrench,
    title: "Infrastructure Damage",
    examples: "Broken streetlights, clogged drainage, road hazards",
    tone: "emerald",
  },
  {
    id: "dispute",
    icon: Users,
    title: "Neighbor Dispute",
    examples: "Property boundary, noise, pet grievances",
    tone: "emerald",
  },
  {
    id: "nuisance",
    icon: AlertTriangle,
    title: "Public Nuisance & Safety",
    examples: "Illegal dumping, road obstruction",
    tone: "emerald",
  },
  {
    id: "blotter",
    icon: ShieldAlert,
    title: "Official Blotter Record",
    examples: "Property damage, physical altercations, theft",
    tone: "amber",
  },
];

const LOCATIONS = [
  "Purok 1",
  "Purok 2",
  "Purok 3",
  "Purok 4",
  "Purok 5",
  "Purok 6",
  "Purok 7",
  "Main Avenue",
  "Highway",
];

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

const fieldLabel =
  "mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300";

const inputClass =
  "w-full rounded-xl border border-slate-200/70 bg-white/80 px-4 py-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-900/60 dark:focus:border-emerald-500";

const sectionTitle = "mb-1 text-lg font-semibold";
/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ReportsPage() {
  const [incident, setIncident] = useState<IncidentId | null>(null);
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [landmark, setLandmark] = useState("");
  const [narrative, setNarrative] = useState("");
  const [respondent, setRespondent] = useState("");
  const [respondentUnknown, setRespondentUnknown] = useState(true);
  const [evidence, setEvidence] = useState<string[]>([]);
  const [certified, setCertified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState("");

  const isComplete =
    Boolean(incident) &&
    Boolean(location) &&
    Boolean(date) &&
    Boolean(time) &&
    narrative.trim().length >= 10 &&
    (respondentUnknown || respondent.trim().length > 0) &&
    certified;

  function addEvidence() {
    setEvidence((prev) => [
      ...prev,
      `evidence-${prev.length + 1}-${Math.floor(Math.random() * 900 + 100)}.jpg`,
    ]);
  }

  function resetForm() {
    setIncident(null);
    setLocation("");
    setDate("");
    setTime("");
    setLandmark("");
    setNarrative("");
    setRespondent("");
    setRespondentUnknown(true);
    setEvidence([]);
    setCertified(false);
    setIsSubmitting(false);
    setSubmitted(false);
    setReference("");
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    // Mock submission - replace with the real API call.
    await new Promise((resolve) => setTimeout(resolve, 1600));
    setReference(`BLT-2026-${Math.floor(1000 + Math.random() * 9000)}`);
    setIsSubmitting(false);
    setSubmitted(true);
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-4 py-10 pb-32">
      {/* Header */}
      <header className="mb-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400"
        >
          <ShieldAlert className="h-6 w-6" aria-hidden />
        </motion.div>
        <h1 className="text-3xl font-bold tracking-tight">
          Incident &amp; Blotter Report
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          File a report with your Barangay. All submissions are recorded
          officially.
        </p>
      </header>

      {/* Emergency banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.35 }}
        role="alert"
        className={cn(
          glass,
          "mb-8 flex items-start gap-4 border-amber-500/40 bg-amber-500/10 p-5 shadow-lg",
        )}
      >
        <motion.span
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400"
        >
          <AlertTriangle className="h-5 w-5" aria-hidden />
        </motion.span>
        <div>
          <p className="font-semibold text-amber-900 dark:text-amber-200">
            Active Emergency?
          </p>
          <p className="mt-1 text-sm text-amber-800 dark:text-amber-200/90">
            For immediate assistance or active crimes in progress, call the
            Barangay Hotline directly at{" "}
            <a
              href="tel:+0288880000"
              className="inline-flex items-center gap-1 font-bold underline underline-offset-2"
            >
              <PhoneCall className="h-3.5 w-3.5" aria-hidden />
              (02) 8888-0000 / 911
            </a>
            .
          </p>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {submitted ? (
          <SuccessCard
            reference={reference}
            onReset={resetForm}
          />
        ) : (
          <motion.form key="form" {...slide} transition={transition}>
            {/* ---------------- Section 1: Incident type ---------------- */}
            <section className={cn(glass, "mb-6 p-6")}>
              <SectionHeading
                step={1}
                title="Category Selection"
                hint="Choose the category that best describes the incident."
              />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {INCIDENTS.map((item) => (
                  <IncidentCard
                    key={item.id}
                    item={item}
                    isSelected={incident === item.id}
                    onSelect={() => setIncident(item.id)}
                  />
                ))}
              </div>
            </section>
{/* ---------------- Section 2: Location & timestamp ---------------- */}
            <section className={cn(glass, "mb-6 p-6")}>
              <SectionHeading
                step={2}
                title="Location & Timestamp"
                hint="Where and when did this happen?"
              />

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="location" className={fieldLabel}>
                    Zone / Purok <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin
                      className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                      aria-hidden
                    />
                    <select
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className={cn(inputClass, "appearance-none pl-11")}
                    >
                      <option value="">Select a location...</option>
                      {LOCATIONS.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="landmark" className={fieldLabel}>
                    Specific Landmark / Location Details
                  </label>
                  <div className="relative">
                    <MapPin
                      className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                      aria-hidden
                    />
                    <input
                      id="landmark"
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="e.g. Beside the covered court"
                      className={cn(inputClass, "pl-11")}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="date" className={fieldLabel}>
                    Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar
                      className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                      aria-hidden
                    />
                    <input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className={cn(inputClass, "pl-11")}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="time" className={fieldLabel}>
                    Time <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Clock
                      className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                      aria-hidden
                    />
                    <input
                      id="time"
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className={cn(inputClass, "pl-11")}
                    />
                  </div>
                </div>
              </div>
            </section>
{/* ------------- Section 3: Narrative & respondent info ------------- */}
            <section className={cn(glass, "mb-6 p-6")}>
              <SectionHeading
                step={3}
                title="Incident Narrative & Evidence"
                hint="Describe what happened in your own words."
              />

              <div className="space-y-5">
                <div>
                  <label htmlFor="narrative" className={fieldLabel}>
                    Detailed Description of Event{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="narrative"
                    rows={5}
                    value={narrative}
                    onChange={(e) => setNarrative(e.target.value)}
                    placeholder="Describe what happened, who was involved, and any details that can help the officer..."
                    className={cn(inputClass, "resize-none")}
                  />
                  <p className="mt-1 text-right text-xs text-slate-400">
                    {narrative.trim().length} characters (min. 10)
                  </p>
                </div>

                <div>
                  <span className={fieldLabel}>Respondent Information</span>
                  <div className="space-y-3">
                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200/70 px-4 py-3 dark:border-slate-800">
                      <input
                        type="checkbox"
                        checked={respondentUnknown}
                        onChange={(e) => setRespondentUnknown(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 accent-emerald-600"
                      />
                      <UserX
                        className="h-4 w-4 shrink-0 text-slate-400"
                        aria-hidden
                      />
                      <span className="text-sm">Unknown / Unidentified</span>
                    </label>

                    {!respondentUnknown && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <input
                          type="text"
                          value={respondent}
                          onChange={(e) => setRespondent(e.target.value)}
                          placeholder="Name or Alias of Person Involved"
                          className={inputClass}
                        />
                      </motion.div>
                    )}
                  </div>
                </div>
{/* Evidence dropzone */}
                <div>
                  <span className={fieldLabel}>
                    Photo / Video Evidence (Optional)
                  </span>
                  <motion.button
                    type="button"
                    onClick={addEvidence}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={cn(
                      "flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors",
                      "border-slate-300 hover:border-emerald-400 dark:border-slate-700",
                    )}
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <Upload className="h-5 w-5" aria-hidden />
                      </span>
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <Camera className="h-5 w-5" aria-hidden />
                      </span>
                    </div>
                    <span className="text-sm font-semibold">
                      Drop photos or videos here
                    </span>
                    <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      or click to browse (JPG, PNG, MP4 - max 10MB each)
                    </span>
                  </motion.button>

                  <AnimatePresence initial={false}>
                    {evidence.map((file) => (
                      <motion.div
                        key={file}
                        layout
                        initial={{ opacity: 0, y: -10, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 26,
                        }}
                        className="mt-2 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-3"
                      >
                        <FileText
                          className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                          aria-hidden
                        />
                        <span className="min-w-0 flex-1 truncate text-sm font-medium">
                          {file}
                        </span>
                        <span className="shrink-0 text-xs text-slate-400">
                          Ready
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setEvidence((prev) =>
                              prev.filter((f) => f !== file),
                            )
                          }
                          aria-label={`Remove ${file}`}
                          className="shrink-0 text-xs font-medium text-slate-400 hover:text-red-500"
                        >
                          Remove
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </section>
{/* ------------- Section 4: Confidentiality & submission ------------- */}
            <section className={cn(glass, "p-6")}>
              <SectionHeading
                step={4}
                title="Verification & Submission"
                hint="Review your report before filing it officially."
              />

              <motion.label
                whileTap={{ scale: 0.99 }}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors",
                  certified
                    ? "border-emerald-500 bg-emerald-500/5"
                    : "border-slate-200/70 dark:border-slate-800",
                )}
              >
                <input
                  type="checkbox"
                  checked={certified}
                  onChange={(e) => setCertified(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-emerald-600"
                />
                <Lock
                  className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                  aria-hidden
                />
                <span className="text-sm">
                  I certify that this report is true and filed in good faith
                  under official Barangay records.
                  <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
                    False reports may be subject to penalties under applicable
                    local ordinances.
                  </span>
                </span>
              </motion.label>

              <motion.button
                type="submit"
                onClick={handleSubmit}
                disabled={!isComplete || isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className={cn(
                  "mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold shadow-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                  isComplete
                    ? "bg-emerald-600 text-white shadow-emerald-600/20 hover:bg-emerald-500"
                    : "bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-500",
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
                    Filing report...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" aria-hidden />
                    Submit Report
                  </>
                )}
              </motion.button>

              {!isComplete && !isSubmitting && (
                <p className="mt-3 flex items-center justify-center gap-2 text-center text-xs text-slate-500 dark:text-slate-400">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden />
                  Complete all required fields and certify your report to
                  submit.
                </p>
              )}
            </section>
          </motion.form>
        )}
      </AnimatePresence>
    </main>
  );
}
/* ------------------------------------------------------------------ */
/*  Section heading                                                    */
/* ------------------------------------------------------------------ */

function SectionHeading({
  step,
  title,
  hint,
}: {
  step: number;
  title: string;
  hint: string;
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <motion.span
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 18 }}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-sm font-bold text-emerald-600 dark:text-emerald-400"
      >
        {step}
      </motion.span>
      <div>
        <h2 className={sectionTitle}>{title}</h2>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
          {hint}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Incident type card                                                 */
/* ------------------------------------------------------------------ */

function IncidentCard({
  item,
  isSelected,
  onSelect,
}: {
  item: IncidentType;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const isAmber = item.tone === "amber";
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
        "relative rounded-2xl border-2 p-4 text-left transition-colors",
        isSelected
          ? isAmber
            ? "border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10"
            : "border-emerald-500 bg-emerald-500/5 shadow-lg shadow-emerald-500/10"
          : "border-slate-200/70 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700",
      )}
    >
      <AnimatePresence>
        {isSelected && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 18 }}
            className={cn(
              "absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full text-white",
              isAmber ? "bg-amber-500" : "bg-emerald-500",
            )}
          >
            <ShieldCheck className="h-4 w-4" aria-hidden />
          </motion.span>
        )}
      </AnimatePresence>

      <span
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
          isSelected
            ? isAmber
              ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
              : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
            : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
        )}
      >
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <p className="mt-3 pr-8 text-sm font-semibold">{item.title}</p>
      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
        {item.examples}
      </p>
    </motion.button>
  );
}
/* ------------------------------------------------------------------ */
/*  Success state                                                      */
/* ------------------------------------------------------------------ */

function SuccessCard({
  reference,
  onReset,
}: {
  reference: string;
  onReset: () => void;
}) {
  return (
    <motion.section
      key="success"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      aria-label="Report submitted"
      className={cn(glass, "mx-auto max-w-xl p-8 text-center sm:p-10")}
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

      <h2 className="text-2xl font-bold">Report Filed Successfully</h2>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.35 }}
        className="mx-auto mt-6 inline-flex flex-col items-center rounded-2xl border border-emerald-500/40 bg-emerald-500/5 px-8 py-5"
      >
        <span className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
          Blotter Reference Number
        </span>
        <span className="mt-1 font-mono text-xl font-bold text-emerald-700 dark:text-emerald-400">
          {reference}
        </span>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.35 }}
        className="mt-6 text-sm leading-relaxed text-slate-600 dark:text-slate-300"
      >
        Your report has been logged into the Barangay Desk System.
        An officer will review this within 24 hours.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.35 }}
        className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="w-full sm:w-auto"
        >
          <Link
            href="/track"
            className={cn(
              "inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-colors hover:bg-emerald-500 sm:w-auto",
            )}
          >
            Track Report Status
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Link>
        </motion.div>

        <motion.button
          type="button"
          onClick={onReset}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className={cn(
            "inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-300/80 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-800 transition-colors hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-800 sm:w-auto dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:hover:border-emerald-500/60 dark:hover:bg-slate-800 dark:hover:text-emerald-300",
          )}
        >
          File Another Report
        </motion.button>
      </motion.div>
    </motion.section>
  );
}