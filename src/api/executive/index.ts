import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { createBuilder } from "@ibnlanre/builder";

import { db } from "@/services/firebase";
import { buildQuery, getQueryDoc, getQueryDocs } from "@/client/core-query";
import { record } from "@/utils/record";
import {
  EXECUTIVE_TENURES_COLLECTION,
  executiveTenureSchema,
} from "@/api/executive-tenure/schema";
import type { UpstreamExecutiveTenureDocument } from "@/api/executive-tenure/types";
import {
  EXECUTIVES_COLLECTION,
  createExecutiveSchema,
  executiveSchema,
  updateExecutiveSchema,
} from "./schema";
import type {
  CreateExecutiveVariables,
  UpdateExecutiveVariables,
  ListExecutiveVariables,
  UpstreamExecutiveCollection,
  UpstreamExecutiveDocument,
  DownstreamExecutiveCollection,
  DownstreamExecutiveDocument,
  CreateExecutiveData,
  UpdateExecutiveData,
} from "./types";

async function create(variables: CreateExecutiveVariables) {
  const { data, user } = variables;
  const validated = createExecutiveSchema.parse(data);

  const tenureRef = doc(
    db,
    EXECUTIVE_TENURES_COLLECTION,
    validated.tenureId
  ) as UpstreamExecutiveTenureDocument;

  const ref = await getQueryDoc(tenureRef, executiveTenureSchema);
  if (!ref) throw new Error("Selected tenure does not exist");

  const executivesRef = collection(
    db,
    EXECUTIVES_COLLECTION
  ) as UpstreamExecutiveCollection;

  const executiveData: CreateExecutiveData = {
    ...validated,
    created: record(user),
    updated: record(user),
  };

  await addDoc(executivesRef, executiveData);
}

async function update(variables: UpdateExecutiveVariables) {
  const { id, data, user } = variables;
  const validated = updateExecutiveSchema.parse(data);

  const executiveRef = doc(
    db,
    EXECUTIVES_COLLECTION,
    id
  ) as UpstreamExecutiveDocument;

  const updateData: UpdateExecutiveData = {
    ...validated,
    updated: record(user),
  };

  await updateDoc(executiveRef, updateData);
}

async function list(variables?: ListExecutiveVariables) {
  const executivesRef = collection(
    db,
    EXECUTIVES_COLLECTION
  ) as DownstreamExecutiveCollection;

  const executivesQuery = buildQuery(executivesRef, variables);
  return await getQueryDocs(executivesQuery, executiveSchema);
}

async function get(id: string) {
  const executiveRef = doc(
    db,
    EXECUTIVES_COLLECTION,
    id
  ) as DownstreamExecutiveDocument;
  return await getQueryDoc(executiveRef, executiveSchema);
}

async function remove(id: string) {
  const executiveRef = doc(
    db,
    EXECUTIVES_COLLECTION,
    id
  ) as UpstreamExecutiveDocument;
  await deleteDoc(executiveRef);
}

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
