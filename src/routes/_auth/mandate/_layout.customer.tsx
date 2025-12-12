import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/section";

import { MandateCustomerForm } from "@/layouts/mandate/customer-form";
import { MandateHeader } from "@/layouts/mandate/header";

export const Route = createFileRoute("/_auth/mandate/_layout/customer")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="relative flex-1 w-full bg-linear-to-b from-mist-green via-white to-sage-green/40 text-deep-forest pt-6 sm:pt-8 pb-10 sm:pb-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 20%, rgba(203,229,167,0.6), transparent 55%), radial-gradient(circle at 88% 5%, rgba(0,35,19,0.15), transparent 50%)",
        }}
      />

      <Section className="relative flex flex-col gap-10">
        <MandateHeader />
        <MandateCustomerForm />
      </Section>
    </div>
  );
}
