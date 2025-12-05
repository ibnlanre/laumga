/**
 * Mono API Integration
 * Handles Direct Debit mandates and split payments
 */

import { z } from "zod/v4";
import axios from "axios";

const MONO_API_URL = "https://api.withmono.com";
const MONO_PUBLIC_KEY = import.meta.env.VITE_MONO_PUBLIC_KEY;
const MONO_SECRET_KEY = import.meta.env.VITE_MONO_SECRET_KEY;

const monoClient = axios.create({
  baseURL: MONO_API_URL,
  headers: {
    "Content-Type": "application/json",
    "mono-sec-key": MONO_SECRET_KEY || "",
  },
});

const PLATFORM_FEE = 50_00; // ₦50 fixed fee in kobo

/**
 * Mono Customer Schema
 */
export const monoCustomerSchema = z.object({
  email: z.email(),
  type: z.enum(["individual", "business"]).optional(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  address: z.string().min(1).max(100),
  phone: z.string().min(1),
  identity: z.object({
    type: z.literal("bvn"),
    number: z.string().length(11),
  }),
});

export type MonoCustomerInput = z.infer<typeof monoCustomerSchema>;

/**
 * Mono Mandate Initiation Schema
 */
export const monoMandateSchema = z.object({
  amount: z.number().min(20000), // Minimum ₦200 in kobo
  type: z.literal("recurring-debit"),
  method: z.literal("mandate"),
  mandate_type: z.enum(["emandate", "signed", "gsm"]),
  debit_type: z.enum(["variable", "fixed"]),
  description: z.string().min(1),
  reference: z.string().min(10),
  customer: z.object({
    id: z.string(),
  }),
  redirect_url: z.url().optional(),
  start_date: z.string(), // YYYY-MM-DD
  end_date: z.string(), // YYYY-MM-DD
  split: z
    .object({
      type: z.enum(["percentage", "fixed"]),
      fee_bearer: z.enum(["business", "sub_accounts"]),
      distribution: z.array(
        z.object({
          account: z.string(),
          value: z.number(),
          max: z.number().optional(),
        })
      ),
    })
    .optional(),
  meta: z.record(z.string(), z.any()).optional(),
});

export type MonoMandateInput = z.infer<typeof monoMandateSchema>;

/**
 * Mono Debit Schema
 */
export const monoDebitSchema = z.object({
  amount: z.number().min(20000),
  reference: z.string().min(10),
  narration: z.string().min(1),
  split: z
    .object({
      type: z.enum(["fixed"]),
      fee_bearer: z.literal("business"),
      distribution: z.array(
        z.object({
          account: z.string(),
          value: z.number(),
        })
      ),
    })
    .optional(),
});

export type MonoDebitInput = z.infer<typeof monoDebitSchema>;

/**
 * Mono API Response Schemas
 */
export const monoCustomerResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.object({
    id: z.string(),
    name: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    email: z.string(),
    phone: z.string(),
    address: z.string(),
    identification_no: z.string(),
    identification_type: z.string(),
    bvn: z.string(),
  }),
});

export type MonoCustomerResponse = z.infer<typeof monoCustomerResponseSchema>;

export const monoMandateResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.object({
    mono_url: z.string(),
    mandate_id: z.string(),
    type: z.string(),
    method: z.string(),
    mandate_type: z.string(),
    amount: z.number(),
    description: z.string(),
    reference: z.string(),
    customer: z.string(),
    redirect_url: z.string().optional(),
    created_at: z.string(),
    updated_at: z.string(),
    start_date: z.string(),
    end_date: z.string(),
  }),
});

export type MonoMandateResponse = z.infer<typeof monoMandateResponseSchema>;

export const monoMandateDetailsResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.object({
    id: z.string(),
    status: z.enum(["initiated", "approved", "rejected", "cancelled"]),
    reference: z.string(),
    amount: z.number(),
    balance: z.number(),
    mandate_type: z.string(),
    debit_type: z.string(),
    account_name: z.string(),
    account_number: z.string(),
    live_mode: z.boolean(),
    approved: z.boolean(),
    ready_to_debit: z.boolean(),
    nibss_code: z.string(),
    institution: z.object({
      bank_code: z.string(),
      nip_code: z.string(),
      name: z.string(),
    }),
    customer: z.string(),
    narration: z.string(),
    start_date: z.string(),
    end_date: z.string(),
    date: z.string(),
  }),
});

export type MonoMandateDetailsResponse = z.infer<
  typeof monoMandateDetailsResponseSchema
>;

export const monoDebitResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  response_code: z.string(),
  data: z.object({
    success: z.boolean(),
    status: z.enum(["successful", "failed", "processing"]),
    event: z.string(),
    amount: z.number(),
    mandate: z.string(),
    reference_number: z.string(),
    date: z.string(),
    live_mode: z.boolean(),
    account_details: z.object({
      bank_code: z.string(),
      account_name: z.string(),
      account_number: z.string(),
      bank_name: z.string(),
    }),
    beneficiary: z.object({
      bank_code: z.string(),
      account_name: z.string(),
      account_number: z.string(),
      bank_name: z.string(),
    }),
    split: z
      .object({
        type: z.string(),
        fee_bearer: z.string(),
        distribution: z.array(
          z.object({
            account: z.string(),
            value: z.number(),
          })
        ),
      })
      .optional(),
  }),
});

export type MonoDebitResponse = z.infer<typeof monoDebitResponseSchema>;

export const monoSubAccountResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.object({
    id: z.string(),
    name: z.string(),
    account_number: z.string(),
    nip_code: z.string(),
    bank_code: z.string(),
  }),
});

export type MonoSubAccountResponse = z.infer<
  typeof monoSubAccountResponseSchema
>;

