import { useEffect } from "react";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { Button, TextInput, Textarea } from "@mantine/core";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import clsx from "clsx";

import { useAuth } from "@/contexts/use-auth";
import type { MonoCustomerForm } from "@/api/mono-customer/types";
import { monoCustomerFormSchema } from "@/api/mono-customer/schema";
import { useCreateMonoCustomer } from "@/api/mono-customer/hooks";
import { PhoneInput } from "@/components/phone-input";

interface MandateCustomerFormProps {
  variant?: "standalone" | "embedded";
  onSuccess?: (monoCustomerId: string) => void;
}

export function MandateCustomerForm(props: MandateCustomerFormProps = {}) {
  const { variant = "standalone", onSuccess } = props;
  const { user } = useAuth();
  const createCustomer = useCreateMonoCustomer();
  const isEmbedded = variant === "embedded";

  const form = useForm<MonoCustomerForm>({
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

    form.setValues({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address,
    });
  }, [user?.id]);

  const handleSubmit = async (data: MonoCustomerForm) => {
    if (!user) return;

    createCustomer.mutate({
      data: {
        user,
        data,
      },
    });
  };

  return (
    <div
      className={clsx(
        "w-full space-y-8",
        isEmbedded &&
          "lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start lg:gap-6 lg:space-y-0"
      )}
    >
      <section
        className={clsx(
          "w-full rounded-4xl border border-sage-green/40 bg-white/95 p-8 shadow-[0_24px_60px_rgba(0,35,19,0.08)] sm:p-10",
          isEmbedded ? undefined : "mx-auto max-w-2xl"
        )}
      >
        <div className="mb-8 space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-institutional-green text-white shrink-0">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-deep-forest">
                Verify your identity
              </h2>
              <p className="mt-2 text-sm text-deep-forest/70">
                We need a few details to set up your recurring contribution.
                Your BVN helps us prevent fraud and process your payments
                securely.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <TextInput
              label="First name"
              placeholder="Aisha"
              withAsterisk
              {...form.getInputProps("firstName")}
              labelProps={{ lh: 2, fz: "sm" }}
              size="lg"
            />

            <TextInput
              label="Last name"
              placeholder="Yusuf"
              withAsterisk
              {...form.getInputProps("lastName")}
              labelProps={{ lh: 2, fz: "sm" }}
              size="lg"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <TextInput
              label="Email"
              placeholder="you@example.com"
              type="email"
              withAsterisk
              {...form.getInputProps("email")}
              labelProps={{ lh: 2, fz: "sm" }}
              size="lg"
            />

            <PhoneInput
              label="Phone number"
              placeholder="0801 234 5678"
              withAsterisk
              {...form.getInputProps("phoneNumber")}
              labelProps={{ lh: 2, fz: "sm" }}
              size="lg"
            />
          </div>

          <Textarea
            label="Residential address"
            placeholder="25 Unity Close, Ikeja"
            withAsterisk
            autosize
            minRows={2}
            {...form.getInputProps("address")}
            labelProps={{ lh: 2, fz: "sm" }}
            size="lg"
          />

          <TextInput
            label="BVN (Bank Verification Number)"
            placeholder="12345678901"
            maxLength={11}
            description="We use this to verify your identity securely."
            withAsterisk
            inputMode="numeric"
            {...form.getInputProps("bvn")}
            labelProps={{ lh: 2, fz: "sm" }}
            size="lg"
          />

          <Button
            type="submit"
            size="xl"
            fullWidth
            loading={createCustomer.isPending}
            className="mt-2"
          >
            {createCustomer.isPending ? "Verifying..." : "Continue"}
          </Button>
        </form>
      </section>

      <section
        className={clsx(
          "space-y-4 rounded-3xl border border-sage-green/40 bg-mist-green/30 p-6 mx-auto w-full max-w-2xl"
        )}
      >
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-1 h-5 w-5 text-institutional-green shrink-0" />
          <div>
            <p className="font-semibold text-deep-forest">
              Your data is secure
            </p>
            <p className="text-sm text-deep-forest/70">
              We only store your details as needed to process your contribution.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
