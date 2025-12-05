import { Group, Burger, Drawer, Button, Anchor, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link } from "@tanstack/react-router";

interface NavItem {
  label: string;
  href: string;
}

interface HeaderProps {
  variant: "public" | "auth" | "admin";
  className?: string;
}

const NAV_ITEMS: Record<HeaderProps["variant"], NavItem[]> = {
  public: [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about-us" },
    { label: "Membership", href: "/membership" },
    { label: "Events", href: "/events" },
    { label: "News", href: "/news" },
    { label: "Contact", href: "/contact" },
  ],
  auth: [
    { label: "My Mandate", href: "/mandate" },
    { label: "Alumni", href: "/alumni" },
    { label: "Gallery", href: "/gallery" },
    { label: "Events", href: "/events" },
  ],
  admin: [
    { label: "My Mandate", href: "/mandate" },
    { label: "Alumni", href: "/alumni" },
    { label: "Gallery", href: "/gallery" },
    { label: "Events", href: "/events" },
    { label: "Admin", href: "/admin" },
  ],
};

export function Header({ variant, className = "" }: HeaderProps) {
  const [opened, { toggle, close }] = useDisclosure(false);
  const items = NAV_ITEMS[variant];
  const isPublic = variant === "public";

  return (
    <>
      {/* Desktop & Mobile Header */}
      <header
        className={`sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 ${className}`}
      >
        <div className="container mx-auto px-4">
          <Group justify="space-between" h={70}>
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-vibrant-lime-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
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
                  className="text-gray-700 hover:text-vibrant-lime-600 font-medium transition-colors"
                >
                  {item.label}
                </Anchor>
              ))}
            </Group>

            {/* CTA Buttons (Public Only) */}
            {isPublic && (
              <Group gap="md" visibleFrom="md">
                <Button
                  variant="subtle"
                  component={Link}
                  to="/login"
                  className="text-gray-700 hover:bg-gray-100"
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  className="bg-vibrant-lime-500 hover:bg-vibrant-lime-600 text-white"
                >
                  Join LAUMGA
                </Button>
              </Group>
            )}

            {/* Mobile Burger */}
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="md"
              color="var(--mantine-color-gray-7)"
            />
          </Group>
        </div>
      </header>

      {/* Mobile Drawer */}
      <Drawer
        opened={opened}
        onClose={close}
        size="100%"
        padding="xl"
        title={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-vibrant-lime-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="text-xl font-bold text-deep-forest-900">
              LAUMGA
            </span>
          </div>
        }
        className="md:hidden"
      >
        <Stack gap="md">
          {items.map((item) => (
            <Anchor
              key={item.href}
              component={Link}
              to={item.href}
              onClick={close}
              underline="never"
              className="text-gray-700 hover:text-vibrant-lime-600 font-medium text-lg py-2"
            >
              {item.label}
            </Anchor>
          ))}

          {isPublic && (
            <>
              <div className="border-t border-gray-200 my-4" />
              <Button
                variant="outline"
                component={Link}
                to="/login"
                onClick={close}
                fullWidth
                className="border-gray-300 text-gray-700"
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                onClick={close}
                fullWidth
                className="bg-vibrant-lime-500 hover:bg-vibrant-lime-600 text-white"
              >
                Join LAUMGA
              </Button>
            </>
          )}
        </Stack>
      </Drawer>
    </>
  );
}
