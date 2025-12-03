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
} from "firebase/firestore";
import { db } from "@/services/firebase";

/**
 * Executive Schema
 */
export const executiveSchema = z.object({
  id: z.string(),
  userId: z.string(),
  displayName: z.string(),
  photoUrl: z.string().url(),
  role: z.string(),
  tier: z.enum(["presidential", "council", "directorate"]),
  tenureYear: z.string(),
  portfolio: z.string().optional(),
  quote: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.number(),
  updatedAt: z.number(),
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

const EXECUTIVES_COLLECTION = "executives";

/**
 * Create executive member
 */
async function create(data: CreateExecutiveData): Promise<Executive> {
  const validated = createExecutiveSchema.parse(data);
  const now = Date.now();

  const executiveData = {
    ...validated,
    createdAt: now,
    updatedAt: now,
  };

  const docRef = await addDoc(
    collection(db, EXECUTIVES_COLLECTION),
    executiveData
  );

  return {
    id: docRef.id,
    ...executiveData,
  };
}

/**
 * Update executive member
 */
async function update(
  id: string,
  data: UpdateExecutiveData
): Promise<Executive> {
  const validated = updateExecutiveSchema.parse(data);
  const executiveRef = doc(db, EXECUTIVES_COLLECTION, id);

  const updateData = {
    ...validated,
    updatedAt: Date.now(),
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
async function fetchAll(filters?: {
  tier?: Executive["tier"];
  tenureYear?: string;
  isActive?: boolean;
}): Promise<Executive[]> {
  const executivesRef = collection(db, EXECUTIVES_COLLECTION);
  let executivesQuery = query(executivesRef);

  // Filter by active status
  if (filters?.isActive !== undefined) {
    executivesQuery = query(
      executivesQuery,
      where("isActive", "==", filters.isActive)
    );
  }

  // Filter by tier
  if (filters?.tier) {
    executivesQuery = query(executivesQuery, where("tier", "==", filters.tier));
  }

  // Filter by tenure year
  if (filters?.tenureYear) {
    executivesQuery = query(
      executivesQuery,
      where("tenureYear", "==", filters.tenureYear)
    );
  }

  // Order by tier (presidential first)
  const tierOrder = { presidential: 0, council: 1, directorate: 2 };
  const snapshot = await getDocs(executivesQuery);
  const executives = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Executive[];

  // Sort by tier hierarchy
  executives.sort((a, b) => tierOrder[a.tier] - tierOrder[b.tier]);

  return executiveSchema.array().parse(executives);
}

/**
 * Fetch executive by ID
 */
async function fetchById(id: string): Promise<Executive | null> {
  const executiveRef = doc(db, EXECUTIVES_COLLECTION, id);
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
  const executivesRef = collection(db, EXECUTIVES_COLLECTION);
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
  return fetchAll({ tenureYear: currentYear, isActive: true });
}

/**
 * Fetch all tenure years
 */
async function fetchTenureYears(): Promise<string[]> {
  const executivesRef = collection(db, EXECUTIVES_COLLECTION);
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
  const executiveRef = doc(db, EXECUTIVES_COLLECTION, id);
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
