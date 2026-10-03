import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import AmbientCodeStream from "@/components/AmbientCodeStream";

export const metadata: Metadata = {
  title: "Barangay Portal",
  description: "Resident portal for the barangay",
};

/**
 * Applies the stored theme before React hydrates so the page never flashes
 * the wrong background. Kept as a string so Next inlines it in <head>.
 *
 * First-time visitors get dark mode: it is the portal's primary brand
 * mode, and we only defer to the OS once the user has actually picked a
 * theme and we have a stored value to honour.
 */
const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    // No stored preference yet -> dark is the default.
    var isDark = stored ? stored === 'dark' : true;
    document.documentElement.classList.toggle('dark', isDark);
  } catch (e) {
    /* localStorage unavailable (private mode) - default to dark. */
    document.documentElement.classList.toggle('dark', true);
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
        {/* Edge code stream - fades in when the cursor nears a screen edge. */}
        <AmbientCodeStream />
        {children}
        <BottomNav />
      </body>
    </html>
  );
}