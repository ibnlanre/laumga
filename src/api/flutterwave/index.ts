import axios, { AxiosError } from "axios";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  flutterwaveTokenizeRequestSchema,
  flutterwaveTokenizedChargeRequestSchema,
  flutterwaveTokenUpdateRequestSchema,
  flutterwavePlanCheckoutRequestSchema,
  flutterwavePaymentPlanCreateRequestSchema,
} from "./schema";
import type { FlutterwaveBank, FlutterwaveErrorResponse } from "./types";
import type {
  FlutterwaveTokenizeResponse,
  FlutterwaveTokenStatusResponse,
  FlutterwaveTokenizedChargeResponse,
  FlutterwaveTransactionResponse,
  FlutterwavePlanCheckoutResponse,
  FlutterwavePaymentPlanCreateResponse,
  FlutterwavePaymentPlanListResponse,
  FlutterwaveSubscriptionListResponse,
  FlutterwaveTransactionVerifyResponse,
} from "./types";
import { createBuilder } from "@ibnlanre/builder";

const FLUTTERWAVE_API_URL = import.meta.env.VITE_FLUTTERWAVE_API_URL;
const FLUTTERWAVE_PUBLIC_KEY = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY;
const FLUTTERWAVE_SECRET_KEY = import.meta.env.VITE_FLUTTERWAVE_SECRET_KEY;
const FLUTTERWAVE_SUBACCOUNT_ID = import.meta.env
  .VITE_FLUTTERWAVE_SUBACCOUNT_ID;

if (!FLUTTERWAVE_API_URL) {
  throw new Error(
    "Flutterwave API URL is not defined in environment variables."
  );
}

if (!FLUTTERWAVE_PUBLIC_KEY) {
  throw new Error(
    "Flutterwave public key is not defined in environment variables."
  );
}

if (!FLUTTERWAVE_SECRET_KEY) {
  throw new Error(
    "Flutterwave secret key is not defined in environment variables."
  );
}

const flutterwaveClient = axios.create({
  baseURL: FLUTTERWAVE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
  },
});

const list = createServerFn({ method: "GET" }).handler(async () => {
  const banks: FlutterwaveBank[] = [
    { label: "Access Bank", value: "044", code: "044" },
    { label: "Citi Bank", value: "023", code: "023" },
    { label: "Ecobank PLC", value: "050", code: "050" },
    { label: "Fidelity Bank", value: "070", code: "070" },
    { label: "First Bank PLC", value: "011", code: "011" },
    { label: "First City Monument Bank", value: "214", code: "214" },
    { label: "Globus Bank", value: "000027", code: "000027" },
    { label: "Guaranty Trust Bank", value: "058", code: "058" },
    { label: "Jaiz Bank", value: "301", code: "301" },
    { label: "Keystone Bank", value: "082", code: "082" },
    { label: "Polaris Bank", value: "076", code: "076" },
    { label: "PremiumTrust Bank", value: "000031", code: "000031" },
    { label: "ProvidusBank PLC", value: "101", code: "101" },
    { label: "Stanbic IBTC Bank", value: "221", code: "221" },
    { label: "Standard Chartered Bank", value: "068", code: "068" },
    { label: "Sterling Bank PLC", value: "232", code: "232" },
    { label: "Suntrust Bank", value: "100", code: "100" },
    { label: "Titan Trust Bank", value: "000025", code: "000025" },
    { label: "Union Bank PLC", value: "032", code: "032" },
    { label: "United Bank for Africa", value: "033", code: "033" },
    { label: "Unity Bank PLC", value: "215", code: "215" },
    { label: "Wema Bank PLC", value: "035", code: "035" },
    { label: "Zenith Bank PLC", value: "057", code: "057" },
  ];
  return banks;
});

const tokenize = createServerFn({ method: "POST" })
  .inputValidator(flutterwaveTokenizeRequestSchema)
  .handler(async ({ data }) => {
    const response = await flutterwaveClient
      .post<FlutterwaveTokenizeResponse>("/v3/accounts/tokenize", data)
      .catch((error: AxiosError<FlutterwaveErrorResponse>) => {
        const flutterwaveError = error.response?.data;

        console.error(flutterwaveError);
        throw new Error(flutterwaveError?.message);
      });

    return response.data;
  });

