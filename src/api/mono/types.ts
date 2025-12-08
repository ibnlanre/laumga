import type z from "zod";
import {
  monoCustomerSchema,
  monoMandateSchema,
  monoDebitSchema,
  monoCustomerResponseSchema,
  monoMandateResponseSchema,
  monoMandateDetailsResponseSchema,
  monoDebitResponseSchema,
  monoSubAccountResponseSchema,
  monoBankListResponseSchema,
  monoPaymentVerifyResponseSchema,
  monoSplitEntrySchema,
  monoSplitConfigurationSchema,
} from "./schema";

export type MonoCustomerInput = z.infer<typeof monoCustomerSchema>;

export type MonoSplitEntry = z.infer<typeof monoSplitEntrySchema>;
export type MonoSplitConfiguration = z.infer<
  typeof monoSplitConfigurationSchema
>;

export type MonoMandateInput = z.infer<typeof monoMandateSchema>;

export type MonoDebitInput = z.infer<typeof monoDebitSchema>;

export type MonoCustomerResponse = z.infer<typeof monoCustomerResponseSchema>;

export type MonoMandateResponse = z.infer<typeof monoMandateResponseSchema>;

export type MonoMandateDetailsResponse = z.infer<
  typeof monoMandateDetailsResponseSchema
>;

export type MonoDebitResponse = z.infer<typeof monoDebitResponseSchema>;

export type MonoSubAccountResponse = z.infer<
  typeof monoSubAccountResponseSchema
>;

export type MonoBankListResponse = z.infer<typeof monoBankListResponseSchema>;

export type MonoPaymentVerifyResponse = z.infer<
  typeof monoPaymentVerifyResponseSchema
>;

export interface MonoStatusResponse {
  status: string;
  message: string;
  data: null | Record<string, any>;
}

export interface MonoSubAccountsListResponse {
  status: string;
  message: string;
  data: Array<{
    id: string;
    account_number: string;
    status: string;
    name: string;
    category: string;
    bank_name: string;
    bank_code: string;
    nibss_code: string;
    created_at: string;
    updated_at: string;
  }>;
}

export interface SupportedBank {
  value: string; // nip_code for API
  label: string; // bank name for display
  bankCode: string; // bank_code
}
