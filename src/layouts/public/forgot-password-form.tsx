import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { Link } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { TextInput, Button, Stack, Anchor } from "@mantine/core";
import { useState } from "react";
import { useResetPassword } from "@/api/user/hooks";
import type { ForgotPasswordFormValues } from "@/api/login/types";
import { forgotPasswordSchema } from "@/api/login/schema";

export function ForgotPasswordForm() {
  const [submittedEmail, setSubmittedEmail] = useState("");

  const { mutate, isPending, isSuccess } = useResetPassword();

  const form = useForm<ForgotPasswordFormValues>({
    validate: zod4Resolver(forgotPasswordSchema),
    initialValues: {
      email: "",
    },
  });

  const handleSubmit = async (values: ForgotPasswordFormValues) => {
    mutate(values, {
      onSuccess: () => {
        setSubmittedEmail(values.email);
      },
    });
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-md space-y-8 pt-16 lg:pt-0">
        <div className="flex w-full flex-col items-center justify-center rounded-4xl border border-sage-green bg-white p-10 py-12 shadow-lg sm:p-14">
          <div className="w-full text-center">
            <div className="mb-6 flex justify-center">
              <Mail className="h-20 w-20 text-vibrant-lime" />
            </div>
            <h1 className="text-deep-forest text-[22px] font-bold leading-tight tracking-[-0.015em] font-display">
              Check Your Email
            </h1>
            <p className="text-gray-600 text-base font-normal leading-normal pt-3">
              We've sent a password reset link to{" "}
              <span className="font-semibold text-deep-forest">
                {submittedEmail}
              </span>
            </p>
            <p className="text-gray-500 text-sm font-normal leading-normal pt-2">
              Please check your email and follow the link to reset your
              password. If you don't see the email, check your spam folder.
            </p>
          </div>

          <Stack gap="md" className="mt-8 w-full">
            <Button
              component={Link}
              to="/login"
              fullWidth
              size="lg"
              className="bg-deep-forest hover:bg-deep-forest/90 text-white font-bold uppercase tracking-wider"
            >
              Back to Login
            </Button>
          </Stack>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-8 pt-16 lg:pt-0">
      <div className="flex w-full flex-col items-center justify-center rounded-4xl border border-sage-green bg-white p-10 py-12 shadow-lg sm:p-14">
        <div className="w-full text-center">
          <h1 className="text-deep-forest text-[22px] font-bold leading-tight tracking-[-0.015em] font-display">
            Forgot Password?
          </h1>
          <p className="text-gray-600 text-base font-normal leading-normal pt-1">
            Enter the email address associated with your membership. We will
            send you a secure link to reset your credentials.
          </p>
        </div>

        <form
          onSubmit={form.onSubmit(handleSubmit)}
          className="mt-8 w-full space-y-6"
        >
          <Stack gap="md">
            <TextInput
              label="Email Address"
              placeholder="you@example.com"
              {...form.getInputProps("email")}
              type="email"
              autoComplete="email"
              required
              rightSection={<Mail className="h-5 w-5" />}
              classNames={{
                input:
                  "border-0 border-b-2 border-deep-forest bg-transparent focus:border-vibrant-lime focus:ring-vibrant-lime/50",
                label:
                  "text-xs font-semibold uppercase tracking-wide text-deep-forest",
              }}
            />

            <Button
              type="submit"
              loading={isPending}
              disabled={isPending}
              fullWidth
              size="lg"
              className="bg-institutional-green hover:bg-institutional-green/90 text-white font-bold uppercase tracking-wider"
            >
              Send Reset Link
            </Button>
          </Stack>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          <Anchor component={Link} to="/login" size="sm">
            <span className="inline-block mr-1">←</span> Back to Login
          </Anchor>
        </div>
      </div>
    </div>
  );
}
