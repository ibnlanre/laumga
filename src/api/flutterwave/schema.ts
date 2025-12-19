import { isoDateTimeString } from "@/schema/date";
import { z } from "zod";

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