export const monoBankListResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.object({
    banks: z.array(
      z.object({
        name: z.string(),
        bank_code: z.string(),
        nip_code: z.string(),
        direct_debit: z.boolean(),
      })
    ),
  }),
});

export type MonoBankListResponse = z.infer<typeof monoBankListResponseSchema>;

export const monoPaymentVerifyResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.object({
    id: z.string(),
    status: z.string(),
    amount: z.number(),
    reference: z.string(),
    split: z.any().optional(),
  }),
});

export type MonoPaymentVerifyResponse = z.infer<
  typeof monoPaymentVerifyResponseSchema
>;

/**
 * Response type for mandate status operations (pause, cancel, reinstate)
 */
export interface MonoStatusResponse {
  status: string;
  message: string;
  data: null | Record<string, any>;
}

/**
 * Response type for fetching all sub-accounts
 */
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

/**
 * Mono API Error
 */
export class MonoError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: any
  ) {
    super(message);
    this.name = "MonoError";
  }
}

function calculatePlatformFee(totalAmount: number): {
  platformFee: number;
  clientAmount: number;
} {
  return {
    platformFee: PLATFORM_FEE,
    clientAmount: totalAmount - PLATFORM_FEE,
  };
}

function createSplitConfiguration(
  totalAmount: number,
  clientSubAccountId: string,
  platformSubAccountId: string
) {
  const { clientAmount, platformFee } = calculatePlatformFee(totalAmount);

  return {
    type: "fixed" as const,
    fee_bearer: "business" as const,
    distribution: [
      {
        account: clientSubAccountId,
        value: clientAmount,
      },
      {
        account: platformSubAccountId,
        value: platformFee,
      },
    ],
  };
}

/**
 * Mono API Client
 */
export const mono = {
  /**
   * Create a Mono customer
   */
  customer: {
    create: async (data: MonoCustomerInput) => {
      const response = await monoClient.post<MonoCustomerResponse>(
        "/v2/customers",
        data
      );
      return response.data;
    },

    fetch: async (customerId: string) => {
      const response = await monoClient.get<MonoCustomerResponse>(
        `/v2/customers/${customerId}`
      );
      return response.data;
    },
  },

  /**
   * Manage Mono mandates
   */
  mandate: {
    /**
     * Initiate a new mandate with split payment
     */
    initiate: async (
      data: MonoMandateInput,
      clientSubAccountId: string,
      platformSubAccountId: string
    ) => {
      const mandateData = {
        ...data,
        split: createSplitConfiguration(
          data.amount,
          clientSubAccountId,
          platformSubAccountId
        ),
      };

      const response = await monoClient.post<MonoMandateResponse>(
        "/v2/payments/initiate",
        mandateData
      );
      return response.data;
    },

    /**
     * Retrieve mandate details
     */
    fetch: async (mandateId: string) => {
      const response = await monoClient.get<MonoMandateDetailsResponse>(
        `/v3/payments/mandates/${mandateId}`
      );
      return response.data;
    },

    /**
     * Cancel a mandate
     */
    cancel: async (mandateId: string) => {
      const response = await monoClient.patch<MonoStatusResponse>(
        `/v3/payments/mandates/${mandateId}/cancel`
      );
      return response.data;
    },

    /**
     * Pause a mandate
     */
    pause: async (mandateId: string) => {
      const response = await monoClient.patch<MonoStatusResponse>(
        `/v3/payments/mandates/${mandateId}/pause`
      );
      return response.data;
    },

    /**
     * Reinstate a paused mandate
     */
    reinstate: async (mandateId: string) => {
      const response = await monoClient.patch<MonoStatusResponse>(
        `/v3/payments/mandates/${mandateId}/reinstate`
      );
      return response.data;
    },

    /**
     * Debit a mandate with split payment
     */
    debit: async (
      mandateId: string,
      data: MonoDebitInput,
      clientSubAccountId: string,
      platformSubAccountId: string
    ) => {
      const debitData = {
        ...data,
        split: createSplitConfiguration(
          data.amount,
          clientSubAccountId,
          platformSubAccountId
        ),
      };

      const response = await monoClient.post<MonoDebitResponse>(
        `/v3/payments/mandates/${mandateId}/debit`,
        debitData
      );
      return response.data;
    },
  },

  /**
   * Fetch banks
   */
  bank: {
    /**
     * Get list of all banks supporting Direct Debit
     */
    fetchAll: async () => {
      const response =
        await monoClient.get<MonoBankListResponse>("/v3/banks/list");
      const data = response.data;

      if (data.status !== "successful" || !data.data?.banks) {
        throw new MonoError("Failed to fetch banks");
      }

      return data.data.banks
        .filter((bank) => bank.direct_debit)
        .map((bank) => ({
          value: bank.nip_code,
          label: bank.name,
          bankCode: bank.bank_code,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));
    },
  },

  /**
   * Manage sub-accounts
   */
  subAccount: {
    /**
     * Create a sub-account for split payments
     */
    create: async (nipCode: string, accountNumber: string) => {
      const response = await monoClient.post<MonoSubAccountResponse>(
        "/v2/payments/payout/sub-account",
        {
          nip_code: nipCode,
          account_number: accountNumber,
        }
      );
      return response.data;
    },

    /**
     * Fetch all sub-accounts
     */
    fetchAll: async () => {
      const response = await monoClient.get<MonoSubAccountsListResponse>(
        "/v2/payments/payout/sub-accounts"
      );
      return response.data;
    },
  },

  /**
   * Payment verification
   */
  payment: {
    verify: async (reference: string) => {
      const response = await monoClient.get<MonoPaymentVerifyResponse>(
        `/v2/payments/verify/${reference}`
      );
      return response.data;
    },
  },
};

export { MONO_PUBLIC_KEY, MONO_SECRET_KEY };
