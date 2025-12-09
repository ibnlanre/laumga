import { Outlet, createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/header";
import { useAuth } from "@/contexts/use-auth";
import { auth } from "@/services/firebase";

export const Route = createFileRoute("/_auth")({
  beforeLoad: async ({ location }) => {
    const currentUser = auth.currentUser;
    console.log("Current user in auth route:", currentUser);

    // if (!user) {
    //   throw redirect({
    //     to: "/login",
    //     search: {
    //       redirect: location.href,
    //     },
    //   });
    // }
  },
  component: AuthLayout,
});

function AuthLayout() {
  const { user } = useAuth();

  const isPrivileged = user?.role === "owner";
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
