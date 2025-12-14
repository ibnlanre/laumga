import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { Link, useNavigate } from "@tanstack/react-router";
import { Mail, Lock } from "lucide-react";
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Group,
  Stack,
  Anchor,
  Divider,
  Text,
} from "@mantine/core";
import { useLogin } from "@/api/user/hooks";
import type { LoginFormValues } from "@/api/login/types";
import { loginSchema } from "@/api/login/schema";

export function AdminLoginForm() {
  const navigate = useNavigate();

  const { mutate, isPending } = useLogin();

  const form = useForm<LoginFormValues>({
    validate: zod4Resolver(loginSchema),
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const handleSubmit = async (values: LoginFormValues) => {
    mutate(values, {
      onSuccess: () => {
        navigate({ reloadDocument: true });
      },
    });
  };

  // const handleSocialLogin = (provider: "google" | "facebook" | "microsoft") => {
  //   const providerMap = {
  //     google: googleProvider,
  //     facebook: facebookProvider,
  //     microsoft: microsoftProvider,
  //   };
  // };

  return (
    <div className="p-6 sm:p-8 lg:p-12 w-full flex-1 place-content-center">
      <div className="w-full max-w-md space-y-8 place-self-center">
        <div className="flex w-full flex-col items-center justify-center rounded-4xl border border-sage-green bg-white p-8 sm:p-10 shadow-lg">
          <div className="w-full text-center mb-8">
            <h1 className="text-deep-forest text-2xl sm:text-3xl font-bold leading-tight tracking-[-0.015em] font-display">
              Admin Access
            </h1>
            <p className="text-gray-600 text-sm sm:text-base font-normal leading-normal mt-2">
              Only authorized administrators can access these tools.
            </p>
          </div>

          {/* Social Login - Hidden for now */}
          {false && (
            <>
              <div className="w-full space-y-4 mb-6">
                <Button
                  fullWidth
                  size="lg"
                  variant="outline"
                  // onClick={() => handleSocialLogin("google")}
                  disabled={isPending}
                  leftSection={
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  }
                  classNames={{
                    root: "border-gray-300 hover:border-vibrant-lime hover:bg-gray-50 transition-colors",
                    label: "text-gray-700 font-medium",
                  }}
                >
                  Continue with Google
                </Button>

                <Button
                  fullWidth
                  size="lg"
                  variant="outline"
                  // onClick={() => handleSocialLogin("facebook")}
                  disabled={isPending}
                  leftSection={
                    <svg className="h-5 w-5" fill="#1877F2" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  }
                  classNames={{
                    root: "border-gray-300 hover:border-vibrant-lime hover:bg-gray-50 transition-colors",
                    label: "text-gray-700 font-medium",
                  }}
                >
                  Continue with Facebook
                </Button>

                <Button
                  fullWidth
                  size="lg"
                  variant="outline"
                  // onClick={() => handleSocialLogin("microsoft")}
                  disabled={isPending}
                  leftSection={
                    <svg className="h-5 w-5" fill="#0078D4" viewBox="0 0 24 24">
                      <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z" />
                    </svg>
                  }
                  classNames={{
                    root: "border-gray-300 hover:border-vibrant-lime hover:bg-gray-50 transition-colors",
                    label: "text-gray-700 font-medium",
                  }}
                >
                  Continue with Microsoft
                </Button>
              </div>

              <Divider
                label={
                  <Text size="sm" c="dimmed">
                    Or continue with email
                  </Text>
                }
                labelPosition="center"
                className="w-full mb-6"
              />
            </>
          )}

          <form
            onSubmit={form.onSubmit(handleSubmit)}
            className="w-full space-y-5"
          >
            <Stack gap="md">
              <TextInput
                label="Email Address"
                placeholder="you@example.com"
                {...form.getInputProps("email")}
                type="email"
                autoComplete="email"
                required
                radius="xl"
                size="lg"
                disabled={isPending}
                labelProps={{
                  lh: 2,
                  fz: "sm",
                }}
                leftSection={<Mail className="h-4 w-4 text-gray-500" />}
              />

              <PasswordInput
                label="Password"
                placeholder="••••••••••••"
                {...form.getInputProps("password")}
                autoComplete="current-password"
                required
                radius="xl"
                size="lg"
                labelProps={{
                  lh: 2,
                  fz: "sm",
                }}
                disabled={isPending}
                leftSection={<Lock className="h-4 w-4 text-gray-500" />}
              />

              <Group justify="space-between">
                <Checkbox
                  label="Remember me"
                  {...form.getInputProps("rememberMe", {
                    type: "checkbox",
                  })}
                  disabled={isPending}
                  classNames={{
                    label: "text-sm text-gray-700",
                  }}
                />
                <Anchor
                  component={Link}
                  to="/forgot-password"
                  size="sm"
                  className="text-institutional-green hover:text-vibrant-lime font-medium"
                >
                  Forgot password?
                </Anchor>
              </Group>

              <Button
                type="submit"
                loading={isPending}
                disabled={isPending}
                fullWidth
                radius="xl"
                size="lg"
                className="bg-institutional-green hover:bg-institutional-green/90 text-white font-semibold transition-colors mt-2"
              >
                Log In
              </Button>
            </Stack>
          </form>

          <div className="mt-6 w-full text-center">
            <Text size="sm" c="dimmed">
              Not a member yet?{" "}
              <Anchor
                component={Link}
                to="/register"
                className="text-institutional-green hover:text-vibrant-lime font-semibold"
              >
                Register for an account
              </Anchor>
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}