const status = createServerFn({ method: "GET" })
  .inputValidator(z.string())
  .handler(async ({ data: reference }) => {
    if (!reference) {
      throw new Error("Token reference is required");
    }

    const response = await flutterwaveClient
      .get<FlutterwaveTokenStatusResponse>(`/v3/accounts/token/${reference}`)
      .catch((error: AxiosError<FlutterwaveErrorResponse>) => {
        const flutterwaveError = error.response?.data;

        console.error(flutterwaveError);
        throw new Error(flutterwaveError?.message);
      });

    return response.data;
  });

const update = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      reference: z.string(),
      payload: flutterwaveTokenUpdateRequestSchema,
    })
  )
  .handler(async ({ data: { reference, payload } }) => {
    const response = await flutterwaveClient
      .put<FlutterwaveTokenStatusResponse>(
        `/v3/accounts/token/${reference}`,
        payload
      )
      .catch((error: AxiosError<FlutterwaveErrorResponse>) => {
        const flutterwaveError = error.response?.data;

        console.error(flutterwaveError);
        throw new Error(flutterwaveError?.message);
      });

    return response.data;
  });

const tokenized = createServerFn({ method: "POST" })
  .inputValidator(flutterwaveTokenizedChargeRequestSchema)
  .handler(async ({ data }) => {
    const response = await flutterwaveClient
      .post<FlutterwaveTokenizedChargeResponse>("/v3/tokenized-charge", data)
      .catch((error: AxiosError<FlutterwaveErrorResponse>) => {
        const flutterwaveError = error.response?.data;

        console.error(flutterwaveError);
        throw new Error(flutterwaveError?.message);
      });

    return response.data;
  });

const transactions = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      customer_email: z.email().optional(),
      tx_ref: z.string().nullable().optional(),
      from: z.string().optional(),
      to: z.string().optional(),
      currency: z.string().optional(),
      status: z.string().optional(),
      customer_fullname: z.string().optional(),
      page: z.number().default(1),
    })
  )
  .handler(async ({ data }) => {
    const response = await flutterwaveClient
      .get<FlutterwaveTransactionResponse>("/v3/transactions", { params: data })
      .catch((error: AxiosError<FlutterwaveErrorResponse>) => {
        const flutterwaveError = error.response?.data;

        console.error(flutterwaveError);
        throw new Error(flutterwaveError?.message);
      });

    return response.data;
  });

const paymentPlanList = createServerFn({ method: "GET" })
  .inputValidator(
    z
      .object({
        page: z.number().min(1).optional(),
        status: z.string().optional(),
        interval: z.string().optional(),
        amount: z.number().optional(),
        currency: z.string().optional(),
        from: z.string().optional(),
        to: z.string().optional(),
      })
      .optional()
  )
  .handler(async ({ data }) => {
    const response = await flutterwaveClient
      .get<FlutterwavePaymentPlanListResponse>("/v3/payment-plans", {
        params: data,
      })
      .catch((error: AxiosError<FlutterwaveErrorResponse>) => {
        const flutterwaveError = error.response?.data;

        console.error(flutterwaveError);
        throw new Error(flutterwaveError?.message);
      });

    return response.data;
  });

const paymentPlanCreate = createServerFn({ method: "POST" })
  .inputValidator(flutterwavePaymentPlanCreateRequestSchema)
  .handler(async ({ data }) => {
    const response = await flutterwaveClient
      .post<FlutterwavePaymentPlanCreateResponse>("/v3/payment-plans", data)
      .catch((error: AxiosError<FlutterwaveErrorResponse>) => {
        const flutterwaveError = error.response?.data;

        console.error(flutterwaveError);
        throw new Error(flutterwaveError?.message);
      });

    return response.data;
  });

