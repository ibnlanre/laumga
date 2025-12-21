import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createBuilder } from "@ibnlanre/builder";

import { db, storage } from "@/services/firebase-admin";
import { serverRecord } from "@/utils/server-record";
import {
  buildServerQuery,
  getServerQueryDoc,
  getServerQueryDocs,
  serverCollection,
} from "@/client/core-query/server";
import { createVariablesSchema } from "@/client/schema";

import {
  LIBRARIES_COLLECTION,
  createLibrarySchema,
  librarySchema,
  updateLibrarySchema,
} from "./schema";
import { MEDIA_COLLECTION, mediaSchema } from "../media/schema";
import type {
  CreateLibraryData,
  LibraryData,
  UpdateLibraryData,
} from "./types";
import { userSchema } from "../user/schema";
import type { MediaData } from "../media/types";

const list = createServerFn({ method: "GET" })
  .inputValidator(createVariablesSchema(librarySchema))
  .handler(async ({ data: variables }) => {
    const librariesRef = serverCollection<LibraryData>(LIBRARIES_COLLECTION);
    const query = buildServerQuery(librariesRef, variables);
    return getServerQueryDocs(query, librarySchema);
  });

const get = createServerFn({ method: "GET" })
  .inputValidator(z.string())
  .handler(async ({ data: id }) => {
    const libraryRef =
      serverCollection<LibraryData>(LIBRARIES_COLLECTION).doc(id);
    return getServerQueryDoc(libraryRef, librarySchema);
  });

const create = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      user: userSchema,
      data: createLibrarySchema,
    })
  )
  .handler(async ({ data: { user, data } }) => {
    const librariesRef =
      serverCollection<CreateLibraryData>(LIBRARIES_COLLECTION);

    await librariesRef.add({
      ...data,
      created: serverRecord(user),
    });
  });

const update = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      id: z.string(),
      user: userSchema,
      data: updateLibrarySchema,
    })
  )
  .handler(async ({ data: { id, user, data } }) => {
    const libraryRef =
      serverCollection<UpdateLibraryData>(LIBRARIES_COLLECTION).doc(id);

    await libraryRef.update({
      ...data,
      updated: serverRecord(user),
    });
  });

const remove = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data: { id } }) => {
    const mediaRef = serverCollection<MediaData>(MEDIA_COLLECTION);
    const mediaQuery = mediaRef.where("libraryId", "==", id);
    const snapshot = await mediaQuery.get();

    if (!snapshot.empty) {
      const batch = db.batch();
      const bucket = storage.bucket();

      for (const doc of snapshot.docs) {
        const media = mediaSchema.parse({ id: doc.id, ...doc.data() });
        if (media.url) {
          try {
            // Extract path from URL if possible, or assume it's stored in a way we can derive.
            // For now, we'll try to parse the path from the URL if it's a standard Firebase Storage URL.
            // Example: https://firebasestorage.googleapis.com/v0/b/[bucket]/o/[path]?alt=media...
            // Path is encoded.
            const urlObj = new URL(media.url);
            const path = decodeURIComponent(
              urlObj.pathname.split("/o/")[1]
            ).split("?")[0];
            await bucket.file(path).delete();
          } catch (error) {
            console.error("Failed to delete media file:", error);
          }
        }
        batch.delete(doc.ref);
      }
      await batch.commit();
    }

    const libraryRef =
      serverCollection<LibraryData>(LIBRARIES_COLLECTION).doc(id);
    await libraryRef.delete();
  });

export const library = createBuilder(
  {
    create,
    update,
    list,
    get,
    remove,
  },
  { prefix: [LIBRARIES_COLLECTION] }
);
