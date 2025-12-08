import type {
  CollectionReference,
  DocumentReference,
} from "firebase/firestore";
import type { z } from "zod";

import type {
  createMandateSchema,
  mandateSchema,
  mandateRecordSchema,
  createMandateRecordSchema,

  mandateDurationSchema,
  mandateFrequencySchema,
  mandateStatusSchema,
  mandateTierSchema,
} from "./schema";
import type { User } from "../user/types";

export type Mandate = z.infer<typeof mandateSchema>;
export type MandateRecord = z.infer<typeof mandateRecordSchema>;
export type CreateMandateData = z.infer<typeof createMandateRecordSchema>;
export type CreateMandateInput = z.infer<typeof createMandateSchema>;

export type MandateTier = z.infer<typeof mandateTierSchema>;
export type MandateStatus = z.infer<typeof mandateStatusSchema>;
export type MandateFrequency = z.infer<typeof mandateFrequencySchema>;
export type MandateDuration = z.infer<typeof mandateDurationSchema>;

export type MandateCollection = CollectionReference<MandateRecord>;
export type MandateDocument = DocumentReference<MandateRecord>;


export interface CreateMandateVariables {
  user: User;
  data: CreateMandateInput;
}

export interface UpdateMandateVariables {
  id: string;
  user: User;
}
