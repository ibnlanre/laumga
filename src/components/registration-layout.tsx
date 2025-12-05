import { Stepper } from "@mantine/core";
import { useRegistration } from "@/contexts/registration-context";
import { AuthLayout } from "@/layouts/auth/layout";
import { AuthSidebar } from "@/layouts/auth/sidebar";

interface RegistrationLayoutProps {
  children: React.ReactNode;
  sidebarTitle: string;
  sidebarDescription: string;
  backgroundImage?: string;
}

export function RegistrationLayout({
  children,
  sidebarTitle,
  sidebarDescription,
  backgroundImage = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop",
}: RegistrationLayoutProps) {
  const { currentStep } = useRegistration();

  return (
    <AuthLayout
      sidebar={
        <AuthSidebar
          title={sidebarTitle}
          description={sidebarDescription}
          backgroundImage={backgroundImage}
          bottomContent={
            <p className="text-white/80 text-sm">
              Already a member?{" "}
              <a
                className="font-semibold text-vibrant-lime underline hover:text-white"
                href="/login"
              >
                Log in here.
              </a>
            </p>
          }
        />
      }
      backgroundColor="bg-white"
    >
      <div className="w-full max-w-3xl px-6 py-8">
        {/* Stepper */}
        <div className="mb-8">
          <Stepper
            active={currentStep - 1}
            color="rgba(0, 104, 56, 1)"
            size="sm"
            classNames={{
              stepIcon: "border-2",
              stepBody: "mt-1",
              stepLabel: "text-xs font-semibold",
              stepDescription: "text-xs",
            }}
          >
            <Stepper.Step
              label="Personal Details"
              description="Tell us about yourself"
            />
            <Stepper.Step
              label="Location & Account"
              description="Network and credentials"
            />
            <Stepper.Step
              label="Review & Confirm"
              description="Complete registration"
            />
          </Stepper>
        </div>

        {/* Content */}
        {children}
      </div>
    </AuthLayout>
  );
}
