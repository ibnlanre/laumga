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
  orderBy,
  serverTimestamp,
  Timestamp,
  CollectionReference,
  DocumentReference,
  type WithFieldValue,
} from "firebase/firestore";
import { db } from "@/services/firebase";

/**
 * Chapter Schema
 */
export const chapterSchema = z.object({
  id: z.string(),
  name: z.string(),
  state: z.string(),
  region: z.enum([
    "North Central",
    "North East",
    "North West",
    "South East",
    "South South",
    "South West",
  ]),
  presidentId: z.string(),
  presidentName: z.string(),
  meetingVenue: z.string().optional(),
  meetingSchedule: z.string().optional(),
  contactEmail: z.email().optional(),
  contactPhone: z.string().optional(),
  memberCount: z.number().default(0),
  isActive: z.boolean().default(true),
  createdAt: z.instanceof(Timestamp),
  updatedAt: z.instanceof(Timestamp),
});

export const createChapterSchema = chapterSchema.omit({
  id: true,
  memberCount: true,
  createdAt: true,
  updatedAt: true,
});

export const updateChapterSchema = createChapterSchema.partial();

export type Chapter = z.infer<typeof chapterSchema>;
export type CreateChapterData = z.infer<typeof createChapterSchema>;
export type UpdateChapterData = z.infer<typeof updateChapterSchema>;

export type ChapterData = Omit<Chapter, "id">;
export type ChapterCollection = CollectionReference<ChapterData>;
export type ChapterDocumentReference = DocumentReference<ChapterData>;

const CHAPTERS_COLLECTION = "chapters";

/**
 * Create chapter
 */
async function create(data: CreateChapterData) {
  const validated = createChapterSchema.parse(data);

  // Check if chapter already exists for this state
  const chaptersRef = collection(
    db,
    CHAPTERS_COLLECTION
  ) as ChapterCollection;
  const existingQuery = query(
    chaptersRef,
    where("state", "==", validated.state)
  );
  const existingSnapshot = await getDocs(existingQuery);

  if (!existingSnapshot.empty) {
    throw new Error("Chapter already exists for this state");
  }

  const chapterData = {
    ...validated,
    memberCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  } satisfies WithFieldValue<ChapterData> as unknown as ChapterData;

  const docRef = await addDoc(chaptersRef, chapterData);

  return {
    id: docRef.id,
    ...chapterData,
  };
}

/**
 * Update chapter
 */
async function update(id: string, data: UpdateChapterData) {
  const validated = updateChapterSchema.parse(data);
  const chapterRef = doc(
    db,
    CHAPTERS_COLLECTION,
    id
  ) as ChapterDocumentReference;

  const updateData = {
    ...validated,
    updatedAt: serverTimestamp(),
  };

  await updateDoc(chapterRef, updateData);

  const updated = await fetchById(id);
  if (!updated) {
    throw new Error("Chapter not found after update");
  }

  return updated;
}

/**
 * Fetch all chapters
 */
async function fetchAll(filters?: {
  region?: Chapter["region"];
  state?: string;
  isActive?: boolean;
}) {
  const chaptersRef = collection(
    db,
    CHAPTERS_COLLECTION
  ) as ChapterCollection;
  let chaptersQuery = query(chaptersRef, orderBy("name", "asc"));

  // Filter by active status
  if (filters?.isActive !== undefined) {
    chaptersQuery = query(
      chaptersQuery,
      where("isActive", "==", filters.isActive)
    );
  }

  // Filter by region
  if (filters?.region) {
    chaptersQuery = query(chaptersQuery, where("region", "==", filters.region));
  }

  // Filter by state
  if (filters?.state) {
    chaptersQuery = query(chaptersQuery, where("state", "==", filters.state));
  }

  const snapshot = await getDocs(chaptersQuery);
  const chapters = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return chapterSchema.array().parse(chapters);
}

/**
 * Fetch chapter by ID
 */
async function fetchById(id: string): Promise<Chapter | null> {
  const chapterRef = doc(
    db,
    CHAPTERS_COLLECTION,
    id
  ) as ChapterDocumentReference;
  const chapterDoc = await getDoc(chapterRef);

  if (!chapterDoc.exists()) {
    return null;
  }

  const chapter = {
    id: chapterDoc.id,
    ...chapterDoc.data(),
  };

  return chapterSchema.parse(chapter);
}

/**
 * Fetch chapter by state
 */
async function fetchByState(state: string): Promise<Chapter | null> {
  const chaptersRef = collection(
    db,
    CHAPTERS_COLLECTION
  ) as ChapterCollection;
  const chapterQuery = query(chaptersRef, where("state", "==", state));
  const snapshot = await getDocs(chapterQuery);

  if (snapshot.empty) {
    return null;
  }

  const chapterDoc = snapshot.docs[0];
  const chapter = {
    id: chapterDoc.id,
    ...chapterDoc.data(),
  };

  return chapterSchema.parse(chapter);
}

/**
 * Fetch chapters by region
 */
async function fetchByRegion(region: Chapter["region"]): Promise<Chapter[]> {
  return fetchAll({ region, isActive: true });
}

/**
 * Increment member count
 */
async function incrementMemberCount(id: string): Promise<void> {
  const chapterRef = doc(
    db,
    CHAPTERS_COLLECTION,
    id
  ) as ChapterDocumentReference;
  const chapterDoc = await getDoc(chapterRef);

  if (!chapterDoc.exists()) {
    throw new Error("Chapter not found");
  }

  const currentCount = chapterDoc.data().memberCount || 0;
  await updateDoc(chapterRef, { memberCount: currentCount + 1 });
}

/**
 * Decrement member count
 */
async function decrementMemberCount(id: string): Promise<void> {
  const chapterRef = doc(
    db,
    CHAPTERS_COLLECTION,
    id
  ) as ChapterDocumentReference;
  const chapterDoc = await getDoc(chapterRef);

  if (!chapterDoc.exists()) {
    throw new Error("Chapter not found");
  }

  const currentCount = chapterDoc.data().memberCount || 0;
  await updateDoc(chapterRef, { memberCount: Math.max(0, currentCount - 1) });
}

/**
 * Delete chapter
 */
async function remove(id: string): Promise<void> {
  const chapterRef = doc(
    db,
    CHAPTERS_COLLECTION,
    id
  ) as ChapterDocumentReference;
  await deleteDoc(chapterRef);
}

export const chapter = {
  create,
  update,
  fetchAll,
  fetchById,
  fetchByState,
  fetchByRegion,
  incrementMemberCount,
  decrementMemberCount,
  remove,
};
