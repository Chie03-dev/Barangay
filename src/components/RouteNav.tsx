"use client";

import { usePathname } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import OfficialTopNav from "@/components/OfficialTopNav";

export default function RouteNav() {
  const pathname = usePathname();
  const isOwn = pathname === "/own" || pathname?.startsWith("/own/");

  return (
    <>
      {isOwn ? (
        <OfficialTopNav
          officialName="Marben Clyde Maglangit"
          officialRole="Punong Barangay"
        />
      ) : (
        <BottomNav />
      )}
    </>
  );
}
