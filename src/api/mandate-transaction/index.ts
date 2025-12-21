import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createBuilder } from "@ibnlanre/builder";

import {
  buildServerQuery,
  getServerQueryDoc,
  getServerQueryDocs,
  serverCollection,
} from "@/client/core-query/server";
import { createVariablesSchema } from "@/client/schema";

import {
  MANDATE_TRANSACTIONS_COLLECTION,
  mandateTransactionSchema,
} from "./schema";
import type { MandateTransactionData } from "./types";

const list = createServerFn({ method: "GET" })
  .inputValidator(createVariablesSchema(mandateTransactionSchema))
  .handler(async ({ data: variables }) => {
    const transactionsRef = serverCollection<MandateTransactionData>(
      MANDATE_TRANSACTIONS_COLLECTION
    );

    const transactionsQuery = buildServerQuery(transactionsRef, variables);
    return await getServerQueryDocs(
      transactionsQuery,
      mandateTransactionSchema
    );
  });

const get = createServerFn({ method: "GET" })
  .inputValidator(z.string())
  .handler(async ({ data: id }) => {
    const transactionsRef = serverCollection<MandateTransactionData>(
      MANDATE_TRANSACTIONS_COLLECTION
    ).doc(id);
    return await getServerQueryDoc(transactionsRef, mandateTransactionSchema);
  });

export const mandateTransactions = createBuilder(
  {
    list,
    get,
  },
  { prefix: [MANDATE_TRANSACTIONS_COLLECTION] }
);
