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

import {
  EXECUTIVES_COLLECTION,
  executiveSchema,
  createExecutiveSchema,
  updateExecutiveSchema,
} from "./schema";
import type {
  CreateExecutiveData,
  UpdateExecutiveData,
  ExecutiveData,
} from "./types";
import { userSchema } from "../user/schema";
import { EXECUTIVE_TENURES_COLLECTION } from "../executive-tenure/schema";
import type { ExecutiveTenure } from "../executive-tenure/types";

const list = createServerFn({ method: "GET" })
  .inputValidator(createVariablesSchema(executiveSchema))
  .handler(async ({ data: variables }) => {
    const executivesRef = serverCollection<ExecutiveData>(
      EXECUTIVES_COLLECTION
    );
    const query = buildServerQuery(executivesRef, variables);
    return getServerQueryDocs(query, executiveSchema);
  });

const get = createServerFn({ method: "GET" })
  .inputValidator(z.string())
  .handler(async ({ data: id }) => {
    const executiveRef = serverCollection<ExecutiveData>(
      EXECUTIVES_COLLECTION
    ).doc(id);
    return getServerQueryDoc(executiveRef, executiveSchema);
  });

const create = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      user: userSchema,
      data: createExecutiveSchema,
    })
  )
  .handler(async ({ data: { user, data } }) => {
    const validated = createExecutiveSchema.parse(data);

    const tenureRef = serverCollection<ExecutiveTenure>(
      EXECUTIVE_TENURES_COLLECTION
    ).doc(validated.tenureId);
    const tenureSnapshot = await tenureRef.get();
    if (!tenureSnapshot.exists)
      throw new Error("Selected tenure does not exist");

    const executivesRef = serverCollection<ExecutiveData>(
      EXECUTIVES_COLLECTION
    );

    const executiveData: CreateExecutiveData = {
      ...validated,
      created: serverRecord(user),
    };

    await executivesRef.add(executiveData);
  });

const update = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      id: z.string(),
      user: userSchema,
      data: updateExecutiveSchema,
    })
  )
  .handler(async ({ data: { id, data, user } }) => {
    const validated = updateExecutiveSchema.parse(data);
    const executiveRef = serverCollection<ExecutiveData>(
      EXECUTIVES_COLLECTION
    ).doc(id);

    const updateData: UpdateExecutiveData = {
      ...validated,
      updated: serverRecord(user),
    };

    await executiveRef.update(updateData);
  });

const remove = createServerFn({ method: "POST" })
  .inputValidator(z.string())
  .handler(async ({ data: id }) => {
    const executiveRef = serverCollection<ExecutiveData>(
      EXECUTIVES_COLLECTION
    ).doc(id);
    await executiveRef.delete();
  });

export const executive = createBuilder(
  {
    create,
    update,
    list,
    get,
    remove,
  },
  { prefix: [EXECUTIVES_COLLECTION] }
);
