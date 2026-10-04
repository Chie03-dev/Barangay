"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Download,
  Send,
  CheckCircle2,
  Globe,
  Code2,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";
import { cn, glass } from "@/lib/utils";
import { useCalmMotion } from "@/hooks/useCalmMotion";

/* ------------------------------------------------------------------ */
/*  Profile data                                                       */
/* ------------------------------------------------------------------ */

const PROFILE = {
  name: "Marben Clyde Maglangit",
  role: "Barangay Management Portal",
  title: "Real niga",
  bio: "Teacher at jrmsu by day. Freelance developer by night.",
  email: "maglangitmarvinc@gmail.com",
  phone: "+63 998 983 5678",
  location: "071 Amatong Street, Miputak Dipolog City",
  skills: ["good person", "not bad", "happy", "like french", "dili manglibri"],
};

const LINKS: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Source code", href: "https://www.youtube.com/shorts/UAl9MyjJevY", icon: Code2 },
  { label: "Portfolio", href: "https://www.youtube.com/shorts/gsQc4Fkmhgs", icon: Globe },
];

const fieldLabel =
  "mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300";

const inputClass =
  "w-full rounded-xl border border-slate-200/70 bg-white/80 px-4 py-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-900/60 dark:focus:border-emerald-500";
/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ContactPage() {
  const calm = useCalmMotion();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const canSend =
    name.trim().length > 0 &&
    email.includes("@") &&
    subject.trim().length > 0 &&
    message.trim().length > 0;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSend) return;
    setIsSending(true);
    // Simulated send - replace with the real API/mail endpoint.
    await new Promise((resolve) => setTimeout(resolve, 1400));
    setIsSending(false);
    setSent(true);
  }

  function resetForm() {
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setSent(false);
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-10 pb-32">
      {/* Header */}
      <header className="mb-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        >
          <MessageSquare className="h-6 w-6" aria-hidden />
        </motion.div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Contact &amp; Developer Profile
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Questions about the portal, or want to work together? Reach out below.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Profile card */}
        <motion.section
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 24 }}
          className={cn(glass, "overflow-hidden p-6 lg:col-span-2")}
        >
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/profile.webp"
                alt={`Portrait of ${PROFILE.name}`}
                className="h-28 w-28 rounded-2xl object-cover shadow-lg ring-2 ring-emerald-500/30"
              />
              <motion.span
                animate={calm ? undefined : { scale: [1, 1.12, 1] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg ring-2 ring-white"
              >
                <CheckCircle2 className="h-4 w-4" aria-hidden />
              </motion.span>
            </div>

            <h2 className="mt-5 text-xl font-bold">{PROFILE.name}</h2>
            <p className="mt-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
              {PROFILE.title}
            </p>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {PROFILE.role}
            </p>

            <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {PROFILE.bio}
            </p>
          </div>

          {/* Skills */}
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {PROFILE.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              >
                {skill}
              </span>
            ))}
          </div>
{/* Contact details */}
          <div className="mt-6 space-y-1 border-t border-slate-200/60 pt-5 dark:border-slate-800">
            <ContactRow
              icon={Mail}
              label="Email"
              value={PROFILE.email}
              href={`mailto:${PROFILE.email}`}
            />
            <ContactRow
              icon={Phone}
              label="Phone"
              value={PROFILE.phone}
              href={`tel:${PROFILE.phone.replace(/\s/g, "")}`}
            />
            <ContactRow
              icon={MapPin}
              label="Location"
              value={PROFILE.location}
            />
          </div>

          {/* Social links */}
          <div className="mt-4 flex justify-center gap-2">
            {LINKS.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-colors hover:bg-emerald-500 hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-emerald-500 dark:hover:text-white"
              >
                <link.icon className="h-4 w-4" aria-hidden />
              </motion.a>
            ))}
          </div>

          {/* Download resume */}
          <a
            href="/resume.pdf"
            download="giganiga.pdf"
            className="mt-6 block"
          >
            <motion.span
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-colors hover:bg-emerald-500"
            >
              <Download className="h-4 w-4" aria-hidden />
              Download Resume
            </motion.span>
          </a>
        </motion.section>
{/* Contact form */}
        <motion.section
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 24 }}
          className={cn(glass, "p-6 lg:col-span-3")}
        >
          <div className="flex items-center gap-2.5">
            <Send
              className="h-4 w-4 text-emerald-600 dark:text-emerald-400"
              aria-hidden
            />
            <h2 className="text-base font-semibold">Send a Message</h2>
          </div>

          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center py-12 text-center"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: [0, 1.15, 1], rotate: [-30, 8, 0] }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10"
                >
                  <CheckCircle2
                    className="h-12 w-12 text-emerald-600 dark:text-emerald-400"
                    aria-hidden
                  />
                </motion.div>
                <h3 className="text-lg font-bold">Message Sent!</h3>
                <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                  Thanks for reaching out, {name.split(" ")[0]}. I&apos;ll get
                  back to you at {email} shortly.
                </p>
                <motion.button
                  type="button"
                  onClick={resetForm}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-300/80 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-800 transition-colors hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-800 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:hover:border-emerald-500/60 dark:hover:bg-slate-800 dark:hover:text-emerald-300"
                >
                  Send Another Message
                </motion.button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="mt-5 space-y-5"
              >
<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className={fieldLabel}>
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className={fieldLabel}>
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className={fieldLabel}>
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="What is this about?"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="message" className={fieldLabel}>
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell me a little about your project or question..."
                    className={cn(inputClass, "resize-none")}
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={!canSend || isSending}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSending ? (
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
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" aria-hidden />
                      Send Message
                    </>
                  )}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.section>
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  Contact detail row                                                 */
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
  const content = (
    <>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs uppercase tracking-wide text-slate-400">
          {label}
        </span>
        <span className="mt-0.5 block truncate text-sm font-medium">
          {value}
        </span>
      </span>
    </>
  );

  const className =
    "flex items-center gap-4 rounded-xl px-3 py-3 transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40";

  return href ? (
    <a href={href} className={className}>
      {content}
    </a>
  ) : (
    <div className={className}>{content}</div>
  );
}