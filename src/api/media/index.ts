import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createBuilder } from "@ibnlanre/builder";
import prettyBytes from "pretty-bytes";

import { storage } from "@/services/firebase-admin";
import {
  buildServerQuery,
  getServerQueryDoc,
  getServerQueryDocs,
  serverCollection,
} from "@/client/core-query/server";
import { serverRecord } from "@/utils/server-record";
import {
  MEDIA_COLLECTION,
  createMediaSchema,
  mediaSchema,
  updateMediaSchema,
} from "./schema";
import type {
  CreateMediaData,
  ListMediaVariables,
  MediaData,
  UpdateMediaData,
} from "./types";
import { userSchema } from "../user/schema";
import { createVariablesSchema } from "@/client/schema";

const list = createServerFn({ method: "GET" })
  .inputValidator(createVariablesSchema(mediaSchema))
  .handler(async ({ data: variables }) => {
    const mediaRef = serverCollection<MediaData>(MEDIA_COLLECTION);
    const mediaQuery = buildServerQuery(mediaRef, variables);
    return await getServerQueryDocs(mediaQuery, mediaSchema);
  });

const get = createServerFn({ method: "GET" })
  .inputValidator(z.string())
  .handler(async ({ data: id }) => {
    const mediaRef = serverCollection<MediaData>(MEDIA_COLLECTION).doc(id);
    return await getServerQueryDoc(mediaRef, mediaSchema);
  });

const getFeaturedMedia = createServerFn({ method: "GET" }).handler(async () => {
  const mediaRef = serverCollection<MediaData>(MEDIA_COLLECTION);
  const variables: ListMediaVariables = {
    filterBy: [{ field: "isFeatured", operator: "==", value: true }],
    sortBy: [{ field: "uploaded", direction: "desc" }],
  };
  const mediaQuery = buildServerQuery(mediaRef, variables);
  return getServerQueryDocs(mediaQuery, mediaSchema);
});

const create = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      data: createMediaSchema,
      user: userSchema,
    })
  )
  .handler(async ({ data }) => {
    const { user, data: mediaData } = data;

    const validated = createMediaSchema.parse(mediaData);
    const mediaRef = serverCollection<CreateMediaData>(MEDIA_COLLECTION);

    const newMediaData: CreateMediaData = createMediaSchema.parse({
      ...validated,
      uploaded: serverRecord(user),
      size: prettyBytes(parseInt(validated.size || "0", 10)),
    });

    await mediaRef.add(newMediaData);
  });

const update = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      id: z.string(),
      data: updateMediaSchema,
      user: userSchema,
    })
  )
  .handler(async ({ data }) => {
    const { id, data: updateData } = data;

    const validated = updateMediaSchema.parse(updateData);
    const mediaRef =
      serverCollection<UpdateMediaData>(MEDIA_COLLECTION).doc(id);

    await mediaRef.update({
      ...validated,
    });
  });

const remove = createServerFn({ method: "POST" })
  .inputValidator(z.string())
  .handler(async ({ data: id }) => {
    const mediaRef = serverCollection<MediaData>(MEDIA_COLLECTION).doc(id);
    const media = await getServerQueryDoc(mediaRef, mediaSchema);
    if (!media) return;

    await deleteStorageObject(media.url);
    await mediaRef.delete();
  });

async function deleteStorageObject(url: string) {
  if (!url) return;
  try {
    const bucket = storage.bucket();
    const urlObj = new URL(url);
    const path = decodeURIComponent(urlObj.pathname.split("/o/")[1]).split(
      "?"
    )[0];
    await bucket.file(path).delete();
  } catch (error) {
    console.error("Error deleting file:", error);
  }
}

export const media = createBuilder(
  {
    create,
    update,
    list,
    get,
    remove,
    getFeaturedMedia,
  },
  { prefix: [MEDIA_COLLECTION] }
);
