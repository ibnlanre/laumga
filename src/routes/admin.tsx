import { Outlet, createFileRoute, useLoaderData } from "@tanstack/react-router";
import { AdminLoginForm } from "@/layouts/auth/admin-login-form";
import { AuthLayout } from "@/layouts/auth/layout";
import { AuthSidebar } from "@/layouts/auth/sidebar";
import { AdminAppShell } from "@/layouts/admin/layout";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      {
        name: "robots",
        content: "noindex, nofollow",
      },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const { currentUser } = useLoaderData({ from: "__root__" });
  const isOwner = false;

  if (!isOwner) {
    return <AdminLoginPage />;
  }

  return (
    <AdminAppShell currentUser={currentUser}>
      <Outlet />
    </AdminAppShell>
  );
}

function AdminLoginPage() {
  return (
    <AuthLayout
      sidebar={
        <AuthSidebar
          title="Administrative Access"
          description="Manage organizational resources, configure settings, and oversee community operations."
          backgroundImage="https://lh3.googleusercontent.com/aida-public/AB6AXuChZklTu5YA4KRBqSGCa5q3ptPTYy_IZwSf_4j7SD-WN1rdW1UEMJSrJxMiEMb2KXDv4gJQeCKWt02zvivTlH-F1ps9w6l0urac4z40tMxWGkqzvVd_8pGMSdoSp4pPhZmqrflzhRA32E_YWXVhfR3B_HpXZw0yAW1cIbn-rxcP5blNzu_hBX1zQAfvoicyvgoQOgD6w2QoTKwXRJbpGSveEyI7lzCQ1Vi5vRwfA0_Xpu8_87ek7wU2KM3WngBxuoSNH5w5lPj1AkA"
        />
      }
    >
      <AdminLoginForm />
    </AuthLayout>
  );
}
