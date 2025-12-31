import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { AuthLayout } from "@/layouts/auth/layout";
import { AuthSidebar } from "@/layouts/auth/sidebar";
import { ResetPasswordForm } from "@/layouts/public/reset-password-form";

const resetPasswordSearchSchema = z.object({
  oobCode: z.string().min(1, "Reset code is required"),
});

export const Route = createFileRoute("/_public/reset-password")({
  validateSearch: resetPasswordSearchSchema,
  head: () => ({
    meta: [
      {
        title: "Reset Password - LAUMGA",
      },
      {
        name: "description",
        content:
          "Set a new password for your LAUMGA account to regain access to member-only features.",
      },
      {
        name: "robots",
        content: "noindex, nofollow",
      },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { oobCode } = Route.useSearch();

  return (
    <AuthLayout
      sidebar={
        <AuthSidebar
          title="Reset your credentials"
          description="Set a fresh password to continue enjoying member-only access."
          backgroundImage="https://lh3.googleusercontent.com/aida-public/AB6AXuCp3qTbn4y3Mjcs2bAXCGsxpnDn0f0FYzSkrusMhJGsV2KrpJvcCy-sljj3OsgK8eiVog_0rhOqH8KMvxO9Ppvsc-LRPTr5XLx5uXQ99yGxd_wqfQT1OINK9nS9XexC5e8dqqSvMkYZVhXFijVSf0dKhROtXdvRaEnWdhD1JoFnXfdhVozQisN48u1qG-0kMmT7mq8E_g0b50KEcC-2NfqQo9JViGrkSc-kpbqAbhS3XKA"
        />
      }
    >
      <ResetPasswordForm token={oobCode} />
    </AuthLayout>
  );
}
