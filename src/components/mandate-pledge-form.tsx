import { useEffect, useMemo, useState } from "react";
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

import {
  createMandateSchema,
  type CreateMandateInput,
  type MandateDuration,
  type MandateFrequency,
} from "@/api/mandate";
import { mono, type SupportedBank } from "@/api/mono";
import { useAuth } from "@/contexts/auth";
import { useCreateMandate } from "@/services/hooks";

const TIER_AMOUNTS = {
  supporter: 500000,
  builder: 1000000,
  guardian: 2500000,
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
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const createMandate = useCreateMandate();
  const [monoUrl, setMonoUrl] = useState<string | null>(null);
  const [banks, setBanks] = useState<SupportedBank[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(true);
  const bankOptions = useMemo(
    () => banks.map((bank) => ({ label: bank.label, value: bank.bankCode })),
    [banks]
  );

  const getInitialAmount = () => {
    if (amount) return amount;
    if (tier && tier !== "custom" && tier in TIER_AMOUNTS) {
      return TIER_AMOUNTS[tier as keyof typeof TIER_AMOUNTS];
    }
    return TIER_AMOUNTS.supporter;
  };

  useEffect(() => {
    async function fetchBanks() {
      try {
        const supportedBanks = await mono.bank.fetchAll();
        setBanks(supportedBanks);
      } finally {
        setLoadingBanks(false);
      }
    }

    fetchBanks();
  }, []);

  const form = useForm<CreateMandateInput>({
    initialValues: {
      amount: getInitialAmount(),
      frequency: "monthly",
      duration: "12-months",
      accountNumber: "",
      bankCode: "",
      bvn: "",
    },
    validate: zod4Resolver(createMandateSchema),
  });

  const handleTierSelect = (tierId: keyof typeof TIER_AMOUNTS) => {
    form.setFieldValue("amount", TIER_AMOUNTS[tierId]);
  };

  const handleCustomAmountChange = (value: string | number | null) => {
    if (value === null || value === "") return;
    const parsedValue = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(parsedValue)) return;
    form.setFieldValue("amount", Math.round(parsedValue * 100));
  };

  const handleSubmit = async (data: CreateMandateInput) => {
    if (!currentUser) return;

    const result = await createMandate.mutateAsync({
      userId: currentUser.uid,
      data,
    });

    if (result.monoUrl) {
      setMonoUrl(result.monoUrl);
    }
  };

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
    <div className="space-y-12">
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
                const isActive = form.values.amount === amountValue;

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleTierSelect(id)}
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
                min={5_000}
                max={1_000_000}
                step={1_000}
                value={Math.round(form.values.amount / 100)}
                onChange={handleCustomAmountChange}
                thousandSeparator=","
                clampBehavior="strict"
                allowNegative={false}
                hideControls
                classNames={{
                  input: `${inputClassNames.input} pl-6 mt-4 border-deep-forest/40 text-lg font-semibold`,
                }}
                leftSection="₦"
                leftSectionProps={{ className: "text-deep-forest" }}
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
                  <Icon className="h-5 w-5" />
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

      <section className="rounded-4xl border border-sage-green/40 bg-white/95 p-6 shadow-[0_24px_60px_rgba(0,35,19,0.08)] sm:p-10">
        <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-8">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-deep-forest/60">
              Setup
            </p>
            <h2 className="text-3xl font-semibold text-deep-forest">
              Complete your mandate
            </h2>
            <p className="text-sm text-deep-forest/70">
              Choose how often Mono should debit, how long the cadence should
              run, and the verified account we can draw from.
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
                      form.setFieldValue(
                        "frequency",
                        frequency as MandateFrequency
                      )
                    }
                    className={`rounded-2xl border-2 px-4 py-4 text-base font-semibold capitalize ${
                      form.values.frequency === frequency
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

          <div className="space-y-4">
            <p className="text-sm font-semibold text-deep-forest">
              Mandate duration
            </p>
            <div className="grid grid-cols-3 gap-3">
              {["12-months", "24-months", "indefinite"].map((duration) => (
                <button
                  key={duration}
                  type="button"
                  onClick={() => {
                    form.setFieldValue("duration", duration as MandateDuration);
                  }}
                  className={`rounded-2xl border-2 px-4 py-4 text-base font-semibold capitalize ${
                    form.values.duration === duration
                      ? "border-deep-forest bg-deep-forest text-white"
                      : "border-sage-green/50 bg-white text-deep-forest hover:border-deep-forest"
                  }`}
                >
                  {duration.replace("-", " ")}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 border-t border-sage-green/40 pt-6">
            <h3 className="text-lg font-semibold text-deep-forest">
              Bank account details
            </h3>

            <Select
              label="Bank"
              placeholder={
                loadingBanks ? "Loading banks..." : "Select your bank"
              }
              data={bankOptions}
              searchable
              disabled={loadingBanks}
              nothingFoundMessage="No direct-debit banks yet"
              comboboxProps={{
                transitionProps: { transition: "fade", duration: 100 },
              }}
              withAsterisk
              leftSection={loadingBanks ? <Loader size="xs" /> : null}
              {...form.getInputProps("bankCode")}
              classNames={inputClassNames}
              size="lg"
            />

            <TextInput
              label="Account number"
              placeholder="0123456789"
              maxLength={10}
              withAsterisk
              inputMode="numeric"
              {...form.getInputProps("accountNumber")}
              classNames={inputClassNames}
              size="lg"
            />

            <TextInput
              label="BVN (Bank Verification Number)"
              placeholder="12345678901"
              maxLength={11}
              description="Mono requires BVN to verify the account holder before any debit is activated."
              withAsterisk
              inputMode="numeric"
              {...form.getInputProps("bvn")}
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
              className="h-14 rounded-2xl bg-vibrant-lime text-base font-semibold text-deep-forest transition hover:bg-vibrant-lime/90"
            >
              {createMandate.isPending
                ? "Creating mandate..."
                : "Start your mandate"}
            </Button>
          </div>
        </form>
      </section>

      <section className="rounded-4xl border border-sage-green/40 bg-white/95 p-6 shadow-[0_24px_60px_rgba(0,35,19,0.08)] sm:p-10 grid gap-10 lg:grid-cols-[2fr,1fr]">
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
                  <Icon className="h-5 w-5" />
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

        <div className="grid gap-6 rounded-3xl border border-sage-green/40 bg-mist-green/20 p-6 sm:grid-cols-2">
          {benefits.map(({ title, copy, icon: Icon }) => (
            <div key={title} className="flex gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-deep-forest shadow shrink-0">
                <Icon className="h-5 w-5" />
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
    </div>
  );
}
