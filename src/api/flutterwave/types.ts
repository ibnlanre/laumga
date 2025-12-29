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
  flutterwaveStatusSchema,
  flutterwaveTransactionSchema,
  flutterwaveTransactionResponseSchema,
  flutterwavePlanCheckoutRequestSchema,
  flutterwavePlanCheckoutResponseSchema,
  flutterwavePaymentPlanCreateRequestSchema,
  flutterwavePaymentPlanCreateResponseSchema,
  flutterwavePaymentPlanListResponseSchema,
  flutterwavePaymentPlanSchema,
  flutterwaveSubscriptionCustomerSchema,
  flutterwaveSubscriptionListResponseSchema,
  flutterwaveTransactionVerifyResponseSchema,
  flutterwaveSubscriptionPlanSchema,
  flutterwaveSubscriptionSchema,
} from "./schema";

export type FlutterwaveErrorResponse = {
  status: "error";
  message: string;
  data: null;
};

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

export type FlutterwaveTransaction = z.infer<
  typeof flutterwaveTransactionSchema
>;
export type FlutterwaveTransactionResponse = z.infer<
  typeof flutterwaveTransactionResponseSchema
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

export type FlutterwaveStatus = z.infer<typeof flutterwaveStatusSchema>;

export type FlutterwavePlanCheckoutRequest = z.infer<
  typeof flutterwavePlanCheckoutRequestSchema
>;
export type FlutterwavePlanCheckoutResponse = z.infer<
  typeof flutterwavePlanCheckoutResponseSchema
>;
export type FlutterwavePaymentPlan = z.infer<
  typeof flutterwavePaymentPlanSchema
>;
export type FlutterwavePaymentPlanListResponse = z.infer<
  typeof flutterwavePaymentPlanListResponseSchema
>;
export type FlutterwavePaymentPlanCreateRequest = z.infer<
  typeof flutterwavePaymentPlanCreateRequestSchema
>;
export type FlutterwavePaymentPlanCreateResponse = z.infer<
  typeof flutterwavePaymentPlanCreateResponseSchema
>;
export type FlutterwaveSubscription = z.infer<
  typeof flutterwaveSubscriptionSchema
>;
export type FlutterwaveSubscriptionPlan = z.infer<
  typeof flutterwaveSubscriptionPlanSchema
>;
export type FlutterwaveSubscriptionCustomer = z.infer<
  typeof flutterwaveSubscriptionCustomerSchema
>;
export type FlutterwaveSubscriptionListResponse = z.infer<
  typeof flutterwaveSubscriptionListResponseSchema
>;

export type FlutterwaveTransactionVerifyResponse = z.infer<
  typeof flutterwaveTransactionVerifyResponseSchema
>;
