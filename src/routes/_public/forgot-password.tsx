import { createFileRoute } from "@tanstack/react-router";
import { ForgotPasswordForm } from "@/layouts/public/forgot-password-form";
import { AuthLayout } from "@/layouts/auth/layout";
import { AuthSidebar } from "@/layouts/auth/sidebar";

export const Route = createFileRoute("/_public/forgot-password")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AuthLayout
      sidebar={
        <AuthSidebar
          title="Account Security"
          description="We help you get back on track so you don't miss out on community updates."
          backgroundImage="https://lh3.googleusercontent.com/aida-public/AB6AXuAAZuN-y9yfVPL-5eXBh4s-qom4q85J3MPP-NEIBsougM4NHm-GbaUr5TdkA3SOR0gxR-lSdN1xMiAl1FF2HW4MaUZZMc1BouF6bdLIcGj9RE1J1v3B_FMhnbi7H26j96sDCrMljQrhl31_o_6yKsLs5dVJWuxo8G_e2wmnLy8Ge-mjXedJNXw2IJuqnw0qLZs8aHEpfTZ0BY00iAX-EiagSwzpc3upyG37bV0fu55YKujpnFr5gguiFNQrX-m_tKORiBfLIJjf5ZA"
        />
      }
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
