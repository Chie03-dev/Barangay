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
  { label: "Dashboard", href: "/own", icon: Home },
  { label: "Directory", href: "/officials", icon: Users },
  { label: "Reports", href: "/reports", icon: AlertCircle },
  { label: "Services", href: "/services", icon: FileText },
];

export default function RouteNav() {
  const pathname = usePathname();
  const isOwn = pathname === "/own" || pathname?.startsWith("/own/");

  return (
    <>
      {isOwn ? (
        <BottomNav
          items={OFFICIAL_NAV_ITEMS}
          brandHref="/officials"
          brandLabel="Barangay Officials Directory"
        />
      ) : (
        <BottomNav />
      )}
    </>
  );
}