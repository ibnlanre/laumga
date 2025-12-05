import { useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, FileText, Award } from "lucide-react";
import { Link } from "@tanstack/react-router";
import clsx from "clsx";

interface MandateHeaderProps {
  isLanding?: boolean;
  disableInteractions?: boolean;
  className?: string;
}

export function MandateHeader({
  isLanding,
  disableInteractions = !!isLanding,
  className,
}: MandateHeaderProps) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isActive = (path: string) => currentPath === path;

  const navItems = [
    {
      label: "Overview",
      href: "/mandate",
      icon: LayoutDashboard,
    },
    {
      label: "Dashboard",
      href: "/mandate/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Pledge",
      href: "/mandate/pledge",
      icon: FileText,
    },
    {
      label: "Certificate",
      href: "/mandate/certificate",
      icon: Award,
    },
  ];

  return (
    <div
      className={`${
        disableInteractions ? "pointer-events-none" : "pointer-events-auto"
      } inset-x-0`}
    >
      <div className={clsx("container mx-auto", className)}>
        <nav
          className={`flex w-full flex-nowrap items-center gap-2 overflow-x-auto rounded-full px-4 py-2 text-sm font-medium transition-all sm:flex-wrap sm:overflow-visible ${
            isLanding
              ? "pointer-events-auto border border-white/20 bg-deep-forest/50 text-white shadow-xl backdrop-blur"
              : "bg-white/95 text-gray-700 shadow-sm border-sage-green/40"
          } [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
          aria-label="Mandate destinations"
        >
          <span
            className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1 text-xs tracking-[0.3em] ${
              isLanding
                ? "border border-white/30 text-white/80"
                : "border border-deep-forest/20 text-deep-forest/80"
            }`}
          >
            MANDATE
          </span>

          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 whitespace-nowrap transition-colors ${
                  active
                    ? isLanding
                      ? "bg-white/90 text-deep-forest shadow-sm"
                      : "bg-deep-forest text-white"
                    : isLanding
                      ? "text-white/70 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
