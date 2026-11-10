"use client";

import { useEffect, useState } from "react";
import { Printer, X, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function PrintTrigger() {
  const [stage, setStage] = useState<"printing" | "done" | null>("printing");

  useEffect(() => {
    const handleAfterPrint = () => setStage("done");
    window.addEventListener("afterprint", handleAfterPrint);
    window.print();
    return () => window.removeEventListener("afterprint", handleAfterPrint);
  }, []);

  if (stage === "done") {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(15, 23, 42, 0.85)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff" }}>
        <div style={{ textAlign: "center", padding: "24px", background: "rgba(30, 41, 59, 0.9)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)" }}>
          <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400 mb-4" aria-hidden />
          <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "8px", color: "#ffffff" }}>Document sent to printer</h2>
          <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "16px" }}>You can close this tab.</p>
          <button
            onClick={() => window.close()}
            className="flex items-center justify-center gap-2 w-full max-w-xs mx-auto h-10 rounded-xl bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors"
          >
            <X className="h-4 w-4" aria-hidden />
            Close tab
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(15, 23, 42, 0.85)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff" }}>
      <div style={{ textAlign: "center", padding: "24px", background: "rgba(30, 41, 59, 0.9)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)" }}>
        <Printer className="mx-auto h-10 w-10 text-emerald-400 mb-4 animate-pulse" aria-hidden />
        <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "8px", color: "#ffffff" }}>Printing document…</h2>
        <p style={{ fontSize: "13px", color: "#94a3b8" }}>If the print dialog doesn't appear, press Ctrl+P (or Cmd+P).</p>
      </div>
    </div>
  );
}
