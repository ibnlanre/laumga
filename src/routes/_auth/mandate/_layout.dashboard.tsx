import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  AlertCircle,
  CalendarClock,
  CalendarOff,
  Download,
  Inbox,
  Settings,
} from "lucide-react";
import { useRef } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { LoadingState } from "@/components/loading-state";
import { DataTable } from "@/components/data-table";
import { MandateHeader } from "@/layouts/mandate/header";
import { useAuth } from "@/contexts/use-auth";
import { formatDate } from "@/utils/date";
import { EmptyState } from "@/components/empty-state";
import type { MandateTransaction } from "@/api/mandate-transaction/types";
import { useGetActiveMandate } from "@/api/mandate/handlers";
import { useFeed } from "@/api/feed/hooks";
import { useListUserMandateTransactions } from "@/api/mandate-transaction/handlers";

const NAIRA_FORMATTER = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

const tierScale = [
  { tier: "supporter", amount: 500_000 },
  { tier: "builder", amount: 1_000_000 },
  { tier: "guardian", amount: 2_500_000 },
] as const;

const transactionColumns: ColumnDef<MandateTransaction>[] = [
  {
    accessorKey: "paidAt",
    header: "Date",
    cell: (info) => (
      <span className="font-medium text-deep-forest">
        {formatDate(info.getValue<string>(), "PPP")}
      </span>
    ),
  },
  {
    accessorKey: "monoReference",
    header: "Reference",
    cell: (info) => (
      <span className="font-mono text-sm text-deep-forest/80">
        {info.getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => {
      const status = info.getValue<string>();
      const label = status
        ? status.charAt(0).toUpperCase() + status.slice(1)
        : "Unknown";
      const styles =
        status === "successful"
          ? "bg-mist-green text-deep-forest"
          : status === "failed"
            ? "bg-red-50 text-red-700"
            : "bg-amber-50 text-amber-700";

      return (
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles}`}
        >
          {label}
        </span>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: (info) => (
      <span className="font-semibold text-deep-forest">
        {formatCurrencyFromKobo(info.getValue<number>())}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <button
        className="rounded-full p-2 text-deep-forest/60 transition hover:text-deep-forest"
        type="button"
        aria-label={`Download receipt for ${formatDate(row.original.paidAt, "PPP")}`}
      >
        <Download className="h-4 w-4" />
      </button>
    ),
  },
];

export const Route = createFileRoute("/_auth/mandate/_layout/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuth();
  const userId = user?.id;

  const {
    data: feedData = [],
    isLoading: feedLoading,
    isError: feedError,
  } = useFeed();

  const { data: activeMandate, isLoading: mandateLoading } =
    useGetActiveMandate(userId);

  const { data: transactions = [], isLoading: transactionsLoading } =
    useListUserMandateTransactions(userId);

  const observerRef = useRef<HTMLDivElement>(null);

  const currentAmount = activeMandate?.amount ?? 0;
  const statusLabel = activeMandate?.status
    ? capitalize(activeMandate.status)
    : "No mandate yet";
  const tierLabel = formatTierLabel(activeMandate?.tier);

  const { percent: tierProgress, label: tierProgressLabel } = currentAmount
    ? getNextTierMeta(currentAmount)
    : { percent: 0, label: "Progress to next tier" };

  return (
    <div className="w-full flex-1 bg-linear-to-b from-mist-green/70 via-white to-white pt-6 sm:pt-8 pb-10 sm:pb-12">
      <div className="mx-auto flex w-full container flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <MandateHeader disableInteractions={false} />

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

          <section className="grid gap-6 md:grid-cols-3">
            {mandateLoading ? (
              <div className="md:col-span-3">
                <LoadingState
                  type="spinner"
                  message="Fetching your mandate..."
                />
              </div>
            ) : activeMandate ? (
              <>
                <article className="relative overflow-hidden rounded-3xl border border-sage-green/40 bg-white/90 p-6 shadow-xl">
                  <div
                    className="pointer-events-none absolute inset-0 opacity-80"
                    aria-hidden="true"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 20% 20%, rgba(205,229,167,0.35), transparent 55%), radial-gradient(circle at 80% 20%, rgba(141,198,63,0.25), transparent 50%)",
                    }}
                  />
                  <div className="relative flex min-h-[220px] flex-col justify-between gap-6">
                    <div className="flex items-start justify-between text-sm font-medium text-deep-forest/70">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-deep-forest/50">
                          Active Mandate
                        </p>
                        <p className="text-lg font-semibold text-deep-forest">
                          {tierLabel}
                        </p>
                      </div>
                      <button
                        className="rounded-full border border-white/60 bg-white/80 p-2 text-deep-forest/70 transition hover:text-deep-forest"
                        type="button"
                        aria-label="Manage mandate settings"
                      >
                        <Settings className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="text-center">
                      <p className="text-4xl font-bold text-deep-forest">
                        {formatCurrencyFromKobo(activeMandate.amount)}
                        <span className="ml-1 text-xl font-medium text-deep-forest/70">
                          / {capitalize(activeMandate.frequency)}
                        </span>
                      </p>
                    </div>
                    <p className="flex items-center justify-between text-sm font-medium text-institutional-green">
                      <span className="inline-flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-vibrant-lime" />
                        {statusLabel}
                      </span>
                      <span className="text-deep-forest/60">
                        Next charge:{" "}
                        {formatNextCharge(activeMandate.nextChargeDate)}
                      </span>
                    </p>
                  </div>
                </article>

                <article className="rounded-3xl border border-sage-green/30 bg-white/90 p-6 shadow-lg">
                  <div className="flex h-full flex-col gap-5">
                    <div className="space-y-2">
                      <div className="h-2.5 w-full rounded-full bg-mist-green/60">
                        <div
                          className="h-full rounded-full bg-vibrant-lime transition-all"
                          style={{ width: `${tierProgress}%` }}
                        />
                      </div>
                      <p className="text-sm text-deep-forest/70">
                        {tierProgressLabel}
                      </p>
                    </div>
                  </div>
                </article>

                <article className="rounded-3xl border border-sage-green/30 bg-white/90 p-6 shadow-lg">
                  <div className="flex h-full flex-col gap-5">
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-deep-forest/70">
                        Mandate health
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-mist-green/80 p-3 text-deep-forest">
                          <Activity className="h-6 w-6" />
                        </div>
                        <p className="text-4xl font-bold tracking-tight text-deep-forest">
                          {transactions.length}
                        </p>
                      </div>
                    </div>
                    <p className="text-base text-deep-forest/70">
                      Successful draws logged since you activated this pledge.
                    </p>
                  </div>
                </article>
              </>
            ) : (
              <div className="md:col-span-3">
                <EmptyState
                  icon={CalendarClock}
                  title="No active mandate"
                  message="Once you complete a pledge, your cadence, totals, and history will populate here."
                >
                  <Link
                    to="/mandate/pledge"
                    className="inline-flex items-center justify-center rounded-full bg-deep-forest px-5 py-2 text-sm font-semibold text-white"
                  >
                    Create a mandate
                  </Link>
                </EmptyState>
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-sage-green/40 bg-white/95 p-6 shadow-lg">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-deep-forest/60">
                  Community activity
                </p>
                <h2 className="text-2xl font-bold text-deep-forest">
                  Mandate feed
                </h2>
                <p className="text-sm text-deep-forest/70">
                  Real-time snapshots when brothers and sisters activate,
                  upgrade, or register.
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

          <section className="rounded-3xl border border-sage-green/30 bg-white/95 p-6 shadow-xl">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-deep-forest">
                  Payment history
                </h2>
                <p className="text-sm text-deep-forest/70">
                  Every debit linked to your mandate appears with a Mono
                  reference for auditing.
                </p>
              </div>
            </div>

            {transactionsLoading ? (
              <div className="py-12">
                <LoadingState
                  type="spinner"
                  message="Loading transactions..."
                />
              </div>
            ) : transactions.length ? (
              <div className="mt-6">
                <DataTable
                  columns={transactionColumns}
                  data={transactions}
                  enableColumnOrdering={false}
                  enableColumnPinning={false}
                  enableColumnResizing={false}
                  enableFilters={false}
                  enableRowSelection={false}
                  enableSearch={false}
                  enableSorting
                  loading={transactionsLoading}
                  pageSize={5}
                />
              </div>
            ) : (
              <div className="pt-6">
                <EmptyState
                  icon={Inbox}
                  title="No transactions yet"
                  message="After your first successful debit, the ledger will populate automatically."
                />
              </div>
            )}
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
                  If you have the means, consider increasing your tier and keep
                  learners equipped all year.
                </p>
              </div>
              <Link
                to="/mandate/pledge"
                className="rounded-2xl bg-vibrant-lime px-6 py-3 text-base font-semibold text-deep-forest transition hover:opacity-90"
              >
                Increase my mandate
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function formatCurrencyFromKobo(value?: number | null) {
  if (value == null) return "₦0";
  return NAIRA_FORMATTER.format(Math.round(value / 100));
}

function formatTierLabel(tier?: string | null) {
  if (!tier) return "Unassigned";
  return tier.charAt(0).toUpperCase() + tier.slice(1);
}

function formatNextCharge(nextChargeDate?: string | null) {
  if (!nextChargeDate) return "Not scheduled";
  return formatDate(nextChargeDate, "MMM d, yyyy");
}

function getNextTierMeta(currentAmount: number) {
  const nextTier = tierScale.find((tier) => tier.amount > currentAmount);
  if (!nextTier) {
    return { percent: 100, label: "You are on the highest tier" };
  }

  const percent = Math.min(
    100,
    Math.round((currentAmount / nextTier.amount) * 100)
  );
  return { percent, label: `Progress to ${capitalize(nextTier.tier)}` };
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
