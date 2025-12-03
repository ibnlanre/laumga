import { Avatar, Menu, Burger, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  Link,
  Outlet,
  createFileRoute,
  useNavigate,
} from "@tanstack/react-router";
import {
  LayoutDashboard,
  Heart,
  Users,
  ImageIcon,
  Calendar,
  Settings,
  LogOut,
  User,
  Shield,
} from "lucide-react";

import { useAuth } from "@/contexts/auth";

export const Route = createFileRoute("/_auth")({
  component: AuthLayout,
});

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/mandate/dashboard" },
  { icon: Heart, label: "My Mandate", to: "/mandate/pledge" },
  { icon: Users, label: "Alumni Directory", to: "/alumni" },
  { icon: ImageIcon, label: "Gallery", to: "/gallery" },
  { icon: Calendar, label: "Events", to: "/events" },
];

const adminNavItems = [
  { icon: Shield, label: "Admin Dashboard", to: "/admin" },
  { icon: Users, label: "User Management", to: "/admin/users" },
  { icon: Calendar, label: "Events Admin", to: "/admin/events" },
  { icon: ImageIcon, label: "Gallery Admin", to: "/admin/gallery" },
];

function AuthLayout() {
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();
  const [opened, { toggle, close }] = useDisclosure(false);

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-mist-green">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-sage-green/30 shadow-sm">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex justify-between items-center py-3">
            {/* Logo & Mobile Menu */}
            <div className="flex items-center gap-4">
              <Burger
                opened={opened}
                onClick={toggle}
                className="lg:hidden"
                size="sm"
              />
              <Link to="/" className="flex items-center gap-3">
                <img
                  alt="LAUMGA Association Logo"
                  className="size-10"
                  src="/laumga-logo.jpeg"
                />
                <span className="font-bold text-xl text-deep-forest hidden sm:inline">
                  LAUMGA
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center gap-2 text-sm font-medium text-deep-forest/70 hover:text-vibrant-lime transition-colors"
                  activeProps={{
                    className: "text-vibrant-lime font-semibold",
                  }}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              ))}
              {userData?.isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 text-sm font-medium text-institutional-green/70 hover:text-institutional-green transition-colors"
                  activeProps={{
                    className: "text-institutional-green font-semibold",
                  }}
                >
                  <Shield className="size-4" />
                  Admin
                </Link>
              )}
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-lg hover:bg-mist-green transition-colors">
                <span className="material-symbols-outlined text-deep-forest">
                  notifications
                </span>
              </button>

              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <button className="flex items-center gap-3 p-2 rounded-lg hover:bg-mist-green transition-colors">
                    <Avatar
                      src={currentUser?.photoURL}
                      alt={userData?.firstName || "User"}
                      size="sm"
                      className="ring-2 ring-sage-green"
                    >
                      {userData?.firstName?.[0] || "U"}
                    </Avatar>
                    <span className="hidden md:block text-sm font-medium text-deep-forest">
                      {userData?.firstName || "User"}
                    </span>
                  </button>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label>Account</Menu.Label>
                  <Menu.Item
                    leftSection={<User className="size-4" />}
                    component={Link}
                    to="/profile"
                  >
                    Profile
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<Settings className="size-4" />}
                    component={Link}
                    to="/settings"
                  >
                    Settings
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    leftSection={<LogOut className="size-4" />}
                    color="red"
                    onClick={handleLogout}
                  >
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <Drawer opened={opened} onClose={close} size="xs" padding="md">
        <div className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={close}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-mist-green transition-colors"
              activeProps={{
                className: "bg-vibrant-lime/10 text-vibrant-lime font-semibold",
              }}
            >
              <item.icon className="size-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}

          {userData?.isAdmin && (
            <>
              <div className="mt-4 pt-4 border-t border-sage-green/30">
                <p className="text-xs font-semibold text-deep-forest/60 px-3 mb-2">
                  ADMIN
                </p>
                {adminNavItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={close}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-institutional-green/10 transition-colors text-institutional-green"
                    activeProps={{
                      className: "bg-institutional-green/20 font-semibold",
                    }}
                  >
                    <item.icon className="size-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>
            </>
          )}

          <div className="mt-4 pt-4 border-t border-sage-green/30">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 text-red-600 w-full transition-colors"
            >
              <LogOut className="size-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </Drawer>

      {/* Main Content */}
      <main className="container mx-auto px-4 lg:px-6 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="mt-20 bg-white border-t border-sage-green/30">
        <div className="container mx-auto px-4 lg:px-6 py-8">
          <div className="text-center text-sm text-deep-forest/60">
            <p>© {new Date().getFullYear()} LAUMGA. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
