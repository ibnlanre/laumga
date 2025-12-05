/**
 * Mono API Integration
 * Handles Direct Debit mandates and split payments
 */

import { z } from "zod/v4";

const MONO_API_URL = "https://api.withmono.com";
const MONO_SECRET_KEY = import.meta.env.VITE_MONO_SECRET_KEY;

// Platform fee configuration
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
 * Mono API Response Types
 */
export interface MonoCustomerResponse {
  status: string;
  message: string;
  data: {
    id: string;
    name: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    identification_no: string;
    identification_type: string;
    bvn: string;
  };
}

export interface MonoMandateResponse {
  status: string;
  message: string;
  data: {
    mono_url: string;
    mandate_id: string;
    type: string;
    method: string;
    mandate_type: string;
    amount: number;
    description: string;
    reference: string;
    customer: string;
    redirect_url?: string;
    created_at: string;
    updated_at: string;
    start_date: string;
    end_date: string;
  };
}

export interface MonoMandateDetailsResponse {
  status: string;
  message: string;
  data: {
    id: string;
    status: "initiated" | "approved" | "rejected" | "cancelled";
    reference: string;
    amount: number;
    balance: number;
    mandate_type: string;
    debit_type: string;
    account_name: string;
    account_number: string;
    live_mode: boolean;
    approved: boolean;
    ready_to_debit: boolean;
    nibss_code: string;
    institution: {
      bank_code: string;
      nip_code: string;
      name: string;
    };
    customer: string;
    narration: string;
    start_date: string;
    end_date: string;
    date: string;
  };
}

export interface MonoDebitResponse {
  status: string;
  message: string;
  response_code: string;
  data: {
    success: boolean;
    status: "successful" | "failed" | "processing";
    event: string;
    amount: number;
    mandate: string;
    reference_number: string;
    date: string;
    live_mode: boolean;
    account_details: {
      bank_code: string;
      account_name: string;
      account_number: string;
      bank_name: string;
    };
    beneficiary: {
      bank_code: string;
      account_name: string;
      account_number: string;
      bank_name: string;
    };
    split?: {
      type: string;
      fee_bearer: string;
      distribution: Array<{
        account: string;
        value: number;
      }>;
    };
  };
}

export interface MonoSubAccountResponse {
  status: string;
  message: string;
  data: {
    id: string;
    name: string;
    account_number: string;
    nip_code: string;
    bank_code: string;
  };
}

export interface MonoBankListResponse {
  status: string;
  message: string;
  data: {
    banks: Array<{
      name: string;
      bank_code: string;
      nip_code: string;
      direct_debit: boolean;
    }>;
  };
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

/**
 * Make API request to Mono
 */
async function monoRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${MONO_API_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "mono-sec-key": MONO_SECRET_KEY || "",
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok || data.status === "failed") {
    throw new MonoError(
      data.message || "Mono API request failed",
      response.status,
      data
    );
  }

  return data;
}

/**
 * Utility: Calculate platform fee
 */
function calculatePlatformFee(totalAmount: number): {
  platformFee: number;
  clientAmount: number;
} {
  return {
    platformFee: PLATFORM_FEE,
    clientAmount: totalAmount - PLATFORM_FEE,
  };
}

/**
 * Utility: Build split payment configuration
 */
function buildSplitConfig(
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
    create: async (data: MonoCustomerInput): Promise<MonoCustomerResponse> => {
      return monoRequest<MonoCustomerResponse>("/v2/customers", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    fetch: async (customerId: string): Promise<MonoCustomerResponse> => {
      return monoRequest<MonoCustomerResponse>(`/v2/customers/${customerId}`);
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
    ): Promise<MonoMandateResponse> => {
      const mandateData = {
        ...data,
        split: buildSplitConfig(
          data.amount,
          clientSubAccountId,
          platformSubAccountId
        ),
      };

      return monoRequest<MonoMandateResponse>("/v2/payments/initiate", {
        method: "POST",
        body: JSON.stringify(mandateData),
      });
    },

    /**
     * Retrieve mandate details
     */
    fetch: async (mandateId: string): Promise<MonoMandateDetailsResponse> => {
      return monoRequest<MonoMandateDetailsResponse>(
        `/v3/payments/mandates/${mandateId}`
      );
    },

    /**
     * Cancel a mandate
     */
    cancel: async (
      mandateId: string
    ): Promise<{ status: string; message: string }> => {
      return monoRequest(`/v3/payments/mandates/${mandateId}/cancel`, {
        method: "PATCH",
      });
    },

    /**
     * Pause a mandate
     */
    pause: async (
      mandateId: string
    ): Promise<{ status: string; message: string }> => {
      return monoRequest(`/v3/payments/mandates/${mandateId}/pause`, {
        method: "PATCH",
      });
    },

    /**
     * Reinstate a paused mandate
     */
    reinstate: async (
      mandateId: string
    ): Promise<{ status: string; message: string }> => {
      return monoRequest(`/v3/payments/mandates/${mandateId}/reinstate`, {
        method: "PATCH",
      });
    },

    /**
     * Debit a mandate with split payment
     */
    debit: async (
      mandateId: string,
      data: MonoDebitInput,
      clientSubAccountId: string,
      platformSubAccountId: string
    ): Promise<MonoDebitResponse> => {
      const debitData = {
        ...data,
        split: buildSplitConfig(
          data.amount,
          clientSubAccountId,
          platformSubAccountId
        ),
      };

      return monoRequest<MonoDebitResponse>(
        `/v3/payments/mandates/${mandateId}/debit`,
        {
          method: "POST",
          body: JSON.stringify(debitData),
        }
      );
    },
  },

  /**
   * Fetch banks
   */
  bank: {
    /**
     * Get list of all banks supporting Direct Debit
     */
    fetchAll: async (): Promise<SupportedBank[]> => {
      const response =
        await monoRequest<MonoBankListResponse>("/v3/banks/list");

      return response.data.banks
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
    create: async (
      nipCode: string,
      accountNumber: string
    ): Promise<MonoSubAccountResponse> => {
      return monoRequest<MonoSubAccountResponse>(
        "/v2/payments/payout/sub-account",
        {
          method: "POST",
          body: JSON.stringify({
            nip_code: nipCode,
            account_number: accountNumber,
          }),
        }
      );
    },

    /**
     * Fetch all sub-accounts
     */
    fetchAll: async (): Promise<{
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
    }> => {
      return monoRequest("/v2/payments/payout/sub-accounts");
    },
  },

  /**
   * Payment verification
   */
  payment: {
    verify: async (
      reference: string
    ): Promise<{
      status: string;
      message: string;
      data: {
        id: string;
        status: string;
        amount: number;
        reference: string;
        split?: any;
      };
    }> => {
      return monoRequest(`/v2/payments/verify/${reference}`);
    },
  },
};
