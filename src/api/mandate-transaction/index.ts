import { buildQuery, getQueryDoc, getQueryDocs } from "@/client/core-query";
import { db } from "@/services/firebase";
import { createBuilder } from "@ibnlanre/builder";
import { collection, doc } from "firebase/firestore";
import {
  MANDATE_TRANSACTIONS_COLLECTION,
  mandateTransactionSchema,
} from "./schema";
import type {
  ListMandateVariables,
  MandateTransactionCollection,
  MandateTransactionDocument,
} from "./types";

async function list(variables?: ListMandateVariables) {
  const transactionsRef = collection(
    db,
    MANDATE_TRANSACTIONS_COLLECTION
  ) as MandateTransactionCollection;

  const transactionsQuery = buildQuery(transactionsRef, variables);
  return await getQueryDocs(transactionsQuery, mandateTransactionSchema);
}

async function get(id: string) {
  const transactionsRef = doc(
    db,
    MANDATE_TRANSACTIONS_COLLECTION,
    id
  ) as MandateTransactionDocument;
  return await getQueryDoc(transactionsRef, mandateTransactionSchema);
}

export const mandateTransactions = createBuilder(
  {
    list,
    get,
  },
  { prefix: [MANDATE_TRANSACTIONS_COLLECTION] }
);
