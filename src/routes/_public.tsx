import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { RegistrationProvider } from "@/contexts/registration-context";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { auth } from "@/services/firebase";
import { user } from "@/api/user";

export const Route = createFileRoute("/_public")({
  beforeLoad: async ({ location }) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const userData = await user.$use.get(currentUser.uid);

    if (userData) {
      const adminRoles = ["admin", "super-admin"];
      const isAdmin = adminRoles.includes(userData.role);

      throw redirect({
        to: isAdmin ? "/admin" : "/mandate",
        search: {
          redirect: location.href,
        },
      });
    }

    return { userData };
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
