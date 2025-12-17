import { z } from "zod";

import { dateSchema, fieldValueSchema } from "@/schema/date";

export const PAYMENT_PARTNERS_COLLECTION = "paymentPartners";

export const allocationTypeSchema = z.enum(["percentage", "fixed"]);
export const feeBearerSchema = z.enum(["business", "sub_accounts"]);

const accountNumberSchema = z
  .string()
  .min(10, "Account number must be at least 10 digits");

export const paymentPartnerBaseSchema = z.object({
  name: z.string().min(1, "Partner name is required"),
  accountNumber: accountNumberSchema,
  nipCode: z.string().min(1, "Bank selection is required"),
  bankName: z.string().min(1, "Bank name is required"),
  allocationType: allocationTypeSchema,
  allocationValue: z.number().positive(),
  allocationMax: z.number().positive().nullable().default(null),
  feeBearer: feeBearerSchema.default("business"),
  isActive: z.boolean().default(true),
});

const flutterwaveSubAccountField = z
  .string()
  .min(1, "Flutterwave sub-account ID is required");

export const paymentPartnerFormSchema = paymentPartnerBaseSchema
  .extend({
    flutterwaveSubAccountId: flutterwaveSubAccountField,
  })
  .refine(
    (data) => {
      if (data.allocationType === "percentage") {
        return data.allocationValue > 0;
      }
      return true;
    },
    {
      message: "Percentage allocation must be greater than 0",
      path: ["allocationValue"],
    }
  )
  .refine(
    (data) => {
      if (data.allocationType === "percentage") {
        return data.allocationValue < 100;
      }
      return true;
    },
    {
      message: "Percentage allocation must be less than 100",
      path: ["allocationValue"],
    }
  );

const paymentPartnerDataBaseSchema = paymentPartnerBaseSchema.safeExtend({
  flutterwaveSubAccountId: z.string().nullable().default(null),
});

export const paymentPartnerDataSchema = paymentPartnerDataBaseSchema.safeExtend({
  created: dateSchema,
  updated: dateSchema,
});

export const createPaymentPartnerSchema = paymentPartnerFormSchema.safeExtend({
  created: fieldValueSchema,
  updated: fieldValueSchema,
});

export const updatePaymentPartnerSchema = createPaymentPartnerSchema.partial();

export const paymentPartnerSchema = paymentPartnerDataSchema.safeExtend({
  id: z.string(),
});
