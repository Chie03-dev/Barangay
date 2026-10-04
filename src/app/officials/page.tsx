"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Crown,
  Users,
  FileText,
  Wallet,
  Baby,
  Briefcase,
  Clock,
  Phone,
  Mail,
  X,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { cn, glass } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Officials data                                                     */
/* ------------------------------------------------------------------ */

type Tier = "captain" | "councilors" | "staff";

type Official = {
  id: string;
  name: string;
  role: string;
  tier: Tier;
  photo: string;
  committees: string[];
  contact: string;
  email: string;
  hours: string;
  tenure?: string;
  icon: LucideIcon;
};

const P1 = "/officials/test1.webp";
const P2 = "/officials/test2.webp";

const OFFICIALS: Official[] = [
  {
    id: "captain",
    name: "Marben Clyde Maglangit",
    role: "Punong Barangay",
    tier: "captain",
    photo: P1,
    committees: ["General Administration", "Peace & Order"],
    contact: "+63 917 123 4567",
    email: "captain@barangay.gov.ph",
    hours: "Mon-Fri, 8:00 AM - 5:00 PM",
    tenure: "2022 - 2025",
    icon: Crown,
  },
  {
    id: "kagawad-1",
    name: "Ana Rebecca Santos",
    role: "Barangay Kagawad",
    tier: "councilors",
    photo: P2,
    committees: ["Health & Sanitation", "Youth & Sports"],
    contact: "+63 917 555 0101",
    email: "kagawad.santos@barangay.gov.ph",
    hours: "Mon, Wed, Fri, 9:00 AM - 12:00 NN",
    icon: Users,
  },
  {
    id: "kagawad-2",
    name: "Jose Allan Rivera",
    role: "Barangay Kagawad",
    tier: "councilors",
    photo: P1,
    committees: ["Infrastructure", "Utilities"],
    contact: "+63 917 555 0102",
    email: "kagawad.rivera@barangay.gov.ph",
    hours: "Tue, Thu, Sat, 9:00 AM - 12:00 NN",
    icon: Users,
  },
  {
    id: "kagawad-3",
    name: "Liezl Mae Navarro",
    role: "Barangay Kagawad",
    tier: "councilors",
    photo: P2,
    committees: ["Women & Children", "Education"],
    contact: "+63 917 555 0103",
    email: "kagawad.navarro@barangay.gov.ph",
    hours: "Mon, Wed, 1:00 PM - 4:00 PM",
    icon: Users,
  },
  {
    id: "secretary",
    name: "Rodel P. Abella",
    role: "Barangay Secretary",
    tier: "staff",
    photo: P2,
    committees: ["Records & Documentation"],
    contact: "+63 917 555 0201",
    email: "secretary@barangay.gov.ph",
    hours: "Mon-Fri, 8:00 AM - 5:00 PM",
    icon: FileText,
  },
  {
    id: "treasurer",
    name: "Grace T. Lim",
    role: "Barangay Treasurer",
    tier: "staff",
    photo: P1,
    committees: ["Finance & Budget"],
    contact: "+63 917 555 0202",
    email: "treasurer@barangay.gov.ph",
    hours: "Mon-Fri, 8:00 AM - 5:00 PM",
    icon: Wallet,
  },
  {
    id: "sk-chair",
    name: "Miguel D. Aquino",
    role: "SK Chairperson",
    tier: "staff",
    photo: P2,
    committees: ["Sangguniang Kabataan", "Programs"],
    contact: "+63 917 555 0203",
    email: "skchair@barangay.gov.ph",
    hours: "Mon-Sat, 4:00 PM - 6:00 PM",
    icon: Baby,
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function OfficialsPage() {
  const [selected, setSelected] = useState<Official | null>(null);

  const captain = OFFICIALS.find((o) => o.tier === "captain")!;
  const councilors = OFFICIALS.filter((o) => o.tier === "councilors");
  const staff = OFFICIALS.filter((o) => o.tier === "staff");

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 pb-32">
      {/* Header */}
      <header className="mb-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400"
        >
          <Briefcase className="h-6 w-6" aria-hidden />
        </motion.div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Barangay Officials
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          The people entrusted with running our community.
        </p>
      </header>

      {/* ---------------- Tier 1: Punong Barangay ---------------- */}
      <section aria-labelledby="tier-captain" className="flex flex-col items-center">
        <h2 id="tier-captain" className="sr-only">
          Punong Barangay
        </h2>
        <OfficialCard official={captain} onOpen={setSelected} featured />
      </section>

      {/* Connector: captain down to the council rail */}
      <div
        aria-hidden
        className="mx-auto flex h-12 w-px flex-col items-center motion-reduce:h-6"
      >
        <div className="h-full w-px bg-gradient-to-b from-emerald-500/60 to-slate-300 dark:to-slate-700" />
      </div>

      {/* ---------------- Tier 2: Sangguniang Barangay ---------------- */}
      <section aria-labelledby="tier-councilors">
        <div className="mb-5 flex items-center justify-center gap-3">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-300 dark:to-slate-700" />
          <h2
            id="tier-councilors"
            className="flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/70 px-4 py-1.5 text-xs font-semibold text-slate-600 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300"
          >
            <Users className="h-3.5 w-3.5" aria-hidden />
            Sangguniang Barangay
          </h2>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-300 dark:to-slate-700" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {councilors.map((person) => (
            <OfficialCard
              key={person.id}
              official={person}
              onOpen={setSelected}
            />
          ))}
        </div>
      </section>

      {/* Connector down to staff */}
      <div aria-hidden className="mx-auto h-12 w-px motion-reduce:h-6">
        <div className="h-full w-px bg-gradient-to-b from-slate-300 to-emerald-500/60 dark:from-slate-700" />
      </div>

      {/* ---------------- Tier 3: Staff ---------------- */}
      <section aria-labelledby="tier-staff">
        <div className="mb-5 flex items-center justify-center gap-3">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-300 dark:to-slate-700" />
          <h2
            id="tier-staff"
            className="flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/70 px-4 py-1.5 text-xs font-semibold text-slate-600 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300"
          >
            <FileText className="h-3.5 w-3.5" aria-hidden />
            Appointed Officials
          </h2>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-300 dark:to-slate-700" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {staff.map((person) => (
            <OfficialCard key={person.id} official={person} onOpen={setSelected} />
          ))}
        </div>
      </section>

      <OfficialModal official={selected} onClose={() => setSelected(null)} />
    </main>
  );
}
/* ------------------------------------------------------------------ */
/*  Official card                                                      */
/* ------------------------------------------------------------------ */

