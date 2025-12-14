import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { RegistrationProvider } from "@/contexts/registration-context";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const Route = createFileRoute("/_public")({
  beforeLoad: async ({ context }) => {
    if (context.isAuthenticated) {
      throw redirect({ to: "/mandate" });
    }
  },
  component: Layout,
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
