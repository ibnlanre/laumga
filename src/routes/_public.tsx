import { Button, Flex, Anchor } from "@mantine/core";
import {
  Link,
  Outlet,
  createFileRoute,
  useLocation,
} from "@tanstack/react-router";
import { useState } from "react";
import { Menu } from "lucide-react";
import { RegistrationProvider } from "@/contexts/registration-context";
import { MobileMenu } from "@/components/mobile-menu";

export const Route = createFileRoute("/_public")({
  component: Layout,
});

function Layout() {
  const location = useLocation();
  const isRegistrationRoute = location.pathname.startsWith("/register");
  const [mobileMenuOpened, setMobileMenuOpened] = useState(false);

  return (
    <div className="min-h-screen font-sanst text-slate-80">
      <header className="sticky top-0 z-50 w-full transition-colors duration-300 bg-white/80 backdrop-blur-md shadow-2xl">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img
                alt="LAUMGA Association Logo"
                className="size-10"
                src="/laumga-logo.jpeg"
              />
              {/* <span className="font-bold text-xl text-white">LAUMGA</span> */}
            </div>
            <Flex
              visibleFrom="lg"
              component="nav"
              justify="center"
              className="gap-8 font-medium text-sm text-deep-forest"
            >
              <Anchor
                unstyled
                className="hover:text-vibrant-lime transition-colors"
                component={Link}
                to="/"
              >
                Home
              </Anchor>
              <Anchor
                unstyled
                className="hover:text-vibrant-lime transition-colors"
                component={Link}
                to="/about-us"
              >
                About Us
              </Anchor>
              <Anchor
                unstyled
                className="hover:text-vibrant-lime transition-colors"
                component={Link}
                to="/membership"
              >
                Membership
              </Anchor>
              <Anchor
                unstyled
                className="hover:text-vibrant-lime transition-colors"
                component={Link}
                to="/events"
              >
                Events
              </Anchor>
              <Anchor
                unstyled
                className="hover:text-vibrant-lime transition-colors"
                component={Link}
                to="/news"
              >
                News
              </Anchor>
              <Anchor
                unstyled
                className="hover:text-vibrant-lime transition-colors"
                component={Link}
                to="/contact"
              >
                Contact
              </Anchor>
            </Flex>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                component={Link}
                to="/login"
                
                visibleFrom="lg"
              >
                Login
              </Button>
              <Button
                variant="filled"
                component={Link}
                to="/register"
                autoContrast
                visibleFrom="lg"
              >
                Join LAUMGA
              </Button>

              <button
                className="lg:hidden p-2 rounded-md text-deep-forest hover:bg-sage-green/20 transition-colors"
                onClick={() => setMobileMenuOpened(true)}
                aria-label="Open menu"
              >
                <Menu className="size-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu
        opened={mobileMenuOpened}
        onClose={() => setMobileMenuOpened(false)}
      />

      {isRegistrationRoute ? (
        <RegistrationProvider>
          <Outlet />
        </RegistrationProvider>
      ) : (
        <Outlet />
      )}

      {/* Footer */}
      <footer className="bg-deep-forest text-white py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* About */}
            <div>
              <h3 className="font-bold text-lg mb-4">About LAUMGA</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Uniting Muslim graduates of LAUTECH in brotherhood, service, and
                excellence since 1997.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Anchor
                    component={Link}
                    to="/about-us"
                    className="text-white/70 hover:text-vibrant-lime text-sm transition-colors"
                    underline="never"
                  >
                    About Us
                  </Anchor>
                </li>
                <li>
                  <Anchor
                    component={Link}
                    to="/membership"
                    className="text-white/70 hover:text-vibrant-lime text-sm transition-colors"
                    underline="never"
                  >
                    Membership
                  </Anchor>
                </li>
                <li>
                  <Anchor
                    component={Link}
                    to="/events"
                    className="text-white/70 hover:text-vibrant-lime text-sm transition-colors"
                    underline="never"
                  >
                    Events
                  </Anchor>
                </li>
                <li>
                  <Anchor
                    component={Link}
                    to="/contact-us"
                    className="text-white/70 hover:text-vibrant-lime text-sm transition-colors"
                    underline="never"
                  >
                    Contact
                  </Anchor>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-bold text-lg mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-vibrant-lime text-base mt-0.5">
                    email
                  </span>
                  <a
                    href="mailto:info@laumga.org"
                    className="hover:text-vibrant-lime transition-colors"
                  >
                    info@laumga.org
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-vibrant-lime text-base mt-0.5">
                    call
                  </span>
                  <a
                    href="tel:+234012345678"
                    className="hover:text-vibrant-lime transition-colors"
                  >
                    +234 (0) 123 456 78
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="font-bold text-lg mb-4">Newsletter</h3>
              <p className="text-white/70 text-sm mb-4">
                Stay updated with our latest news and events.
              </p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-vibrant-lime"
                />
                <Button
                  size="sm"
                  variant="filled"
                  color="vibrant-lime"
                  className="text-deep-forest"
                >
                  Subscribe
                </Button>
              </form>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/60">
              © {new Date().getFullYear()} LAUMGA. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-white/60 hover:text-vibrant-lime transition-colors"
              >
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3l-.5 3h-2.5v6.95c5.05-.5 9-4.76 9-9.95z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-white/60 hover:text-vibrant-lime transition-colors"
              >
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.67.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98-3.56-.18-6.73-1.89-8.84-4.48-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.22-1.95-.55v.05c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.94.07 4.28 4.28 0 0 0 4 2.98 8.52 8.52 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21c7.35 0 11.37-6.08 11.37-11.37 0-.17 0-.34-.01-.51.78-.57 1.45-1.29 1.98-2.08z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-white/60 hover:text-vibrant-lime transition-colors"
              >
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-12 5v10h3V11H7zm1.5-2a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm6.5 2v2h-1c-1.1 0-2 1.34-2 3v5h-3v-7c0-2.21 1.79-4 4-4h2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
