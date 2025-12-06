import { z } from "zod/v4";
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
  Timestamp,
  serverTimestamp,
  CollectionReference,
} from "firebase/firestore";
import { buildQuery, getQueryDocs, type Variables } from "@/client/core-query";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "@/services/firebase";

/**
 * Gallery Collection Schema
 */
export const gallerySchema = z.object({
  id: z.string(),
  title: z.string(),
  year: z.string(),
  category: z.string(),
  coverImageUrl: z.url(),
  description: z.string(),
  isFeatured: z.boolean().default(false),
  mediaCount: z.number().default(0),
  createdAt: z.instanceof(Timestamp),
  updatedAt: z.instanceof(Timestamp),
});

export const createGallerySchema = gallerySchema.omit({
  id: true,
  mediaCount: true,
  createdAt: true,
  updatedAt: true,
});

export const updateGallerySchema = createGallerySchema.partial();

export type Gallery = z.infer<typeof gallerySchema>;
export type CreateGalleryData = z.infer<typeof createGallerySchema>;
export type UpdateGalleryData = z.infer<typeof updateGallerySchema>;

export type GalleryData = Omit<Gallery, "id">;
export type GalleryCollection = CollectionReference<GalleryData>;

/**
 * Gallery Media Schema
 */
export const galleryMediaSchema = z.object({
  id: z.string(),
  collectionId: z.string(),
  url: z.url(),
  caption: z.string().optional(),
  uploadedBy: z.string(),
  uploadedByName: z.string().optional(),
  createdAt: z.instanceof(Timestamp),
});

export const createMediaSchema = galleryMediaSchema.omit({
  id: true,
  createdAt: true,
});

export type GalleryMedia = z.infer<typeof galleryMediaSchema>;
export type CreateMediaData = z.infer<typeof createMediaSchema>;

const GALLERIES_COLLECTION = "galleries";
const MEDIA_COLLECTION = "galleryMedia";
const STORAGE_PATH = "gallery";

/**
 * Upload image to Firebase Storage
 */
async function uploadImage(
 variables: { file: File; path?: string }
): Promise<string> {
  const { file, path = STORAGE_PATH } = variables;
  
  const fileName = z.string().slugify().parse(file.name);
  const storageRef = ref(storage, `${path}/${fileName}`);

  try {
    // Check if the file already exists by attempting to get its download URL
    return await getDownloadURL(storageRef);
  } catch (error) {
    // File does not exist, proceed with upload
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }
}

/**
 * Delete image from Firebase Storage
 */
async function deleteImage(url: string): Promise<void> {
  try {
    const imageRef = ref(storage, url);
    await deleteObject(imageRef);
  } catch (error) {
    console.error("Error deleting image:", error);
  }
}

/**
 * Create gallery collection
 */
async function createCollection(data: CreateGalleryData): Promise<Gallery> {
  const validated = createGallerySchema.parse(data);

  const galleryData = {
    ...validated,
    mediaCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(
    collection(db, GALLERIES_COLLECTION),
    galleryData
  );

  const newDoc = await getDoc(docRef);
  return {
    id: newDoc.id,
    ...newDoc.data(),
  } as Gallery;
}

/**
 * Update gallery collection
 */
async function updateCollection(
  id: string,
  data: UpdateGalleryData
): Promise<Gallery> {
  const validated = updateGallerySchema.parse(data);
  const galleryRef = doc(db, GALLERIES_COLLECTION, id);

  const updateData = {
    ...validated,
    updatedAt: serverTimestamp(),
  };

  await updateDoc(galleryRef, updateData);

  const updated = await fetchCollectionById(id);
  if (!updated) {
    throw new Error("Gallery not found after update");
  }

  return updated;
}

/**
 * Fetch all gallery collections
 */
async function fetchCollections(
  variables?: Variables<GalleryData>
): Promise<Gallery[]> {
  const galleriesRef = collection(
    db,
    GALLERIES_COLLECTION
  ) as GalleryCollection;

  const q = buildQuery(galleriesRef, variables);
  const docs = await getQueryDocs(q);

  return gallerySchema.array().parse(docs);
}

/**
 * Fetch gallery collection by ID
 */
async function fetchCollectionById(id: string): Promise<Gallery | null> {
  const galleryRef = doc(db, GALLERIES_COLLECTION, id);
  const galleryDoc = await getDoc(galleryRef);

  if (!galleryDoc.exists()) {
    return null;
  }

  const gallery = {
    id: galleryDoc.id,
    ...galleryDoc.data(),
  };

  return gallerySchema.parse(gallery);
}

/**
 * Delete gallery collection
 */
async function deleteCollection(id: string): Promise<void> {
  // Delete all media in this collection first
  const media = await fetchMedia(id);
  for (const item of media) {
    await deleteMedia(item.id);
  }

  // Delete the collection
  const galleryRef = doc(db, GALLERIES_COLLECTION, id);
  await deleteDoc(galleryRef);
}

/**
 * Add media to gallery collection
 */
async function addMedia(data: CreateMediaData): Promise<GalleryMedia> {
  const validated = createMediaSchema.parse(data);

  const mediaData = {
    ...validated,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, MEDIA_COLLECTION), mediaData);

  // Increment media count in gallery
  const galleryRef = doc(db, GALLERIES_COLLECTION, data.collectionId);
  const galleryDoc = await getDoc(galleryRef);
  if (galleryDoc.exists()) {
    const currentCount = galleryDoc.data().mediaCount || 0;
    await updateDoc(galleryRef, { mediaCount: currentCount + 1 });
  }

  const newDoc = await getDoc(docRef);
  return {
    id: newDoc.id,
    ...newDoc.data(),
  } as GalleryMedia;
}

/**
 * Fetch media for a gallery collection
 */
async function fetchMedia(collectionId: string): Promise<GalleryMedia[]> {
  const mediaRef = collection(db, MEDIA_COLLECTION);
  const mediaQuery = query(
    mediaRef,
    where("collectionId", "==", collectionId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(mediaQuery);

  const media = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return galleryMediaSchema.array().parse(media);
}

/**
 * Delete media from gallery
 */
async function deleteMedia(id: string): Promise<void> {
  const mediaRef = doc(db, MEDIA_COLLECTION, id);
  const mediaDoc = await getDoc(mediaRef);

  if (!mediaDoc.exists()) {
    throw new Error("Media not found");
  }

  const mediaData = mediaDoc.data();

  // Delete from storage
  await deleteImage(mediaData.url);

  // Delete from Firestore
  await deleteDoc(mediaRef);

  // Decrement media count in gallery
  const galleryRef = doc(db, GALLERIES_COLLECTION, mediaData.collectionId);
  const galleryDoc = await getDoc(galleryRef);
  if (galleryDoc.exists()) {
    const currentCount = galleryDoc.data().mediaCount || 0;
    await updateDoc(galleryRef, { mediaCount: Math.max(0, currentCount - 1) });
  }
}

export const gallery = {
  uploadImage,
  deleteImage,
  createCollection,
  updateCollection,
  fetchCollections,
  fetchCollectionById,
  deleteCollection,
  addMedia,
  fetchMedia,
  deleteMedia,
};
