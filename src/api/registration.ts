import { z } from "zod/v4";

/**
 * Step 1: Personal Details Schema
 */
export const personalDetailsSchema = z.object({
  title: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  middleName: z.string().optional(),
  maidenName: z.string().optional(),
  nickname: z.string().optional(),
  gender: z.enum(["male", "female"], { message: "Gender is required" }),
  profilePictureUrl: z.string().optional(),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  classSet: z.string().nullable(),
});

export type PersonalDetailsFormValues = z.infer<typeof personalDetailsSchema>;

/**
 * Step 2: Location Schema
 */
export const locationDetailsSchema = z.object({
  countryOfOrigin: z.string().min(1, "Country of origin is required"),
  stateOfOrigin: z.string().min(1, "State of origin is required"),
  countryOfResidence: z.string().min(1, "Country of residence is required"),
  stateOfResidence: z.string().min(1, "State/Region of residence is required"),
  address: z.string().min(10, "Address must be at least 10 characters"),
});

export type LocationDetailsFormValues = z.infer<typeof locationDetailsSchema>;

/**
 * Step 3: Account Credentials Schema
 */
export const accountCredentialsSchema = z.object({
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
});

export type AccountCredentialsFormValues = z.infer<
  typeof accountCredentialsSchema
>;

/**
 * Complete Registration Data
 * Combines all steps for final submission
 */
export const registrationSchema = personalDetailsSchema
  .extend(locationDetailsSchema.shape)
  .extend(accountCredentialsSchema.shape);

export type RegistrationFormValues = z.infer<typeof registrationSchema>;
