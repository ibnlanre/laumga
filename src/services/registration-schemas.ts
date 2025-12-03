import { z } from "zod/v4";

/**
 * Step 1: Personal Details Schema
 */
export const PersonalDetailsSchema = z.object({
  title: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  middleName: z.string().optional(),
  gender: z.enum(["male", "female"], { message: "Gender is required" }),
  passportUrl: z.string().min(1, "Passport photo is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  nationality: z.string().optional().default("Nigerian"),
});

export type PersonalDetailsFormValues = z.infer<typeof PersonalDetailsSchema>;

/**
 * Step 2: Location & Account Credentials Schema
 * (Already exists as AccountCredentialsSchema in validation.ts)
 */
export const LocationAccountSchema = z.object({
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

export type LocationAccountFormValues = z.infer<typeof LocationAccountSchema>;

/**
 * Step 3: Review & Signature Schema
 */
export const ReviewSubmitSchema = z.object({
  signature: z.string().min(1, "Signature is required"),
});

export type ReviewSubmitFormValues = z.infer<typeof ReviewSubmitSchema>;

/**
 * Complete Registration Data
 * Combines all steps for final submission
 */
export const CompleteRegistrationSchema = PersonalDetailsSchema.extend(
  LocationAccountSchema.shape
).extend(ReviewSubmitSchema.shape);

// export const CompleteRegistrationSchema = z.object({
//   ...PersonalDetailsSchema.shape,
//   ...LocationAccountSchema.shape,
//   ...ReviewSubmitSchema.shape,
// });

export type CompleteRegistrationData = z.infer<
  typeof CompleteRegistrationSchema
>;
