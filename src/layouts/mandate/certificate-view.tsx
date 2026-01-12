"use client";

import { Alert, Button, Image } from "@mantine/core";
import { Link, useLoaderData } from "@tanstack/react-router";
import { Download, ExternalLink, Lock, Sparkles } from "lucide-react";
import * as ReactToPDF from "react-to-pdf";

import { formatDate } from "@/utils/date";
import { useAuth } from "@/contexts/use-auth";
import { listGetActiveMandateCertificateOptions } from "@/api/mandate-certificate/options";
import { LoadingState } from "@/components/loading-state";
import { useCreateMandateCertificate } from "@/api/mandate-certificate/hooks";
import { notifications } from "@mantine/notifications";
import { formatCurrency } from "@/utils/currency";
import { useQuery } from "@tanstack/react-query";

export function MandateCertificateView() {
  const { user } = useAuth();
  const { activeMandate } = useLoaderData({ from: "/_auth/mandate/_layout" });
  const { toPDF, targetRef } = ReactToPDF.usePDF({
    filename: "mandate-certificate.pdf",
    page: { margin: 20 },
  });

  const mandateCertificate = useQuery(
    listGetActiveMandateCertificateOptions(activeMandate?.id)
  );
  const createCertificate = useCreateMandateCertificate();

  const handleGenerateCertificate = () => {
    if (!activeMandate || !user) return;

    createCertificate.mutate(
      { data: { mandate: activeMandate, user } },
      {
        onSuccess: () => {
          notifications.show({
            title: "Certificate generated",
            message: "Your mandate certificate has been successfully created.",
            color: "green",
          });
        },
        onError: () => {
          notifications.show({
            title: "Generation failed",
            message: "Unable to generate certificate. Please try again.",
            color: "red",
          });
        },
      }
    );
  };

  if (mandateCertificate.isLoading) {
    return <LoadingState message="Loading certificate..." />;
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
          rightSection={<ExternalLink size={16} />}
        >
          Go to login
        </Button>
      </div>
    );
  }

  if (mandateCertificate.isError) {
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

  if (!mandateCertificate.data) {
    if (activeMandate && activeMandate.status === "active") {
      return (
        <div className="mx-auto w-full max-w-3xl rounded-4xl border border-sage-green/50 bg-white/90 p-10 text-center shadow-[0_40px_120px_rgba(0,35,19,0.08)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-mist-green text-deep-forest">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="mt-6 text-3xl font-semibold text-deep-forest font-display">
            Certificate Available
          </h2>
          <p className="mt-3 text-base text-deep-forest/70">
            Your mandate is active! You can now generate your official
            Certificate of Mandate to commemorate your pledge.
          </p>
          <Button
            onClick={handleGenerateCertificate}
            loading={createCertificate.isPending}
            size="lg"
            radius="xl"
            className="mx-auto mt-6 bg-deep-forest text-white hover:bg-deep-forest/90 text-sm"
            leftSection={<Sparkles size={16} />}
          >
            Generate Certificate
          </Button>
        </div>
      );
    }

    return (
      <div className="mx-auto w-full max-w-3xl rounded-4xl border border-sage-green/50 bg-white/90 p-10 text-center shadow-[0_40px_120px_rgba(0,35,19,0.08)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-mist-green text-deep-forest">
          <Lock className="h-6 w-6" />
        </div>
        <h2 className="mt-6 text-3xl font-semibold text-deep-forest font-display">
          Certificate locked
        </h2>
        <p className="mt-3 text-base text-deep-forest/70">
          You don't have an active mandate yet. Start a pledge to generate your
          certificate of mandate. Your certificate will unlock once your first
          mandate is active.
        </p>

        <Button
          component={Link}
          to="/mandate/pledge"
          size="lg"
          radius="xl"
          className="mx-auto mt-6 bg-deep-forest text-white hover:bg-deep-forest/90"
          rightSection={<ExternalLink size={16} />}
        >
          Start a pledge
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div
        ref={targetRef}
        className="rounded-4xl border-4 border-institutional-green/30 bg-white p-10 shadow-[0_50px_140px_rgba(0,35,19,0.12)]"
      >
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.4em] text-deep-forest/50">
          <span>Certificate</span>
          <span className="text-deep-forest/70">
            {mandateCertificate.data.frequency}
          </span>
        </div>
        <div className="mt-6 flex justify-center">
          <div className="flex h-16 w-16 p-2.5 items-center justify-center rounded-full bg-black text-2xl font-bold text-vibrant-lime overflow-hidden">
            <Image
              src="/laumga-square.jpeg"
              alt="Laumga"
              width={48}
              height={48}
            />
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
            {mandateCertificate.data.userName}
          </p>
          <p className="mt-4 text-base text-deep-forest/70">
            has pledged a {mandateCertificate.data.frequency} mandate of
          </p>
          <p className="mt-2 text-3xl font-bold text-deep-forest">
            {formatCurrency(mandateCertificate.data?.amount)}
          </p>
          <p className="mt-4 text-base text-deep-forest/70">
            to keep verified welfare, scholarship, and empowerment lifelines
            active for the brotherhood.
          </p>
        </div>
        <div className="my-8 border-t border-dashed border-sage-green/60" />
        <div className="flex flex-col gap-6 text-sm text-deep-forest/70 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-semibold text-deep-forest">Issued</p>
            <p>
              {mandateCertificate.data.created
                ? formatDate(mandateCertificate.data.created.at, "PPP")
                : "Pending activation"}
            </p>
          </div>
          <div className="text-center">
            {mandateCertificate.data.signatureUrl ? (
              <img
                src={mandateCertificate.data.signatureUrl}
                alt={`${mandateCertificate.data.chairmanName} signature`}
                className="mx-auto h-16 object-contain"
              />
            ) : (
              <p className="text-xs uppercase tracking-[0.4em] text-deep-forest/40">
                Signature pending
              </p>
            )}
            <p className="mt-2 font-serif text-lg text-deep-forest">
              {mandateCertificate.data.chairmanName}
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
          fullWidth
          classNames={{
            root: "border-2 border-deep-forest text-deep-forest hover:bg-deep-forest/5 h-12",
            label: "font-semibold",
          }}
          onClick={() => toPDF()}
          leftSection={<Download size={16} />}
        >
          Download certificate
        </Button>
        <Button
          component={Link}
          to="/mandate/dashboard"
          radius="xl"
          size="lg"
          fullWidth
          classNames={{
            root: "bg-deep-forest text-white hover:bg-deep-forest/90 h-12",
            label: "font-semibold",
          }}
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
