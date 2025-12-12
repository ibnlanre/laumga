import { z } from "zod";

export const monoCustomerFormSchema = z.object({
  type: z.enum(["individual", "business"]).default("individual"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email("Enter a valid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z
    .string()
    .min(10, "Address must be at least 10 characters")
    .max(100, "Address cannot exceed 100 characters"),
  bvn: z.string().length(11, "BVN must be 11 digits"),
});
