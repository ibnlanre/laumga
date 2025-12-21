import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import axios from "axios";
import { createBuilder } from "@ibnlanre/builder";
import {
  monoCustomerSchema,
  monoMandateSchema,
  monoDebitSchema,
} from "./schema";
import type {
  MonoCustomerResponse,
  MonoMandateResponse,
  MonoMandateDetailsResponse,
  MonoStatusResponse,
  MonoDebitResponse,
  MonoBankListResponse,
  MonoSubAccountResponse,
  MonoSubAccountsListResponse,
  MonoPaymentVerifyResponse,
} from "./types";

const MONO_API_URL = import.meta.env.VITE_MONO_API_URL;
const MONO_PUBLIC_KEY = import.meta.env.VITE_MONO_PUBLIC_KEY;
const MONO_SECRET_KEY = import.meta.env.VITE_MONO_SECRET_KEY;

const getMonoClient = () => {
  if (!MONO_SECRET_KEY) {
    throw new Error("Mono secret key is not defined in environment variables.");
  }

  return axios.create({
    baseURL: MONO_API_URL,
    headers: {
      "Content-Type": "application/json",
      "mono-sec-key": MONO_SECRET_KEY,
    },
  });
};

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

const createCustomer = createServerFn({ method: "POST" })
  .inputValidator(monoCustomerSchema)
  .handler(async ({ data }) => {
    const client = getMonoClient();
    const response = await client.post<MonoCustomerResponse>(
      "/v2/customers",
      data
    );
    return response.data;
  });

const fetchCustomer = createServerFn({ method: "GET" })
  .inputValidator(z.string())
  .handler(async ({ data: customerId }) => {
    const client = getMonoClient();
    const response = await client.get<MonoCustomerResponse>(
      `/v2/customers/${customerId}`
    );
    return response.data;
  });

const initiateMandate = createServerFn({ method: "POST" })
  .inputValidator(monoMandateSchema)
  .handler(async ({ data }) => {
    const client = getMonoClient();
    const response = await client.post<MonoMandateResponse>(
      "/v2/payments/initiate",
      data
    );
    return response.data;
  });

const fetchMandate = createServerFn({ method: "GET" })
  .inputValidator(z.string())
  .handler(async ({ data: mandateId }) => {
    const client = getMonoClient();
    const response = await client.get<MonoMandateDetailsResponse>(
      `/v3/payments/mandates/${mandateId}`
    );
    return response.data;
  });

const cancelMandate = createServerFn({ method: "POST" })
  .inputValidator(z.string())
  .handler(async ({ data: mandateId }) => {
    const client = getMonoClient();
    const response = await client.patch<MonoStatusResponse>(
      `/v3/payments/mandates/${mandateId}/cancel`
    );
    return response.data;
  });

const pauseMandate = createServerFn({ method: "POST" })
  .inputValidator(z.object({ data: z.string() }))
  .handler(async ({ data: { data: mandateId } }) => {
    const client = getMonoClient();
    const response = await client.patch<MonoStatusResponse>(
      `/v3/payments/mandates/${mandateId}/pause`
    );
    return response.data;
  });

const reinstateMandate = createServerFn({ method: "POST" })
  .inputValidator(z.object({ data: z.string() }))
  .handler(async ({ data: { data: mandateId } }) => {
    const client = getMonoClient();
    const response = await client.patch<MonoStatusResponse>(
      `/v3/payments/mandates/${mandateId}/reinstate`
    );
    return response.data;
  });

const debitMandate = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      data: z.object({ mandateId: z.string(), data: monoDebitSchema }),
    })
  )
  .handler(
    async ({
      data: {
        data: { mandateId, data },
      },
    }) => {
      const client = getMonoClient();
      const response = await client.post<MonoDebitResponse>(
        `/v3/payments/mandates/${mandateId}/debit`,
        data
      );
      return response.data;
    }
  );

const listBanks = createServerFn({ method: "GET" }).handler(async () => {
  const client = getMonoClient();
  const response = await client.get<MonoBankListResponse>("/v3/banks/list");
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
});

const createSubAccount = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      data: z.object({ nipCode: z.string(), accountNumber: z.string() }),
    })
  )
  .handler(
    async ({
      data: {
        data: { nipCode, accountNumber },
      },
    }) => {
      const client = getMonoClient();
      const response = await client.post<MonoSubAccountResponse>(
        "/v2/payments/payout/sub-account",
        {
          nip_code: nipCode,
          account_number: accountNumber,
        }
      );
      return response.data;
    }
  );

const listSubAccounts = createServerFn({ method: "GET" }).handler(async () => {
  const client = getMonoClient();
  const response = await client.get<MonoSubAccountsListResponse>(
    "/v2/payments/payout/sub-accounts"
  );
  return response.data;
});

const verifyPayment = createServerFn({ method: "GET" })
  .inputValidator(z.object({ data: z.string() }))
  .handler(async ({ data: { data: reference } }) => {
    const client = getMonoClient();
    const response = await client.get<MonoPaymentVerifyResponse>(
      `/v2/payments/verify/${reference}`
    );
    return response.data;
  });

export const mono = createBuilder(
  {
    customer: {
      create: createCustomer,
      fetch: fetchCustomer,
    },
    mandate: {
      initiate: initiateMandate,
      fetch: fetchMandate,
      cancel: cancelMandate,
      pause: pauseMandate,
      reinstate: reinstateMandate,
      debit: debitMandate,
    },
    bank: {
      list: listBanks,
    },
    subAccount: {
      create: createSubAccount,
      list: listSubAccounts,
    },
    payment: {
      verify: verifyPayment,
    },
  },
  { prefix: ["mono"] }
);

export { MONO_PUBLIC_KEY, MONO_SECRET_KEY };
