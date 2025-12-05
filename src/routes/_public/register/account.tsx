import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import {
  TextInput,
  Select,
  Checkbox,
  PasswordInput,
  Alert,
} from "@mantine/core";
import { useState } from "react";
import { Phone, Home, MapPin, Mail } from "lucide-react";
import { PasswordStrengthCheck } from "@/components/password-strength-check";
import {
  LocationAccountSchema,
  type LocationAccountFormValues,
} from "@/services/registration-schemas";
import { useRegistration } from "@/contexts/registration-context";
import { useFetchChapterByState } from "@/services/hooks";
import { RegistrationLayout } from "@/components/registration-layout";

export const Route = createFileRoute("/_public/register/account")({
  component: RouteComponent,
});

const STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
  "FCT",
];

function RouteComponent() {
  const navigate = useNavigate();
  const { personalDetails, setLocationAccount, nextStep, previousStep } =
    useRegistration();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LocationAccountFormValues>({
    initialValues: {
      stateOfOrigin: "",
      stateOfResidence: "",
      phoneNumber: "",
      address: "",
      email: "",
      password: "",
      agreeToTerms: false,
    },
    validate: zod4Resolver(LocationAccountSchema),
  });

  // Fetch chapter based on state of residence
  const { data: chapter } = useFetchChapterByState(
    form.values.stateOfResidence
  );

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
    <RegistrationLayout>
      <div className="bg-white p-8 md:p-12">
        <div>
          <h2 className="mb-2 font-serif text-4xl font-bold text-deep-forest">
            Location &amp; Network
          </h2>
          <p className="text-gray-600">
            Tell us where you are to connect you with your local chapter
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <Select
              label="State of Origin"
              placeholder="Select your state..."
              data={STATES}
              searchable
              required
              withAsterisk
              {...form.getInputProps("stateOfOrigin")}
            />
            <Select
              label="State of Residence"
              placeholder="Select your state..."
              data={STATES}
              searchable
              required
              withAsterisk
              {...form.getInputProps("stateOfResidence")}
            />
          </div>

          {chapter && (
            <Alert
              title="Chapter Assignment"
              icon={<MapPin className="h-4 w-4" />}
              variant="light"
              color="green"
            >
              Based on your residence, you will be assigned to the{" "}
              <strong>{chapter.name}</strong>. You can change this later in your
              profile.
            </Alert>
          )}

          <TextInput
            label="Phone Number"
            placeholder="080XXXXXXXX"
            type="tel"
            required
            withAsterisk
            leftSection={<Phone className="h-4 w-4" />}
            {...form.getInputProps("phoneNumber")}
          />

          <TextInput
            label="Residential Address"
            placeholder="Your full address"
            required
            withAsterisk
            leftSection={<Home className="h-4 w-4" />}
            {...form.getInputProps("address")}
          />

          <div className="pt-4">
            <h3 className="mb-4 font-serif text-2xl font-bold text-deep-forest">
              Account Credentials
            </h3>

            <div className="space-y-4">
              <TextInput
                label="Email Address"
                placeholder="you@laumga.org"
                type="email"
                required
                withAsterisk
                leftSection={<Mail className="h-4 w-4" />}
                {...form.getInputProps("email")}
              />

              <div>
                <PasswordInput
                  label="Create Password"
                  placeholder="••••••••••••"
                  visible={showPassword}
                  onVisibilityChange={setShowPassword}
                  required
                  withAsterisk
                  {...form.getInputProps("password")}
                />
                <div className="mt-2">
                  <PasswordStrengthCheck password={form.values.password} />
                </div>
              </div>

              <Checkbox
                label="I agree to abide by the constitution of LAUMGA and uphold the values of the brotherhood."
                {...form.getInputProps("agreeToTerms", {
                  type: "checkbox",
                })}
              />
            </div>

            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="font-semibold text-deep-forest transition hover:underline"
              >
                ← Back to Personal Details
              </button>
              <button
                type="button"
                onClick={() => form.onSubmit(handleSubmit)()}
                className="group flex items-center justify-center rounded-lg bg-vibrant-lime py-5 px-12 text-lg font-bold uppercase tracking-wider text-deep-forest transition hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-vibrant-lime/50"
              >
                REVIEW APPLICATION
              </button>
            </div>
          </div>
        </div>
      </div>
    </RegistrationLayout>
  );
}
