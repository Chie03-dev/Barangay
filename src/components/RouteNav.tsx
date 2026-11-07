"use client";

import { usePathname } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import {
  Home,
  Users,
  AlertCircle,
  FileText,
} from "lucide-react";

const OFFICIAL_NAV_ITEMS = [
  { label: "Dashboard", href: "/officials", icon: Home },
  { label: "Directory", href: "/officials/directory", icon: Users },
  { label: "Reports", href: "/reports", icon: AlertCircle },
  { label: "Services", href: "/services", icon: FileText },
];

export default function RouteNav() {
  const pathname = usePathname();
  const isOfficial = pathname === "/officials" || pathname?.startsWith("/officials/");

  return (
    <>
      {isOfficial ? (
        <BottomNav
          items={OFFICIAL_NAV_ITEMS}
          brandHref="/officials/directory"
          brandLabel="Barangay Officials Directory"
        />
      ) : (
        <BottomNav />
      )}
    </>
  );
}