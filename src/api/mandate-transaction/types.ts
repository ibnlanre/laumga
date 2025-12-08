import type { Variables } from "@/client/core-query";
import {
  mandateTransactionSchema,
  mandateTransactionDataSchema,
  createMandateTransactionSchema,
} from "./schema";
import type {
  CollectionReference,
  DocumentReference,
} from "firebase/firestore";
import type { z } from "zod";

export type MandateTransaction = z.infer<typeof mandateTransactionSchema>;
export type MandateTransactionData = z.infer<
  typeof mandateTransactionDataSchema
>;
export type CreateMandateTransactionData = z.infer<
  typeof createMandateTransactionSchema
>;

export type MandateTransactionCollection =
  CollectionReference<MandateTransactionData>;
export type MandateTransactionDocument =
  DocumentReference<MandateTransactionData>;

export type ListMandateVariables = Variables<MandateTransactionData>;