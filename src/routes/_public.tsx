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

      <footer className="bg-deep-forest text-white border-t-4 border-vibrant-lime">
        <div className="container mx-auto px-4 lg:px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img
                  alt="LAUMGA White Logo"
                  className="h-10 w-10 brightness-0 invert"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXiQMl6xvnod5aC02bXFWiekA5E6mKQpt2oaSW7NTDSkvI7YVkBnoXHc4DFLxN65bvEQcxbn863sQDqeDIBfXkYZNhA2fx93b_p6Y7JR5U7k73xelN4sdAeptLqwMnJPhUzq6HuuaN97d-rvpo5GZCTB3Cd7ZjOXRc54VGVMphsYMIPUIEC6yZpB-b2LCF7e6L7u8Kw7k59LREbJTNx0OE-pvT2eGbUziPNCPZMSLIpk9YXMbQFDrdj_bq3zbGzqqCZECE_SaWW6U"
                />
                <span className="font-serif font-bold text-xl text-white">
                  LAUMGA
                </span>
              </div>
              <p className="text-sm text-gray-200">
                Building a united, virile brotherhood for the cause of Almighty
                Allah and the benefit of the Muslim Ummah.
              </p>
              <div className="flex space-x-3 mt-4">
                <a
                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-deep-forest hover:bg-gray-200"
                  href="#"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                  </svg>
                </a>
                <a
                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-deep-forest hover:bg-gray-200"
                  href="#"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733a4.67 4.67 0 002.048-2.578 9.3 9.3 0 01-2.958 1.13 4.66 4.66 0 00-7.938 4.25 13.229 13.229 0 01-9.602-4.868c-.337.58-.53 1.25-.53 1.968a4.658 4.658 0 002.065 3.877 4.65 4.65 0 01-2.11-.583v.06a4.66 4.66 0 003.738 4.566 4.69 4.69 0 01-2.104.08 4.661 4.661 0 004.35 3.234 9.348 9.348 0 01-5.786 1.995c-.376 0-.747-.022-1.112-.065a13.175 13.175 0 007.14 2.093c8.57 0 13.255-7.098 13.255-13.254 0-.202-.005-.403-.014-.602a9.454 9.454 0 002.323-2.41z"></path>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h5 className="font-bold text-lg mb-4">Quick Links</h5>
              <ul className="space-y-2 text-sm text-mist-green">
                <li>
                  <a className="hover:text-white hover:underline" href="#">
                    Membership
                  </a>
                </li>
                <li>
                  <a className="hover:text-white hover:underline" href="#">
                    News &amp; Events
                  </a>
                </li>
                <li>
                  <a className="hover:text-white hover:underline" href="#">
                    Our Mission
                  </a>
                </li>
                <li>
                  <a className="hover:text-white hover:underline" href="#">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-lg mb-4">Contact Info</h5>
              <ul className="space-y-2 text-sm text-gray-200">
                <li>LAUTECH, Ogbomoso,</li>
                <li>Oyo State, Nigeria.</li>
                <li>
                  <a
                    className="hover:text-white hover:underline"
                    href="mailto:info@laumga.org"
                  >
                    info@laumga.org
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-lg mb-4">Newsletter</h5>
              <p className="text-sm text-gray-200 mb-3">
                Subscribe to An-Naseehah.
              </p>
              <div className="flex">
                <input
                  className="grow w-full text-sm rounded-l-md border-gray-400 bg-white/20 text-white placeholder-gray-300 focus:ring-gold focus:border-gold"
                  placeholder="Enter your email"
                  type="email"
                />
                <button className="bg-gold text-rust px-4 py-2 text-sm rounded-r-md hover:bg-opacity-90 transition-opacity font-bold">
                  Subscribe
                </button>
              </div>
            </div>

            {/* <div>
                <h5 className="font-bold text-lg mb-4">Get in Touch</h5>
                <form className="space-y-3">
                  <input
                    className="w-full text-sm rounded-md border-gray-600 bg-white/10 text-white placeholder-gray-400 focus:ring-vibrant-lime focus:border-vibrant-lime"
                    placeholder="Your Name"
                    type="text"
                  />
                  <input
                    className="w-full text-sm rounded-md border-gray-600 bg-white/10 text-white placeholder-gray-400 focus:ring-vibrant-lime focus:border-vibrant-lime"
                    placeholder="Your Email"
                    type="email"
                  />
                  <button className="w-full bg-vibrant-lime text-deep-forest px-4 py-2 text-sm rounded-md hover:bg-opacity-90 transition-opacity font-bold">
                    Submit
                  </button>
                </form>
              </div>
              <div>
                <h5 className="font-bold text-lg mb-4">Follow Us</h5>
                <div className="flex space-x-3 mt-4">
                  <a
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20"
                    href="#"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                    </svg>
                  </a>
                  <a
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20"
                    href="#"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733a4.67 4.67 0 002.048-2.578 9.3 9.3 0 01-2.958 1.13 4.66 4.66 0 00-7.938 4.25 13.229 13.229 0 01-9.602-4.868c-.337.58-.53 1.25-.53 1.968a4.658 4.658 0 002.065 3.877 4.65 4.65 0 01-2.11-.583v.06a4.66 4.66 0 003.738 4.566 4.69 4.69 0 01-2.104.08 4.661 4.661 0 004.35 3.234 9.348 9.348 0 01-5.786 1.995c-.376 0-.747-.022-1.112-.065a13.175 13.175 0 007.14 2.093c8.57 0 13.255-7.098 13.255-13.254 0-.202-.005-.403-.014-.602a9.454 9.454 0 002.323-2.41z"></path>
                    </svg>
                  </a>
                </div>
              </div> */}
          </div>
        </div>
        <div className="bg-[#001a0e] py-4">
          <div className="container mx-auto px-4 lg:px-6 text-center text-sm text-gray-400">
            <p>© 2024 LAUMGA. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
