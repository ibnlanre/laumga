import { z } from "zod";

import { dateSchema, fieldValueSchema } from "@/schema/date";

export const PAYMENT_PARTNERS_COLLECTION = "paymentPartners";

export const allocationTypeSchema = z.enum(["percentage", "fixed"]);
export const feeBearerSchema = z.enum(["business", "sub_accounts"]);

const accountNumberSchema = z
  .string()
  .min(10, "Account number must be at least 10 digits");

export const paymentPartnerFormSchema = z
  .object({
    name: z.string().min(1, "Partner name is required"),
    accountNumber: accountNumberSchema,
    nipCode: z.string().min(1, "NIP code is required"),
    allocationType: allocationTypeSchema,
    allocationValue: z.number().positive(),
    allocationMax: z.number().positive().nullable().default(null),
    feeBearer: feeBearerSchema.default("business"),
    isActive: z.boolean().default(true),
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

export const paymentPartnerDataSchema = paymentPartnerFormSchema.extend({
  bankName: z.string().min(1, "Bank name is required"),
  monoSubAccountId: z.string().min(1, "Mono sub-account ID is required"),
  bankCode: z.string().min(1, "Bank code is required"),
  created: dateSchema,
  updated: dateSchema,
});

export const createPaymentPartnerSchema = paymentPartnerDataSchema.extend({
  created: fieldValueSchema,
  updated: fieldValueSchema,
});

export const updatePaymentPartnerSchema = createPaymentPartnerSchema.partial();

export const paymentPartnerSchema = paymentPartnerDataSchema.extend({
  id: z.string(),
});
