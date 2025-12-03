import { z } from "zod/v4";

export const LoginSchema = z.object({
  email: z.email("Invalid email address").min(1, "Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .min(1, "Password is required"),
  rememberMe: z.boolean().default(false),
});

export type LoginFormValues = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  title: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  middleName: z.string().optional(),
  gender: z.enum(["male", "female"], { message: "Gender is required" }),
  passportUrl: z.string().optional(),
  stateOfOrigin: z.string().min(1, "State of origin is required"),
  stateOfResidence: z.string().min(1, "State of residence is required"),
  email: z.email("Invalid email address").min(1, "Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*]/,
      "Password must contain at least one special character"
    ),
  agreeToTerms: z
    .boolean()
    .refine((val) => val === true, "You must agree to the terms"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  nationality: z.string().optional(),
  signature: z.string().optional(),
});

export type RegisterFormValues = z.infer<typeof RegisterSchema>;

export const AccountCredentialsSchema = z.object({
  stateOfOrigin: z.string().min(1, "State of origin is required"),
  stateOfResidence: z.string().min(1, "State of residence is required"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  email: z.email("Invalid email address").min(1, "Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*]/,
      "Password must contain at least one special character"
    ),
  agreeToTerms: z
    .boolean()
    .refine((val) => val === true, "You must agree to the terms"),
});

export type AccountCredentialsFormValues = z.infer<
  typeof AccountCredentialsSchema
>;

export const ForgotPasswordSchema = z.object({
  email: z.email("Invalid email address").min(1, "Email is required"),
});

export type ForgotPasswordFormValues = z.infer<typeof ForgotPasswordSchema>;
