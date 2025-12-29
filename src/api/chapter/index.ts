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
  CHAPTERS_COLLECTION,
  chapterSchema,
  createChapterSchema,
  updateChapterSchema,
} from "./schema";
import type {
  ChapterData,
  CreateChapterData,
  UpdateChapterData,
} from "./types";
import { userSchema } from "../user/schema";

const list = createServerFn({ method: "GET" })
  .inputValidator(createVariablesSchema(chapterSchema))
  .handler(async ({ data: variables }) => {
    const chaptersRef = serverCollection<ChapterData>(CHAPTERS_COLLECTION);
    const query = buildServerQuery(chaptersRef, variables);
    return getServerQueryDocs(query, chapterSchema);
  });

const get = createServerFn({ method: "GET" })
  .inputValidator(z.string())
  .handler(async ({ data: id }) => {
    const chapterRef =
      serverCollection<ChapterData>(CHAPTERS_COLLECTION).doc(id);
    return getServerQueryDoc(chapterRef, chapterSchema);
  });

const create = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      user: userSchema,
      data: createChapterSchema,
    })
  )
  .handler(async ({ data: { user, data } }) => {
    const validated = createChapterSchema.parse(data);
    const chaptersRef = serverCollection<ChapterData>(CHAPTERS_COLLECTION);

    const existingSnapshot = await chaptersRef
      .where("state", "==", validated.state)
      .get();

    if (!existingSnapshot.empty) {
      throw new Error("Chapter already exists for this state");
    }

    const chapterData: CreateChapterData = {
      ...validated,
      created: serverRecord(user),
    };

    await chaptersRef.add(chapterData);
  });

const update = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      id: z.string(),
      user: userSchema,
      data: updateChapterSchema,
    })
  )
  .handler(async ({ data: { id, data, user } }) => {
    const validated = updateChapterSchema.parse(data);
    const chapterRef =
      serverCollection<ChapterData>(CHAPTERS_COLLECTION).doc(id);

    const updateData: UpdateChapterData = {
      ...validated,
      updated: serverRecord(user),
    };

    await chapterRef.update(updateData);
  });

const remove = createServerFn({ method: "POST" })
  .inputValidator(z.string())
  .handler(async ({ data: id }) => {
    const chapterRef =
      serverCollection<ChapterData>(CHAPTERS_COLLECTION).doc(id);
    await chapterRef.delete();
  });

export const chapter = createBuilder(
  {
    create,
    update,
    list,
    get,
    remove,
  },
  { prefix: [CHAPTERS_COLLECTION] }
);
