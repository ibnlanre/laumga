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
import { db } from "@/services/firebase";
import { buildQuery, getQueryDoc, getQueryDocs } from "@/client/core-query";
import { createBuilder } from "@ibnlanre/builder";
import {
  CHAPTERS_COLLECTION,
  chapterSchema,
  createChapterSchema,
} from "./schema";
import type {
  ListChapterVariables,
  CreateChapterData,
  DownstreamChapterCollection,
  DownstreamChapterDocument,
  UpstreamChapterCollection,
  UpstreamChapterDocument,
  UpdateChapterData,
  UpdateChapterVariables,
  CreateChapterVariables,
} from "./types";
import { record } from "@/utils/record";
import { updateChapterSchema } from "./schema";

async function create(variables: CreateChapterVariables) {
  const { data, user } = variables;

  const validated = createChapterSchema.parse(data);
  const chaptersRef = collection(
    db,
    CHAPTERS_COLLECTION
  ) as UpstreamChapterCollection;

  const existingQuery = query(
    chaptersRef,
    where("state", "==", validated.state)
  );
  const existingSnapshot = await getDocs(existingQuery);

  if (!existingSnapshot.empty) {
    throw new Error("Chapter already exists for this state");
  }

  const chapterData: CreateChapterData = {
    ...validated,
    created: record(user),
    updated: record(user),
  };

  await addDoc(chaptersRef, chapterData);
}

async function update(variables: UpdateChapterVariables) {
  const { id, data, user } = variables;
  const validated = updateChapterSchema.parse(data);
  const chapterRef = doc(
    db,
    CHAPTERS_COLLECTION,
    id
  ) as UpstreamChapterDocument;

  const updateData: UpdateChapterData = {
    ...validated,
    updated: record(user),
  };

  await updateDoc(chapterRef, updateData);
}

async function list(variables?: ListChapterVariables) {
  const chaptersRef = collection(
    db,
    CHAPTERS_COLLECTION
  ) as DownstreamChapterCollection;

  const chaptersQuery = buildQuery(chaptersRef, variables);
  return await getQueryDocs(chaptersQuery, chapterSchema);
}

async function get(id: string) {
  const chapterRef = doc(
    db,
    CHAPTERS_COLLECTION,
    id
  ) as DownstreamChapterDocument;
  return await getQueryDoc(chapterRef, chapterSchema);
}

async function remove(id: string) {
  const chapterRef = doc(
    db,
    CHAPTERS_COLLECTION,
    id
  ) as UpstreamChapterDocument;
  await deleteDoc(chapterRef);
}

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
