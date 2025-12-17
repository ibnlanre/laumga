import type { z } from "zod";

import {
  flutterwaveBankSchema,
  flutterwaveMandateConsentSchema,
  flutterwaveSplitChargeSchema,
  flutterwaveTokenLifecycleStatusSchema,
  flutterwaveTokenStatusDataSchema,
  flutterwaveTokenStatusResponseSchema,
  flutterwaveTokenizeDataSchema,
  flutterwaveTokenizeRequestSchema,
  flutterwaveTokenizeResponseSchema,
  flutterwaveTokenizedChargeCustomerSchema,
  flutterwaveTokenizedChargeDataSchema,
  flutterwaveTokenizedChargeRequestSchema,
  flutterwaveTokenizedChargeResponseSchema,
  flutterwaveTokenUpdateRequestSchema,
  flutterwaveTokenUpdateResponseSchema,
} from "./schema";

export type FlutterwaveBank = z.infer<typeof flutterwaveBankSchema>;
export type FlutterwaveMandateConsent = z.infer<
  typeof flutterwaveMandateConsentSchema
>;
export type FlutterwaveTokenizeRequest = z.infer<
  typeof flutterwaveTokenizeRequestSchema
>;
export type FlutterwaveTokenizeData = z.infer<
  typeof flutterwaveTokenizeDataSchema
>;
export type FlutterwaveTokenizeResponse = z.infer<
  typeof flutterwaveTokenizeResponseSchema
>;

export type FlutterwaveTokenLifecycleStatus = z.infer<
  typeof flutterwaveTokenLifecycleStatusSchema
>;
export type FlutterwaveTokenStatus = z.infer<
  typeof flutterwaveTokenStatusDataSchema
>;
export type FlutterwaveTokenStatusResponse = z.infer<
  typeof flutterwaveTokenStatusResponseSchema
>;
export type FlutterwaveTokenUpdateRequest = z.infer<
  typeof flutterwaveTokenUpdateRequestSchema
>;
export type FlutterwaveTokenUpdateResponse = z.infer<
  typeof flutterwaveTokenUpdateResponseSchema
>;

export type FlutterwaveSplitCharge = z.infer<
  typeof flutterwaveSplitChargeSchema
>;
export type FlutterwaveTokenizedChargeRequest = z.infer<
  typeof flutterwaveTokenizedChargeRequestSchema
>;
export type FlutterwaveTokenizedChargeData = z.infer<
  typeof flutterwaveTokenizedChargeDataSchema
>;
export type FlutterwaveTokenizedChargeResponse = z.infer<
  typeof flutterwaveTokenizedChargeResponseSchema
>;
export type FlutterwaveTokenizedChargeCustomer = z.infer<
  typeof flutterwaveTokenizedChargeCustomerSchema
>;
