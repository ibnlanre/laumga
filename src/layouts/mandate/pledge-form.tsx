import { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import {
  Alert,
  Button,
  Group,
  Loader,
  Tabs,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  Edit,
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

import { createMandateSchema } from "@/api/mandate/schema";
import type { CreateMandate, MandateFrequency } from "@/api/mandate/types";
import { useAuth } from "@/contexts/use-auth";
import { useCreateMandate } from "@/api/mandate/hooks";
import { useFetchMonoBanks } from "@/api/mono/hooks";
import { useCreateMonoCustomer } from "@/api/mono-customer/hooks";
import { PhoneInput } from "@/components/phone-input";
import { Textarea } from "@mantine/core";
import { monoCustomerFormSchema } from "@/api/mono-customer/schema";
import type { MonoCustomerForm } from "@/api/mono-customer/types";
import { useGetUserMandate } from "@/api/mandate/handlers";
import { Section } from "@/components/section";

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
    title: "Mono authorization",
    copy: "Every pledge is verified via secure Mono flow before activation.",
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
  description: "text-deep-forest/60",
  input:
    "h-14 rounded-2xl border-2 border-sage-green/60 bg-white text-base text-deep-forest placeholder:text-deep-forest/40 focus:border-deep-forest focus:ring-0",
};

const tierIconWrapperClasses = {
  active:
    "flex h-10 w-10 items-center justify-center rounded-2xl border border-white/40 bg-white/10 text-white",
  inactive:
    "flex h-10 w-10 items-center justify-center rounded-2xl border border-deep-forest/20 bg-mist-green/60 text-deep-forest",
};

interface MandatePledgeFormProps {
  tier?: "supporter" | "builder" | "guardian" | "custom";
  amount?: number;
}

export function MandatePledgeForm({
  tier,
  amount,
}: MandatePledgeFormProps = {}) {
  const { user } = useAuth();

  const navigate = useNavigate();
  const createMandate = useCreateMandate();
  const monoBanks = useFetchMonoBanks();
  const createCustomer = useCreateMonoCustomer();

  const [monoUrl, setMonoUrl] = useState<string | null>(null);
  const userMandate = useGetUserMandate(user?.id);

  const customerForm = useForm<MonoCustomerForm>({
    initialValues: {
      type: "individual",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      address: "",
      bvn: "",
    },
    validate: zod4Resolver(monoCustomerFormSchema),
  });

  useEffect(() => {
    if (!user) return;

    customerForm.setValues({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address,
    });
  }, [user?.id]);

  const handleContinue = async (data: MonoCustomerForm) => {
    if (!user) return;

    createCustomer.mutate({
      user,
      data,
    });
  };

  const pledgeForm = useForm<CreateMandate>({
    initialValues: {
      amount: 0,
      frequency: "monthly",
      startDate: new Date(),
      endDate: null,
    },
    validate: zod4Resolver(createMandateSchema),
    transformValues: (values) => ({
      ...values,
      amount: Math.round(values.amount * 100),
    }),
  });

  useEffect(() => {
    if (amount) pledgeForm.setFieldValue("amount", amount);

    switch (tier) {
      case "supporter":
        pledgeForm.setFieldValue("amount", TIER_AMOUNTS.supporter);
        break;
      case "builder":
        pledgeForm.setFieldValue("amount", TIER_AMOUNTS.builder);
        break;
      case "guardian":
        pledgeForm.setFieldValue("amount", TIER_AMOUNTS.guardian);
        break;
      default:
        pledgeForm.setFieldValue("amount", TIER_AMOUNTS.supporter);
    }
  }, [amount, tier]);

  useEffect(() => {
    if (userMandate.isPending || monoUrl) return;
    const { data } = userMandate;

    if (data) setMonoUrl(data.monoUrl);
  }, [userMandate.isLoading]);

  const handleSubmit = async (data: CreateMandate) => {
    if (!user) return;

    const { mono_url } = await createMandate.mutateAsync({
      user,
      data,
    });

    if (mono_url) setMonoUrl(mono_url);
  };

  const canConfigureMandate = Boolean(user?.monoCustomerId);
  const mandateCreated = Boolean(monoUrl);

  const steps = [
    {
      id: "customer" as const,
      title: "Verify your identity",
      copy: "Create a Mono customer profile so we can authorize debits.",
      complete: canConfigureMandate,
    },
    {
      id: "mandate" as const,
      title: "Configure your mandate",
      copy: "Choose cadence, opening debit, and the bank account we draw from.",
      complete: mandateCreated,
    },
  ];

  if (monoUrl) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-6 rounded-3xl border border-sage-green/50 bg-white/95 p-8 shadow-2xl">
        <Alert
          icon={<AlertCircle />}
          radius="lg"
          title="Authorization required"
          color="green"
          variant="light"
        >
          <Stack gap="md">
            <Text size="sm">
              Your mandate shell is ready. Authorize it with Mono to begin the
              debit rhythm, or jump straight to your dashboard to review the
              setup.
            </Text>
            <Group>
              <Button
                component="a"
                href={monoUrl}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
              >
                Authorize Mandate
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate({ to: "/mandate/dashboard" })}
              >
                View Dashboard
              </Button>
            </Group>
          </Stack>
        </Alert>
      </div>
    );
  }

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
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
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
                    onClick={() =>
                      pledgeForm.setFieldValue("amount", amountValue)
                    }
                    className={`group relative flex h-full flex-col justify-between rounded-3xl border-2 p-6 text-left transition-all ${
                      isActive
                        ? "border-deep-forest bg-deep-forest text-white shadow-xl"
                        : "border-sage-green/40 bg-white/90 text-deep-forest hover:border-deep-forest"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em]">
                      <span>{label}</span>
                      <span
                        className={
                          isActive
                            ? tierIconWrapperClasses.active
                            : tierIconWrapperClasses.inactive
                        }
                      >
                        <Icon
                          className={`h-5 w-5 ${isActive ? "text-white" : accent}`}
                        />
                      </span>
                    </div>
                    <div className="space-y-2 pt-6">
                      <p
                        className={`text-3xl font-bold ${isActive ? "text-white" : "text-deep-forest"}`}
                      >
                        {amountLabel}
                      </p>
                      <p
                        className={`text-sm ${isActive ? "text-white/80" : "text-deep-forest/70"}`}
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

            <div className="flex flex-col rounded-3xl border-2 border-dashed border-deep-forest/50 bg-deep-forest/5 p-6">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-deep-forest">
                <span>Custom pledge</span>
                <Edit size={16} />
              </div>
              <p className="pt-6 text-sm text-deep-forest/70">
                Set the debit that mirrors your capacity. Amounts are captured
                in naira.
              </p>
              <NumberInput
                aria-label="Custom mandate amount"
                placeholder="enter amount"
                min={1_000}
                max={1_000_000}
                step={1_000}
                thousandSeparator=","
                clampBehavior="strict"
                allowNegative={false}
                hideControls
                classNames={{
                  input: `${inputClassNames.input} pl-6 mt-4 border-deep-forest/40 text-lg font-semibold`,
                }}
                leftSection="₦"
                leftSectionProps={{ className: "text-deep-forest" }}
                {...pledgeForm.getInputProps("amount")}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {impactPillars.map(({ title, copy, icon: Icon }) => (
              <div
                key={title}
                className="rounded-2xl border border-sage-green/50 bg-white/80 p-4"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage-green/25 text-deep-forest shrink-0">
                  <Icon size={20} />
                </div>
                <p className="pt-4 text-base font-semibold text-deep-forest">
                  {title}
                </p>
                <p className="text-sm text-deep-forest/70">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-sage-green/40 bg-white/90 p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid flex-1 gap-4 lg:grid-cols-2">
            {steps.map(({ id, title, copy, complete }) => (
              <div
                key={id}
                className={`rounded-2xl border p-4 ${
                  complete
                    ? "border-deep-forest bg-deep-forest text-white"
                    : "border-sage-green/40 bg-mist-green/15 text-deep-forest"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.3em]">
                  {complete ? "Complete" : "Pending"}
                </p>
                <h3
                  className={`pt-3 text-lg font-semibold ${complete ? "text-white" : "text-deep-forest"}`}
                >
                  {title}
                </h3>
                <p
                  className={`text-sm ${complete ? "text-white/80" : "text-deep-forest/70"}`}
                >
                  {copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Tabs
        value={canConfigureMandate ? "mandate" : "customer"}
        keepMounted={false}
        className="space-y-0"
      >
        <Tabs.Panel value="customer">
          <section className="rounded-4xl border border-sage-green/40 bg-white/95 p-6 shadow-[0_24px_60px_rgba(0,35,19,0.08)] sm:p-10 space-y-10">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-deep-forest/60">
                Step 1
              </p>
              <h2 className="text-3xl font-semibold text-deep-forest">
                Verify your identity with Mono
              </h2>
              <p className="text-sm text-deep-forest/70">
                Mono requires a BVN-backed customer profile before any debit can
                be authorized. Share your identity details once and they will be
                reused for every future mandate.
              </p>
            </div>

            <form
              onSubmit={customerForm.onSubmit(handleContinue)}
              className="space-y-6 mt-10"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <TextInput
                  label="First name"
                  placeholder="Aisha"
                  withAsterisk
                  {...customerForm.getInputProps("firstName")}
                  labelProps={{ lh: 2, fz: "sm" }}
                  classNames={{
                    label: inputClassNames.label,
                    input: inputClassNames.input,
                  }}
                  size="lg"
                />

                <TextInput
                  label="Last name"
                  placeholder="Yusuf"
                  withAsterisk
                  {...customerForm.getInputProps("lastName")}
                  labelProps={{ lh: 2, fz: "sm" }}
                  classNames={{
                    label: inputClassNames.label,
                    input: inputClassNames.input,
                  }}
                  size="lg"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <TextInput
                  label="Email"
                  placeholder="you@example.com"
                  type="email"
                  withAsterisk
                  {...customerForm.getInputProps("email")}
                  labelProps={{ lh: 2, fz: "sm" }}
                  classNames={{
                    label: inputClassNames.label,
                    input: inputClassNames.input,
                  }}
                  size="lg"
                />

                <PhoneInput
                  label="Phone number"
                  placeholder="0801 234 5678"
                  withAsterisk
                  {...customerForm.getInputProps("phoneNumber")}
                  labelProps={{ lh: 2, fz: "sm" }}
                  classNames={{
                    label: inputClassNames.label,
                    input: inputClassNames.input,
                  }}
                  size="lg"
                />
              </div>

              <Textarea
                label="Residential address"
                placeholder="25 Unity Close, Ikeja"
                withAsterisk
                autosize
                minRows={3}
                {...customerForm.getInputProps("address")}
                labelProps={{ lh: 2, fz: "sm" }}
                classNames={{
                  label: inputClassNames.label,
                  input: inputClassNames.input,
                }}
                size="lg"
              />

              <TextInput
                label="BVN (Bank Verification Number)"
                placeholder="12345678901"
                maxLength={11}
                description="We use this to verify your identity securely."
                withAsterisk
                inputMode="numeric"
                {...customerForm.getInputProps("bvn")}
                labelProps={{ lh: 2, fz: "sm" }}
                classNames={{
                  label: inputClassNames.label,
                  input: inputClassNames.input,
                }}
                size="lg"
              />

              <Button
                type="submit"
                size="xl"
                fullWidth
                loading={createCustomer.isPending}
                disabled={createCustomer.isPending}
                className="h-14 rounded-2xl bg-vibrant-lime text-base font-semibold text-deep-forest transition hover:bg-vibrant-lime/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {createCustomer.isPending ? "Verifying..." : "Continue"}
              </Button>

              <section className="space-y-4 rounded-3xl border border-sage-green/40 bg-mist-green/30 p-6 mx-auto w-full">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-institutional-green shrink-0" />
                  <div>
                    <p className="font-semibold text-deep-forest">
                      Your data is secure
                    </p>
                    <p className="text-sm text-deep-forest/70">
                      We only store your details as needed to process your
                      contribution.
                    </p>
                  </div>
                </div>
              </section>
            </form>
          </section>
        </Tabs.Panel>

        <Tabs.Panel value="mandate">
          <section className="rounded-4xl border border-sage-green/40 bg-white/95 p-6 shadow-[0_24px_60px_rgba(0,35,19,0.08)] sm:p-10">
            <form
              onSubmit={pledgeForm.onSubmit(handleSubmit)}
              className="space-y-8"
            >
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-deep-forest/60">
                  Step 2
                </p>
                <h2 className="text-3xl font-semibold text-deep-forest">
                  Complete your mandate
                </h2>
                <p className="text-sm text-deep-forest/70">
                  Choose how often Mono should debit, how long the cadence
                  should run, and the verified account we can draw from.
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-semibold text-deep-forest">
                  Payment frequency
                </p>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {["monthly", "quarterly", "annually", "one-time"].map(
                    (frequency) => (
                      <button
                        key={frequency}
                        type="button"
                        onClick={() =>
                          pledgeForm.setFieldValue(
                            "frequency",
                            frequency as MandateFrequency
                          )
                        }
                        className={`rounded-2xl border-2 px-4 py-4 text-base font-semibold capitalize ${
                          pledgeForm.values.frequency === frequency
                            ? "border-deep-forest bg-deep-forest text-white"
                            : "border-sage-green/50 bg-white text-deep-forest hover:border-deep-forest"
                        }`}
                      >
                        {frequency.replace("-", " ")}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="space-y-4 border-t border-sage-green/40 pt-6">
                <h3 className="text-lg font-semibold text-deep-forest">
                  Kickoff debit preferences
                </h3>

                <NumberInput
                  label="Initial debit amount"
                  placeholder="₦50,000"
                  description="Optional opening debit if you want to start with a different amount."
                  min={1_000}
                  max={1_000_000}
                  thousandSeparator=","
                  clampBehavior="strict"
                  hideControls
                  leftSection="₦ "
                  leftSectionProps={{ className: "text-deep-forest" }}
                  {...pledgeForm.getInputProps("initialDebitAmount")}
                  classNames={{
                    label: inputClassNames.label,
                    description: inputClassNames.description,
                    input: `${inputClassNames.input} pl-6`,
                  }}
                  size="lg"
                />

                <DateInput
                  label="Start date"
                  placeholder="Pick a start date"
                  minDate={new Date()}
                  {...pledgeForm.getInputProps("startDate")}
                  classNames={{
                    label: inputClassNames.label,
                    input: inputClassNames.input,
                  }}
                  size="lg"
                />

                <DateInput
                  label="End date"
                  placeholder="Pick an end date"
                  minDate={pledgeForm.values.startDate}
                  {...pledgeForm.getInputProps("endDate")}
                  classNames={{
                    label: inputClassNames.label,
                    input: inputClassNames.input,
                  }}
                  size="lg"
                />
              </div>

              <div className="space-y-4 border-t border-sage-green/40 pt-6">
                <h3 className="text-lg font-semibold text-deep-forest">
                  Bank account details
                </h3>

                <Select
                  label="Bank"
                  data={monoBanks.data || []}
                  clearable
                  searchable
                  placeholder="Select your bank"
                  disabled={monoBanks.isPending}
                  nothingFoundMessage="No direct-debit banks yet"
                  comboboxProps={{
                    transitionProps: { transition: "fade", duration: 100 },
                  }}
                  withAsterisk
                  leftSection={
                    monoBanks.isPending ? <Loader size="xs" /> : null
                  }
                  {...pledgeForm.getInputProps("bankCode")}
                  classNames={inputClassNames}
                  size="lg"
                />

                <TextInput
                  label="Account number"
                  placeholder="0123456789"
                  maxLength={10}
                  withAsterisk
                  inputMode="numeric"
                  {...pledgeForm.getInputProps("accountNumber")}
                  classNames={inputClassNames}
                  size="lg"
                />
              </div>

              <div className="space-y-3">
                <Button
                  type="submit"
                  size="xl"
                  fullWidth
                  loading={createMandate.isPending}
                  disabled={!canConfigureMandate}
                  className="h-14 rounded-2xl bg-vibrant-lime text-base font-semibold text-deep-forest transition hover:bg-vibrant-lime/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {createMandate.isPending
                    ? "Creating mandate..."
                    : "Start your mandate"}
                </Button>
              </div>
            </form>
          </section>
        </Tabs.Panel>
      </Tabs>

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
