import type { PropsWithChildren } from "react";
import { useMemo, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  ActionIcon,
  Avatar,
  Button,
  Burger,
  Drawer,
  Indicator,
  Menu,
  TextInput,
} from "@mantine/core";
import { Bell, ChevronDown, LogOut, Search } from "lucide-react";
import clsx from "clsx";

import { Section } from "@/components/section";
import { useLogout, useListUsers } from "@/api/user/hooks";
import type { User } from "@/api/user/types";
import { adminNavGroups } from "./navigation";
import type { AdminNavGroup, AdminNavItem } from "./navigation";

type BadgeKey = NonNullable<AdminNavItem["badgeKey"]>;

interface AdminAppShellProps extends PropsWithChildren {
  currentUser?: User | null;
}

export function AdminAppShell({ children, currentUser }: AdminAppShellProps) {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const searchState = (routerState.location.search ?? {}) as Record<
    string,
    unknown
  >;
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { mutateAsync: logout, isPending } = useLogout();
  const { data: users = [] } = useListUsers();

  const pendingMembers = useMemo(
    () => users.filter(({ status }) => status === "pending").length,
    [users]
  );

  const badgeCounts: Partial<Record<BadgeKey, number>> = {
    pendingMembers,
    alerts: pendingMembers > 8 ? 1 : 0,
  };

  const handleLogout = async () => {
    await logout();
  };

  const closeDrawer = () => setMobileNavOpen(false);

  const handleDrawerLogout = async () => {
    await handleLogout();
    closeDrawer();
  };

  return (
    <div className="flex min-h-screen bg-mist-green">
      <aside className="hidden w-[260px] flex-col bg-deep-forest px-6 py-8 text-white lg:flex">
        <SidebarBrand />
        <div className="mt-8 flex-1 overflow-y-auto pr-2">
          <AdminNavigation
            groups={adminNavGroups}
            pathname={pathname}
            search={searchState}
            variant="sidebar"
            badges={badgeCounts}
          />
        </div>
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
          <p className="font-semibold text-white">Stewardship tips</p>
          <p className="mt-2">
            Review new approvals daily and keep donation streams in sync to
            avoid settlement gaps.
          </p>
        </div>
      </aside>

      <Drawer
        opened={mobileNavOpen}
        onClose={closeDrawer}
        padding="xl"
        size="md"
        position="left"
        overlayProps={{ backgroundOpacity: 0.45, blur: 6 }}
        withinPortal
        classNames={{ content: "bg-mist-green overflow-y-auto" }}
        title={<SidebarBrand compact />}
      >
        <div className="flex flex-col gap-6">
          <AdminNavigation
            groups={adminNavGroups}
            pathname={pathname}
            search={searchState}
            variant="drawer"
            badges={badgeCounts}
            onNavigate={closeDrawer}
          />
          <Button
            variant="light"
            className="bg-deep-forest text-white transition-colors hover:bg-deep-forest/95"
            leftSection={<LogOut className="size-4" />}
            loading={isPending}
            onClick={handleDrawerLogout}
          >
            Log out
          </Button>
        </div>
      </Drawer>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-sage-green/30 bg-white/95 backdrop-blur">
          <Section className="flex h-[70px] items-center gap-4">
            <div className="flex flex-1 items-center gap-3">
              <ActionIcon
                variant="subtle"
                color="dark"
                className="lg:hidden"
                onClick={() => setMobileNavOpen(true)}
                aria-label="Open navigation"
              >
                <Burger
                  opened={mobileNavOpen}
                  size="sm"
                  color="var(--mantine-color-dark-7)"
                />
              </ActionIcon>
              <TextInput
                className="flex-1"
                placeholder="Search members, transaction IDs, or articles..."
                leftSection={<Search className="size-4 text-deep-forest/60" />}
                radius="xl"
                size="md"
                styles={{
                  input: {
                    background: "rgba(226, 238, 221, 0.6)",
                    borderColor: "transparent",
                  },
                }}
              />
            </div>
            <div className="flex items-center gap-3">
              <Indicator
                color="red"
                size={8}
                offset={4}
                disabled={!badgeCounts.alerts}
              >
                <ActionIcon
                  variant="light"
                  size="lg"
                  className="bg-mist-green text-deep-forest hover:bg-mist-green/70"
                  aria-label="View alerts"
                >
                  <Bell className="size-5" />
                </ActionIcon>
              </Indicator>
              <ProfileMenu
                currentUser={currentUser}
                onLogout={handleLogout}
                isLoggingOut={isPending}
              />
            </div>
          </Section>
        </header>

        <main className="flex-1 pb-12">
          <Section className="pt-8">
            <div className="flex flex-col gap-10">{children}</div>
          </Section>
        </main>
      </div>
    </div>
  );
}

interface SidebarBrandProps {
  compact?: boolean;
}

function SidebarBrand({ compact }: SidebarBrandProps) {
  return (
    <Link to="/admin" className="flex items-center gap-3">
      <img
        src="/laumga-logo.jpeg"
        alt="LAUMGA"
        className="h-10 w-10 rounded-full border border-white/20"
      />
      <div>
        <p
          className={clsx(
            "font-serif text-white",
            compact ? "text-base" : "text-xl"
          )}
        >
          Stewardship Console
        </p>
        <p className="text-xs text-white/70">LAUMGA Admin</p>
      </div>
    </Link>
  );
}

