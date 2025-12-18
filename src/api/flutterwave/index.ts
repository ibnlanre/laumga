import axios, { AxiosError } from "axios";
import { createServerFn } from "@tanstack/react-start";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";

import { tryCatch } from "@/utils/try-catch";
import {
  flutterwaveTokenizeRequestSchema,
  flutterwaveTokenizedChargeRequestSchema,
  flutterwaveTokenUpdateRequestSchema,
} from "./schema";
import type { FlutterwaveBank, FlutterwaveErrorResponse } from "./types";
import type {
  FlutterwaveTokenizeResponse,
  FlutterwaveTokenStatusResponse,
  FlutterwaveTokenizedChargeResponse,
} from "./types";
import { createBuilder } from "@ibnlanre/builder";

const FLUTTERWAVE_API_URL = import.meta.env.VITE_FLUTTERWAVE_API_URL;
const FLUTTERWAVE_PUBLIC_KEY = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY;
const FLUTTERWAVE_SECRET_KEY = import.meta.env.VITE_FLUTTERWAVE_SECRET_KEY;

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

const list: FlutterwaveBank[] = [
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

const tokenize = createServerFn({ method: "POST" })
  .inputValidator(zodValidator(flutterwaveTokenizeRequestSchema))
  .handler(async ({ data }) => {
    const response = await flutterwaveClient
      .post<FlutterwaveTokenizeResponse>("/v3/accounts/tokenize", data)
      .catch((error: AxiosError<FlutterwaveErrorResponse>) => {
        const flutterwaveError = error.response?.data;
        throw new Error(flutterwaveError?.message);
      });

    return response.data;
  });

const status = createServerFn({ method: "GET" })
  .inputValidator(zodValidator(z.string()))
  .handler(async ({ data: reference }) => {
    if (!reference) {
      throw new Error("Token reference is required");
    }

    const response = await flutterwaveClient
      .get<FlutterwaveTokenStatusResponse>(`/v3/accounts/token/${reference}`)
      .catch((error: AxiosError<FlutterwaveErrorResponse>) => {
        const flutterwaveError = error.response?.data;
        throw new Error(flutterwaveError?.message);
      });

    return response.data;
  });

const update = createServerFn({ method: "POST" })
  .inputValidator(
    zodValidator(
      z.object({
        reference: z.string(),
        payload: flutterwaveTokenUpdateRequestSchema,
      })
    )
  )
  .handler(async ({ data: { reference, payload } }) => {
    const response = await flutterwaveClient
      .put<FlutterwaveTokenStatusResponse>(
        `/v3/accounts/token/${reference}`,
        payload
      )
      .catch((error: AxiosError<FlutterwaveErrorResponse>) => {
        const flutterwaveError = error.response?.data;
        throw new Error(flutterwaveError?.message);
      });
    
    return response.data;
  });

const tokenized = createServerFn({ method: "POST" })
  .inputValidator(zodValidator(flutterwaveTokenizedChargeRequestSchema))
  .handler(async ({ data }) => {
    const response = await flutterwaveClient
      .post<FlutterwaveTokenizedChargeResponse>("/v3/tokenized-charge", data)
      .catch((error: AxiosError<FlutterwaveErrorResponse>) => {
        const flutterwaveError = error.response?.data;
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
  },
  { prefix: ["flutterwave"] }
);
