import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { Button, NumberInput, Select, TextInput, Stack } from "@mantine/core";
import {
  Heart,
  GraduationCap,
  HardHat,
  Shield,
  Star,
  TrendingUp,
} from "lucide-react";
import { z } from "zod";
import clsx from "clsx";
import { capitalize } from "inflection";

import { useCreateFlutterwavePlanCheckout } from "@/api/flutterwave/hooks";
import { Section } from "@/components/section";
import { formatCurrency } from "@/utils/currency";
import { PhoneInput } from "@/components/phone-input";
import { queryClient } from "@/routing/query-client";
import { flutterwave } from "@/api/flutterwave";
import type {
  FlutterwavePaymentPlan,
  FlutterwavePaymentPlanListResponse,
} from "@/api/flutterwave/types";
import type { GetNextPageParamFunction } from "@tanstack/react-query";

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

const paymentFrequencyOptions = [
  { value: "hourly", label: "Hourly" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "bi-annually", label: "Bi-annually" },
  { value: "yearly", label: "Yearly" },
];

const frequencySchema = z.enum([
  "hourly",
  "daily",
  "weekly",
  "monthly",
  "quarterly",
  "bi-annually",
  "yearly",
]);

const publicPledgeSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  phoneNumber: z.string().min(10, "Valid phone number is required"),
  email: z.email("Valid email is required"),
  amount: z.number().min(1000, "Minimum amount is ₦1,000"),
  frequency: frequencySchema,
  paymentPlanId: z.number().nullable().default(null),
});

type PublicPledgeFormValues = z.infer<typeof publicPledgeSchema>;

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

const minimumPaymentAmount = 1_000;

const getNextPageParam: GetNextPageParamFunction<
  number,
  FlutterwavePaymentPlanListResponse
> = (lastPage, allPages) => {
  const { total_pages = 1, current_page = allPages.length } = {
    ...lastPage.meta?.page_info,
  };

  if (current_page < total_pages) return allPages.length + 1;
};

const tierIconWrapperClasses = {
  active:
    "flex h-10 w-10 items-center justify-center rounded-2xl border border-white/40 bg-white/10 text-white",
  inactive:
    "flex h-10 w-10 items-center justify-center rounded-2xl border border-deep-forest/20 bg-mist-green/60 text-deep-forest",
};

const inputClassNames = {
  label: "text-sm font-semibold text-deep-forest",
  description: "text-deep-forest/60 text-sm tracking-wide",
  input:
    "h-14 rounded-2xl border-2 border-sage-green/60 bg-white text-base text-deep-forest placeholder:text-deep-forest/40 focus:border-deep-forest focus:ring-0",
};

