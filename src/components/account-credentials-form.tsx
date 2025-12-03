import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import {
  TextInput,
  PasswordInput,
  Select,
  Checkbox,
  Stack,
  Group,
  Button,
  Alert,
} from "@mantine/core";
import { useState } from "react";
import {
  AccountCredentialsSchema,
  type AccountCredentialsFormValues,
} from "@/services/validation";
import { PasswordStrengthCheck } from "./password-strength-check";

interface AccountCredentialsFormProps {
  onSubmit?: (values: AccountCredentialsFormValues) => void;
  isLoading?: boolean;
}

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

export function AccountCredentialsForm({
  onSubmit,
  isLoading = false,
}: AccountCredentialsFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<AccountCredentialsFormValues>({
    initialValues: {
      stateOfOrigin: "",
      stateOfResidence: "",
      phoneNumber: "",
      address: "",
      email: "",
      password: "",
      agreeToTerms: false,
    },
    validate: zod4Resolver(AccountCredentialsSchema),
  });

  const handleSubmit = (values: AccountCredentialsFormValues) => {
    onSubmit?.(values);
  };

  return (
    <Stack gap="lg">
      <Stack gap="md">
        <h3 className="font-serif text-3xl font-bold text-deep-forest">
          Network Details
        </h3>
        <Group grow>
          <Select
            label="State of Origin"
            placeholder="Select your state..."
            data={STATES}
            searchable
            {...form.getInputProps("stateOfOrigin")}
          />
          <Select
            label="State of Residence"
            placeholder="Select your state..."
            data={STATES}
            searchable
            {...form.getInputProps("stateOfResidence")}
          />
        </Group>

        <Group grow>
          <TextInput
            label="Phone Number"
            placeholder="080XXXXXXXX"
            type="tel"
            leftSection={
              <span className="material-symbols-outlined">phone</span>
            }
            {...form.getInputProps("phoneNumber")}
          />
        </Group>

        <TextInput
          label="Address"
          placeholder="Your residential address"
          leftSection={<span className="material-symbols-outlined">home</span>}
          {...form.getInputProps("address")}
        />

        <Alert
          title="Location Notice"
          icon={<span className="material-symbols-outlined">info</span>}
          variant="light"
          color="green"
        >
          Based on your residence, you will be assigned to the{" "}
          {form.values.stateOfResidence || "selected"} State Chapter. You can
          change this later in your profile.
        </Alert>
      </Stack>

      <Stack gap="md">
        <h3 className="font-serif text-3xl font-bold text-deep-forest">
          Account Credentials
        </h3>

        <TextInput
          label="Email Address"
          placeholder="you@laumga.org"
          type="email"
          leftSection={<span className="material-symbols-outlined">mail</span>}
          {...form.getInputProps("email")}
        />

        <div>
          <PasswordInput
            label="Create Password"
            placeholder="••••••••••••"
            visible={showPassword}
            onVisibilityChange={setShowPassword}
            {...form.getInputProps("password")}
          />
          <div className="mt-4">
            <PasswordStrengthCheck password={form.values.password} />
          </div>
        </div>
      </Stack>

      <Stack gap="md">
        <Checkbox
          label="I agree to abide by the constitution of LAUMGA and uphold the values of the brotherhood."
          {...form.getInputProps("agreeToTerms", {
            type: "checkbox",
          })}
        />
      </Stack>

      <Group justify="space-between">
        <Button variant="subtle">← Back to Personal Details</Button>
        <Button
          type="submit"
          onClick={() => form.onSubmit(handleSubmit)()}
          loading={isLoading}
        >
          REVIEW APPLICATION
        </Button>
      </Group>
    </Stack>
  );
}
