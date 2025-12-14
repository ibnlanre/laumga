import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const Route = createFileRoute("/_auth")({
  beforeLoad: async ({ location, context }) => {
    if (!context.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-mist-green-50">
      <Header variant="auth" />

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      <Footer variant="minimal" />
    </div>
  );
}
