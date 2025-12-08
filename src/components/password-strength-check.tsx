import { Stack, Progress, Text, Group, Box } from "@mantine/core";
import { Check, X } from "lucide-react";
import getPasswordStrength from "strong-password-check";

interface PasswordStrengthCheckProps {
  password: string;
}

interface CriterionDefinition {
  label: string;
  messageFragment: string;
}

const passwordStrengthConfig = {
  lowercase: true,
  uppercase: true,
  digits: true,
  specialChars: true,
  minLength: 8,
} as const;

const CRITERIA_DEFINITIONS: CriterionDefinition[] = [
  {
    label: `At least ${passwordStrengthConfig.minLength} characters`,
    messageFragment: `Contains at least ${passwordStrengthConfig.minLength} characters`,
  },
  { label: "Contains a number", messageFragment: "digits" },
  {
    label: "Contains an uppercase letter",
    messageFragment: "uppercase letters",
  },
  {
    label: "Contains a lowercase letter",
    messageFragment: "lowercase letters",
  },
  {
    label: "Contains a special character (!@#...)",
    messageFragment: "special characters",
  },
];

const STRENGTH_COLOR: Record<string, string> = {
  Weak: "red",
  Moderate: "yellow",
  Strong: "green",
};

export function PasswordStrengthCheck({
  password,
}: PasswordStrengthCheckProps) {
  const { messages, strength } = getPasswordStrength(
    password,
    passwordStrengthConfig
  );

  const checks = CRITERIA_DEFINITIONS.map(({ label, messageFragment }) => ({
    label,
    checked: !messages.some((message) => {
      return message.toLowerCase().includes(messageFragment.toLowerCase());
    }),
  }));

  const passedChecks = checks.filter((check) => check.checked).length;
  const progressPercentage = (passedChecks / checks.length) * 100;
  const strengthColor = STRENGTH_COLOR[strength] ?? "gray";

  return (
    <Stack gap="md">
      <Box>
        <Group justify="space-between" mb="xs">
          <Text size="sm" fw={500} className="text-deep-forest">
            Password Strength
          </Text>
          <Text size="sm" fw={500} c={strengthColor}>
            {strength}
          </Text>
        </Group>
        <Progress
          value={progressPercentage}
          color={strengthColor}
          transitionDuration={400}
        />
      </Box>

      <Stack gap="xs">
        {checks.map((check) => (
          <CheckItem
            key={check.label}
            label={check.label}
            checked={check.checked}
          />
        ))}
      </Stack>
    </Stack>
  );
}

interface CheckItemProps {
  label: string;
  checked: boolean;
}

function CheckItem({ label, checked }: CheckItemProps) {
  return (
    <Group gap="xs">
      {checked ? (
        <Check size={16} className="text-green-access shrink-0" />
      ) : (
        <X size={16} className="text-gray-400 shrink-0" />
      )}
      <Text
        size="xs"
        className={checked ? "text-green-access" : "text-gray-400"}
      >
        {label}
      </Text>
    </Group>
  );
}
