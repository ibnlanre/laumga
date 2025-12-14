import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/section";

import { MandateHeader } from "@/layouts/mandate/header";
import { MandateCertificateView } from "../../../layouts/mandate/certificate-view";

export const Route = createFileRoute("/_auth/mandate/_layout/certificate")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="relative flex-1 w-full bg-linear-to-b from-mist-green via-white to-sage-green/30 text-deep-forest pt-6 sm:pt-8 pb-10 sm:pb-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 20%, rgba(203,229,167,0.55), transparent 55%), radial-gradient(circle at 92% 0%, rgba(0,35,19,0.18), transparent 45%)",
        }}
      />

      <div className="relative flex flex-col gap-10">
        <MandateHeader />
        <Section>
          <MandateCertificateView />
        </Section>
      </div>
    </div>
  );
}
