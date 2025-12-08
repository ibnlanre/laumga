import { Outlet, createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/header";
import { useAuth } from "@/contexts/use-auth";

export const Route = createFileRoute("/_auth")({
  component: AuthLayout,
});

function AuthLayout() {
  const { user } = useAuth();
  const isPrivileged = user?.role === "admin" || user?.role === "super-admin";
  const variant = isPrivileged ? "admin" : "auth";

  return (
    <div className="flex flex-col min-h-screen bg-mist-green-50">
      <Header variant={variant} />

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