export const Route = createFileRoute("/_public/pledge")({
  loader: async () => {
    const planResponse = await queryClient.ensureInfiniteQueryData({
      queryKey: flutterwave.paymentPlan.list.$get({ status: "active" }),
      initialPageParam: 1,
      queryFn: () =>
        flutterwave.$use.paymentPlan.list({
          data: { status: "active" },
        }),
      getNextPageParam,
    });

    const paymentPlans = planResponse.pages.flatMap(({ data }) => data);
    return { paymentPlans };
  },
  head: () => ({
    meta: [
      {
        title: "Make a Pledge - LAUMGA",
      },
      {
        name: "description",
        content:
          "Support LAUMGA's mission through monthly donations. Choose from Supporter, Builder, Guardian, or Champion tiers to fund welfare, scholarships, and community projects.",
      },
      {
        name: "keywords",
        content:
          "LAUMGA donation, alumni contribution, monthly pledge, support Muslim community, LAUTECH alumni donation",
      },
      {
        property: "og:title",
        content: "Make a Pledge - LAUMGA",
      },
      {
        property: "og:description",
        content:
          "Support LAUMGA's mission through monthly donations. Fund welfare, scholarships, and community projects.",
      },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { paymentPlans } = Route.useLoaderData();

  const planCheckout = useCreateFlutterwavePlanCheckout();

  const paymentPlansByFrequency = useMemo(() => {
    return paymentPlans.reduce<Record<string, FlutterwavePaymentPlan>>(
      (acc, plan) => {
        acc[plan.interval] = plan;
        return acc;
      },
      initialPaymentPlans
    );
  }, [paymentPlans]);

  const pledgeForm = useForm<PublicPledgeFormValues>({
    initialValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      amount: 5000,
      frequency: "monthly",
      paymentPlanId: paymentPlansByFrequency["monthly"].id,
    },
    validate: zod4Resolver(publicPledgeSchema),
  });

  const handleSubmit = async ({
    fullName,
    phoneNumber,
    email,
    amount,
    frequency,
    paymentPlanId,
  }: PublicPledgeFormValues) => {
    const cleanPhone = phoneNumber.replace(/\D/g, "");
    const txRef = `LAUMGA_PUBLIC_${cleanPhone}_${Date.now()}`;

    const response = await planCheckout.mutateAsync({
      data: {
        txRef,
        amount,
        currency: "NGN",
        paymentPlanId,
        paymentOptions: "card",
        customer: {
          email,
          name: fullName,
          phoneNumber,
        },
        meta: {
          cadence: frequency,
          amount,
          paymentPlanId,
          source: "public_pledge",
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

      <Section className="relative flex flex-col gap-12">
        <section className="relative overflow-hidden rounded-4xl border border-white/60 bg-white/90 p-6 shadow-[0px_30px_80px_rgba(0,35,19,0.08)] sm:p-10">
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
                Make a recurring pledge
              </h1>
              <p className="text-base text-deep-forest/70 sm:max-w-3xl">
                Support verified welfare cases, tuition bridges, and empowerment
                projects with a steady monthly contribution. No account
                required.
              </p>
            </div>

            <div
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr"
              aria-label="Impact pillars"
            >
              {impactPillars.map(({ title, copy, icon: Icon }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-sage-green/50 bg-white/80 p-4 grid gap-2 grid-rows-[auto_1fr] items-center"
                >
                  <div className="flex gap-3 items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-deep-forest/10 text-deep-forest shrink-0">
                      <Icon size={20} />
                    </div>
                    <p className="text-sm font-semibold text-deep-forest">
                      {title}
                    </p>
                  </div>
                  <p className="text-sm text-deep-forest/70">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-4xl border border-white/60 bg-white/90 p-6 shadow-[0_40px_120px_rgba(0,35,19,0.08)] sm:p-10">
          <form
            onSubmit={pledgeForm.onSubmit(handleSubmit)}
            className="space-y-8"
          >
            <div className="space-y-1">
              <h2 className="text-3xl font-semibold text-deep-forest">
                Your information
              </h2>
              <p className="text-sm text-deep-forest/70">
                We'll use this to process your recurring pledge through
                Flutterwave.
              </p>
            </div>

            <Stack gap="md">
              <TextInput
                label="Full Name"
                placeholder="Enter your full name"
                classNames={inputClassNames}
                withAsterisk
                size="lg"
                {...pledgeForm.getInputProps("fullName")}
              />

              <PhoneInput
                label="Phone Number"
                placeholder="Enter your phone number"
                classNames={inputClassNames}
                withAsterisk
                size="lg"
                {...pledgeForm.getInputProps("phoneNumber")}
              />

              <TextInput
                label="Email Address"
                type="email"
                placeholder="your@email.com"
                classNames={inputClassNames}
                withAsterisk
                size="lg"
                {...pledgeForm.getInputProps("email")}
              />
            </Stack>

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
                Pick your amount and frequency. We'll create a secure
                subscription through Flutterwave.
              </p>
            </div>

            <div
              className="grid gap-4 md:grid-cols-2 auto-rows-fr"
              aria-label="Pledge tiers"
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
                        "group relative flex h-full flex-col justify-between rounded-3xl border-2 p-6 text-left transition-all",
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
                    aria-label="Custom pledge amount"
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
                    withAsterisk
                    {...pledgeForm.getInputProps("frequency")}
                    size="lg"
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
            Your pledge is flexible and transparent. To pause or cancel, contact
            our support team with your phone number.
          </p>
        </section>
      </Section>
    </div>
  );
}
