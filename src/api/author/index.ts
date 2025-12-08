import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  type DocumentReference,
} from "firebase/firestore";
import { db } from "@/services/firebase";
import { buildQuery, getQueryDoc, getQueryDocs } from "@/client/core-query";
import {
  AUTHORS_COLLECTION,
  authorSchema,
  createAuthorSchema,
  updateAuthorSchema,
} from "@/api/author/schema";
import type {
  Author,
  ListAuthorVariables,
  CreateAuthorData,
  CreateAuthorVariables,
  DownstreamAuthorCollection,
  DownstreamAuthorDocument,
  UpdateAuthorData,
  UpdateAuthorVariables,
  UpstreamAuthorCollection,
  UpstreamAuthorDocument,
} from "./types";
import { createBuilder } from "@ibnlanre/builder";
import { record } from "@/utils/record";

async function create(variables: CreateAuthorVariables) {
  const { user, data } = variables;

  const validated = createAuthorSchema.parse(data);
  const authorsRef = collection(
    db,
    AUTHORS_COLLECTION
  ) as UpstreamAuthorCollection;

  const existingQuery = query(
    authorsRef,
    where("fullName", "==", validated.fullName)
  );
  const existingSnapshot = await getDocs(existingQuery);

  if (!existingSnapshot.empty) {
    throw new Error("An author with this name already exists");
  }

  const authorData: CreateAuthorData = {
    ...validated,
    created: record(user),
  };

  if (validated.status === "published") {
    authorData.published = record(user);
  }

  await addDoc(authorsRef, authorData);
}

async function update(variables: UpdateAuthorVariables) {
  const { id, data, user } = variables;
  const validated = updateAuthorSchema.parse(data);

  const authorRef = doc(db, AUTHORS_COLLECTION, id) as UpstreamAuthorDocument;

  const updateData: UpdateAuthorData = {
    ...validated,
    updated: record(user),
  };

  if (validated.status === "published" && !validated.published) {
    updateData.published = record(user);
  }

  if (validated.status === "archived" && !validated.archived) {
    updateData.archived = record(user);
  }

  await updateDoc(authorRef, updateData);
}

async function list(variables?: ListAuthorVariables) {
  const authorsRef = collection(
    db,
    AUTHORS_COLLECTION
  ) as DownstreamAuthorCollection;

  const authorsQuery = buildQuery(authorsRef, variables);
  return await getQueryDocs(authorsQuery, authorSchema);
}

async function get(id: string) {
  const authorRef = doc(db, AUTHORS_COLLECTION, id) as DownstreamAuthorDocument;
  return await getQueryDoc(authorRef, authorSchema);
}

async function remove(id: string) {
  const authorRef = doc(
    db,
    AUTHORS_COLLECTION,
    id
  ) as DocumentReference<Author>;
  await deleteDoc(authorRef);
}

export const author = createBuilder({
  remove,
  create,
  update,
  list,
  get,
});
