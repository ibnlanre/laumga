import { useState } from "react";
import { PasswordInput, Button, Stack, Text, Anchor } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { CheckCircle2, Lock } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useApplyPasswordReset } from "@/api/user/hooks";
import type { ResetPasswordFormValues } from "@/api/login/types";
import { resetPasswordSchema } from "@/api/login/schema";

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  const { mutateAsync, isPending, isSuccess } = useApplyPasswordReset();

  const form = useForm<ResetPasswordFormValues>({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validate: zod4Resolver(resetPasswordSchema),
  });

  const handleSubmit = form.onSubmit(async ({ newPassword }) => {
    await mutateAsync({ token, newPassword });
  });

  if (isSuccess) {
    return (
      <div className="w-full max-w-md space-y-8">
        <div className="flex w-full flex-col items-center justify-center rounded-4xl border border-sage-green bg-white p-10 py-12 shadow-lg sm:p-14 text-center">
          <div className="mb-6 flex justify-center">
            <CheckCircle2 className="h-20 w-20 text-vibrant-lime" />
          </div>
          <Text size="xl" fw={700} c="deep-forest">
            Password updated
          </Text>
          <Text c="dimmed" mt="sm">
            You can now sign in with your new credentials.
          </Text>
          <Button
            component={Link}
            to="/login"
            fullWidth
            size="lg"
            mt="xl"
            className="bg-institutional-green hover:bg-institutional-green/90 text-white font-bold uppercase tracking-wider"
          >
            Back to login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="flex w-full flex-col items-center justify-center rounded-4xl border border-sage-green bg-white p-10 py-12 shadow-lg sm:p-14">
        <div className="w-full text-center">
          <Text size="xl" fw={700} c="deep-forest">
            Choose a new password
          </Text>
          <Text c="dimmed" mt="xs">
            Your password must contain at least 8 characters with a mix of
            letters and numbers.
          </Text>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 w-full space-y-6">
          <Stack gap="md">
            <PasswordInput
              label="New password"
              placeholder="••••••••••••"
              withAsterisk
              {...form.getInputProps("newPassword")}
              visible={isPasswordVisible}
              onVisibilityChange={setIsPasswordVisible}
              disabled={isPending}
              autoComplete="section-reset new-password"
              leftSection={<Lock size={16} className="text-gray-500" />}
            />

            <PasswordInput
              label="Confirm password"
              placeholder="Repeat password"
              withAsterisk
              {...form.getInputProps("confirmPassword")}
              visible={isConfirmVisible}
              onVisibilityChange={setIsConfirmVisible}
              disabled={isPending}
              autoComplete="section-reset new-password"
              leftSection={<Lock size={16} className="text-gray-500" />}
            />

            <Button
              type="submit"
              loading={isPending}
              disabled={isPending}
              fullWidth
              size="lg"
              className="bg-institutional-green hover:bg-institutional-green/90 text-white font-bold uppercase tracking-wider"
            >
              Update password
            </Button>

            <Anchor
              component={Link}
              to="/forgot-password"
              size="sm"
              className="text-center text-institutional-green hover:text-vibrant-lime"
            >
              Need a fresh reset link?
            </Anchor>
          </Stack>
        </form>
      </div>
    </div>
  );
}
