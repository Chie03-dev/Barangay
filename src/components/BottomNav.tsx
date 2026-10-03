"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, FileText, Clock, User, Contact, type LucideIcon } from "lucide-react";
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
  { label: "Contact", href: "/contact", icon: Contact },
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
      className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-3"
    >
      <div className="flex w-fit max-w-full items-center justify-center gap-1 rounded-full border border-slate-200/50 bg-white/80 px-2 py-2 shadow-2xl backdrop-blur-xl sm:gap-2 sm:px-4 sm:py-3 dark:border-slate-800/50 dark:bg-slate-900/80">
        {/* Brand mark - hidden on the narrowest screens to save width */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.svg"
          alt="Barangay seal"
          className="mr-0.5 hidden h-8 w-8 shrink-0 rounded-full shadow-sm ring-1 ring-slate-200/70 sm:block sm:mr-1 dark:ring-slate-800"
        />

        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              aria-label={item.label}
              className="group relative z-10 shrink-0 rounded-full p-2.5 sm:p-3"
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
                    "h-[1.15rem] w-[1.15rem] transition-colors duration-200 sm:h-5 sm:w-5",
                    isActive
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-slate-500 group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-slate-100",
                  )}
                  aria-hidden
                />
              </motion.span>

              {/* Hover tooltip */}
              <span className="pointer-events-none absolute -top-9 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 sm:block dark:bg-slate-100 dark:text-slate-900">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}