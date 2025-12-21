import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createBuilder } from "@ibnlanre/builder";

import { serverRecord } from "@/utils/server-record";
import {
  buildServerQuery,
  getServerQueryDoc,
  getServerQueryDocs,
  serverCollection,
} from "@/client/core-query/server";
import { createVariablesSchema } from "@/client/schema";
import { db } from "@/services/firebase-admin";

import {
  EXECUTIVE_TENURES_COLLECTION,
  executiveTenureSchema,
  createExecutiveTenureSchema,
  updateExecutiveTenureSchema,
} from "./schema";
import type {
  CreateExecutiveTenureData,
  UpdateExecutiveTenureData,
  ExecutiveTenureData,
} from "./types";
import { userSchema } from "../user/schema";

async function deactivateActiveTenures(exceptId?: string) {
  const tenuresRef = serverCollection<ExecutiveTenureData>(
    EXECUTIVE_TENURES_COLLECTION
  );
  const snapshot = await tenuresRef.where("isActive", "==", true).get();

  if (snapshot.empty) return;

  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    if (doc.id !== exceptId) {
      batch.update(doc.ref, { isActive: false });
    }
  });
  await batch.commit();
}

const list = createServerFn({ method: "GET" })
  .inputValidator(createVariablesSchema(executiveTenureSchema))
  .handler(async ({ data: variables }) => {
    const tenuresRef = serverCollection<ExecutiveTenureData>(
      EXECUTIVE_TENURES_COLLECTION
    );
    const query = buildServerQuery(tenuresRef, variables);
    return getServerQueryDocs(query, executiveTenureSchema);
  });

const get = createServerFn({ method: "GET" })
  .inputValidator(z.string())
  .handler(async ({ data: id }) => {
    const tenureRef = serverCollection<ExecutiveTenureData>(
      EXECUTIVE_TENURES_COLLECTION
    ).doc(id);
    return getServerQueryDoc(tenureRef, executiveTenureSchema);
  });

const create = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      user: userSchema,
      data: createExecutiveTenureSchema,
    })
  )
  .handler(async ({ data: { user, data } }) => {
    const validated = createExecutiveTenureSchema.parse(data);
    const tenuresRef = serverCollection<ExecutiveTenureData>(
      EXECUTIVE_TENURES_COLLECTION
    );

    if (validated.isActive) {
      await deactivateActiveTenures();
    }

    const tenureData: CreateExecutiveTenureData = {
      ...validated,
      created: serverRecord(user),
    };

    await tenuresRef.add(tenureData);
  });

const update = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      id: z.string(),
      user: userSchema,
      data: updateExecutiveTenureSchema,
    })
  )
  .handler(async ({ data: { id, data, user } }) => {
    const validated = updateExecutiveTenureSchema.parse(data);
    const tenureRef = serverCollection<ExecutiveTenureData>(
      EXECUTIVE_TENURES_COLLECTION
    ).doc(id);

    if (validated.isActive) {
      await deactivateActiveTenures(id);
    }

    const updateData: UpdateExecutiveTenureData = {
      ...validated,
      updated: serverRecord(user),
    };

    await tenureRef.update(updateData);
  });

const remove = createServerFn({ method: "POST" })
  .inputValidator(z.string())
  .handler(async ({ data: id }) => {
    const tenureRef = serverCollection<ExecutiveTenureData>(
      EXECUTIVE_TENURES_COLLECTION
    ).doc(id);
    await tenureRef.delete();
  });

export const executiveTenure = createBuilder(
  {
    create,
    update,
    list,
    get,
    remove,
  },
  { prefix: [EXECUTIVE_TENURES_COLLECTION] }
);
