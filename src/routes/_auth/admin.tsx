import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { auth } from "@/services/firebase";
import { user } from "@/api/user";

export const Route = createFileRoute("/_auth/admin")({
  beforeLoad: async ({ location }) => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }

    const userData = await user.$use.get(currentUser.uid);

    const canAccess = userData?.role === "owner";

    if (!canAccess) {
      throw redirect({ to: "/login" });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  return <Outlet />;
}
