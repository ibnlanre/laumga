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
  AUTHORS_COLLECTION,
  authorSchema,
  createAuthorSchema,
  updateAuthorSchema,
} from "@/api/author/schema";
import type { AuthorData, CreateAuthorData, UpdateAuthorData } from "./types";
import { userSchema } from "../user/schema";

const list = createServerFn({ method: "GET" })
  .inputValidator(createVariablesSchema(authorSchema))
  .handler(async ({ data: variables }) => {
    const authorsRef = serverCollection<AuthorData>(AUTHORS_COLLECTION);
    const query = buildServerQuery(authorsRef, variables);
    return getServerQueryDocs(query, authorSchema);
  });

const get = createServerFn({ method: "GET" })
  .inputValidator(z.string())
  .handler(async ({ data: id }) => {
    const authorRef = serverCollection<AuthorData>(AUTHORS_COLLECTION).doc(id);
    return getServerQueryDoc(authorRef, authorSchema);
  });

const create = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      user: userSchema,
      data: createAuthorSchema,
    })
  )
  .handler(async ({ data: { user, data } }) => {
    const validated = createAuthorSchema.parse(data);
    const authorsRef = serverCollection<AuthorData>(AUTHORS_COLLECTION);

    const existingSnapshot = await authorsRef
      .where("fullName", "==", validated.fullName)
      .get();

    if (!existingSnapshot.empty) {
      throw new Error("An author with this name already exists");
    }

    const authorData: CreateAuthorData = {
      ...validated,
      created: serverRecord(user),
    };

    if (validated.status === "published") {
      authorData.published = serverRecord(user);
    }

    await authorsRef.add(authorData);
  });

const update = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      id: z.string(),
      user: userSchema,
      data: updateAuthorSchema,
    })
  )
  .handler(async ({ data: { id, data, user } }) => {
    const validated = updateAuthorSchema.parse(data);
    const authorRef = serverCollection<AuthorData>(AUTHORS_COLLECTION).doc(id);

    const updateData: UpdateAuthorData = {
      ...validated,
      updated: serverRecord(user),
    };

    if (validated.status === "published" && !validated.published) {
      updateData.published = serverRecord(user);
    }

    if (validated.status === "archived" && !validated.archived) {
      updateData.archived = serverRecord(user);
    }

    await authorRef.update(updateData);
  });

const remove = createServerFn({ method: "POST" })
  .inputValidator(z.string())
  .handler(async ({ data: id }) => {
    const authorRef = serverCollection<AuthorData>(AUTHORS_COLLECTION).doc(id);
    await authorRef.delete();
  });

export const author = createBuilder(
  {
    create,
    update,
    list,
    get,
    remove,
  },
  { prefix: [AUTHORS_COLLECTION] }
);
