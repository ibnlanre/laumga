import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { Header } from "@/components/layout/header";
import { useAuth } from "@/contexts/use-auth";
import { auth } from "@/services/firebase";
import { useListUsers } from "@/api/user/hooks";

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

  const { data } = useListUsers();
  console.log("All users data:", data);

  console.log("Authenticated user:", user);

  const isPrivileged = ["admin", "super-admin"].includes(user?.role || "");
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
