import { createBuilder } from "@ibnlanre/builder";
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
import { record } from "@/utils/record";

import {
  EXECUTIVE_TENURES_COLLECTION,
  createExecutiveTenureSchema,
  executiveTenureSchema,
  updateExecutiveTenureSchema,
} from "./schema";
import type {
  CreateExecutiveTenureVariables,
  ListExecutiveTenureVariables,
  UpdateExecutiveTenureVariables,
  CreateExecutiveTenureData,
  UpdateExecutiveTenureData,
  DownstreamExecutiveTenureDocument,
  DownstreamExecutiveTenureCollection,
  UpstreamExecutiveTenureCollection,
  UpstreamExecutiveTenureDocument,
} from "./types";

async function deactivateActiveTenures(exceptId?: string) {
  const tenuresRef = collection(
    db,
    EXECUTIVE_TENURES_COLLECTION
  ) as DownstreamExecutiveTenureCollection;

  const activeQuery = query(tenuresRef, where("isActive", "==", true));
  const snapshot = await getDocs(activeQuery);

  const updates = snapshot.docs
    .filter((snapshot) => snapshot.id !== exceptId)
    .map((snapshot) => updateDoc(snapshot.ref, { isActive: false }));

  await Promise.all(updates);
}

async function create(variables: CreateExecutiveTenureVariables) {
  const { data, user } = variables;
  const validated = createExecutiveTenureSchema.parse(data);

  const tenuresRef = collection(
    db,
    EXECUTIVE_TENURES_COLLECTION
  ) as UpstreamExecutiveTenureCollection;

  if (validated.isActive) {
    await deactivateActiveTenures();
  }

  const tenureData: CreateExecutiveTenureData = {
    ...validated,
    created: record(user),
    updated: record(user),
  };

  await addDoc(tenuresRef, tenureData);
}

async function update(variables: UpdateExecutiveTenureVariables) {
  const { id, data, user } = variables;
  const validated = updateExecutiveTenureSchema.parse(data);
  const tenureRef = doc(
    db,
    EXECUTIVE_TENURES_COLLECTION,
    id
  ) as UpstreamExecutiveTenureDocument;

  if (validated.isActive) {
    await deactivateActiveTenures(id);
  }

  const updateData: UpdateExecutiveTenureData = {
    ...validated,
    updated: record(user),
  };

  await updateDoc(tenureRef, updateData);
}

async function list(variables?: ListExecutiveTenureVariables) {
  const tenuresRef = collection(
    db,
    EXECUTIVE_TENURES_COLLECTION
  ) as DownstreamExecutiveTenureCollection;

  const tenuresQuery = buildQuery(tenuresRef, variables);
  return await getQueryDocs(tenuresQuery, executiveTenureSchema);
}

async function get(id: string) {
  const tenureRef = doc(
    db,
    EXECUTIVE_TENURES_COLLECTION,
    id
  ) as DownstreamExecutiveTenureDocument;
  return await getQueryDoc(tenureRef, executiveTenureSchema);
}

async function remove(id: string) {
  const tenureRef = doc(
    db,
    EXECUTIVE_TENURES_COLLECTION,
    id
  ) as DownstreamExecutiveTenureDocument;
  await deleteDoc(tenureRef);
}

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
