import { createFileRoute } from "@tanstack/react-router";
import { MandatePledgeForm } from "@/components/mandate-pledge-form";

export const Route = createFileRoute("/_auth/mandate/pledge")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-display bg-background-light text-[#151910]">
      <div className="w-full max-w-5xl">
        <MandatePledgeForm />
      </div>
    </div>
  );
}
