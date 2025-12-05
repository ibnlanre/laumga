import { z } from "zod";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  Timestamp,
  CollectionReference,
  DocumentReference,
  type WithFieldValue,
} from "firebase/firestore";
import { db } from "@/services/firebase";
import { buildQuery, getQueryDocs, type Variables } from "@/client/core-query";

/**
 * Executive Schema
 */
export const executiveSchema = z.object({
  id: z.string(),
  userId: z.string(),
  displayName: z.string(),
  photoUrl: z.url(),
  role: z.string(),
  tier: z.enum(["presidential", "council", "directorate"]),
  tenureYear: z.string(),
  portfolio: z.string().optional(),
  quote: z.string().optional(),
  email: z.email().optional(),
  phone: z.string().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.instanceof(Timestamp),
  updatedAt: z.instanceof(Timestamp),
});

export const createExecutiveSchema = executiveSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateExecutiveSchema = createExecutiveSchema.partial();

export type Executive = z.infer<typeof executiveSchema>;
export type CreateExecutiveData = z.infer<typeof createExecutiveSchema>;
export type UpdateExecutiveData = z.infer<typeof updateExecutiveSchema>;

export type ExecutiveData = Omit<Executive, "id">;
export type ExecutiveCollectionReference = CollectionReference<ExecutiveData>;
export type ExecutiveDocumentReference = DocumentReference<ExecutiveData>;

const EXECUTIVES_COLLECTION = "executives";

/**
 * Create executive member
 */
async function create(data: CreateExecutiveData) {
  const validated = createExecutiveSchema.parse(data);

  const executiveData = {
    ...validated,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  } satisfies WithFieldValue<ExecutiveData> as unknown as ExecutiveData;

  const executivesRef = collection(
    db,
    EXECUTIVES_COLLECTION
  ) as ExecutiveCollectionReference;
  const docRef = await addDoc(executivesRef, executiveData);

  return {
    id: docRef.id,
    ...executiveData,
  };
}

/**
 * Update executive member
 */
async function update(id: string, data: UpdateExecutiveData) {
  const validated = updateExecutiveSchema.parse(data);
  const executiveRef = doc(
    db,
    EXECUTIVES_COLLECTION,
    id
  ) as ExecutiveDocumentReference;

  const updateData = {
    ...validated,
    updatedAt: serverTimestamp(),
  };

  await updateDoc(executiveRef, updateData);

  const updated = await fetchById(id);
  if (!updated) {
    throw new Error("Executive not found after update");
  }

  return updated;
}

/**
 * Fetch all executives
 */
async function fetchAll(variables?: Variables<ExecutiveData>) {
  const executivesRef = collection(
    db,
    EXECUTIVES_COLLECTION
  ) as ExecutiveCollectionReference;

  const q = buildQuery(executivesRef, variables);
  const docs = await getQueryDocs(q);

  // Keep post-processing ordering (presidential first) to preserve behaviour
  const parsedExecutives = executiveSchema.array().parse(docs);
  const tierOrder = { presidential: 0, council: 1, directorate: 2 };
  parsedExecutives.sort((a, b) => tierOrder[a.tier] - tierOrder[b.tier]);

  return parsedExecutives;
}

/**
 * Fetch executive by ID
 */
async function fetchById(id: string): Promise<Executive | null> {
  const executiveRef = doc(
    db,
    EXECUTIVES_COLLECTION,
    id
  ) as ExecutiveDocumentReference;
  const executiveDoc = await getDoc(executiveRef);

  if (!executiveDoc.exists()) {
    return null;
  }

  const executive = {
    id: executiveDoc.id,
    ...executiveDoc.data(),
  };

  return executiveSchema.parse(executive);
}

/**
 * Fetch executive by user ID
 */
async function fetchByUserId(userId: string): Promise<Executive | null> {
  const executivesRef = collection(
    db,
    EXECUTIVES_COLLECTION
  ) as ExecutiveCollectionReference;
  const executiveQuery = query(
    executivesRef,
    where("userId", "==", userId),
    where("isActive", "==", true)
  );
  const snapshot = await getDocs(executiveQuery);

  if (snapshot.empty) {
    return null;
  }

  const executiveDoc = snapshot.docs[0];
  const executive = {
    id: executiveDoc.id,
    ...executiveDoc.data(),
  };

  return executiveSchema.parse(executive);
}

/**
 * Fetch current executives (active tenure)
 */
async function fetchCurrent(): Promise<Executive[]> {
  const currentYear = new Date().getFullYear().toString();
  return fetchAll({
    filterBy: [
      { field: "tenureYear", operator: "==", value: currentYear },
      { field: "isActive", operator: "==", value: true },
    ],
  });
}

/**
 * Fetch all tenure years
 */
async function fetchTenureYears(): Promise<string[]> {
  const executivesRef = collection(
    db,
    EXECUTIVES_COLLECTION
  ) as ExecutiveCollectionReference;
  const snapshot = await getDocs(executivesRef);

  const years = new Set<string>();
  snapshot.docs.forEach((doc) => {
    const data = doc.data();
    if (data.tenureYear) {
      years.add(data.tenureYear);
    }
  });

  return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a));
}

/**
 * Delete executive member
 */
async function remove(id: string): Promise<void> {
  const executiveRef = doc(
    db,
    EXECUTIVES_COLLECTION,
    id
  ) as ExecutiveDocumentReference;
  await deleteDoc(executiveRef);
}

export const executive = {
  create,
  update,
  fetchAll,
  fetchById,
  fetchByUserId,
  fetchCurrent,
  fetchTenureYears,
  remove,
};
