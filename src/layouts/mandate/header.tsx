import { useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, FileText, Award } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Section } from "@/components/section";
import clsx from "clsx";

interface MandateHeaderProps {
  isLanding?: boolean;
  className?: string;
}

export function MandateHeader({ isLanding, className }: MandateHeaderProps) {
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
      label: "Pledge",
      href: "/mandate/pledge",
      icon: FileText,
    },
    {
      label: "Dashboard",
      href: "/mandate/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Certificate",
      href: "/mandate/certificate",
      icon: Award,
    },
  ];

  return (
    <Section className={className}>
      <nav
        className={clsx(
          "flex w-full flex-nowrap items-center gap-2 overflow-x-auto rounded-full px-4 py-2 text-sm font-medium transition-all md:flex-wrap md:overflow-visible",
          {
            "pointer-events-auto border border-white/20 bg-deep-forest/50 text-white shadow-xl backdrop-blur":
              isLanding,
            "bg-white/95 text-gray-700 shadow-sm border-sage-green/40":
              !isLanding,
          },
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        )}
        aria-label="Mandate destinations"
      >
        <span
          className={clsx(
            "shrink-0 whitespace-nowrap rounded-full px-3 py-1 text-xs tracking-[0.3em]",
            {
              "border border-white/30 text-white/80": isLanding,
              "border border-deep-forest/20 text-deep-forest/80": !isLanding,
            }
          )}
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
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 whitespace-nowrap ${
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
    </Section>
  );
}
