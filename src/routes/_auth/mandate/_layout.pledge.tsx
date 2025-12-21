import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod/v4";

import { MandatePledgeForm } from "@/layouts/mandate/pledge-form";
import { MandateHeader } from "@/layouts/mandate/header";
import { Stack } from "@mantine/core";

const pledgeSearchSchema = z
  .object({
    tier: z.enum(["supporter", "builder", "guardian", "custom"]),
    amount: z.number(),
  })
  .partial();

export const Route = createFileRoute("/_auth/mandate/_layout/pledge")({
  validateSearch: pledgeSearchSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const { tier, amount } = Route.useSearch();

  return (
    <div className="relative flex-1 w-full bg-linear-to-b spacey-10 from-mist-green via-white to-sage-green/40 text-deep-forest pt-6 sm:pt-8 pb-10 sm:pb-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 20%, rgba(203,229,167,0.6), transparent 55%), radial-gradient(circle at 88% 5%, rgba(0,35,19,0.15), transparent 50%)",
        }}
      />

      <Stack gap={40} className="relative">
        <MandateHeader />
        <MandatePledgeForm tier={tier} amount={amount} />
      </Stack>
    </div>
  );
}
