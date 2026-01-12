import { Group, Burger, Drawer, Button, Anchor, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";

import { useLogout } from "@/api/user/hooks";

interface NavItem {
  label: string;
  href: string;
}

type HeaderVariant = "public" | "auth" | "admin";

interface HeaderProps {
  variant: HeaderVariant;
  className?: string;
}

const NAV_ITEMS: Record<HeaderVariant, NavItem[]> = {
  public: [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about-us" },
    { label: "Membership", href: "/membership" },
    { label: "Events", href: "/events" },
    { label: "News", href: "/bulletin" },
    { label: "Contact", href: "/contact-us" },
  ],
  auth: [
    { label: "My Mandate", href: "/mandate" },
    { label: "Alumni", href: "/alumni" },
    { label: "Gallery", href: "/gallery" },
  ],
  admin: [
    { label: "Dashboard", href: "/admin" },
    { label: "Mandates", href: "/admin/mandates" },
    { label: "Alumni", href: "/admin/alumni" },
    { label: "Articles", href: "/admin/articles" },
    { label: "Events", href: "/admin/events" },
    { label: "Gallery", href: "/admin/gallery" },
    { label: "Roles", href: "/admin/roles" },
    { label: "Users", href: "/admin/users" },
  ],
};

export function Header({ variant, className = "" }: HeaderProps) {
  const [opened, { toggle, close }] = useDisclosure(false);

  const routerState = useRouterState();
  const navigate = useNavigate();
  const currentPath = routerState.location.pathname;

  const items = NAV_ITEMS[variant];
  const isPublic = variant === "public";

  const { mutateAsync, isPending } = useLogout();

  const handleLogout = async () => {
    await mutateAsync().then(() => {
      navigate({ to: "/" });
    });
  };

  const isActive = (href: string) => {
    if (href === "/") return currentPath === "/";
    return currentPath.startsWith(href);
  };

  return (
    <>
      {/* Desktop & Mobile Header */}
      <header
        className={`sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 ${className}`}
      >
        <section className="lg:container mx-auto px-4 sm:px-6 lg:px-8">
          <Group justify="space-between" h={70}>
            {/* Logo */}
            <Link
              to={isPublic ? "/" : variant === "auth" ? "/mandate" : "/admin"}
              className="flex items-center gap-2"
            >
              <img
                src="/laumga-logo.jpeg"
                alt="LAUMGA emblem"
                className="size-10 object-scale-down"
              />
              <span className="text-xl font-bold text-deep-forest-900">
                LAUMGA
              </span>
            </Link>

            {/* Desktop Navigation */}
            <Group gap="xl" visibleFrom="md">
              {items.map((item) => (
                <Anchor
                  key={item.href}
                  component={Link}
                  to={item.href}
                  underline="never"
                  className={`font-medium transition-colors ${
                    isActive(item.href)
                      ? "text-vibrant-lime-600 font-bold"
                      : "text-gray-700 hover:text-vibrant-lime-600"
                  }`}
                >
                  {item.label}
                </Anchor>
              ))}
            </Group>

            {/* Auth Actions */}
            {isPublic ? (
              <Group gap="md" visibleFrom="md">
                <Button
                  radius="xl"
                  variant="subtle"
                  component={Link}
                  to="/login"
                  className="text-gray-700 hover:bg-gray-100"
                >
                  Login
                </Button>
                <Button
                  radius="xl"
                  component={Link}
                  to="/register"
                  className="bg-vibrant-lime-500 hover:bg-vibrant-lime-600 text-white"
                >
                  Join LAUMGA
                </Button>
              </Group>
            ) : (
              <Button
                radius="xl"
                type="button"
                variant="outline"
                className="hidden border-deep-forest text-deep-forest md:inline-flex"
                onClick={handleLogout}
                loading={isPending}
                disabled={isPending}
              >
                Log Out
              </Button>
            )}

            {/* Mobile Burger */}
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="md"
              color="gray.7"
            />
          </Group>
        </section>
      </header>

      {/* Mobile Drawer */}
      <Drawer
        opened={opened}
        onClose={close}
        size={500}
        padding="xl"
        title={
          <div className="flex items-center gap-2">
            <img
              src="/laumga-logo.jpeg"
              alt="LAUMGA emblem"
              className="w-10 h-10 rounded-full object-cover border border-sage-green"
            />
            <span className="text-xl font-bold text-deep-forest-900">
              LAUMGA
            </span>
          </div>
        }
        className="lg:hidden"
      >
        <Stack gap="md">
          {items.map((item) => (
            <Anchor
              key={item.href}
              component={Link}
              to={item.href}
              onClick={close}
              underline="never"
              className={`font-medium text-lg py-2 ${
                isActive(item.href)
                  ? "text-vibrant-lime-600 font-bold"
                  : "text-gray-700 hover:text-vibrant-lime-600"
              }`}
            >
              {item.label}
            </Anchor>
          ))}

          {isPublic ? (
            <>
              <div className="border-t border-gray-200 my-4" />
              <Button
                variant="outline"
                component={Link}
                to="/login"
                onClick={close}
                size="lg"
                radius="xl"
                fullWidth
                className="border-gray-300 text-gray-700 text-base"
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                onClick={close}
                size="lg"
                radius="xl"
                fullWidth
                className="bg-vibrant-lime-500 hover:bg-vibrant-lime-600 text-white text-base"
              >
                Join LAUMGA
              </Button>
            </>
          ) : (
            <>
              <div className="border-t border-gray-200 my-4" />
              <Button
                type="button"
                variant="outline"
                fullWidth
                size="lg"
                radius="xl"
                classNames={{
                  root: "border-2 border-deep-forest text-deep-forest hover:bg-deep-forest/5",
                  label: "font-semibold text-base",
                }}
                onClick={() => {
                  close();
                  handleLogout();
                }}
                loading={isPending}
                disabled={isPending}
              >
                Log Out
              </Button>
            </>
          )}
        </Stack>
      </Drawer>
    </>
  );
}
