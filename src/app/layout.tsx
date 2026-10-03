import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Barangay Portal",
  description: "Resident portal for the barangay",
};

/**
 * Applies the stored theme before React hydrates so the page never flashes
 * the wrong background. Kept as a string so Next inlines it in <head>.
 */
const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = stored ? stored === 'dark' : prefersDark;
    document.documentElement.classList.toggle('dark', isDark);
  } catch (e) {
    /* localStorage unavailable (private mode) - fall back to light. */
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="relative min-h-screen overflow-x-hidden bg-slate-100 font-sans text-slate-900 transition-colors duration-300 antialiased dark:bg-slate-950 dark:text-slate-100">
        {/* Ambient mesh orbs sit behind all page content. */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-900/20" />
          <div className="absolute -left-40 top-1/2 h-96 w-96 rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-900/10" />
          <div className="absolute -bottom-40 right-1/4 h-96 w-96 rounded-full bg-teal-100/50 blur-3xl dark:bg-slate-900/30" />
        </div>
        {children}
        <BottomNav />
      </body>
    </html>
  );
}