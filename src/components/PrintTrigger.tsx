"use client";

import { useEffect } from "react";

export function PrintTrigger() {
  useEffect(() => {
    window.print();
  }, []);
  return null;
}
