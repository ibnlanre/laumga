import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";

import type { ApprovalStatus } from "@/api/user/types";
import { Section } from "@/components/section";
import { MandateHeader } from "@/layouts/mandate/header";
import { queryClient } from "@/routing/query-client";
import { mandate } from "@/api/mandate";

export const Route = createFileRoute("/_auth/mandate/_layout")({
  loader: async ({ context }) => {
    const { uid } = context;

    const activeMandate = await queryClient.ensureQueryData({
      queryKey: mandate.get.$get({ data: uid }),
      queryFn: () => mandate.$use.get({ data: uid! }),
    });

    return { activeMandate };
  },
  component: RouteComponent,
});

export function RouteComponent() {
  return <Outlet />;
}

type RestrictedStatus = Exclude<ApprovalStatus, "approved">;
type StatusCopy = { title: string; body: string; hint: string };

const statusCopy = {
  pending: {
    title: "Your membership is under review",
    body: "Our membership council is validating your submission. You will receive an email as soon as the review is complete, and mandate tools unlock automatically once you are cleared.",
    hint: "Keep an eye on your inbox and ensure you have responded to any follow-up questions from your chapter lead.",
  },
  rejected: {
    title: "Your membership needs attention",
    body: "We could not approve your profile with the information provided. Please respond to the clarification email so we can reopen your review.",
    hint: "Reply to the message from membership or reach out to your local coordinator to resolve outstanding questions.",
  },
  suspended: {
    title: "Membership temporarily suspended",
    body: "Access to mandate tooling is paused while we investigate an account issue. We will notify you once everything is resolved.",
    hint: "If you believe this is a mistake, contact the membership desk with any supporting information.",
  },
} satisfies Record<RestrictedStatus, StatusCopy>;

interface AccessNoticeProps {
  status?: ApprovalStatus;
}

function AccessNotice({ status }: AccessNoticeProps) {
  if (!status) {
    return {
      title: "Membership on hold",
      body: "We are finishing up a quick review before enabling mandate controls. Thank you for your patience.",
      hint: "Reach out to your chapter lead if you have urgent updates to share.",
    };
  }

  if (status === "approved") return null;
  const copy = statusCopy[status];

  return (
    <div className="flex flex-1 flex-col bg-linear-to-b from-mist-green/70 via-white to-white">
      <MandateHeader isLanding />
      <Section className="flex flex-1 w-full items-center justify-center py-12">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 rounded-4xl border border-sage-green/50 bg-white/95 p-10 text-center shadow-[0px_40px_140px_rgba(0,35,19,0.08)]">
          <span className="rounded-3xl bg-mist-green/70 p-4 text-deep-forest">
            <AlertTriangle className="h-8 w-8" />
          </span>
          <h1 className="text-3xl font-bold text-deep-forest">{copy.title}</h1>
          <p className="text-base text-deep-forest/80">{copy.body}</p>
          <div className="w-full rounded-3xl border border-sage-green/40 bg-mist-green/40 p-4 text-sm text-deep-forest/80">
            {copy.hint}
          </div>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-deep-forest px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-deep-forest/90"
          >
            Return home
          </Link>
        </div>
      </Section>
    </div>
  );
}
