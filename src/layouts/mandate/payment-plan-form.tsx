import { useMemo } from "react";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { Button, NumberInput, Select, Tabs } from "@mantine/core";
import { Link, useLoaderData, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  FileText,
  GraduationCap,
  HardHat,
  Heart,
  LayoutDashboard,
  Shield,
  Star,
  TrendingUp,
  Vote,
} from "lucide-react";

import { useAuth } from "@/contexts/use-auth";
import { useCreateFlutterwavePlanCheckout } from "@/api/flutterwave/hooks";
import { Section } from "@/components/section";
import { formatCurrency } from "@/utils/currency";
import clsx from "clsx";
import { capitalize } from "inflection";
import { z } from "zod";
import type { FlutterwavePaymentPlan } from "@/api/flutterwave/types";
import { formatDateTime } from "@/utils/date";

const TIER_AMOUNTS = {
  supporter: 5000,
  builder: 10000,
  guardian: 25000,
} as const;

const tierOptions = [
  {
    id: "supporter",
    label: "Supporter",
    amountLabel: "₦5,000",
    copy: "Keeps welfare helplines funded every month.",
    accent: "text-sage-green",
    icon: Shield,
    amountValue: TIER_AMOUNTS.supporter,
  },
  {
    id: "builder",
    label: "Builder",
    amountLabel: "₦10,000",
    copy: "Backs book grants and transport for scholars.",
    accent: "text-institutional-green",
    icon: TrendingUp,
    amountValue: TIER_AMOUNTS.builder,
  },
  {
    id: "guardian",
    label: "Guardian",
    amountLabel: "₦25,000",
    copy: "Underwrites multi-student stipends per term.",
    accent: "text-vibrant-lime",
    icon: Star,
    amountValue: TIER_AMOUNTS.guardian,
  },
] as const;

const impactPillars = [
  {
    title: "Rapid welfare relief",
    copy: "Groceries, stipends, and hospital deposits dispatched within 48 hours.",
    icon: Heart,
  },
  {
    title: "Scholars who finish",
    copy: "Tuition bridges and exam fees keep brilliant students enrolled.",
    icon: GraduationCap,
  },
  {
    title: "Community ventures",
    copy: "Skills labs and micro-capital empower halal businesses to hire locally.",
    icon: HardHat,
  },
];

const safeguards = [
  {
    title: "Tokenized consent",
    copy: "Mandates run through our payment partner's bank-grade tokenization before activation.",
    icon: Shield,
  },
  {
    title: "Paper trail ready",
    copy: "Signed debit references + BVN checks keep ledgers audit-proof.",
    icon: FileText,
  },
  {
    title: "Live reporting",
    copy: "Mandate dashboard mirrors every debit, pause, and reinstatement in real-time.",
    icon: LayoutDashboard,
  },
];

const benefits = [
  {
    title: "Shariah compliant",
    copy: "Funds are deployed through vetted Muslim-led channels.",
    icon: CheckCircle2,
  },
  {
    title: "Monthly reports",
    copy: "Receive curated snapshots of welfare, scholarship, and empowerment spends.",
    icon: BarChart3,
  },
  {
    title: "Community voting",
    copy: "Mandate holders prioritise quarterly focus areas together.",
    icon: Vote,
  },
  {
    title: "Digital dashboard",
    copy: "Track every debit, pause, and upgrade without calling support.",
    icon: LayoutDashboard,
  },
];

const inputClassNames = {
  label: "text-sm font-semibold text-deep-forest",
  description: "text-deep-forest/60 text-sm tracking-wide",
  input:
    "h-14 rounded-2xl border-2 border-sage-green/60 bg-white text-base text-deep-forest placeholder:text-deep-forest/40 focus:border-deep-forest focus:ring-0",
};

const tierIconWrapperClasses = {
  active:
    "flex h-10 w-10 items-center justify-center rounded-2xl border border-white/40 bg-white/10 text-white",
  inactive:
    "flex h-10 w-10 items-center justify-center rounded-2xl border border-deep-forest/20 bg-mist-green/60 text-deep-forest",
};

const minimumPaymentAmount = 1_000;

const paymentFrequencyOptions = [
  { value: "hourly", label: "Hourly" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "bi-annually", label: "Bi-annually" },
  { value: "yearly", label: "Yearly" },
];

const initialPaymentPlans = {
  monthly: {
    id: 152274,
    name: "Monthly Plan",
    amount: 0,
    interval: "monthly",
    duration: 0,
    status: "active",
    currency: "NGN",
    plan_token: "rpp_fe6d9cd432ff52ab354a",
    created_at: "2025-12-29T01:43:47.000Z",
  },
};

