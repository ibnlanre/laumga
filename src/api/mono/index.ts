import axios from "axios";
import type {
  MonoCustomerInput,
  MonoCustomerResponse,
  MonoMandateInput,
  MonoMandateResponse,
  MonoMandateDetailsResponse,
  MonoStatusResponse,
  MonoDebitInput,
  MonoDebitResponse,
  MonoBankListResponse,
  MonoSubAccountResponse,
  MonoSubAccountsListResponse,
  MonoPaymentVerifyResponse,
} from "./types";
import { createBuilder } from "@ibnlanre/builder";

const MONO_API_URL = import.meta.env.VITE_MONO_API_URL;
const MONO_PUBLIC_KEY = import.meta.env.VITE_MONO_PUBLIC_KEY;
const MONO_SECRET_KEY = import.meta.env.VITE_MONO_SECRET_KEY;

if (!MONO_SECRET_KEY) {
  throw new Error("Mono secret key is not defined in environment variables.");
}

if (!MONO_PUBLIC_KEY) {
  throw new Error("Mono public key is not defined in environment variables.");
}

const monoClient = axios.create({
  baseURL: MONO_API_URL,
  headers: {
    "Content-Type": "application/json",
    "mono-sec-key": MONO_SECRET_KEY,
  },
});

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
 * Mono API Client
 */
export const mono = createBuilder({
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
    initiate: async (data: MonoMandateInput) => {
      const response = await monoClient.post<MonoMandateResponse>(
        "/v2/payments/initiate",
        data
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
    debit: async (mandateId: string, data: MonoDebitInput) => {
      const response = await monoClient.post<MonoDebitResponse>(
        `/v3/payments/mandates/${mandateId}/debit`,
        data
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
    list: async () => {
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
    list: async () => {
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
});

export { MONO_PUBLIC_KEY, MONO_SECRET_KEY };
