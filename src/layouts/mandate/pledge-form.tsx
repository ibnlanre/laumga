import { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import {
  Alert,
  Button,
  Group,
  Loader,
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

import {
  createMandateSchema,
  mandateFrequencySchema,
} from "@/api/mandate/schema";
import type { CreateMandate } from "@/api/mandate/types";
import { useAuth } from "@/contexts/use-auth";
import { useCreateMandate } from "@/api/mandate/hooks";
import {
  useFetchFlutterwaveBanks,
  useTokenizeFlutterwaveAccount,
} from "@/api/flutterwave/hooks";
import type { FlutterwaveMandateConsent } from "@/api/flutterwave/types";
import { useGetUserMandate } from "@/api/mandate/handlers";
import { Section } from "@/components/section";
import { formatCurrency } from "@/utils/currency";
import { addYears } from "date-fns";
import clsx from "clsx";
import { formatDateString } from "@/utils/date";

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
    title: "Flutterwave consent",
    copy: "Mandates run through Flutterwave's bank-grade tokenization before activation.",
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

const MIN_CUSTOM_MANDATE_AMOUNT = 1_000;
const MANDATE_FREQUENCIES = mandateFrequencySchema.options;

interface MandatePledgeFormProps {
  tier?: "supporter" | "builder" | "guardian" | "custom";
  amount?: number;
}

export function MandatePledgeForm({
  tier,
  amount = 1000,
}: MandatePledgeFormProps) {
  const { user } = useAuth();

  const navigate = useNavigate();
  const tokenizeAccount = useTokenizeFlutterwaveAccount();
  const createMandate = useCreateMandate();
  const flutterwaveBanks = useFetchFlutterwaveBanks();

  const [mandateSummary, setMandateSummary] = useState<{
    reference: string;
    status: string;
    consent: FlutterwaveMandateConsent | null;
  } | null>(null);

  const { data: existingMandate, refetch: refetchMandate } = useGetUserMandate(
    user?.id
  );

  const pledgeForm = useForm<CreateMandate>({
    initialValues: {
      amount: 0,
      frequency: "monthly",
      startDate: new Date().toJSON(),
      endDate: null,
      bankCode: "",
      accountNumber: "",
    },
    validate: zod4Resolver(createMandateSchema),
  });

  useEffect(() => {
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
        pledgeForm.setFieldValue("amount", amount);
    }
  }, [amount, tier]);

  useEffect(() => {
    if (!pledgeForm.values.startDate) return;

    const oneYearForward = addYears(new Date(pledgeForm.values.startDate), 1);
    const yearEnd = formatDateString(oneYearForward);

    pledgeForm.setFieldValue("endDate", yearEnd);
  }, [pledgeForm.values.startDate]);

  const handleSubmit = async (data: CreateMandate) => {
    if (!user) return;

    if (!user.address || !user.phoneNumber) {
      return;
    }

    // Step 1: Call Flutterwave to tokenize the account
    const tokenResponse = await tokenizeAccount.mutateAsync({
      data: {
        email: user.email,
        amount: data.amount,
        address: user.address,
        phone_number: user.phoneNumber,
        account_bank: data.bankCode,
        account_number: data.accountNumber,
        start_date: data.startDate,
        end_date: data.endDate!,
        narration: `LAUMGA Foundation ${data.frequency} contribution`,
      },
    });

    // Step 2: Create mandate in Firebase with the tokenResponse
    const result = await createMandate.mutateAsync({
      user,
      data,
      tokenResponse,
    });

    setMandateSummary({
      reference: result.reference,
      status: result.status,
      consent: result.mandate_consent,
    });

    refetchMandate();
  };

  const profileReady = Boolean(user?.address && user?.phoneNumber);
  const hasExistingMandate = Boolean(existingMandate);

  if (mandateSummary) {
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
              Your Flutterwave mandate is submitted. We will email you once the
              bank confirms consent. Keep the reference below for your records.
            </Text>
            <div className="rounded-2xl bg-white/80 px-4 py-3 text-sm text-deep-forest">
              <p className="font-semibold">
                Reference: {mandateSummary.reference}
              </p>
              <p className="text-xs uppercase tracking-[0.3em] text-deep-forest/60">
                Status: {mandateSummary.status}
              </p>
              {mandateSummary.consent && (
                <div className="mt-2 text-xs text-deep-forest/70">
                  <p>
                    Account: {mandateSummary.consent.account_name} ·{" "}
                    {mandateSummary.consent.account_number}
                  </p>
                  <p>Bank: {mandateSummary.consent.bank_name}</p>
                </div>
              )}
            </div>

            <Group>
              <Button onClick={() => navigate({ to: "/mandate/dashboard" })}>
                View Dashboard
              </Button>
              <Button variant="subtle" onClick={() => setMandateSummary(null)}>
                Create another pledge
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
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr"
            aria-label="Mandate tiers"
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
                      <span>{label}</span>
                      <span
                        className={
                          isActive
                            ? tierIconWrapperClasses.active
                            : tierIconWrapperClasses.inactive
                        }
                      >
                        <Icon
                          className={clsx("h-5 w-5", {
                            "text-white": isActive,
                            [accent]: !isActive,
                          })}
                        />
                      </span>
                    </div>
                    <div className="space-y-2 pt-6">
                      <p
                        className={clsx("text-3xl font-bold", {
                          "text-white": isActive,
                          "text-deep-forest": !isActive,
                        })}
                      >
                        {amountLabel}
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
          </div>
        </div>
      </section>

      <section className="rounded-4xl border border-sage-green/40 bg-white/95 p-6 shadow-[0_24px_60px_rgba(0,35,19,0.08)] sm:p-10">
        <div className="space-y-6">
          {hasExistingMandate && (
            <div className="rounded-3xl border border-vibrant-lime/40 bg-gradient-to-r from-mist-green/80 via-white to-mist-green/60 p-5 shadow-[0_25px_60px_rgba(0,35,19,0.08)]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3 text-institutional-green">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-institutional-green/10">
                    <AlertCircle className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-institutional-green/70">
                      Mandate already active
                    </p>
                    <p className="text-base font-semibold text-deep-forest">
                      Reference {existingMandate?.flutterwaveReference}
                    </p>
                  </div>
                </div>
                <div className="flex-1 text-sm text-deep-forest/80">
                  You currently have a {existingMandate?.status} mandate. Manage
                  pauses, reinstatements, or upgrades inside your dashboard.
                </div>
                <Button
                  size="md"
                  radius="xl"
                  variant="light"
                  className="bg-vibrant-lime/20 text-institutional-green hover:bg-vibrant-lime/40"
                  onClick={() => navigate({ to: "/mandate/dashboard" })}
                >
                  Go to dashboard
                </Button>
              </div>
            </div>
          )}

          {!profileReady && (
            <Alert
              icon={<AlertCircle />}
              color="yellow"
              radius="lg"
              variant="light"
              title="Finish your profile first"
            >
              <Text size="sm">
                Add your phone number and address on your account so Flutterwave
                can verify the mandate request.
              </Text>
            </Alert>
          )}

          <form
            onSubmit={pledgeForm.onSubmit(handleSubmit)}
            className="space-y-8"
          >
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-deep-forest/60">
                Mandate setup
              </p>
              <h2 className="text-3xl font-semibold text-deep-forest">
                Complete your mandate
              </h2>
              <p className="text-sm text-deep-forest/70">
                Choose how often Flutterwave should debit, how long the cadence
                should run, and the verified account we can draw from.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex flex-col rounded-3xl border-2 border-dashed border-deep-forest/50 bg-deep-forest/5 p-6 justify-evenly space-y-6">
                <section>
                  <div className="space-y-0.5">
                    <h3 className="text-lg font-semibold text-deep-forest">
                      Amount
                    </h3>

                    <p className="text-sm text-deep-forest/70">
                      How much would you like to pledge each cycle?
                    </p>
                  </div>

                  <NumberInput
                    aria-label="Custom mandate amount"
                    placeholder="Enter amount"
                    min={MIN_CUSTOM_MANDATE_AMOUNT}
                    step={1_000}
                    thousandSeparator=","
                    allowNegative={false}
                    hideControls
                    classNames={{
                      ...inputClassNames,
                      input: clsx(inputClassNames.input, "mt-4"),
                    }}
                    leftSection="₦"
                    leftSectionProps={{ className: "text-deep-forest" }}
                    {...pledgeForm.getInputProps("amount")}
                  />

                  <p className="text-xs mt-3 font-semibold uppercase tracking-wider text-deep-forest/70">
                    Minimum Amount: {formatCurrency(MIN_CUSTOM_MANDATE_AMOUNT)}
                  </p>
                </section>

                <section className="space-y-4">
                  <div className="space-y-0.5">
                    <h3 className="text-lg font-semibold text-deep-forest">
                      Payment frequency
                    </h3>

                    <p className="text-sm text-deep-forest/70">
                      How often would you like to contribute?
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {MANDATE_FREQUENCIES.map((frequency) => (
                      <button
                        key={frequency}
                        type="button"
                        onClick={() => {
                          pledgeForm.setFieldValue("frequency", frequency);
                        }}
                        className={clsx(
                          "rounded-2xl border-2 px-4 py-4 text-base font-semibold capitalize",
                          {
                            "border-deep-forest bg-deep-forest text-white":
                              pledgeForm.values.frequency === frequency,
                            "border-sage-green/50 bg-white text-deep-forest hover:border-deep-forest":
                              pledgeForm.values.frequency !== frequency,
                            "cursor-not-allowed opacity-60": hasExistingMandate,
                          }
                        )}
                        disabled={hasExistingMandate}
                      >
                        {frequency.replace("-", " ")}
                      </button>
                    ))}
                  </div>
                </section>
              </div>

              <section className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-deep-forest">
                    Kickoff debit preferences
                  </h3>

                  <DateInput
                    label="Start date"
                    placeholder="Pick a start date"
                    minDate={new Date()}
                    withAsterisk
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
                    withAsterisk
                    {...pledgeForm.getInputProps("endDate")}
                    classNames={{
                      label: inputClassNames.label,
                      input: inputClassNames.input,
                    }}
                    size="lg"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-deep-forest">
                    Bank account details
                  </h3>

                  <Select
                    label="Bank"
                    data={flutterwaveBanks.data || []}
                    clearable
                    searchable
                    placeholder="Select your bank"
                    disabled={
                      flutterwaveBanks.isPending ||
                      !profileReady ||
                      hasExistingMandate
                    }
                    nothingFoundMessage="No supported banks yet"
                    comboboxProps={{
                      transitionProps: { transition: "fade", duration: 100 },
                    }}
                    withAsterisk
                    leftSection={
                      flutterwaveBanks.isPending ? <Loader size="xs" /> : null
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
                    disabled={!profileReady || hasExistingMandate}
                    {...pledgeForm.getInputProps("accountNumber")}
                    classNames={inputClassNames}
                    size="lg"
                  />
                </div>
              </section>
            </div>

            <Button
              type="submit"
              size="xl"
              fullWidth
              loading={tokenizeAccount.isPending || createMandate.isPending}
              disabled={!profileReady || hasExistingMandate}
              className="h-14 rounded-2xl bg-vibrant-lime text-base font-semibold text-deep-forest transition hover:bg-vibrant-lime/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {createMandate.isPending
                ? "Creating mandate..."
                : "Start your mandate"}
            </Button>
          </form>
        </div>
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
