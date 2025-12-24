import { db } from "@/services/firebase-admin";
import { Query } from "firebase-admin/firestore";
import type { DocumentData } from "firebase/firestore";
import type { Variables } from "../types";

import { z } from "zod";
import { tryCatch } from "@/utils/try-catch";

export function serverCollection<
  DocumentType extends DocumentData = DocumentData,
>(collectionPath: string) {
  return db.collection(
    collectionPath
  ) as FirebaseFirestore.CollectionReference<DocumentType>;
}

export function serverDocument<
  DocumentType extends DocumentData = DocumentData,
>(
  document:
    | FirebaseFirestore.DocumentReference<DocumentType>
    | FirebaseFirestore.Query<DocumentType>
) {
  return document as DocumentType extends DocumentData
    ? FirebaseFirestore.DocumentReference<DocumentType>
    : FirebaseFirestore.Query<DocumentType>;
}

export function buildServerQuery<
  DocumentType extends DocumentData = DocumentData,
>(
  collection: FirebaseFirestore.CollectionReference<DocumentType>,
  variables: Variables<DocumentType> = {}
) {
  const { filterBy = [], sortBy = [] } = variables;

  let querySnapshot: FirebaseFirestore.Query<DocumentType> = collection;

  if (filterBy.length) {
    filterBy.forEach(({ field, operator, value }) => {
      querySnapshot = querySnapshot.where(field, operator, value);
    });
  }

  if (sortBy.length) {
    sortBy.forEach(({ field, direction }) => {
      querySnapshot = querySnapshot.orderBy(field, direction);
    });
  }

  return querySnapshot;
}

async function getServerDocument<
  DocumentType extends DocumentData,
  Schema extends z.ZodType,
>(
  snapshot: FirebaseFirestore.DocumentSnapshot<DocumentType, DocumentData>,
  schema: Schema
) {
  if (!snapshot.exists) return null;
  const data = { id: snapshot.id, ...snapshot.data() };
  return schema.parse(data);
}

export async function getServerQueryDoc<
  DocumentType extends DocumentData,
  Schema extends z.ZodType,
>(
  reference:
    | FirebaseFirestore.DocumentReference<DocumentType>
    | FirebaseFirestore.Query<DocumentType>,
  schema: Schema
) {
  const result = await tryCatch(async () => {
    if (reference instanceof Query) {
      const result = await reference.get();
      if (result.empty) return null;

      const [snapshot] = result.docs;
      return getServerDocument(snapshot, schema);
    }

    const snapshot = await reference.get();
    return getServerDocument(snapshot, schema);
  });

  if (result.success) return result.data;
  console.error("getServerQueryDoc failed:", result.error);
  return null;
}

export async function getServerQueryDocs<
  DocumentType extends DocumentData,
  Schema extends z.ZodType,
>(querySnapshot: FirebaseFirestore.Query<DocumentType>, schema: Schema) {
  const result = await tryCatch(async () => {
    const snapshot = await querySnapshot.get();
    if (snapshot.empty) return [];
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return schema.array().parse(data);
  });

  if (result.success) return result.data;
  console.error("getServerQueryDocs failed:", result.error);
  return [];
}
