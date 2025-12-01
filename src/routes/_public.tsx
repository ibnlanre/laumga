import { Button, Flex, Anchor } from "@mantine/core";
import { Link, Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public")({
  component: Layout,
});

function Layout() {
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
                c="white"
                className="lg:hidden"
              >
                Login
              </Button>
              <Button variant="filled" component={Link} to="/join" autoContrast>
                Join LAUMGA
              </Button>

              <button className="lg:hidden p-2 rounded-md text-white">
                <span className="material-icons">menu</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <Outlet />
    </div>
  );
}
