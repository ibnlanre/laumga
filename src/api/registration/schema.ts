import { z } from "zod/v4";
import { formatDate } from "@/utils/date";
import { passwordSchema } from "@/schema/password";

export const personalDetailsSchema = z.object({
  title: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  middleName: z.string().optional().default(""),
  maidenName: z.string().optional().default(""),
  nickname: z.string().optional().default(""),
  gender: z.enum(["male", "female"], { message: "Gender is required" }),
  photoUrl: z.string().nullable().default(null),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  classSet: z
    .string()
    .min(4, "Class set is required")
    .nullable()
    .default(null)
    .transform((value) => {
      if (!value) return null;
      return formatDate(value, "yyyy");
    }),
});

export const locationDetailsSchema = z.object({
  countryOfOrigin: z.string().min(1, "Country of origin is required"),
  stateOfOrigin: z.string().min(1, "State of origin is required"),
  countryOfResidence: z.string().min(1, "Country of residence is required"),
  stateOfResidence: z.string().min(1, "State/Region of residence is required"),
  address: z.string().min(10, "Address must be at least 10 characters"),
});

export const accountCredentialsSchema = z.object({
  email: z.email("Invalid email address").min(1, "Email is required"),
  password: passwordSchema,
});

export const registrationSchema = personalDetailsSchema
  .extend(locationDetailsSchema.shape)
  .extend(accountCredentialsSchema.shape);
