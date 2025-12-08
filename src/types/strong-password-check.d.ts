declare module "strong-password-check" {
  export interface PasswordStrengthConfig {
    lowercase?: boolean;
    uppercase?: boolean;
    digits?: boolean;
    specialChars?: boolean;
    minLength?: number;
  }

  export interface PasswordStrengthResult {
    messages: string[];
    strength: "Weak" | "Moderate" | "Strong";
  }

  export default function getPasswordStrength(
    password: string,
    config?: PasswordStrengthConfig
  ): PasswordStrengthResult;
}
