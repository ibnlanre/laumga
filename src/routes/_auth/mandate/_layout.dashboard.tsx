import {
  createFileRoute,
  Link,
  useLoaderData,
  useNavigate,
} from "@tanstack/react-router";
import {
  AlertCircle,
  CalendarClock,
  CalendarOff,
  Pause,
  Play,
  X,
} from "lucide-react";
import { useRef } from "react";
import { Button, Text } from "@mantine/core";
import { modals } from "@mantine/modals";

import { LoadingState } from "@/components/loading-state";
import { MandateHeader } from "@/layouts/mandate/header";
import { useAuth } from "@/contexts/use-auth";
import { EmptyState } from "@/components/empty-state";
import {
  usePauseMandate,
  useReinstateMandate,
  useCancelMandate,
} from "@/api/mandate/hooks";
import { listFeedOptions } from "@/api/feed/options";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency } from "@/utils/currency";
import { Section } from "@/components/section";

export const Route = createFileRoute("/_auth/mandate/_layout/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuth();
  const { activeMandate } = useLoaderData({ from: "/_auth/mandate/_layout" });

  const navigate = useNavigate({ from: "/mandate/dashboard" });

  const {
    data: feedData = [],
    isLoading: feedLoading,
    isError: feedError,
  } = useQuery(listFeedOptions());

  const pauseMutation = usePauseMandate();
  const reinstateMutation = useReinstateMandate();
  const cancelMutation = useCancelMandate();

  const observerRef = useRef<HTMLDivElement>(null);

  const {
    amount = 0,
    frequency = "monthly",
    status = "No mandate yet",
    tier = "unassigned",
  } = { ...activeMandate };

  const handlePauseMandate = () => {
    modals.openConfirmModal({
      title: "Pause Your Mandate",
      centered: true,
      radius: "xl",
      padding: "xl",
      withCloseButton: false,
      children: (
        <Text c="dimmed">
          Your <span className="capitalize font-semibold">{tier}</span> mandate
          will be paused. You can resume it anytime from your dashboard.
        </Text>
      ),
      labels: { confirm: "Pause", cancel: "Cancel" },
      confirmProps: { color: "dark", size: "md", radius: "xl" },
      cancelProps: { variant: "default", size: "md", radius: "xl" },
      onConfirm: async () => {
        if (!user) return;

        await pauseMutation.mutateAsync({ data: { user } });
      },
    });
  };

  const handleResumeMandate = () => {
    modals.openConfirmModal({
      title: "Resume Your Mandate",
      centered: true,
      radius: "xl",
      padding: "xl",
      withCloseButton: false,
      children: (
        <Text c="dimmed">
          Your <span className="capitalize font-semibold">{tier}</span> mandate
          will be reactivated. Debits will resume on schedule.
        </Text>
      ),
      labels: { confirm: "Resume", cancel: "Cancel" },
      confirmProps: { color: "green", size: "md", radius: "xl" },
      cancelProps: { variant: "default", size: "md", radius: "xl" },
      onConfirm: async () => {
        if (!user) return;

        await reinstateMutation.mutateAsync({ data: { user } });
      },
    });
  };

  const handleCancelMandate = () => {
    modals.openConfirmModal({
      title: "Cancel Your Mandate",
      centered: true,
      radius: "xl",
      padding: "xl",
      withCloseButton: false,
      children: (
        <div className="space-y-3">
          <Text c="dimmed">
            This will permanently cancel your{" "}
            <span className="capitalize font-semibold">{tier}</span> mandate and
            deactivate your Flutterwave subscription.
          </Text>
          <Text c="dimmed">
            You can set up a new mandate afterwards if you wish.
          </Text>
        </div>
      ),
      labels: { confirm: "Cancel Mandate", cancel: "Keep It" },
      confirmProps: { color: "red", size: "md", radius: "xl" },
      cancelProps: { variant: "default", size: "md", radius: "xl" },
      onConfirm: async () => {
        if (!user) return;

        await cancelMutation.mutateAsync({ data: { user } });
        navigate({ to: "/mandate/pledge" });
      },
    });
  };

  return (
    <div className="w-full flex-1 bg-linear-to-b from-mist-green/70 via-white to-white pt-6 sm:pt-8 pb-10 sm:pb-12">
      <div className="flex w-full flex-col gap-8">
        <MandateHeader />

        <Section>
          <main className="flex flex-col gap-10 rounded-4xl border border-sage-green/40 bg-white/95 p-6 shadow-[0px_30px_80px_rgba(0,35,19,0.08)] sm:p-10">
            <header className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-deep-forest/70">
                stewardship
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h1 className="text-3xl font-black tracking-[-0.03em] text-deep-forest sm:text-4xl">
                    The Stewardship Console
                  </h1>
                  <p className="text-base text-deep-forest/70">
                    Track your pledge rhythm and keep every contribution
                    intentional.
                  </p>
                </div>
                <Link
                  to="/mandate/pledge"
                  className="inline-flex items-center justify-center rounded-full bg-deep-forest px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-deep-forest/90"
                >
                  Adjust my pledge
                </Link>
              </div>
            </header>

            <section>
              {activeMandate ? (
                <article className="relative overflow-hidden rounded-3xl border border-sage-green/40 bg-white/90 p-8 shadow-xl">
                  <div
                    className="pointer-events-none absolute inset-0 opacity-80"
                    aria-hidden="true"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 20% 20%, rgba(205,229,167,0.35), transparent 55%), radial-gradient(circle at 80% 20%, rgba(141,198,63,0.25), transparent 50%)",
                    }}
                  />
                  <div className="relative space-y-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-deep-forest/50">
                          Active Mandate
                        </p>
                        <p className="text-2xl font-bold text-deep-forest capitalize mt-2">
                          {tier}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-2 rounded-full bg-vibrant-lime/20 px-4 py-2 text-sm font-medium text-institutional-green capitalize">
                        <span className="size-2 rounded-full bg-vibrant-lime" />
                        {status}
                      </span>
                    </div>

                    <div className="text-center py-6">
                      <p className="text-5xl font-bold text-deep-forest">
                        {formatCurrency(amount)}
                      </p>
                      <p className="text-xl font-medium text-deep-forest/70 capitalize mt-2">
                        per {frequency}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3 justify-center pt-4 border-t border-sage-green/30">
                      {status === "active" && (
                        <Button
                          size="lg"
                          className="inline-flex items-center gap-2 rounded-full border-2 border-deep-forest/20 bg-white text-sm font-semibold text-deep-forest transition hover:bg-deep-forest/5 hover:border-deep-forest/40"
                          type="button"
                          onClick={handlePauseMandate}
                        >
                          <Pause size={18} />
                          Pause mandate
                        </Button>
                      )}

                      {status === "paused" && (
                        <Button
                          size="lg"
                          className="inline-flex items-center gap-2 rounded-full border-2 border-vibrant-lime bg-vibrant-lime/10 text-sm font-semibold text-institutional-green transition hover:bg-vibrant-lime/20"
                          type="button"
                          onClick={handleResumeMandate}
                        >
                          <Play size={18} />
                          Resume mandate
                        </Button>
                      )}

                      <Button
                        size="lg"
                        className="inline-flex items-center gap-2 rounded-full border-2 border-red-200 bg-red-50 text-sm font-semibold text-red-700 transition hover:bg-red-100 hover:border-red-300"
                        type="button"
                        onClick={handleCancelMandate}
                      >
                        <X size={18} />
                        Cancel mandate
                      </Button>
                    </div>
                  </div>
                </article>
              ) : (
                <EmptyState
                  icon={CalendarClock}
                  title="No active mandate"
                  message="Once you complete a pledge, your cadence and community activity will populate here."
                >
                  <Link
                    to="/mandate/pledge"
                    className="inline-flex items-center justify-center rounded-full bg-deep-forest px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-deep-forest/90"
                  >
                    Create a mandate
                  </Link>
                </EmptyState>
              )}
            </section>

            <section className="rounded-3xl border border-sage-green/40 bg-white/95 p-6 shadow-lg">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-deep-forest/60">
                    Community activity
                  </p>
                  <h2 className="text-2xl font-bold text-deep-forest">
                    Recent Mandate Activity
                  </h2>
                  <p className="text-sm text-deep-forest/70">
                    Real-time snapshots from your fellow community members.
                  </p>
                </div>
              </div>

              {feedLoading ? (
                <div className="py-12">
                  <LoadingState
                    type="spinner"
                    message="Gathering latest activity..."
                  />
                </div>
              ) : feedError ? (
                <div className="pt-6">
                  <EmptyState
                    icon={AlertCircle}
                    title="Could not load feed"
                    message="We will retry shortly. Refresh if the issue persists."
                  />
                </div>
              ) : feedData.length ? (
                <ul className="mt-6 space-y-4">
                  {feedData.map((item, index) => (
                    <li
                      key={`${item.timestamp}-${index}`}
                      className="flex flex-col gap-2 rounded-2xl border border-sage-green/40 bg-mist-green/30 px-4 py-3 text-deep-forest"
                    >
                      <span className="text-xs font-semibold uppercase tracking-[0.3em] text-deep-forest/60">
                        {item.type === "donation" ? "Mandate" : "Registration"}
                      </span>

                      <p className="text-sm text-deep-forest/80">
                        {item.type === "donation"
                          ? `📍 A ${item.gender === "male" ? "brother" : "sister"} from ${item.location} donated`
                          : `🚀 New member from ${item.location} registered`}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="pt-6">
                  <EmptyState
                    icon={CalendarOff}
                    title="No feed items yet"
                    message="As soon as fresh pledges land, the stories will roll through here."
                  />
                </div>
              )}
              <div ref={observerRef} className="h-1" />
            </section>

            <section className="rounded-3xl bg-deep-forest px-6 py-8 text-white shadow-2xl">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2 text-center md:text-left">
                  <p className="text-sm uppercase tracking-[0.3em] text-white/70">
                    steady builders
                  </p>
                  <p className="text-2xl font-semibold">
                    Allah loves the consistent deed, even if small.
                  </p>
                  <p className="text-white/80">
                    If you have the means, consider increasing your tier and
                    keep learners equipped all year.
                  </p>
                </div>
                <Link
                  to="/mandate/pledge"
                  className="rounded-2xl bg-vibrant-lime px-6 py-3 text-base font-semibold text-deep-forest transition hover:opacity-90"
                >
                  View pledge options
                </Link>
              </div>
            </section>
          </main>
        </Section>
      </div>
    </div>
  );
}
