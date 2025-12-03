import { Stack, Progress, Text, Group, Box } from "@mantine/core";
import { Check as CheckIcon, X } from "lucide-react";

interface PasswordStrengthCheckProps {
  password: string;
}

interface StrengthChecks {
  minLength: boolean;
  hasNumber: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasSpecialChar: boolean;
}

export function PasswordStrengthCheck({
  password,
}: PasswordStrengthCheckProps) {
  const checks: StrengthChecks = {
    minLength: password.length >= 8,
    hasNumber: /\d/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const checkCount = Object.values(checks).filter(Boolean).length;
  const strength =
    checkCount <= 1
      ? "Weak"
      : checkCount <= 2
        ? "Fair"
        : checkCount <= 4
          ? "Good"
          : "Strong";
  const strengthColor =
    strength === "Weak"
      ? "red"
      : strength === "Fair"
        ? "yellow"
        : strength === "Good"
          ? "blue"
          : "green";

  const progressPercentage = (checkCount / 5) * 100;

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
        <Progress value={progressPercentage} color={strengthColor} />
      </Box>

      <Stack gap="xs">
        <CheckItem label="At least 8 characters" checked={checks.minLength} />
        <CheckItem label="Contains a number" checked={checks.hasNumber} />
        <CheckItem
          label="Contains an uppercase letter"
          checked={checks.hasUppercase}
        />
        <CheckItem
          label="Contains a lowercase letter"
          checked={checks.hasLowercase}
        />
        <CheckItem
          label="Contains a special character (!@#...)"
          checked={checks.hasSpecialChar}
        />
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
        <CheckIcon size={16} className="text-green-access shrink-0" />
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
