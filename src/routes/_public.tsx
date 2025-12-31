import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { RegistrationProvider } from "@/contexts/registration-context";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageLoader } from "@/components/page-loader";

export const Route = createFileRoute("/_public")({
  beforeLoad: async ({ context }) => {
    if (context.isAuthenticated) {
      throw redirect({ to: "/mandate" });
    }
  },
  head: () => ({
    meta: [
      {
        name: "description",
        content:
          "LAUMGA - Ladoke Akintola University of Technology Muslim Graduates Association. Connecting alumni, empowering the Ummah through spiritual growth and community development.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:site_name",
        content: "LAUMGA",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ],
  }),
  component: Layout,
  pendingComponent: PageLoader,
});

function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header variant="public" />

      <main className="flex-1">
        <RegistrationProvider>
          <Outlet />
        </RegistrationProvider>
      </main>

      <Footer variant="full" />
    </div>
  );
}
