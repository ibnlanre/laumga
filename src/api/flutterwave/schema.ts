import { isoDateTimeString } from "@/schema/date";
import { z } from "zod";
import { mandateFrequencySchema } from "../mandate/schema";

export const flutterwaveBankSchema = z.object({
  label: z.string(),
  value: z.string(),
  code: z.string(),
});

export const flutterwaveMandateConsentSchema = z.object({
  bank_name: z.string(),
  account_name: z.string(),
  account_number: z.string(),
  amount: z.union([z.number(), z.string()]),
});

export const flutterwaveTokenizeRequestSchema = z.object({
  email: z.email(),
  amount: z.number().positive(),
  address: z.string().min(1),
  phone_number: z.string().min(8),
  account_bank: z.string().min(3),
  account_number: z.string().min(10).max(10),
  start_date: isoDateTimeString,
  end_date: isoDateTimeString.nullable(),
  narration: z.string().optional(),
});

export const flutterwaveStatusSchema = z.enum([
  "PENDING",
  "APPROVED",
  "ACTIVE",
  "SUSPENDED",
  "DELETED",
]);

export const flutterwaveTokenizeDataSchema = z.object({
  status: flutterwaveStatusSchema,
  amount: z.number(),
  address: z.string().nullable(),
  narration: z.string().nullable(),
  account_id: z.union([z.number(), z.string()]),
  currency: z.string(),
  end_date: isoDateTimeString,
  customer_id: z.union([z.number(), z.string()]),
  start_date: isoDateTimeString,
  reference: z.string(),
  updated_at: isoDateTimeString,
  created_at: isoDateTimeString,
  processor_code: z.string().nullable(),
  processor_response: z.string().nullable(),
  mandate_consent: flutterwaveMandateConsentSchema.nullable(),
});

export const flutterwaveTokenizeResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: flutterwaveTokenizeDataSchema,
});

export const flutterwaveTokenLifecycleStatusSchema = z.enum([
  "PENDING",
  "APPROVED",
  "ACTIVE",
  "SUSPENDED",
  "DELETED",
]);

export const flutterwaveTokenStatusDataSchema = z.object({
  token: z.string().nullable(),
  reference: z.string(),
  status: flutterwaveTokenLifecycleStatusSchema,
  start_date: isoDateTimeString,
  end_date: isoDateTimeString.nullable(),
  amount: z.number(),
  currency: z.string(),
  address: z.string().nullable(),
  narration: z.string().nullable(),
  processor_code: z.string().nullable(),
  processor_response: z.string().nullable(),
  active_on: isoDateTimeString.nullable(),
  created_at: isoDateTimeString,
  updated_at: isoDateTimeString,
  account_id: z.union([z.number(), z.string()]),
  customer_id: z.union([z.number(), z.string()]),
});

export const flutterwaveTokenStatusResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: flutterwaveTokenStatusDataSchema,
});

export const flutterwaveTokenStatusSchema = z.enum([
  "ACTIVE",
  "SUSPENDED",
  "DELETED",
]);

export const flutterwaveTransactionMetaSchema = z.object({
  __CheckoutInitAddress: z.string().optional(),
  __FingerprintConfidenceScore: z.union([z.string(), z.number()]).optional(),
  userId: z.string().optional(),
  cadence: mandateFrequencySchema,
  amount: z.union([z.string(), z.number()]).optional(),
  paymentPlanId: z.union([z.number(), z.string()]).nullable(),
  platform: z.string().optional(),
  subaccount_split: z.string().optional(),
});

export const flutterwaveTransactionSchema = z.object({
  id: z.number(),
  tx_ref: z.string(),
  flw_ref: z.string(),
  device_fingerprint: z.string().nullable(),
  amount: z.number(),
  currency: z.string(),
  charged_amount: z.number(),
  app_fee: z.number(),
  merchant_fee: z.number(),
  processor_response: z.string(),
  auth_model: z.string(),
  ip: z.string(),
  narration: z.string(),
  status: z.string(),
  payment_type: z.string(),
  created_at: isoDateTimeString,
  account_id: z.number(),
  card: z
    .object({
      first_6digits: z.string(),
      last_4digits: z.string(),
      issuer: z.string(),
      country: z.string(),
      type: z.string(),
      token: z.string(),
      expiry: z.string(),
    })
    .optional(),
  meta: flutterwaveTransactionMetaSchema,
  amount_settled: z.number(),
  customer: z.object({
    id: z.number(),
    name: z.string(),
    phone_number: z.string().nullable(),
    email: z.string(),
    created_at: isoDateTimeString,
  }),
});

export const flutterwaveTransactionResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  meta: z.object({
    page_info: z.object({
      total: z.number(),
      current_page: z.number(),
      total_pages: z.number(),
    }),
  }),
  data: z.array(flutterwaveTransactionSchema),
});

export const flutterwaveTokenUpdateRequestSchema = z.object({
  status: flutterwaveTokenStatusSchema,
});

export const flutterwaveTokenUpdateResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: flutterwaveTokenStatusDataSchema.extend({
    response_code: z.string().nullable(),
    response_message: z.string().nullable(),
  }),
});