const frequencySchema = z.enum([
  "hourly",
  "daily",
  "weekly",
  "monthly",
  "quarterly",
  "bi-annually",
  "yearly",
]);

const paymentPlanSchema = z.object({
  amount: z.number().min(minimumPaymentAmount),
  frequency: frequencySchema,
  paymentPlanId: z.union([z.string(), z.number()]),
});

type PaymentPlanFormValues = z.infer<typeof paymentPlanSchema>;

interface PaymentPlanFormProps {
  amount?: number;
  paymentPlans?: FlutterwavePaymentPlan[];
}

export function PaymentPlanForm({
  amount = 1000,
  paymentPlans = [],
}: PaymentPlanFormProps) {
  const { user } = useAuth();
  const { activeMandate } = useLoaderData({ from: "/_auth/mandate/_layout" });

  const navigate = useNavigate({ from: "/mandate/pledge" });
  const planCheckout = useCreateFlutterwavePlanCheckout();

  const hasActiveSubscription = activeMandate?.status === "active";
  const summaryTab = !hasActiveSubscription ? "customer" : "status";

  const paymentPlansByFrequency = useMemo(() => {
    return paymentPlans.reduce<Record<string, FlutterwavePaymentPlan>>(
      (acc, plan) => {
        acc[plan.interval] = plan;
        return acc;
      },
      initialPaymentPlans
    );
  }, [paymentPlans]);

  const pledgeForm = useForm<PaymentPlanFormValues>({
    initialValues: {
      amount,
      frequency: "monthly",
      paymentPlanId: paymentPlansByFrequency["monthly"].id,
    },
    validate: zod4Resolver(paymentPlanSchema),
  });

  pledgeForm.watch("amount", ({ value: amount }) => {
    navigate({ search: { amount } });
  });

  const handleSubmit = async ({
    amount,
    frequency,
    paymentPlanId,
  }: PaymentPlanFormValues) => {
    if (!user) return;

    const txRef = `LAUMGA_MANDATE_${user.id}_${Date.now()}`;
    const url = new URL(location.origin + location.pathname);
    url.searchParams.set("txRef", txRef);
    const redirectUrl = url.toString();

    const response = await planCheckout.mutateAsync({
      data: {
        txRef,
        amount,
        currency: "NGN",
        paymentPlanId,
        paymentOptions: "card",
        redirectUrl,
        customer: {
          email: user.email,
          name: user.fullName,
          phoneNumber: user.phoneNumber,
        },
        meta: {
          userId: user.id,
          cadence: frequency,
          amount,
          paymentPlanId: String(paymentPlanId),
        },
        customizations: {
          title: `${capitalize(frequency)} pledge`,
          description: `Recurring ${frequency} support`,
          logo: "https://www.laumgafoundation.org/laumga-logo.jpeg",
        },
      },
    });

    const { link } = response.data;
    if (link) open(link, "_self");
  };

  const renderSubscriptionSummary = () => {
    if (!activeMandate) return null;

    const amountLabel = formatCurrency(activeMandate.amount);
    const intervalValue = activeMandate.frequency;
    const cadenceLabel = capitalize(intervalValue);
    const statusLabel = capitalize(activeMandate.status);
    const createdLabel = activeMandate.created?.at
      ? formatDateTime(activeMandate.created?.at)
      : "Awaiting activation";

    const paymentDetails = [
      { label: "Started", value: createdLabel },
      { label: "Amount", value: amountLabel },
      { label: "Frequency", value: cadenceLabel },
    ];

    return (
      <div className="space-y-8">
        <section className="space-y-6 rounded-3xl border border-red-200/80 bg-red-50/50 p-6">
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-700 shrink-0">
                <AlertCircle size={20} />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-red-900">
                  You already have an active mandate
                </h2>
                <p className="text-sm text-red-700">
                  To adjust your pledge, you must first cancel your current{" "}
                  <span className="capitalize font-semibold">
                    {activeMandate.tier || "custom"}
                  </span>{" "}
                  mandate from the dashboard, then return here to create a new
                  one.
                </p>
              </div>
            </div>
            <Link
              to="/mandate/dashboard"
              className="inline-flex items-center justify-center rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Go to dashboard
            </Link>
          </div>
        </section>

        <section className="space-y-6 rounded-3xl border border-institutional-green/60 bg-mist-green/30 p-6">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-deep-forest/60">
              {statusLabel}
            </p>
            <div className="space-y-1 text-sm text-deep-forest/70">
              <h2 className="text-2xl font-semibold text-deep-forest">
                Current mandate details
              </h2>
              <p>
                Manage this mandate from your{" "}
                <Link
                  to="/mandate/dashboard"
                  className="font-semibold text-deep-forest underline hover:text-deep-forest/80"
                >
                  dashboard.
                </Link>
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {paymentDetails.map(({ label, value }) => (
              <div
                key={`${label}-${value}`}
                className="rounded-2xl border border-sage-green/50 bg-white/80 p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-deep-forest/60">
                  {label}
                </p>
                <p className="pt-2 text-sm font-semibold text-deep-forest break-all">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  };

  return (
    <Section className="flex flex-col gap-12">
      <section className="relative overflow-hidden rounded-4xl border border-white/60 bg-white/90 p-6 shadow-[0_40px_120px_rgba(0,35,19,0.08)] sm:p-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(205,229,167,0.35), transparent 55%), radial-gradient(circle at 80% 0%, rgba(0,104,56,0.18), transparent 45%)",
          }}
        />
        <div className="relative space-y-8">
          <div className="space-y-3 text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-deep-forest/70">
              pledge
            </p>
            <h1 className="text-4xl font-black tracking-[-0.03em] text-deep-forest sm:text-5xl">
              Choose the rhythm that fits your capacity
            </h1>
            <p className="text-base text-deep-forest/70 sm:max-w-3xl">
              Every steady debit keeps verified welfare cases, tuition bridges,
              and empowerment projects moving without pauses.
            </p>
          </div>

          <div
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr"
            aria-label="Mandate impact pillars"
          >
            {impactPillars.map(({ title, copy, icon: Icon }) => (
              <div
                key={title}
                className="rounded-2xl border border-sage-green/50 bg-white/80 p-4 grid gap-2 grid-rows-[auto_1fr] items-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage-green/25 text-deep-forest shrink-0">
                  <Icon size={20} />
                </div>

                <article>
                  <p className="pt-4 text-base font-semibold text-deep-forest">
                    {title}
                  </p>
                  <p className="text-sm text-deep-forest/70">{copy}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-4xl border border-white/60 bg-white/90 p-6 shadow-[0_40px_120px_rgba(0,35,19,0.08)] sm:p-10">
        <Tabs value={summaryTab}>
          <Tabs.Panel value="customer">
            <form
              onSubmit={pledgeForm.onSubmit(handleSubmit)}
              className="space-y-8"
            >
              <div className="space-y-1">
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-deep-forest/70">
                    Minimum Amount: {formatCurrency(minimumPaymentAmount)}
                  </p>
                  <h2 className="text-3xl font-semibold text-deep-forest">
                    Design your cadence
                  </h2>
                </div>
                <p className="text-sm text-deep-forest/70">
                  Pick your amount and frequency. We'll spin up a hosted
                  subscription checkout that mirrors it until bank mandates
                  resume.
                </p>
              </div>

              <div
                className="grid gap-4 md:grid-cols-2 auto-rows-fr"
                aria-label="Mandate tiers"
              >
                {tierOptions.map(
                  ({
                    id,
                    label,
                    amountLabel,
                    copy,
                    icon: Icon,
                    accent,
                    amountValue,
                  }) => {
                    const isActive = pledgeForm.values.amount === amountValue;

                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => {
                          pledgeForm.setFieldValue("amount", amountValue);
                        }}
                        className={clsx(
                          "group relative flex h-full flex-col justify-between rounded-3xl border-2 p-6 text-left transition-all group",
                          {
                            "border-deep-forest bg-deep-forest text-white shadow-xl":
                              isActive,
                            "border-sage-green/40 bg-white/90 text-deep-forest hover:border-deep-forest":
                              !isActive,
                          }
                        )}
                      >
                        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em]">
                          <span className="group-hover:scale-103 duration-300 transition-transform origin-left">
                            {label}
                          </span>
                          <span
                            className={clsx({
                              [tierIconWrapperClasses.active]: isActive,
                              [tierIconWrapperClasses.inactive]: !isActive,
                            })}
                          >
                            <Icon
                              className={clsx("h-5 w-5", {
                                "text-white": isActive,
                                [accent]: !isActive,
                              })}
                            />
                          </span>
                        </div>
                        <div className="space-y-2 pt-6 group-hover:-translate-y-1 transition-transform duration-300">
                          <p
                            className={clsx("text-3xl font-bold", {
                              "text-white": isActive,
                              "text-deep-forest": !isActive,
                            })}
                          >
                            {amountLabel}
                            <span
                              className={clsx("ml-2 text-base font-semibold", {
                                "text-white/80": isActive,
                                "text-deep-forest/70": !isActive,
                              })}
                            >
                              {pledgeForm.values.frequency}
                            </span>
                          </p>

                          <p
                            className={clsx("text-sm", {
                              "text-white/80": isActive,
                              "text-deep-forest/70": !isActive,
                            })}
                          >
                            {copy}
                          </p>
                        </div>
                        {isActive && (
                          <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-vibrant-lime">
                            Active
                          </span>
                        )}
                      </button>
                    );
                  }
                )}

                <div className="flex flex-col rounded-3xl border-2 border-dashed border-deep-forest/50 bg-deep-forest/5 p-6 justify-evenly space-y-6">
                  <section className="grid gap-2">
                    <div className="space-y-0.5">
                      <h3 className="text-lg font-semibold text-deep-forest">
                        Custom Amount
                      </h3>

                      <p className="text-sm text-deep-forest/70">
                        How much would you like to pledge each cycle?
                      </p>
                    </div>

                    <NumberInput
                      aria-label="Custom mandate amount"
                      placeholder="Enter amount"
                      min={minimumPaymentAmount}
                      step={1_000}
                      thousandSeparator=","
                      allowNegative={false}
                      hideControls
                      classNames={inputClassNames}
                      leftSection="₦"
                      leftSectionProps={{ className: "text-deep-forest" }}
                      {...pledgeForm.getInputProps("amount")}
                      size="lg"
                      labelProps={{
                        lh: 2,
                        fz: "sm",
                      }}
                    />
                  </section>

                  <section className="grid gap-2">
                    <div className="space-y-0.5">
                      <h3 className="text-lg font-semibold text-deep-forest">
                        Payment frequency
                      </h3>

                      <p className="text-sm text-deep-forest/70">
                        How often would you like to contribute?
                      </p>
                    </div>

                    <Select
                      searchable
                      placeholder="Choose frequency"
                      nothingFoundMessage="No options found"
                      data={paymentFrequencyOptions}
                      classNames={{
                        ...inputClassNames,
                        dropdown:
                          "bg-white/95 border-2 border-sage-green/60 rounded-lg",
                      }}
                      withAlignedLabels
                      withAsterisk
                      {...pledgeForm.getInputProps("frequency")}
                      size="lg"
                      labelProps={{
                        lh: 2,
                        fz: "sm",
                      }}
                    />
                  </section>
                </div>
              </div>

              <Button
                type="submit"
                size="xl"
                fullWidth
                loading={planCheckout.isPending}
                disabled={planCheckout.isPending}
                className="h-14 rounded-2xl bg-vibrant-lime text-base font-semibold text-deep-forest transition hover:bg-vibrant-lime/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {planCheckout.isPending
                  ? "Preparing checkout..."
                  : "Start secure subscription"}
              </Button>
            </form>
          </Tabs.Panel>

          <Tabs.Panel value="status">{renderSubscriptionSummary()}</Tabs.Panel>
        </Tabs>
      </section>

      <section className="rounded-4xl border border-sage-green/40 bg-white/95 p-6 shadow-[0_24px_60px_rgba(0,35,19,0.08)] sm:p-10 grid gap-y-10 gap-x-4 lg:grid-cols-[2fr_1fr]">
        <aside className="rounded-3xl border border-sage-green/40 bg-mist-green/30 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-deep-forest/60">
            Stewardship
          </p>
          <h3 className="pt-2 text-xl font-semibold text-deep-forest">
            How we guard every debit
          </h3>
          <div className="mt-6 space-y-4">
            {safeguards.map(({ title, copy, icon: Icon }) => (
              <div
                key={title}
                className="flex gap-4 rounded-2xl border border-sage-green/60 bg-white/80 p-4"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-deep-forest/10 text-deep-forest shrink-0">
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-deep-forest">
                    {title}
                  </p>
                  <p className="text-sm text-deep-forest/70">{copy}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-deep-forest/60">
            Need clarity before locking a pledge? Email stewardship@laumga.org
            and a mandate lead will reach out within one business day.
          </p>
        </aside>

        <div className="grid gap-6 rounded-3xl border border-sage-green/40 bg-mist-green/20 p-6 sm:grid-cols-2 lg:grid-cols-1 content-between">
          {benefits.map(({ title, copy, icon: Icon }) => (
            <div key={title} className="flex gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-deep-forest shadow shrink-0">
                <Icon size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-deep-forest">
                  {title}
                </p>
                <p className="text-sm text-deep-forest/70">{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-4xl bg-deep-forest px-6 py-12 text-center text-white shadow-[0_30px_80px_rgba(0,0,0,0.4)] sm:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/60">
          legacy
        </p>
        <h2 className="mt-3 text-3xl font-semibold">
          Leave a digital sadaqah legacy that keeps students, families, and
          ventures afloat.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-white/80">
          Your pledge is flexible, transparent, and fully cancelable. What
          remains consistent is the lifeline it provides to the Ummah.
        </p>
      </section>
    </Section>
  );
}
