"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, FileText, Clock, User, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Services", href: "/services", icon: FileText },
  { label: "Track", href: "/track", icon: Clock },
  { label: "Profile", href: "/profile", icon: User },
];

const HIDDEN_PATHS = ["/", "/login"];

export default function BottomNav() {
  const pathname = usePathname();

  if (!pathname || HIDDEN_PATHS.includes(pathname)) return null;

  return (
    <motion.nav
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 26, delay: 0.1 }}
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
    >
      <div className="flex items-center gap-2 rounded-full border border-slate-200/50 bg-white/80 px-4 py-3 shadow-2xl backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/80">
        {/* Brand mark */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.svg"
          alt="Barangay seal"
          className="mr-1 h-8 w-8 rounded-full shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-800"
        />

        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className="group relative z-10 rounded-full p-3"
            >
              {isActive && (
                <motion.span
                  layoutId="nav-pill"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute inset-0 -z-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30"
                />
              )}

              <motion.span
                animate={
                  isActive ? { scale: 1.1, y: -2 } : { scale: 1, y: 0 }
                }
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="block"
              >
                <Icon
                  className={cn(
                    "h-5 w-5 transition-colors duration-200",
                    isActive
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-slate-500 group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-slate-100",
                  )}
                  aria-hidden
                />
              </motion.span>

              {/* Hover tooltip */}
              <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 dark:bg-slate-100 dark:text-slate-900">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}