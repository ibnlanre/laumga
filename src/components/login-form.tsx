import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { Link, useNavigate } from "@tanstack/react-router";
import { Mail, Lock } from "lucide-react";
import { LoginSchema, type LoginFormValues } from "@/services/validation";
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Group,
  Stack,
  Anchor,
} from "@mantine/core";
import { useLogin } from "@/services/hooks";

export function LoginForm() {
  const navigate = useNavigate();

  const { mutate, isPending } = useLogin();

  const form = useForm<LoginFormValues>({
    validate: zod4Resolver(LoginSchema),
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const handleSubmit = async (values: LoginFormValues) => {
    mutate(values, {
      onSuccess: () => {
        navigate({ to: "/" });
      },
    });
  };

  return (
    <div className="p-6 sm:p-8 lg:p-12 w-full flex-1 place-content-center">
      <div className="w-full max-w-md space-y-8 place-self-center">
        <div className="flex w-full flex-col items-center justify-center rounded-lg border border-sage-green bg-white p-10 py-12 shadow-lg sm:p-14">
          <div className="w-full text-center">
            <h1 className="text-deep-forest text-[22px] font-bold leading-tight tracking-[-0.015em] font-display">
              Member Login
            </h1>
            <p className="text-gray-600 text-base font-normal leading-normal pt-1">
              Please enter your details.
            </p>
          </div>

          <form
            onSubmit={form.onSubmit(handleSubmit)}
            className="mt-8 w-full space-y-6"
          >
            <Stack gap="md">
              <TextInput
                radius={0}
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

              <PasswordInput
                label="Password"
                radius={0}
                placeholder="••••••••••••"
                {...form.getInputProps("password")}
                autoComplete="current-password"
                required
                rightSection={<Lock className="h-5 w-5" />}
                classNames={{
                  input:
                    "border-0 border-b-2 border-deep-forest bg-transparent focus:border-vibrant-lime focus:ring-vibrant-lime/50",
                  label:
                    "text-xs font-semibold uppercase tracking-wide text-deep-forest",
                }}
              />

              <Group justify="space-between">
                <Checkbox
                  label="Remember me"
                  {...form.getInputProps("rememberMe", {
                    type: "checkbox",
                  })}
                />
                <Anchor component={Link} to="/forgot-password" size="sm">
                  Forgot password?
                </Anchor>
              </Group>

              <Button
                type="submit"
                loading={isPending}
                disabled={isPending}
                fullWidth
                size="lg"
                className="bg-institutional-green hover:bg-institutional-green/90 text-white font-bold uppercase tracking-wider"
              >
                Log In
              </Button>
            </Stack>
          </form>

          <div className="mt-6 w-full">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              <a
                className="inline-flex w-full justify-center rounded-full border border-gray-300 bg-white p-2 text-gray-500 shadow-sm hover:border-vibrant-lime hover:text-gray-900"
                href="#"
              >
                <span className="sr-only">Sign in with Google</span>
                <svg
                  aria-hidden="true"
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path>
                </svg>
              </a>
              <a
                className="inline-flex w-full justify-center rounded-full border border-gray-300 bg-white p-2 text-gray-500 shadow-sm hover:border-vibrant-lime hover:text-gray-900"
                href="#"
              >
                <span className="sr-only">Sign in with Facebook</span>
                <svg
                  aria-hidden="true"
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    clipRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    fillRule="evenodd"
                  ></path>
                </svg>
              </a>
              <a
                className="inline-flex w-full justify-center rounded-full border border-gray-300 bg-white p-2 text-gray-500 shadow-sm hover:border-vibrant-lime hover:text-gray-900"
                href="#"
              >
                <span className="sr-only">Sign in with LinkedIn</span>
                <svg
                  aria-hidden="true"
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                </svg>
              </a>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-600">
            <p>
              Not a member yet?{" "}
              <Anchor unstyled component={Link} to="/register" fw="bold">
                Register for an account.
              </Anchor>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
