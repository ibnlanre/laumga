import type { LucideIcon } from "lucide-react";
import {
  BellRing,
  CalendarDays,
  CheckCircle2,
  FileText,
  Images,
  LayoutGrid,
  LineChart,
  Link2,
  Newspaper,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";

type NavMatch = (pathname: string, search: Record<string, unknown>) => boolean;

export interface AdminNavItem {
  label: string;
  to: string;
  description: string;
  icon: LucideIcon;
  match?: NavMatch;
  badgeKey?: "pendingMembers" | "alerts";
}

export interface AdminNavGroup {
  label: string;
  items: AdminNavItem[];
}

const matchPath = (base: string): NavMatch => {
  return (pathname) => pathname === base || pathname.startsWith(`${base}/`);
};

const matchExact = (base: string): NavMatch => {
  return (pathname) => pathname === base || pathname === `${base}/`;
};

export const adminNavGroups: AdminNavGroup[] = [
  {
    label: "Core",
    items: [
      {
        label: "Dashboard",
        to: "/admin",
        description: "Command center",
        icon: LayoutGrid,
        match: matchExact("/admin"),
      },
      {
        label: "Member Directory",
        to: "/admin/users",
        description: "Registry & profiles",
        icon: Users,
        badgeKey: "pendingMembers",
        match: matchPath("/admin/users"),
      },
      {
        label: "Approvals",
        to: "/admin/approvals",
        description: "Verification queue",
        icon: CheckCircle2,
        match: matchExact("/admin/approvals"),
      },
    ],
  },
  {
    label: "Finance",
    items: [
      {
        label: "Overview",
        to: "/admin/mandates",
        description: "Mandate health",
        icon: LineChart,
        match: matchPath("/admin/mandates"),
      },
      {
        label: "Transactions",
        to: "/admin/mandates?view=transactions",
        description: "Debits & inflow",
        icon: Wallet,
        match: (pathname, search) =>
          pathname === "/admin/mandates" && search?.view === "transactions",
      },
      {
        label: "Payment Partners",
        to: "/admin/payment-partners",
        description: "Mono accounts",
        icon: Link2,
        match: matchPath("/admin/payment-partners"),
      },
    ],
  },
  {
    label: "Content",
    items: [
      {
        label: "Events & Calendar",
        to: "/admin/events",
        description: "Programming cadence",
        icon: CalendarDays,
        match: matchPath("/admin/events"),
      },
      {
        label: "News/Bulletin",
        to: "/admin/articles",
        description: "Editorial planning",
        icon: Newspaper,
        match: matchPath("/admin/articles"),
      },
      {
        label: "Gallery Manager",
        to: "/admin/gallery",
        description: "Media library",
        icon: Images,
        match: matchPath("/admin/gallery"),
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        label: "Roles & Permissions",
        to: "/admin/roles",
        description: "Access control",
        icon: ShieldCheck,
        match: matchPath("/admin/roles"),
      },
      {
        label: "Audit Logs",
        to: "/admin/audit-logs",
        description: "Trace every change",
        icon: FileText,
        match: matchExact("/admin/audit-logs"),
      },
      {
        label: "Alerts",
        to: "/admin/alerts",
        description: "System signals",
        icon: BellRing,
        match: matchExact("/admin/alerts"),
        badgeKey: "alerts",
      },
    ],
  },
];