function OfficialCard({
  official,
  onOpen,
  featured = false,
}: {
  official: Official;
  onOpen: (o: Official) => void;
  featured?: boolean;
}) {
  // Tracks whether the real photo loaded; falls back to initials if not.
  const [photoFailed, setPhotoFailed] = useState(false);
  const Icon = official.icon;

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(official)}
      aria-haspopup="dialog"
      aria-label={`View details for ${official.name}, ${official.role}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      whileHover={{ scale: featured ? 1.02 : 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        glass,
        "group relative flex flex-col items-center p-6 text-center",
        featured
          ? "w-full max-w-sm border-emerald-500/30 shadow-xl shadow-emerald-500/10 dark:border-emerald-500/20"
          : "w-full",
      )}
    >
      {featured && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow">
          Leader
        </span>
      )}

      <div
        className={cn(
          "relative flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800",
          featured ? "h-24 w-24" : "h-20 w-20",
        )}
      >
        {photoFailed ? (
          <span className="text-2xl font-bold text-slate-500 dark:text-slate-400">
            {initials(official.name)}
          </span>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={official.photo}
            alt={`Portrait of ${official.name}`}
            onError={() => setPhotoFailed(true)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:group-hover:scale-100"
          />
        )}
        <span className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white shadow ring-2 ring-white dark:ring-slate-900">
          <Icon className="h-3 w-3" aria-hidden />
        </span>
      </div>

      <h3 className="mt-4 text-sm font-bold leading-tight">{official.name}</h3>
      <p className="mt-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
        {official.role}
      </p>
      {official.tenure && (
        <p className="mt-1 text-[11px] text-slate-400">{official.tenure}</p>
      )}

      <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 transition-colors group-hover:text-emerald-600 dark:text-slate-400 dark:group-hover:text-emerald-400">
        View details
        <ChevronRight
          className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />
      </span>
    </motion.button>
  );
}
/* ------------------------------------------------------------------ */
/*  Details modal                                                      */
/* ------------------------------------------------------------------ */

function OfficialModal({
  official,
  onClose,
}: {
  official: Official | null;
  onClose: () => void;
}) {
  const [photoFailed, setPhotoFailed] = useState(false);

  // Escape closes the dialog; body scroll is locked while it is open.
  useEffect(() => {
    if (!official) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [official, onClose]);

  return (
    <AnimatePresence>
      {official && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="official-modal-name"
            className={cn(glass, "w-full max-w-md p-6 shadow-2xl")}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
                {photoFailed ? (
                  <span className="text-xl font-bold text-slate-500">
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

              <div className="min-w-0 flex-1">
                <h2 id="official-modal-name" className="text-lg font-bold">
                  {official.name}
                </h2>
                <p className="mt-0.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  {official.role}
                </p>
                {official.tenure && (
                  <p className="mt-0.5 text-xs text-slate-400">
                    Term {official.tenure}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close details"
                className="shrink-0 rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>

            {/* Committees */}
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Committees &amp; Portfolio
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {official.committees.map((c) => (
                  <span
                    key={c}
                    className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="mt-5 space-y-2 border-t border-slate-200/60 pt-4 dark:border-slate-800">
              <a
                href={`tel:${official.contact.replace(/\s/g, "")}`}
                className="flex items-center gap-3 rounded-xl px-2 py-2 text-sm transition-colors hover:bg-slate-100/70 dark:hover:bg-slate-800/40"
              >
                <Phone className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                <span className="font-mono">{official.contact}</span>
              </a>
              <a
                href={`mailto:${official.email}`}
                className="flex items-center gap-3 rounded-xl px-2 py-2 text-sm transition-colors hover:bg-slate-100/70 dark:hover:bg-slate-800/40"
              >
                <Mail className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                <span className="truncate">{official.email}</span>
              </a>
              <p className="flex items-center gap-3 rounded-xl px-2 py-2 text-sm">
                <Clock className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                <span>{official.hours}</span>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}