export const flutterwaveTokenizedChargeCustomerSchema = z.object({
  id: z.union([z.number(), z.string()]),
  phone_number: z.string().nullable(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  created_at: isoDateTimeString.nullable(),
});

export const flutterwaveSplitChargeSchema = z.object({
  id: z.string(),
  transaction_charge_type: z
    .enum(["flat", "flat_subaccount", "percentage"])
    .optional(),
  transaction_charge: z.number().optional(),
  transaction_split_ratio: z.number().optional(),
});

export const flutterwaveTokenizedChargeRequestSchema = z.object({
  token: z.string(),
  email: z.email(),
  amount: z.number().positive(),
  tx_ref: z.string(),
  type: z.literal("account"),
  narration: z.string().optional(),
  currency: z.string().default("NGN"),
  subaccounts: z.array(flutterwaveSplitChargeSchema).optional(),
});

export const flutterwaveTokenizedChargeDataSchema = z.object({
  id: z.number(),
  tx_ref: z.string(),
  flw_ref: z.string().nullable(),
  redirect_url: z.string().nullable(),
  device_fingerprint: z.string().nullable(),
  amount: z.number(),
  charged_amount: z.number().nullable(),
  app_fee: z.number().nullable(),
  merchant_fee: z.number().nullable(),
  processor_response: z.string(),
  auth_model: z.string().nullable(),
  currency: z.string(),
  ip: z.string().nullable(),
  narration: z.string().nullable(),
  status: z.string(),
  payment_type: z.string().nullable(),
  created_at: isoDateTimeString,
  account_id: z.union([z.number(), z.string()]),
  customer: flutterwaveTokenizedChargeCustomerSchema.nullable(),
});

export const flutterwaveTokenizedChargeResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: flutterwaveTokenizedChargeDataSchema,
});

export const flutterwavePlanCheckoutCustomerSchema = z.object({
  email: z.email(),
  name: z.string().min(1),
  phoneNumber: z.string().optional().nullable(),
});

export const flutterwavePlanCheckoutCustomizationSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  logo: z.url().optional(),
});

export const flutterwavePlanCheckoutRequestSchema = z.object({
  txRef: z.string(),
  amount: z.number().positive(),
  currency: z.string().default("NGN"),
  redirectUrl: z.url().optional(),
  paymentPlanId: z.number().nullable().default(null),
  customer: flutterwavePlanCheckoutCustomerSchema,
  customizations: flutterwavePlanCheckoutCustomizationSchema.optional(),
  meta: flutterwaveTransactionMetaSchema,
  paymentOptions: z.string().optional().default("card"),
});

export const flutterwavePlanCheckoutResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.object({
    link: z.url(),
  }),
});

export const flutterwavePaymentPlanSchema = z.object({
  id: z.number(),
  name: z.string(),
  amount: z.number().nullable(),
  interval: z.string(),
  duration: z.number().nullable().optional(),
  status: z.string(),
  currency: z.string(),
  plan_token: z.string().nullable().optional(),
  created_at: isoDateTimeString,
  updated_at: isoDateTimeString.nullable().optional(),
});

export const flutterwavePaymentPlanListResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.array(flutterwavePaymentPlanSchema),
  meta: z
    .object({
      page_info: z.object({
        total: z.number(),
        current_page: z.number(),
        total_pages: z.number(),
      }),
    })
    .optional(),
});

export const flutterwavePaymentPlanCreateRequestSchema = z.object({
  name: z.string().min(1),
  interval: z.string().min(1),
  amount: z.number().positive().optional(),
  currency: z.string().default("NGN"),
  duration: z.number().int().positive().optional(),
});

export const flutterwavePaymentPlanCreateResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: flutterwavePaymentPlanSchema,
});

export const flutterwaveSubscriptionCustomerSchema = z.object({
  id: z.union([z.number(), z.string()]).nullable().optional(),
  customer_email: z.email().nullable().optional(),
});

export const flutterwaveSubscriptionPlanSchema = z.object({
  id: z.number(),
  name: z.string(),
  amount: z.number().nullable().optional(),
  interval: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  currency: z.string().nullable().optional(),
});

export const flutterwaveSubscriptionSchema = z.object({
  id: z.number(),
  amount: z.number(),
  status: z.string(),
  created_at: isoDateTimeString,
  plan: z.number(),
  customer: flutterwaveSubscriptionCustomerSchema,
});

export const flutterwaveSubscriptionListResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.array(flutterwaveSubscriptionSchema),
  meta: z
    .object({
      page_info: z.object({
        total: z.number(),
        current_page: z.number(),
        total_pages: z.number(),
      }),
    })
    .optional(),
});

export const flutterwaveTransactionVerifyDataSchema = z.object({
  id: z.number(),
  tx_ref: z.string(),
  flw_ref: z.string(),
  device_fingerprint: z.string().nullable(),
  amount: z.number(),
  currency: z.string(),
  charged_amount: z.number(),
  app_fee: z.number(),
  merchant_fee: z.number(),
  processor_response: z.string(),
  auth_model: z.string(),
  ip: z.string(),
  narration: z.string(),
  status: z.string(),
  payment_type: z.string(),
  created_at: isoDateTimeString,
  account_id: z.number(),
  card: z
    .object({
      first_6digits: z.string(),
      last_4digits: z.string(),
      issuer: z.string(),
      country: z.string(),
      type: z.string(),
      token: z.string(),
      expiry: z.string(),
    })
    .optional(),
  meta: flutterwaveTransactionMetaSchema,
  plan: z.number().optional(),
  amount_settled: z.number(),
  customer: z.object({
    id: z.number(),
    email: z.email(),
    name: z.string(),
    phone_number: z.string().nullable(),
    created_at: isoDateTimeString,
  }),
});

export const flutterwaveTransactionVerifyResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: flutterwaveTransactionVerifyDataSchema,
});
