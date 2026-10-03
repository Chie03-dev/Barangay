"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  Mail,
  Lock,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Slideshow                                                          */
/* ------------------------------------------------------------------ */

const SLIDES = [
  "https://images.pexels.com/photos/4673995/pexels-photo-4673995.jpeg",
  "https://images.pexels.com/photos/27429709/pexels-photo-27429709.jpeg",
  "https://images.pexels.com/photos/35642939/pexels-photo-35642939.jpeg",
  "https://images.pexels.com/photos/33072140/pexels-photo-33072140.jpeg",
];

const SLIDE_MS = 6000;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [slide, setSlide] = useState(0);

  // 3D tilt driven by pointer position.
  const rotateX = useSpring(useMotionValue(0), { stiffness: 220, damping: 20 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 220, damping: 20 });

  // Advance the slideshow.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(
      () => setSlide((s) => (s + 1) % SLIDES.length),
      SLIDE_MS,
    );
    return () => clearInterval(id);
  }, []);

  function handleMove(event: React.MouseEvent<HTMLDivElement>) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 10);
    rotateX.set(-py * 10);
  }

  function handleLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Mock auth: there is no backend yet, so any submit goes straight
    // through. Wire a real sign-in call here when the backend lands.
    router.push("/dashboard");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      {/* Cinematic slideshow */}
      <div aria-hidden className="absolute inset-0 -z-20">
        <AnimatePresence initial={false}>
          <motion.img
            key={slide}
            src={SLIDES[slide]}
            alt=""
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1.4, ease: "easeInOut" },
              scale: { duration: SLIDE_MS / 1000, ease: "linear" },
            }}
            className="absolute inset-0 h-full w-full object-cover motion-reduce:transition-none"
          />
        </AnimatePresence>

        {/*
          Scrim. In light mode the photography is dimmed less and tinted warm
          so the pale card still reads as sitting on a deliberate surface,
          rather than a white panel floating on near-black.
        */}
        <div className="absolute inset-0 bg-slate-900/45 backdrop-blur-[2px] dark:bg-slate-950/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-slate-900/30 dark:from-slate-950/80 dark:to-slate-950/40" />
      </div>

      {/* Slide indicators */}
      <div
        aria-hidden
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2"
      >
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            tabIndex={-1}
            onClick={() => setSlide(i)}
            aria-label={`Show background ${i + 1}`}
            className="group relative h-1 w-8 overflow-hidden rounded-full bg-white/45 transition-all dark:bg-white/25"
          >
            <motion.span
              className="absolute inset-y-0 left-0 rounded-full bg-emerald-400"
              initial={false}
              animate={{ width: i === slide ? "100%" : "0%" }}
              transition={{ duration: i === slide ? SLIDE_MS / 1000 : 0.3 }}
            />
          </button>
        ))}
      </div>

      <motion.div
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ rotateX, rotateY, transformPerspective: 1200 }}
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "w-full max-w-md rounded-3xl border p-8 shadow-2xl backdrop-blur-2xl motion-reduce:transform-none",
          // Light: nearly opaque with a defined edge, so it reads as a solid
          // card instead of a washed-out translucent panel.
          "border-slate-200/90 bg-slate-50/95 shadow-slate-900/20",
          // Dark: keeps the glassy translucency.
          "dark:border-slate-700/80 dark:bg-slate-900/70 dark:shadow-black/40",
        )}
      >
        <div className="mb-8 flex flex-col items-center text-center">
          {/* Barangay crest, served from public/logo.png */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Barangay seal"
            className="mb-5 h-28 w-28 rounded-3xl bg-white/80 p-1.5 shadow-xl ring-1 ring-slate-200/70 dark:bg-white/10 dark:ring-slate-700"
          />
          <h1 className="text-2xl font-bold tracking-tight">
            Sign in to your account
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Access your barangay resident portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <FloatingField
            id="email"
            name="email"
            type="email"
            label="Email"
            autoComplete="email"
            icon={Mail}
            value={email}
            onChange={setEmail}
          />

          <FloatingField
            id="password"
            name="password"
            type="password"
            label="Password"
            autoComplete="current-password"
            icon={Lock}
            value={password}
            onChange={setPassword}
          />

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-colors hover:bg-emerald-500"
          >
            Sign In
            <ArrowRight className="h-4 w-4" aria-hidden />
          </motion.button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Protected by the Barangay&apos;s data privacy policy.
        </p>
      </motion.div>
    </main>
  );
}
/* ------------------------------------------------------------------ */
/*  Floating-label input with validation state                         */
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
  const isFloating = value.length > 0;

  return (
    <div>
      <div
        className={cn(
          "relative rounded-xl border bg-white transition-all duration-200 dark:bg-slate-900/50",
          "border-slate-200/80 dark:border-slate-800",
          "focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/15",
          "focus-within:shadow-lg focus-within:shadow-emerald-500/10",
        )}
      >
        <Icon
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden
        />

        <label
          htmlFor={id}
          className={cn(
            "pointer-events-none absolute left-11 origin-left text-slate-500 transition-all duration-200 ease-out",
            "dark:text-slate-400",
            // Float up when the field is focused or has content.
            isFloating
              ? "top-2 text-xs font-medium text-slate-600 dark:text-slate-300"
              : "top-1/2 -translate-y-1/2 text-sm",
          )}
        >
          {label}
        </label>

        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
          className={cn(
            "w-full rounded-xl bg-transparent pb-2 pt-6 pl-11 pr-4 text-sm outline-none transition-colors",
            "text-slate-900 dark:text-slate-100",
          )}
        />
      </div>
    </div>
  );
}