import { tryCatch } from "@/utils/try-catch";
import type {
  CollectionReference,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
} from "firebase/firestore";

import {
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
  Query,
  collection,
} from "firebase/firestore";
import { z } from "zod";

import type { Variables, Reference } from "../types";
import { db } from "@/services/firebase";

export function clientCollection<
  DocumentType extends DocumentData = DocumentData,
>(path: string, ...pathSegments: string[]) {
  return collection(
    db,
    path,
    ...pathSegments
  ) as CollectionReference<DocumentType>;
}

export function clientDocument<
  DocumentType extends DocumentData = DocumentData,
>(document: Reference<DocumentType>) {
  return document as DocumentType extends DocumentData
    ? DocumentReference<DocumentType>
    : Query<DocumentType>;
}

export function buildQuery<DocumentType extends DocumentData = DocumentData>(
  collection: CollectionReference<DocumentType>,
  variables: Variables<DocumentType> = {}
) {
  const { filterBy = [], sortBy = [] } = variables;

  let querySnapshot = query(collection);

  if (filterBy.length) {
    filterBy.forEach(({ field, operator, value }) => {
      querySnapshot = query(querySnapshot, where(field, operator, value));
    });
  }

  if (sortBy.length) {
    sortBy.forEach(({ field, direction }) => {
      querySnapshot = query(querySnapshot, orderBy(field, direction));
    });
  }

  return querySnapshot;
}

async function getDocument<
  DocumentType extends DocumentData,
  Schema extends z.ZodType,
>(snapshot: DocumentSnapshot<DocumentType, DocumentData>, schema: Schema) {
  if (!snapshot.exists()) return null;
  const data = { id: snapshot.id, ...snapshot.data() };
  return schema.parse(data);
}

export async function getQueryDoc<
  DocumentType extends DocumentData,
  Schema extends z.ZodType,
>(reference: Reference<DocumentType>, schema: Schema) {
  const result = await tryCatch(async () => {
    if (reference instanceof Query) {
      const result = await getDocs(reference);
      if (result.empty) return null;

      const [snapshot] = result.docs;
      return getDocument(snapshot, schema);
    }

    const snapshot = await getDoc(reference);
    return getDocument(snapshot, schema);
  });

  if (result.success) return result.data;
  return null;
}

export async function getQueryDocs<
  DocumentType extends DocumentData,
  Schema extends z.ZodType,
>(querySnapshot: Query<DocumentType>, schema: Schema) {
  const result = await tryCatch(async () => {
    const snapshot = await getDocs(querySnapshot);
    if (snapshot.empty) return [];
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return schema.array().parse(data);
  });

  if (result.success) return result.data;
  return [];
}
