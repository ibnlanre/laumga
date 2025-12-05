import {
  Outlet,
  createFileRoute,
  // redirect
} from "@tanstack/react-router";
import { Header } from "@/components/layout/header";
import { useAuth } from "@/contexts/auth";
// import { auth } from "@/services/firebase";
// import { user } from "@/api/user";

export const Route = createFileRoute("/_auth")({
  // beforeLoad: async ({ location }) => {
  //   const currentUser = auth.currentUser;

  //   if (!currentUser) {
  //     throw redirect({
  //       to: "/login",
  //       search: {
  //         redirect: location.href,
  //       },
  //     });
  //   }

  //   const userData = await user.fetch(currentUser.uid);

  //   if (!userData) {
  //     throw redirect({
  //       to: "/login",
  //       search: {
  //         redirect: location.href,
  //       },
  //     });
  //   }

  //   return { userData };
  // },
  component: AuthLayout,
});

function AuthLayout() {
  const { userData } = useAuth();
  const isPrivileged =
    userData?.role === "admin" || userData?.role === "super-admin";
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
