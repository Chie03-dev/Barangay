"use client";
import { Suspense, useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
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
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SESSION_COOKIE } from "@/lib/auth";
import { useCalmMotion } from "@/hooks/useCalmMotion";
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
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [slide, setSlide] = useState(0);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const calm = useCalmMotion();
  // Only allow same-origin relative paths, so `?next=` can't be used to
  // redirect a resident to an external site.
  const rawNext = searchParams.get("next");
  const nextPath =
    rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//")
      ? rawNext
      : "/dashboard";
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
    if (calm) return;
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
    setIsAuthenticating(true);
    // Mock auth: there is no backend yet, so any submit goes straight
    // through. Wire a real sign-in call here when the backend lands.
    document.cookie = `${SESSION_COOKIE}=1; path=/; max-age=${
      60 * 60 * 24 * 7
    }; samesite=lax`;
    // Return the resident to wherever the middleware bounced them from.
    router.push(nextPath);
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
            loading="lazy"
            decoding="async"
            // Cross-fade only; the Ken Burns scale is driven by the 6s
            // transition below so new slides don't "pop" in at 1.08x.
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, scale: calm ? 1.02 : 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1.4, ease: "easeInOut" },
              scale: { duration: SLIDE_MS / 1000, ease: "linear" },
            }}
            className="absolute inset-0 h-full w-full object-cover motion-reduce:transition-none fetchPriority=high"
          />
        </AnimatePresence>
        {/*
          Scrim. In light mode the photography is dimmed less and tinted warm
          so the pale card still reads as sitting on a deliberate surface,
          rather than a white panel floating on near-black.
        */}
        <div className="absolute inset-0 bg-slate-900/45 backdrop-blur-[2px] max-sm:backdrop-blur-none dark:bg-slate-950/60" />
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
            onClick={() => setSlide(i)}
            aria-label={`Show background ${i + 1}`}
            className={cn(
                "group relative h-1 w-8 overflow-hidden rounded-full bg-white/45 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:bg-white/25",
                i === slide && "bg-white/60 dark:bg-white/40"
              )}
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
      {/* Slideshow prev / next */}
      <button
        type="button"
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full flex items-center justify-center border border-white/30 bg-black/20 text-white hover:bg-white/40 transition-colors backdrop-blur-sm"
        onClick={() => setSlide((s) => (s - 1 + SLIDES.length) % SLIDES.length)}
        aria-label="Previous background"
      >
        <ChevronLeft className="h-5 w-5" aria-hidden />
      </button>
      <button
        type="button"
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full flex items-center justify-center border border-white/30 bg-black/20 text-white hover:bg-white/40 transition-colors backdrop-blur-sm"
        onClick={() => setSlide((s) => (s + 1) % SLIDES.length)}
        aria-label="Next background"
      >
        <ChevronRight className="h-5 w-5" aria-hidden />
      </button>
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
          "border-slate-200 bg-white shadow-sm shadow-slate-200/40",
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

          {/* Sliding thin line accent */}
          <motion.div
            animate={{ x: ["-100%", "100%"] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "linear",
            }}
            className="mt-6 w-full h-2 rounded-full overflow-hidden bg-slate-200/60 dark:bg-slate-800/50"
          >
            <motion.div
              className="h-full w-1/3 bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.6)] dark:shadow-[0_0_16px_rgba(16,185,129,0.4)]"
            />
          </motion.div>
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
            disabled={isAuthenticating}
            whileHover={isAuthenticating ? undefined : { scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-colors hover:bg-emerald-500 disabled:opacity-70 disabled:cursor-not-allowed"
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
                Sign In
                <ArrowRight className="h-4 w-4" aria-hidden />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </main>
  );
}
/* ------------------------------------------------------------------ */
/*  Route entry - Suspense keeps useSearchParams from opting the        */
/*  page out of static prerendering.                                   */
/* ------------------------------------------------------------------ */
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-slate-950">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-500/30 border-t-emerald-500" />
        </main>
      }
    >
      <LoginForm />
    </Suspense>
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
          "relative rounded-xl border bg-slate-50 transition-all duration-200 dark:bg-slate-900/50",
          "border-slate-300 dark:border-slate-800",
          "focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/15",
          "focus-within:shadow-lg focus-within:shadow-emerald-500/10",
        )}
      >
        <Icon
          className="pointer-events-none absolute left-4 top-[2.625rem] h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden
        />
        <label
          htmlFor={id}
          className={cn(
            "pointer-events-none absolute left-11 origin-left text-slate-500 transition-all duration-200 ease-out",
            "dark:text-slate-400",
            // Float up when the field is focused or has content.
            isFloating
              ? "top-2 text-xs font-medium text-slate-700 dark:text-slate-300"
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
            "w-full rounded-xl bg-transparent pb-2 pt-10 pl-11 pr-4 text-sm outline-none transition-colors",
            "text-slate-900 dark:text-slate-100",
          )}
        />
      </div>
    </div>
  );
}