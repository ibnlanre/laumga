import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import {
  Button,
  Select,
  Stack,
  Text,
  TextInput,
  Alert,
  Loader,
  NumberInput,
  Group,
} from "@mantine/core";
import { useNavigate } from "@tanstack/react-router";
import { useCreateMandate } from "@/services/hooks";
import { useAuth } from "@/contexts/auth";
import { createMandateSchema, type CreateMandateInput } from "@/api/mandate";
import { mono, type SupportedBank } from "@/api/mono";
import {
  AlertCircle,
  CheckCircle2,
  Shield,
  TrendingUp,
  Star,
} from "lucide-react";
import { useState, useEffect } from "react";

const TIER_AMOUNTS = {
  supporter: 500000, // ₦5,000 in kobo
  builder: 1000000, // ₦10,000 in kobo
  guardian: 2500000, // ₦25,000 in kobo
};

export function MandatePledgeForm() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const createMandate = useCreateMandate();
  const [monoUrl, setMonoUrl] = useState<string | null>(null);
  const [banks, setBanks] = useState<SupportedBank[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(true);

  // Fetch supported banks from Mono API
  useEffect(() => {
    async function fetchBanks() {
      try {
        const supportedBanks = await mono.bank.fetchAll();
        setBanks(supportedBanks);
      } catch (error) {
        console.error("Failed to fetch banks:", error);
      } finally {
        setLoadingBanks(false);
      }
    }
    fetchBanks();
  }, []);

  const form = useForm<CreateMandateInput>({
    initialValues: {
      amount: 500000,
      frequency: "monthly",
      duration: "12-months",
      accountNumber: "",
      bankCode: "",
      bvn: "",
    },
    validate: zod4Resolver(createMandateSchema),
  });

  const handleTierSelect = (tier: keyof typeof TIER_AMOUNTS) => {
    form.setFieldValue("amount", TIER_AMOUNTS[tier]);
  };

  const handleSubmit = async (data: CreateMandateInput) => {
    if (!currentUser) return;

    try {
      const result = await createMandate.mutateAsync({
        userId: currentUser.uid,
        data,
      });

      // Show Mono authorization URL
      if (result.monoUrl) {
        setMonoUrl(result.monoUrl);
      }
    } catch (error) {
      console.error("Failed to create mandate:", error);
    }
  };

  // If Mono URL is available, show authorization screen
  if (monoUrl) {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-6">
        <Alert
          icon={<AlertCircle />}
          title="Authorization Required"
          color="blue"
        >
          <Stack gap="md">
            <Text size="sm">
              Your mandate has been created successfully. Please authorize it by
              clicking the button below to complete the setup process.
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
    <div className="w-full max-w-7xl mx-auto space-y-12 py-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="font-serif text-5xl font-bold text-deep-forest">
          Choose Your Impact Level
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Your consistent support is a continuous charity that builds a better
          future for our ummah.
        </p>
      </div>

      {/* Tier Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Supporter Tier */}
        <button
          type="button"
          onClick={() => handleTierSelect("supporter")}
          className={`group relative overflow-hidden rounded-2xl border-2 p-8 text-left transition-all hover:shadow-xl ${
            form.values.amount === TIER_AMOUNTS.supporter
              ? "border-sage-green bg-sage-green/5 shadow-lg"
              : "border-gray-200 bg-white hover:border-sage-green/50"
          }`}
        >
          <div className="space-y-4">
            <div className="inline-flex rounded-full bg-sage-green/10 p-3">
              <Shield className="h-6 w-6 text-sage-green" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold text-deep-forest">
                Supporter
              </h3>
              <p className="mt-2 text-4xl font-bold text-deep-forest">₦5,000</p>
              <p className="mt-1 text-sm text-gray-600">Per Month</p>
            </div>
          </div>
          {form.values.amount === TIER_AMOUNTS.supporter && (
            <div className="absolute top-4 right-4">
              <CheckCircle2 className="h-6 w-6 text-sage-green" />
            </div>
          )}
        </button>

        {/* Builder Tier */}
        <button
          type="button"
          onClick={() => handleTierSelect("builder")}
          className={`group relative overflow-hidden rounded-2xl border-2 p-8 text-left transition-all hover:shadow-xl ${
            form.values.amount === TIER_AMOUNTS.builder
              ? "border-institutional-green bg-institutional-green/5 shadow-lg"
              : "border-gray-200 bg-institutional-green/5 hover:border-institutional-green/50"
          }`}
        >
          <div className="space-y-4">
            <div className="inline-flex rounded-full bg-institutional-green/10 p-3">
              <TrendingUp className="h-6 w-6 text-institutional-green" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold text-deep-forest">
                Builder
              </h3>
              <p className="mt-2 text-4xl font-bold text-deep-forest">
                ₦10,000
              </p>
              <p className="mt-1 text-sm text-gray-600">Per Month</p>
            </div>
          </div>
          {form.values.amount === TIER_AMOUNTS.builder && (
            <div className="absolute top-4 right-4">
              <CheckCircle2 className="h-6 w-6 text-institutional-green" />
            </div>
          )}
        </button>

        {/* Guardian Tier */}
        <button
          type="button"
          onClick={() => handleTierSelect("guardian")}
          className={`group relative overflow-hidden rounded-2xl border-2 p-8 text-left transition-all hover:shadow-xl ${
            form.values.amount === TIER_AMOUNTS.guardian
              ? "border-deep-forest bg-deep-forest text-white shadow-lg"
              : "border-gray-200 bg-deep-forest text-white hover:border-deep-forest/50"
          }`}
        >
          <div className="space-y-4">
            <div className="inline-flex rounded-full bg-vibrant-lime/20 p-3">
              <Star className="h-6 w-6 text-vibrant-lime" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold text-white">
                Guardian
              </h3>
              <p className="mt-2 text-4xl font-bold text-vibrant-lime">
                ₦25,000
              </p>
              <p className="mt-1 text-sm text-white/70">Per Month</p>
            </div>
          </div>
          {form.values.amount === TIER_AMOUNTS.guardian && (
            <div className="absolute top-4 right-4">
              <CheckCircle2 className="h-6 w-6 text-vibrant-lime" />
            </div>
          )}
        </button>

        {/* Custom Pledge */}
        <div
          className={`relative overflow-hidden rounded-2xl border-2 border-dashed p-8 transition-all ${
            form.values.amount !== TIER_AMOUNTS.supporter &&
            form.values.amount !== TIER_AMOUNTS.builder &&
            form.values.amount !== TIER_AMOUNTS.guardian
              ? "border-deep-forest bg-deep-forest/5"
              : "border-gray-300 bg-white"
          }`}
        >
          <div className="space-y-4">
            <div className="inline-flex rounded-full bg-gray-100 p-3">
              <span className="material-symbols-outlined text-gray-600">
                edit
              </span>
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold text-deep-forest">
                Custom Pledge
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Enter your own amount
              </p>
              <NumberInput
                placeholder="Amount"
                min={200}
                max={1000000}
                step={1000}
                value={form.values.amount / 100}
                onChange={(value) =>
                  form.setFieldValue("amount", Number(value) * 100)
                }
                classNames={{
                  input:
                    "mt-3 border-2 border-gray-300 focus:border-deep-forest text-lg font-semibold",
                }}
                leftSection="₦"
                hideControls
              />
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-mist-green rounded-2xl p-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-3">
            <div className="inline-flex rounded-full bg-sage-green/20 p-4">
              <CheckCircle2 className="h-6 w-6 text-sage-green" />
            </div>
            <h4 className="font-semibold text-deep-forest">
              Shariah Compliant
            </h4>
            <p className="text-sm text-gray-600">
              All funds are managed according to Islamic principles.
            </p>
          </div>
          <div className="space-y-3">
            <div className="inline-flex rounded-full bg-institutional-green/20 p-4">
              <span className="material-symbols-outlined text-institutional-green">
                insert_chart
              </span>
            </div>
            <h4 className="font-semibold text-deep-forest">Monthly Reports</h4>
            <p className="text-sm text-gray-600">
              Receive detailed impact and financial reports every month.
            </p>
          </div>
          <div className="space-y-3">
            <div className="inline-flex rounded-full bg-deep-forest/20 p-4">
              <span className="material-symbols-outlined text-deep-forest">
                how_to_vote
              </span>
            </div>
            <h4 className="font-semibold text-deep-forest">Community Voting</h4>
            <p className="text-sm text-gray-600">
              Mandate holders have a say in major project selections.
            </p>
          </div>
          <div className="space-y-3">
            <div className="inline-flex rounded-full bg-vibrant-lime/20 p-4">
              <span className="material-symbols-outlined text-deep-forest">
                dashboard
              </span>
            </div>
            <h4 className="font-semibold text-deep-forest">
              Digital Dashboard
            </h4>
            <p className="text-sm text-gray-600">
              Track your contributions and see their impact in real-time.
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <form
        onSubmit={form.onSubmit(handleSubmit)}
        className="max-w-3xl mx-auto space-y-8"
      >
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-sm">
          <h2 className="font-serif text-3xl font-bold text-deep-forest mb-6">
            Complete Your Mandate Setup
          </h2>

          <Stack gap="lg">
            {/* Frequency */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-deep-forest">
                Payment Frequency
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: "monthly", label: "Monthly" },
                  { value: "quarterly", label: "Quarterly" },
                  { value: "annually", label: "Annually" },
                  { value: "one-time", label: "One-time" },
                ].map((freq) => (
                  <button
                    key={freq.value}
                    type="button"
                    onClick={() =>
                      form.setFieldValue("frequency", freq.value as any)
                    }
                    className={`rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
                      form.values.frequency === freq.value
                        ? "border-deep-forest bg-deep-forest text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-deep-forest"
                    }`}
                  >
                    {freq.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-deep-forest">
                Mandate Duration
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "12-months", label: "12 Months" },
                  { value: "24-months", label: "24 Months" },
                  { value: "indefinite", label: "Indefinite" },
                ].map((dur) => (
                  <button
                    key={dur.value}
                    type="button"
                    onClick={() =>
                      form.setFieldValue("duration", dur.value as any)
                    }
                    className={`rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
                      form.values.duration === dur.value
                        ? "border-deep-forest bg-deep-forest text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-deep-forest"
                    }`}
                  >
                    {dur.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bank Details */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-deep-forest">
                Bank Account Details
              </h3>

              <Select
                label="Bank"
                placeholder={
                  loadingBanks ? "Loading banks..." : "Select your bank"
                }
                data={banks}
                searchable
                disabled={loadingBanks}
                {...form.getInputProps("bankCode")}
                leftSection={loadingBanks ? <Loader size="xs" /> : null}
                classNames={{
                  input: "border-2 border-gray-300 focus:border-deep-forest",
                }}
              />

              <TextInput
                label="Account Number"
                placeholder="0123456789"
                maxLength={10}
                {...form.getInputProps("accountNumber")}
                classNames={{
                  input: "border-2 border-gray-300 focus:border-deep-forest",
                }}
              />

              <TextInput
                label="BVN (Bank Verification Number)"
                placeholder="12345678901"
                maxLength={11}
                {...form.getInputProps("bvn")}
                description="Required for mandate authorization with Mono"
                classNames={{
                  input: "border-2 border-gray-300 focus:border-deep-forest",
                }}
              />
            </div>
          </Stack>
        </div>

        {/* Submit Button */}
        <div className="space-y-4">
          <Button
            type="submit"
            size="xl"
            fullWidth
            loading={createMandate.isPending}
            className="bg-vibrant-lime text-deep-forest hover:bg-vibrant-lime/90 font-bold text-lg h-14 rounded-xl"
          >
            {createMandate.isPending
              ? "Creating Mandate..."
              : "Start Your Mandate"}
          </Button>
          <p className="text-center text-sm text-gray-500">
            🔒 Secure 256-bit encryption • Cancel or pause anytime • Shariah
            compliant
          </p>
        </div>
      </form>

      {/* CTA Section */}
      <div className="bg-deep-forest text-white rounded-2xl p-12 text-center space-y-6">
        <h2 className="font-serif text-4xl font-bold">
          Leave a digital Sadaqah legacy behind.
        </h2>
        <p className="text-lg text-white/80 max-w-2xl mx-auto">
          Your consistent support is a continuous charity that builds a better
          future for our ummah.
        </p>
      </div>
    </div>
  );
}
