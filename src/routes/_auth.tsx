import { Outlet, createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/contexts/auth";

export const Route = createFileRoute("/_auth")({
  component: AuthLayout,
});

function AuthLayout() {
  const { userData } = useAuth();
  const variant = userData?.isAdmin ? "admin" : "auth";

  return (
    <div className="flex flex-col min-h-screen bg-mist-green-50">
      <Header variant={variant} />

      <main className="flex-1 container mx-auto px-4 lg:px-6 py-8">
        <Outlet />
      </main>

      <Footer variant="minimal" />
    </div>
  );
}
