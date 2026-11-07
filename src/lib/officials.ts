import {
  Crown,
  Users,
  FileText,
  Wallet,
  Baby,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Officials data — single source of truth for the directory and the */
/*  official profile page.                                            */
/* ------------------------------------------------------------------ */

export type Tier = "captain" | "councilors" | "staff";

export type Official = {
  id: string;
  name: string;
  role: string;
  tier: Tier;
  photo: string;
  committees: string[];
  contact: string;
  email: string;
  hours: string;
  tenure?: string;
  icon: LucideIcon;
  /** Short description of the office and its responsibilities. */
  bio: string;
  /** Services residents can ask this official about. */
  services: string[];
};

export const P1 = "/Portrait_Placeholder.png";
export const P2 = "/Portrait_Placeholder.png";

export const OFFICIALS: Official[] = [
  {
    id: "captain",
    name: "Marben Clyde Maglangit",
    role: "Punong Barangay",
    tier: "captain",
    photo: P1,
    committees: ["General Administration", "Peace & Order"],
    contact: "+63 917 123 4567",
    email: "captain@barangay.gov.ph",
    hours: "Mon-Fri, 8:00 AM - 5:00 PM",
    tenure: "2022 - 2025",
    icon: Crown,
    bio:
      "Chief executive of the barangay. Oversees general administration,\npeace and order, and the delivery of basic services to residents.",
    services: ["Barangay Clearance", "Certifications", "Peace & Order Concerns"],
  },
  {
    id: "kagawad-1",
    name: "Ana Rebecca Santos",
    role: "Barangay Kagawad",
    tier: "councilors",
    photo: P2,
    committees: ["Health & Sanitation", "Youth & Sports"],
    contact: "+63 917 555 0101",
    email: "kagawad.santos@barangay.gov.ph",
    hours: "Mon, Wed, Fri, 9:00 AM - 12:00 NN",
    icon: Users,
    bio:
      "Councilor on health, sanitation, and youth programs. Chairs the\nhealth and sanitation committee and coordinates barangay health center\nactivities.",
    services: ["Health Certificates", "Youth Programs", "Sanitation Concerns"],
  },
  {
    id: "kagawad-2",
    name: "Jose Allan Rivera",
    role: "Barangay Kagawad",
    tier: "councilors",
    photo: P1,
    committees: ["Infrastructure", "Utilities"],
    contact: "+63 917 555 0102",
    email: "kagawad.rivera@barangay.gov.ph",
    hours: "Tue, Thu, Sat, 9:00 AM - 12:00 NN",
    icon: Users,
    bio:
      "Councilor on infrastructure and utilities. Oversees barangay roads,\nstreetlights, water systems, and public works projects.",
    services: ["Infrastructure Requests", "Streetlight Repair", "Utilities Coordination"],
  },
  {
    id: "kagawad-3",
    name: "Liezl Mae Navarro",
    role: "Barangay Kagawad",
    tier: "councilors",
    photo: P2,
    committees: ["Women & Children", "Education"],
    contact: "+63 917 555 0103",
    email: "kagawad.navarro@barangay.gov.ph",
    hours: "Mon, Wed, 1:00 PM - 4:00 PM",
    icon: Users,
    bio:
      "Councilor on women, children, and education. Advocates for child\nprotection, women's programs, and local education initiatives.",
    services: ["Women's Desk", "Scholarship Endorsement", "Child Welfare"],
  },
  {
    id: "secretary",
    name: "Rodel P. Abella",
    role: "Barangay Secretary",
    tier: "staff",
    photo: P2,
    committees: ["Records & Documentation"],
    contact: "+63 917 555 0201",
    email: "secretary@barangay.gov.ph",
    hours: "Mon-Fri, 8:00 AM - 5:00 PM",
    icon: FileText,
    bio:
      "Keeps barangay records, meeting minutes, and official documents.\nManages certifications and document requests from residents.",
    services: ["Document Requests", "Meeting Minutes", "Records & Archives"],
  },
  {
    id: "treasurer",
    name: "Grace T. Lim",
    role: "Barangay Treasurer",
    tier: "staff",
    photo: P1,
    committees: ["Finance & Budget"],
    contact: "+63 917 555 0202",
    email: "treasurer@barangay.gov.ph",
    hours: "Mon-Fri, 8:00 AM - 5:00 PM",
    icon: Wallet,
    bio:
      "Manages barangay funds, the annual budget, and financial reports.\nOversees revenue collection and disbursement.",
    services: ["Business Permit Fees", "Clearance Payments", "Financial Statements"],
  },
  {
    id: "sk-chair",
    name: "Miguel D. Aquino",
    role: "SK Chairperson",
    tier: "staff",
    photo: P2,
    committees: ["Sangguniang Kabataan", "Programs"],
    contact: "+63 917 555 0203",
    email: "skchair@barangay.gov.ph",
    hours: "Mon-Sat, 4:00 PM - 6:00 PM",
    icon: Baby,
    bio:
      "Chairs the Sangguniang Kabataan and leads youth programs, sports\ndevelopment, and student scholarships in the barangay.",
    services: ["SK Membership", "Youth Events", "Sports Tournaments"],
  },
];

/** First letters of the first two words, for portrait fallbacks. */
export function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

/** Find an official by id, falling back to the Punong Barangay. */
export function findOfficial(
  id: string | null | undefined,
): Official {
  return (
    OFFICIALS.find((o) => o.id === id) ??
    OFFICIALS.find((o) => o.tier === "captain")!
  );
}