type AdminNavigationVariant = "sidebar" | "drawer";

interface AdminNavigationProps {
  groups: AdminNavGroup[];
  pathname: string;
  search: Record<string, unknown>;
  variant: AdminNavigationVariant;
  badges: Partial<Record<BadgeKey, number>>;
  onNavigate?: () => void;
}

function AdminNavigation({
  groups,
  pathname,
  search,
  variant,
  badges,
  onNavigate,
}: AdminNavigationProps) {
  return (
    <nav
      className={clsx(
        "space-y-6",
        variant === "drawer" && "space-y-5 text-deep-forest"
      )}
      aria-label="Admin navigation"
    >
      {groups.map((group) => (
        <div key={group.label} className="space-y-2">
          <p
            className={clsx(
              "text-xs uppercase tracking-[0.2em]",
              variant === "sidebar" ? "text-white/50" : "text-deep-forest/50"
            )}
          >
            {group.label}
          </p>
          <div className="flex flex-col gap-1">
            {group.items.map((item) => (
              <AdminNavLink
                key={item.label}
                item={item}
                pathname={pathname}
                search={search}
                variant={variant}
                badgeCount={item.badgeKey ? (badges[item.badgeKey] ?? 0) : 0}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}

interface AdminNavLinkProps {
  item: AdminNavItem;
  pathname: string;
  search: Record<string, unknown>;
  variant: AdminNavigationVariant;
  badgeCount?: number;
  onNavigate?: () => void;
}

function AdminNavLink({
  item,
  pathname,
  search,
  variant,
  badgeCount,
  onNavigate,
}: AdminNavLinkProps) {
  const Icon = item.icon;
  const isActive = item.match
    ? item.match(pathname, search)
    : pathname === item.to;

  const content = (
    <div className="flex items-center gap-3">
      <div
        className={clsx(
          "rounded-2xl p-2",
          variant === "sidebar" ? "bg-white/10" : "bg-white"
        )}
      >
        <Icon
          className={clsx(
            "size-4",
            variant === "sidebar" ? "text-white" : "text-deep-forest"
          )}
        />
      </div>
      <div className="flex flex-1 flex-col">
        <span
          className={clsx(
            "text-sm font-semibold",
            variant === "sidebar" ? "text-white" : "text-deep-forest"
          )}
        >
          {item.label}
        </span>
        <span
          className={clsx(
            "text-xs",
            variant === "sidebar" ? "text-white/60" : "text-deep-forest/60"
          )}
        >
          {item.description}
        </span>
      </div>
      {badgeCount ? (
        <span className="rounded-full bg-vibrant-lime/20 px-2 py-0.5 text-xs font-semibold text-vibrant-lime-800">
          {badgeCount}{" "}
          {item.badgeKey === "alerts"
            ? `Alert${badgeCount > 1 ? "s" : ""}`
            : `Pending`}
        </span>
      ) : null}
    </div>
  );

  return (
    <Link
      to={item.to}
      onClick={onNavigate}
      className={clsx(
        "group rounded-2xl border border-transparent px-3 py-2",
        variant === "sidebar"
          ? "border-white/0 text-white"
          : "bg-white/80 text-deep-forest shadow-sm",
        isActive &&
          (variant === "sidebar"
            ? "border-l-4 border-vibrant-lime bg-white/10"
            : "border border-vibrant-lime/40")
      )}
    >
      {content}
    </Link>
  );
}

interface ProfileMenuProps {
  currentUser?: User | null;
  onLogout: () => Promise<void>;
  isLoggingOut: boolean;
}

function ProfileMenu({
  currentUser,
  onLogout,
  isLoggingOut,
}: ProfileMenuProps) {
  const initials = useMemo(() => {
    const source = currentUser?.fullName ?? currentUser?.firstName ?? "Admin";
    return source
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }, [currentUser]);

  return (
    <Menu width={220} position="bottom-end" shadow="lg">
      <Menu.Target>
        <button
          type="button"
          className="flex items-center gap-3 rounded-full border border-sage-green/40 bg-white px-3 py-1.5 text-left shadow-sm"
        >
          <Avatar
            src={currentUser?.photoUrl ?? undefined}
            radius="xl"
            size="md"
            alt={currentUser?.fullName ?? "Administrator"}
          >
            {initials}
          </Avatar>
          <div className="hidden sm:flex sm:flex-col">
            <span className="text-sm font-semibold text-deep-forest">
              {currentUser?.fullName ?? "Administrator"}
            </span>
            <span className="text-xs text-deep-forest/70">Operations lead</span>
          </div>
          <ChevronDown className="size-4 text-deep-forest" />
        </button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Session</Menu.Label>
        <Menu.Item
          leftSection={<LogOut className="size-4" />}
          onClick={() => {
            void onLogout();
          }}
          disabled={isLoggingOut}
        >
          Log out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
