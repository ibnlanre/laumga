import { useMemo } from "react";
import { Alert, Button, Loader } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { Download, ExternalLink, Lock } from "lucide-react";

import { useAuth } from "@/contexts/use-auth";
import { formatDate } from "@/utils/date";
import { useGetMandateCertificate } from "@/api/mandate-certificate/hooks";

const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export function MandateCertificateView() {
  const { user } = useAuth();
  const { data, isLoading, isError } = useGetMandateCertificate(user?.id);

  const formattedAmount = useMemo(() => {
    if (!data?.amount) return nairaFormatter.format(0);
    return nairaFormatter.format(data.amount / 100);
  }, [data?.amount]);

  const formattedStartDate = useMemo(() => {
    if (!data?.startDate) return "";
    return formatDate(data.startDate, "MMMM d, yyyy");
  }, [data?.startDate]);

  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center py-20">
        <Loader color="green" size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-3xl rounded-4xl border border-sage-green/50 bg-white/90 p-10 text-center shadow-[0_40px_120px_rgba(0,35,19,0.08)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-mist-green text-deep-forest">
          <Lock className="h-6 w-6" />
        </div>
        <h2 className="mt-6 text-3xl font-semibold text-deep-forest font-display">
          Sign in required
        </h2>
        <p className="mt-3 text-base text-deep-forest/70">
          You need to be signed in to view and download your mandate
          certificate. Please log in with the email tied to your pledge.
        </p>
        <Button
          component={Link}
          to="/login"
          size="lg"
          radius="xl"
          className="mx-auto mt-6 bg-deep-forest px-10 text-white hover:bg-deep-forest/90"
          rightSection={<ExternalLink className="h-4 w-4" />}
        >
          Go to login
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center py-20">
        <Loader color="green" size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert
        color="red"
        radius="lg"
        title="Unable to load certificate"
        className="mx-auto max-w-xl"
      >
        Please refresh the page or try again later.
      </Alert>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto w-full max-w-2xl rounded-3xl border border-sage-green/40 bg-white/80 p-10 text-center shadow-2xl">
        <h2 className="text-2xl font-semibold text-deep-forest">
          No active mandate yet
        </h2>
        <p className="mt-3 text-sm text-deep-forest/70">
          Start a pledge to generate your certificate of mandate. Your
          certificate will unlock once your first mandate is active.
        </p>
        <Button
          component={Link}
          to="/mandate/pledge"
          size="lg"
          radius="xl"
          className="mt-6 bg-deep-forest text-white hover:bg-deep-forest/90"
        >
          Start a pledge
        </Button>
      </div>
    );
  }

  const frequencyLabel = data.frequency.replace("-", " ");

  const handleDownload = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="rounded-4xl border-4 border-institutional-green/30 bg-white p-10 shadow-[0_50px_140px_rgba(0,35,19,0.12)]">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.4em] text-deep-forest/50">
          <span>Certificate</span>
          {/* <span className="text-deep-forest/70">{data.frequency}</span> */}
        </div>
        <div className="mt-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-deep-forest text-2xl font-bold text-vibrant-lime">
            L
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.6em] text-deep-forest/70">
            Laumga Foundation
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-[0.2em] text-deep-forest">
            Certificate of Mandate
          </h1>
          <p className="mt-6 text-base text-deep-forest/70">
            This certifies that
          </p>
          <p className="mt-2 text-2xl font-semibold text-institutional-green">
            {data.userName}
          </p>
          <p className="mt-4 text-base text-deep-forest/70">
            has pledged a {frequencyLabel} mandate of
          </p>
          <p className="mt-2 text-3xl font-bold text-deep-forest">
            {formattedAmount}
          </p>
          <p className="mt-4 text-base text-deep-forest/70">
            to keep verified welfare, scholarship, and empowerment lifelines
            active for the brotherhood.
          </p>
        </div>
        <div className="my-8 border-t border-dashed border-sage-green/60" />
        <div className="flex flex-col gap-6 text-sm text-deep-forest/70 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-semibold text-deep-forest">Started</p>
            <p>{formattedStartDate || "Pending activation"}</p>
          </div>
          <div className="text-center">
            {data.signatureUrl ? (
              <img
                src={data.signatureUrl}
                alt={`${data.chairmanName} signature`}
                className="mx-auto h-16 object-contain"
              />
            ) : (
              <p className="text-xs uppercase tracking-[0.4em] text-deep-forest/40">
                Signature pending
              </p>
            )}
            <p className="mt-2 font-serif text-lg text-deep-forest">
              {data.chairmanName}
            </p>
            <p className="text-xs uppercase tracking-[0.4em] text-deep-forest/60">
              Chairman, Laumga Foundation
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-3xl border border-sage-green/40 bg-white/80 p-6 shadow-lg md:flex-row">
        <Button
          variant="outline"
          radius="xl"
          size="lg"
          className="flex-1 border-deep-forest text-deep-forest hover:bg-deep-forest/5"
          onClick={handleDownload}
          leftSection={<Download className="h-4 w-4" />}
        >
          Download certificate
        </Button>
        <Button
          component={Link}
          to="/mandate/dashboard"
          radius="xl"
          size="lg"
          className="flex-1 bg-deep-forest text-white hover:bg-deep-forest/90"
        >
          Go to donor dashboard
        </Button>
      </div>
      <p className="text-center text-sm text-deep-forest/70">
        Inspire others to give
      </p>
    </div>
  );
}
