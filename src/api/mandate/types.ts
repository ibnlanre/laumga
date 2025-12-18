import type {
  CollectionReference,
  DocumentReference,
} from "firebase/firestore";
import type { z } from "zod";

import type {
  createMandateSchema,
  createMandateDataSchema,
  mandateSchema,
  mandateDataSchema,
  mandateFrequencySchema,
  mandateTierSchema,
  updateMandateSchema,
} from "./schema";
import type { Variables } from "@/client/core-query";
import type { User } from "../user/types";
import type { FlutterwaveTokenizeResponse } from "../flutterwave/types";

export type Mandate = z.infer<typeof mandateSchema>;
export type MandateData = z.infer<typeof mandateDataSchema>;

export type CreateMandateData = z.infer<typeof createMandateDataSchema>;
export type CreateMandate = z.infer<typeof createMandateSchema>;
export type UpdateMandate = z.infer<typeof updateMandateSchema>;

export type MandateTier = z.infer<typeof mandateTierSchema>;
export type MandateFrequency = z.infer<typeof mandateFrequencySchema>;

export type MandateCollection = CollectionReference<CreateMandateData>;
export type MandateDocument = DocumentReference<CreateMandateData>;

export type ListMandateVariables = Variables<CreateMandateData>;

export interface CreateMandateVariables {
  user: User;
  data: CreateMandate;
  tokenResponse: FlutterwaveTokenizeResponse;
}

export interface UpdateMandateVariables {
  user: User;
  data?: UpdateMandate;
}
