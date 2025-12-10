import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod/v4";
import { zodValidator } from "@tanstack/zod-adapter";

import { MandatePledgeForm } from "@/layouts/mandate/mandate-pledge-form";
import { MandateHeader } from "@/layouts/mandate/header";

const pledgeSearchSchema = z.object({
  tier: z.enum(["supporter", "builder", "guardian", "custom"]).optional(),
  amount: z.number().optional(),
});

export const Route = createFileRoute("/_auth/mandate/_layout/pledge")({
  validateSearch: zodValidator(pledgeSearchSchema),
  component: RouteComponent,
});

function RouteComponent() {
  const { tier, amount } = Route.useSearch();

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

      <div className="relative container mx-auto flex flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <MandateHeader disableInteractions={false} />
        <MandatePledgeForm tier={tier} amount={amount} />
      </div>
    </div>
  );
}
