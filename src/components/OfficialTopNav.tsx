"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Shield,
  Users,
  FileText,
  AlertCircle,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Home,
  type LucideIcon,
} from "lucide-react";
import { cn, glass } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const OFFICIAL_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/own", icon: Home },
  { label: "Officials Directory", href: "/officials", icon: Users },
  { label: "Reports", href: "/reports", icon: AlertCircle },
  { label: "Services", href: "/services", icon: FileText },
];

export default function OfficialTopNav({
  officialName,
  officialRole,
}: {
  officialName: string;
  officialRole: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const initials = officialName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const signOut = () => {
    document.cookie = `barangay_session=; path=/; max-age=0`;
    document.cookie = `barangay_official_session=; path=/; max-age=0`;
    router.push("/login");
  };

  return (
    <>
      {/* Desktop top nav */}
      <nav
        className={cn(
          "sticky top-0 z-30 border-b border-slate-200/80 dark:border-slate-800/50",
          glass,
        )}
      >
        <div className="px-6 py-3.5 flex items-center justify-between">
          {/* Brand */}
          <Link
            href="/own"
            className="flex items-center gap-2.5"
            aria-current={pathname === "/own" ? "page" : undefined}
          >
            <Shield className="h-6 w-6 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
            <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100">
              Barangay Officials
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            {OFFICIAL_NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors",
                    isActive
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                      : "text-slate-600 hover:bg-slate-100 hover:text-emerald-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-emerald-400",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop user area */}
          <div className="hidden md:flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end gap-0.5">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {officialName}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {officialRole}
              </p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 font-medium">
              {initials}
            </div>
            <button
              type="button"
              onClick={signOut}
              className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              <LogOut className="h-4 w-4 shrink-0" aria-hidden />
              <span>Sign out</span>
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden flex items-center gap-1 rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X className="h-5 w-5" aria-hidden />
            ) : (
              <Menu className="h-5 w-5" aria-hidden />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-slate-900/80 backdrop-blur-sm dark:bg-slate-950/90"
              onClick={() => setMenuOpen(false)}
            />
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-xs bg-white dark:bg-slate-900 border-l border-slate-200/80 dark:border-slate-800/50 flex flex-col"
            >
              <div className="px-6 py-5 flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50">
                <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Menu
                </span>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" aria-hidden />
                </button>
              </div>
              <div className="py-4 space-y-1">
                {OFFICIAL_NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-6 py-3 text-sm font-medium rounded-xl transition-colors",
                        isActive
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100",
                      )}
                    >
                      <Icon className="h-5 w-5 shrink-0" aria-hidden />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
              <div className="px-6 py-5 border-t border-slate-200/50 dark:border-slate-800/50">
                <div className="flex flex-col items-end gap-0.5 mb-4">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {officialName}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {officialRole}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    signOut();
                  }}
                  className="w-full flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-rose-50 hover:text-rose-600 dark:border-slate-700 dark:hover:bg-rose-900/10 dark:text-rose-400 dark:hover:text-rose-300"
                >
                  <LogOut className="h-4 w-4 shrink-0" aria-hidden />
                  Sign out
                </button>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Desktop user dropdown */}
      <AnimatePresence>
        {userMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setUserMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200/80 bg-white shadow-xl dark:border-slate-800/50 dark:bg-slate-900 py-2"
            >
              <div className="px-4 py-3 border-b border-slate-100/80 dark:border-slate-800/50">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {officialName}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {officialRole}
                </p>
              </div>
              <button
                type="button"
                onClick={signOut}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/10"
              >
                <LogOut className="h-4 w-4 shrink-0" aria-hidden />
                Sign out
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}