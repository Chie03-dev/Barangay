"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Shield,
  User,
  Lock,
  ArrowRight,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn, glass } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function OfficialsLoginPage() {
  const [officialId, setOfficialId] = useState("");
  const [officialPassword, setOfficialPassword] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsAuthenticating(true);
    // Mock auth for officials - wire a real sign-in call here.
    setTimeout(() => {
      setIsAuthenticating(false);
    }, 1200);
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      {/* Background */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-gradient-to-br from-amber-950 via-slate-950 to-slate-950"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/15 via-transparent to-transparent"
      />

      {/* Flip button */}
      <motion.button
        onClick={() => setIsFlipped(!isFlipped)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className="absolute top-6 right-6 z-20 flex items-center justify-center rounded-xl border border-amber-200/50 bg-amber-50/80 p-2 px-3 text-amber-700 transition-colors hover:bg-amber-50 backdrop-blur-sm shadow-sm dark:border-amber-900/30 dark:bg-amber-950/60 dark:text-amber-300 dark:hover:bg-amber-900/40"
        aria-label={isFlipped ? "Back to official login" : "Go to resident login"}
      >
        {isFlipped ? (
          <X className="h-5 w-5" aria-hidden />
        ) : (
          <ArrowRight className="h-5 w-5" aria-hidden />
        )}
      </motion.button>

      {/* 3D flip container: official login front, resident login back */}
      <div className="relative perspective-1000 w-full max-w-md flex items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {!isFlipped ? (
            <motion.div
              key="front"
              initial={{ opacity: 0, rotateY: -90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: 90 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="w-full"
            >
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={cn(
                  "w-full max-w-md rounded-3xl border p-8 shadow-2xl backdrop-blur-2xl motion-reduce:transform-none",
                  "border-amber-500/40 bg-amber-50/90 shadow-amber-900/30",
                  "dark:border-amber-900/30 dark:bg-amber-950/40 dark:shadow-black/50",
                )}
              >
                <div className="mb-8 flex flex-col items-center text-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo.png"
                    alt="Barangay seal"
                    className="mb-5 h-28 w-28 rounded-3xl bg-white/80 p-1.5 shadow-xl ring-1 ring-amber-200/70 dark:bg-white/10 dark:ring-amber-700/60"
                  />
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <Shield className="h-6 w-6" aria-hidden />
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    Official Login
                  </h1>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Barangay personnel access
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  <FloatingField
                    id="official-id"
                    name="officialId"
                    type="text"
                    label="Official ID"
                    autoComplete="username"
                    icon={User}
                    value={officialId}
                    onChange={setOfficialId}
                  />

                  <FloatingField
                    id="official-password"
                    name="officialPassword"
                    type="password"
                    label="Password"
                    autoComplete="current-password"
                    icon={Lock}
                    value={officialPassword}
                    onChange={setOfficialPassword}
                  />

                  <motion.button
                    type="submit"
                    disabled={isAuthenticating}
                    whileHover={isAuthenticating ? undefined : { scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-amber-600 text-sm font-semibold text-white shadow-lg shadow-amber-600/25 transition-colors hover:bg-amber-500 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isAuthenticating ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white"
                        />
                        Signing in…
                      </>
                    ) : (
                      <>
                        Official Sign In
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="back"
              initial={{ opacity: 0, rotateY: 90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: -90 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="w-full"
            >
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={cn(
                  "w-full max-w-md rounded-3xl border p-8 shadow-2xl backdrop-blur-2xl motion-reduce:transform-none",
                  "border-emerald-500/40 bg-emerald-50/90 shadow-emerald-900/30",
                  "dark:border-emerald-900/30 dark:bg-emerald-950/40 dark:shadow-black/50",
                )}
              >
                <div className="mb-8 flex flex-col items-center text-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo.png"
                    alt="Barangay seal"
                    className="mb-5 h-28 w-28 rounded-3xl bg-white/80 p-1.5 shadow-xl ring-1 ring-emerald-200/70 dark:bg-white/10 dark:ring-emerald-700/60"
                  />
                  <h1 className="text-2xl font-bold tracking-tight">
                    Resident Login
                  </h1>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Access your barangay resident portal
                  </p>
                </div>

                <Link
                  href="/login"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-colors hover:bg-emerald-500"
                >
                  Go to Resident Login
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  Floating label field                                               */
/* ------------------------------------------------------------------ */

function FloatingField({
  id,
  name,
  type,
  label,
  autoComplete,
  icon: Icon,
  value,
  onChange,
}: {
  id: string;
  name: string;
  type: string;
  label: string;
  autoComplete: string;
  icon: LucideIcon;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="group relative">
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-11 top-1/2 -translate-y-1/2 text-sm text-slate-500 transition-all duration-200 group-focus-within:-translate-y-2.5 group-focus-within:text-amber-600 dark:text-slate-400 dark:group-focus-within:text-amber-400 group-has-[:not(:placeholder-shown)]:-translate-y-2.5 group-has-[:not(:placeholder-shown)]:text-amber-600 dark:group-has-[:not(:placeholder-shown)]:text-amber-400"
      >
        {label}
      </label>
      <Icon
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-amber-600 dark:group-focus-within:text-amber-400"
        aria-hidden
      />
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={label}
        autoComplete={autoComplete}
        className="h-12 w-full rounded-xl border border-slate-200/70 bg-white/80 pl-11 pr-4 text-sm text-slate-900 outline-none transition-colors placeholder:invisible focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-100 dark:focus:border-amber-500"
      />
    </div>
  );
}