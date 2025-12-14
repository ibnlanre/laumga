import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { createBuilder } from "@ibnlanre/builder";
import prettyBytes from "pretty-bytes";

import { db, storage } from "@/services/firebase";
import { buildQuery, getQueryDoc, getQueryDocs } from "@/client/core-query";
import { record } from "@/utils/record";
import {
  MEDIA_COLLECTION,
  createMediaSchema,
  mediaSchema,
  updateMediaSchema,
} from "./schema";
import type {
  CreateMediaData,
  CreateMediaVariables,
  DownstreamMediaCollection,
  DownstreamMediaDocument,
  ListMediaVariables,
  UpdateMediaVariables,
  UpstreamMediaCollection,
  UpstreamMediaDocument,
} from "./types";

async function list(variables?: ListMediaVariables) {
  const mediaRef = collection(
    db,
    MEDIA_COLLECTION
  ) as DownstreamMediaCollection;

  const mediaQuery = buildQuery(mediaRef, variables);
  return await getQueryDocs(mediaQuery, mediaSchema);
}

async function get(id: string) {
  const mediaRef = doc(db, MEDIA_COLLECTION, id) as DownstreamMediaDocument;

  return await getQueryDoc(mediaRef, mediaSchema);
}

export function getFeaturedMedia() {
  const mediaRef = collection(
    db,
    MEDIA_COLLECTION
  ) as DownstreamMediaCollection;

  const variables: ListMediaVariables = {
    filterBy: [{ field: "isFeatured", operator: "==", value: true }],
    sortBy: [{ field: "uploaded", value: "desc" }],
  };

  const mediaQuery = buildQuery(mediaRef, variables);
  return getQueryDocs(mediaQuery, mediaSchema);
}

async function create(variables: CreateMediaVariables) {
  const { user, data } = variables;

  const validated = createMediaSchema.parse(data);
  const mediaRef = collection(db, MEDIA_COLLECTION) as UpstreamMediaCollection;

  const mediaData: CreateMediaData = createMediaSchema.parse({
    ...validated,
    uploaded: record(user),
    size: prettyBytes(parseInt(validated.size || "0", 10)),
  });

  await addDoc(mediaRef, mediaData);
}

async function update(variables: UpdateMediaVariables) {
  const { id, data } = variables;
  const validated = updateMediaSchema.parse(data);

  const mediaRef = doc(db, MEDIA_COLLECTION, id) as UpstreamMediaDocument;

  await updateDoc(mediaRef, {
    ...validated,
  });
}

async function remove(id: string) {
  const mediaRef = doc(db, MEDIA_COLLECTION, id) as DownstreamMediaDocument;

  const media = await getQueryDoc(mediaRef, mediaSchema);
  if (!media) return;

  await deleteStorageObject(media.url);
  await deleteDoc(mediaRef);
}

async function deleteStorageObject(url: string) {
  if (!url) return;

  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch (error) {
    console.warn("Failed to delete gallery media", error);
  }
}

export const media = createBuilder({
  create,
  update,
  list,
  get,
  remove,
  getFeaturedMedia,
});
