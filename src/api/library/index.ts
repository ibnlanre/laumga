import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { createBuilder } from "@ibnlanre/builder";

import { db, storage } from "@/services/firebase";
import { buildQuery, getQueryDoc, getQueryDocs } from "@/client/core-query";
import { record } from "@/utils/record";
import {
  LIBRARIES_COLLECTION,
  createLibrarySchema,
  librarySchema,
  updateLibrarySchema,
} from "./schema";
import { MEDIA_COLLECTION, mediaSchema } from "../media/schema";
import type {
  CreateLibraryVariables,
  DownstreamLibraryCollection,
  DownstreamLibraryDocument,
  ListLibraryVariables,
  RemoveLibraryVariables,
  UpstreamLibraryCollection,
  UpstreamLibraryDocument,
  UpdateLibraryVariables,
} from "./types";

async function create(variables: CreateLibraryVariables) {
  const { data, user } = variables;
  const validated = createLibrarySchema.parse(data);

  const librariesRef = collection(
    db,
    LIBRARIES_COLLECTION
  ) as UpstreamLibraryCollection;

  await addDoc(librariesRef, {
    ...validated,
    created: record(user),
  });
}

async function update(variables: UpdateLibraryVariables) {
  const { id, data, user } = variables;
  const validated = updateLibrarySchema.parse(data);

  const libraryRef = doc(
    db,
    LIBRARIES_COLLECTION,
    id
  ) as UpstreamLibraryDocument;

  await updateDoc(libraryRef, {
    ...validated,
    updated: record(user),
  });
}

async function list(variables?: ListLibraryVariables) {
  const librariesRef = collection(
    db,
    LIBRARIES_COLLECTION
  ) as DownstreamLibraryCollection;

  const librariesQuery = buildQuery(librariesRef, variables);
  return await getQueryDocs(librariesQuery, librarySchema);
}

async function get(id: string) {
  const libraryRef = doc(
    db,
    LIBRARIES_COLLECTION,
    id
  ) as DownstreamLibraryDocument;

  return await getQueryDoc(libraryRef, librarySchema);
}

async function remove(variables: RemoveLibraryVariables) {
  const { id } = variables;

  const mediaRef = collection(db, MEDIA_COLLECTION);
  const mediaQuery = query(mediaRef, where("libraryId", "==", id));
  const snapshot = await getDocs(mediaQuery);

  if (snapshot.empty) return;

  for (const document of snapshot.docs) {
    const media = mediaSchema.parse({ id: document.id, ...document.data() });
    if (media.url) await deleteMediaFromStorage(media.url);
    await deleteDoc(doc(db, MEDIA_COLLECTION, media.id));
  }

  const libraryRef = doc(
    db,
    LIBRARIES_COLLECTION,
    id
  ) as UpstreamLibraryDocument;

  await deleteDoc(libraryRef);
}

async function deleteMediaFromStorage(url: string) {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch (error) {}
}

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