const subscriptionList = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      email: z.email(),
      status: z.string().optional(),
      page: z.number().min(1).optional(),
      transaction_id: z.number().optional(),
      plan: z.string().optional(),
      subscribed_from: z.string().optional(),
      subscribed_to: z.string().optional(),
      next_due_from: z.string().optional(),
      next_due_to: z.string().optional(),
    })
  )
  .handler(async ({ data }) => {
    const response = await flutterwaveClient
      .get<FlutterwaveSubscriptionListResponse>("/v3/subscriptions", {
        params: data,
      })
      .catch((error: AxiosError<FlutterwaveErrorResponse>) => {
        const flutterwaveError = error.response?.data;

        console.error(flutterwaveError);
        throw new Error(flutterwaveError?.message);
      });

    return response.data;
  });

const subscriptionCancel = createServerFn({ method: "POST" })
  .inputValidator(z.number())
  .handler(async ({ data: subscriptionId }) => {
    const response = await flutterwaveClient
      .put(`/v3/subscriptions/${subscriptionId}/cancel`)
      .catch((error: AxiosError<FlutterwaveErrorResponse>) => {
        const flutterwaveError = error.response?.data;

        console.error(flutterwaveError);
        throw new Error(flutterwaveError?.message);
      });

    return response.data;
  });

const subscriptionActivate = createServerFn({ method: "POST" })
  .inputValidator(z.number())
  .handler(async ({ data: subscriptionId }) => {
    const response = await flutterwaveClient
      .put(`/v3/subscriptions/${subscriptionId}/activate`)
      .catch((error: AxiosError<FlutterwaveErrorResponse>) => {
        const flutterwaveError = error.response?.data;

        console.error(flutterwaveError);
        throw new Error(flutterwaveError?.message);
      });

    return response.data;
  });

const transactionVerify = createServerFn({ method: "GET" })
  .inputValidator(z.string())
  .handler(async ({ data: txRef }) => {
    const response = await flutterwaveClient
      .get<FlutterwaveTransactionVerifyResponse>(
        `/v3/transactions/verify_by_reference`,
        { params: { tx_ref: txRef } }
      )
      .catch((error: AxiosError<FlutterwaveErrorResponse>) => {
        const flutterwaveError = error.response?.data;

        console.error(flutterwaveError);
        throw new Error(flutterwaveError?.message);
      });

    return response.data;
  });

const planCheckout = createServerFn({ method: "POST" })
  .inputValidator(flutterwavePlanCheckoutRequestSchema)
  .handler(async ({ data }) => {
    const {
      txRef,
      amount,
      currency,
      redirectUrl,
      paymentPlanId,
      customer,
      customizations,
      meta,
      paymentOptions,
    } = data;

    const payload = {
      tx_ref: txRef,
      amount,
      currency,
      redirect_url: redirectUrl,
      payment_plan: paymentPlanId,
      payment_options: paymentOptions,
      customer: {
        email: customer.email,
        name: customer.name,
        phonenumber: customer.phoneNumber,
      },
      customizations: customizations
        ? {
            title: customizations.title,
            description: customizations.description,
            logo: customizations.logo,
          }
        : undefined,
      meta: {
        ...meta,
        platform: "laumga",
      },
      subaccounts: [{ id: FLUTTERWAVE_SUBACCOUNT_ID }],
    };

    const response = await flutterwaveClient
      .post<FlutterwavePlanCheckoutResponse>("/v3/payments", payload)
      .catch((error: AxiosError<FlutterwaveErrorResponse>) => {
        const flutterwaveError = error.response?.data;

        console.error(flutterwaveError);
        throw new Error(flutterwaveError?.message);
      });

    return response.data;
  });

export const flutterwave = createBuilder(
  {
    account: {
      tokenize,
      status,
      update,
    },
    charge: {
      tokenized,
    },
    bank: {
      list,
    },
    transaction: {
      list: transactions,
      verify: transactionVerify,
    },
    payment: {
      planCheckout,
    },
    paymentPlan: {
      list: paymentPlanList,
      create: paymentPlanCreate,
    },
    subscription: {
      list: subscriptionList,
      cancel: subscriptionCancel,
      activate: subscriptionActivate,
      get: subscriptionList,
    },
  },
  { prefix: ["flutterwave"] }
);
