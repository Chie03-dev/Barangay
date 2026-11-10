"use client";

import { useEffect } from "react";

export function PrintTrigger() {
  useEffect(() => {
    const handleAfterPrint = () => window.close();
    window.addEventListener("afterprint", handleAfterPrint);
    window.print();
    return () => window.removeEventListener("afterprint", handleAfterPrint);
  }, []);

  return null;
}
