import { createFileRoute } from "@tanstack/react-router";

import { LoginForm } from "@/components/login-form";
import { AuthLayout } from "@/layouts/auth/layout";
import { AuthSidebar } from "@/layouts/auth/sidebar";

export const Route = createFileRoute("/_public/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AuthLayout
      sidebar={
        <AuthSidebar
          title="Strengthening the bonds of brotherhood."
          description="Access your profile, connect with peers, and manage your membership."
          backgroundImage="https://lh3.googleusercontent.com/aida-public/AB6AXuChZklTu5YA4KRBqSGCa5q3ptPTYy_IZwSf_4j7SD-WN1rdW1UEMJSrJxMiEMb2KXDv4gJQeCKWt02zvivTlH-F1ps9w6l0urac4z40tMxWGkqzvVd_8pGMSdoSp4pPhZmqrflzhRA32E_YWXVhfR3B_HpXZw0yAW1cIbn-rxcP5blNzu_hBX1zQAfvoicyvgoQOgD6w2QoTKwXRJbpGSveEyI7lzCQ1Vi5vRwfA0_Xpu8_87ek7wU2KM3WngBxuoSNH5w5lPj1AkA"
        />
      }
    >
      <LoginForm />
    </AuthLayout>
  );
}
