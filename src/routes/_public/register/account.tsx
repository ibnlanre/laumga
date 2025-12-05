import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "@mantine/form";
import {
  TextInput,
  Select,
  Checkbox,
  PasswordInput,
  Alert,
  Loader,
} from "@mantine/core";
import { useState } from "react";
import { Home, MapPin, Mail, ArrowLeft, Globe } from "lucide-react";
import { PasswordStrengthCheck } from "@/components/password-strength-check";
import { type LocationAccountFormValues } from "@/api/registration";
import { useCountryOptions, useStateOptions } from "@/services/location";
import { useRegistration } from "@/contexts/registration-context";
import { useFetchChapterByState } from "@/services/hooks";
import { RegistrationLayout } from "@/components/registration-layout";

export const Route = createFileRoute("/_public/register/account")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { setLocationAccount, nextStep, previousStep } = useRegistration();
  const [showPassword, setShowPassword] = useState(false);
  const { countryOptions, countryOptionsLoading } = useCountryOptions();

  const form = useForm<LocationAccountFormValues>({
    mode: "uncontrolled",
    initialValues: {
      countryOfOrigin: "Nigeria",
      stateOfOrigin: "",
      countryOfResidence: "Nigeria",
      stateOfResidence: "",
      address: "",
      email: "",
      password: "",
      agreeToTerms: false,
    },
    // validate: zod4Resolver(LocationAccountSchema), // TODO: Return back
  });

  const {
    stateOptions: originStateOptions,
    stateOptionsLoading: isLoadingOriginStates,
  } = useStateOptions(form.values.countryOfOrigin);

  const {
    stateOptions: residenceStateOptions,
    stateOptionsLoading: isLoadingResidenceStates,
  } = useStateOptions(form.values.countryOfResidence);

  const hasOriginStateSelect =
    originStateOptions.length || isLoadingOriginStates;
  const hasResidenceStateSelect =
    residenceStateOptions.length || isLoadingResidenceStates;

  const { data: chapter } = useFetchChapterByState(
    form.values.stateOfResidence
  );

  const isNigeriaResidence = form.values.countryOfResidence === "Nigeria";

  const handleSubmit = (values: LocationAccountFormValues) => {
    setLocationAccount(values);
    nextStep();
    navigate({ to: "/register/review" });
  };

  const handleBack = () => {
    previousStep();
    navigate({ to: "/register" });
  };

  return (
    <RegistrationLayout
      sidebarTitle="Expand Your Network."
      sidebarDescription="Connecting you to the chapter closest to your residence."
    >
      <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-6">
        <div>
          <h2 className="font-serif text-3xl font-bold text-deep-forest mb-2">
            Network Details
          </h2>
          <p className="text-gray-600">
            Where you're from and how to reach you
          </p>
        </div>

        {/* Location */}
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Country of Origin"
              placeholder="Select country..."
              data={countryOptions}
              key={form.key("countryOfOrigin")}
              {...form.getInputProps("countryOfOrigin")}
              searchable
              withAsterisk
              leftSection={<Globe size={16} />}
              labelProps={{
                lh: 2,
                fz: "sm",
              }}
              radius="lg"
              size="lg"
            />

            {hasOriginStateSelect ? (
              <Select
                label="State of Origin"
                placeholder="Select your state..."
                data={originStateOptions}
                searchable
                withAsterisk
                key={form.key("stateOfOrigin")}
                {...form.getInputProps("stateOfOrigin")}
                disabled={isLoadingOriginStates}
                rightSection={
                  isLoadingOriginStates ? <Loader size="sm" /> : undefined
                }
                nothingFoundMessage="No state options"
                labelProps={{
                  lh: 2,
                  fz: "sm",
                }}
                radius="lg"
                size="lg"
              />
            ) : (
              <TextInput
                label="State/Region of Origin"
                placeholder="e.g. California, Ontario, etc."
                withAsterisk
                key={form.key("stateOfOrigin")}
                {...form.getInputProps("stateOfOrigin")}
                labelProps={{
                  lh: 2,
                  fz: "sm",
                }}
                radius="lg"
                size="lg"
              />
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Country of Residence"
              placeholder="Select country..."
              data={countryOptions}
              searchable
              withAsterisk
              leftSection={<Globe size={16} />}
              key={form.key("countryOfResidence")}
              {...form.getInputProps("countryOfResidence")}
              disabled={countryOptionsLoading}
              rightSection={
                countryOptionsLoading ? <Loader size="sm" /> : undefined
              }
              nothingFoundMessage="No country found"
              labelProps={{
                lh: 2,
                fz: "sm",
              }}
              radius="lg"
              size="lg"
            />

            {hasResidenceStateSelect ? (
              <Select
                label="State of Residence"
                placeholder="Select your state..."
                data={residenceStateOptions}
                searchable
                withAsterisk
                key={form.key("stateOfResidence")}
                {...form.getInputProps("stateOfResidence")}
                disabled={isLoadingResidenceStates}
                rightSection={
                  isLoadingResidenceStates ? <Loader size="sm" /> : undefined
                }
                nothingFoundMessage="No state options"
                labelProps={{
                  lh: 2,
                  fz: "sm",
                }}
                radius="lg"
                size="lg"
              />
            ) : (
              <TextInput
                label="State/Region of Residence"
                placeholder="e.g. Texas, London, etc."
                withAsterisk
                key={form.key("stateOfResidence")}
                {...form.getInputProps("stateOfResidence")}
                labelProps={{
                  lh: 2,
                  fz: "sm",
                }}
                radius="lg"
                size="lg"
              />
            )}
          </div>
        </div>

        {chapter && isNigeriaResidence && (
          <Alert
            title="Chapter Assignment"
            icon={<MapPin size={16} />}
            variant="light"
            color="green"
          >
            Based on your residence, you will be assigned to the{" "}
            <strong>{chapter.name}</strong>. You can change this later in your
            profile.
          </Alert>
        )}

        <TextInput
          label="Residential Address"
          placeholder="Your full address"
          withAsterisk
          leftSection={<Home size={16} />}
          key={form.key("address")}
          {...form.getInputProps("address")}
          labelProps={{
            lh: 2,
            fz: "sm",
          }}
          radius="lg"
          size="lg"
        />

        {/* Account Credentials */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="font-serif text-2xl font-bold text-deep-forest mb-4">
            Account Credentials
          </h3>

          <div className="space-y-4">
            <TextInput
              label="Email Address"
              placeholder="aminah.alfaruq@email.com"
              type="email"
              withAsterisk
              leftSection={<Mail size={16} />}
              key={form.key("email")}
              {...form.getInputProps("email")}
              labelProps={{
                lh: 2,
                fz: "sm",
              }}
              radius="lg"
              size="lg"
            />

            <div>
              <PasswordInput
                label="Create Password"
                placeholder="••••••••••••"
                visible={showPassword}
                onVisibilityChange={setShowPassword}
                withAsterisk
                key={form.key("password")}
                {...form.getInputProps("password")}
                labelProps={{
                  lh: 2,
                  fz: "sm",
                }}
                radius="lg"
                size="lg"
              />
              <div className="mt-2">
                <PasswordStrengthCheck password={form.values.password} />
              </div>
            </div>

            <Checkbox
              label="I agree to abide by the constitution of LAUMGA and uphold the values of the brotherhood."
              key={form.key("agreeToTerms")}
              {...form.getInputProps("agreeToTerms", {
                type: "checkbox",
              })}
              fz="sm"
              radius="lg"
              size="lg"
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 font-semibold text-deep-forest transition hover:text-institutional-green"
          >
            <ArrowLeft size={16} />
            Back to Personal Details
          </button>
          <button
            type="submit"
            className="rounded-lg bg-vibrant-lime py-4 px-8 text-base font-bold uppercase tracking-wider text-deep-forest transition hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-vibrant-lime/50"
          >
            Review Application
          </button>
        </div>
      </form>
    </RegistrationLayout>
  );
}
