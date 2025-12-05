import { Stepper } from "@mantine/core";
import { useRegistration } from "@/contexts/registration-context";

interface RegistrationLayoutProps {
  children: React.ReactNode;
}

export function RegistrationLayout({ children }: RegistrationLayoutProps) {
  const { currentStep } = useRegistration();

  return (
    <div className="min-h-screen bg-mist-green">
      {/* Stepper Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <Stepper
            active={currentStep}
            color="rgba(0, 104, 56, 1)"
            completedIcon={null}
            classNames={{
              stepIcon: "border-2",
              stepBody: "mt-2",
            }}
          >
            <Stepper.Step
              label="Personal Details"
              description="Tell us about yourself"
            />
            <Stepper.Step
              label="Location & Account"
              description="Where you're from and how to reach you"
            />
            <Stepper.Step
              label="Review & Submit"
              description="Confirm and complete"
            />
          </Stepper>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-6xl">{children}</div>
    </div>
  );
}
