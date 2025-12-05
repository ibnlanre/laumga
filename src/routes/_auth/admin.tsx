import {
  Outlet, createFileRoute,
  // notFound
} from "@tanstack/react-router";
// import { auth } from "@/services/firebase";
// import { user } from "@/api/user";

export const Route = createFileRoute("/_auth/admin")({
  beforeLoad: async () => {
    // const currentUser = auth.currentUser;
    // if (!currentUser) throw notFound();

    // const userData = await user.fetch(currentUser.uid);
    // if (!userData?.isAdmin) throw notFound();
  },
  component: AdminLayout,
});

function AdminLayout() {
  return <Outlet />;
}
