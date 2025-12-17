import axios from "axios";
import { createBuilder } from "@ibnlanre/builder";

import {
  flutterwaveBankSchema,
  flutterwaveTokenizeRequestSchema,
  flutterwaveTokenizedChargeRequestSchema,
  flutterwaveTokenUpdateRequestSchema,
} from "./schema";
import type { FlutterwaveBank, FlutterwaveTokenUpdateRequest } from "./types";
import type {
  FlutterwaveTokenizeRequest,
  FlutterwaveTokenizeResponse,
  FlutterwaveTokenStatusResponse,
  FlutterwaveTokenizedChargeRequest,
  FlutterwaveTokenizedChargeResponse,
} from "./types";

const FLUTTERWAVE_API_URL = import.meta.env.VITE_FLUTTERWAVE_API_URL;
const FLUTTERWAVE_SECRET_KEY = import.meta.env.VITE_FLUTTERWAVE_SECRET_KEY;

if (!FLUTTERWAVE_API_URL) {
  throw new Error(
    "Flutterwave API URL is not defined in environment variables."
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

const supportedBanks: FlutterwaveBank[] = flutterwaveBankSchema.array().parse(
  [
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
  ].sort((a, b) => a.label.localeCompare(b.label))
);

export class FlutterwaveError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = "FlutterwaveError";
  }
}

export const flutterwave = createBuilder({
  account: {
    tokenize: async (payload: FlutterwaveTokenizeRequest) => {
      const data = flutterwaveTokenizeRequestSchema.parse(payload);
      const response =
        await flutterwaveClient.post<FlutterwaveTokenizeResponse>(
          "/v3/accounts/tokenized",
          data
        );
      return response.data;
    },

    status: async (reference: string) => {
      if (!reference) {
        throw new FlutterwaveError("Token reference is required");
      }

      const response =
        await flutterwaveClient.get<FlutterwaveTokenStatusResponse>(
          `/v3/accounts/token/${reference}`
        );
      return response.data;
    },

    update: async (
      reference: string,
      payload: FlutterwaveTokenUpdateRequest
    ) => {
      const data = flutterwaveTokenUpdateRequestSchema.parse(payload);
      const response =
        await flutterwaveClient.put<FlutterwaveTokenStatusResponse>(
          `/v3/accounts/token/${reference}`,
          data
        );
      return response.data;
    },
  },
  charge: {
    tokenized: async (payload: FlutterwaveTokenizedChargeRequest) => {
      const data = flutterwaveTokenizedChargeRequestSchema.parse(payload);
      const response =
        await flutterwaveClient.post<FlutterwaveTokenizedChargeResponse>(
          "/v3/tokenized-charge",
          data
        );
      return response.data;
    },
  },
  bank: {
    list: async () => supportedBanks,
  },
});

export type { FlutterwaveSplitCharge } from "./types";
export { FLUTTERWAVE_SECRET_KEY };
