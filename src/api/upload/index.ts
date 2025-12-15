import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { createBuilder } from "@ibnlanre/builder";

import { storage } from "@/services/firebase";
import { getFirebaseErrorMessage } from "@/utils/firebase-errors";
import { tryCatch } from "@/utils/try-catch";
import { slugCodec, imageFileSchema, documentFileSchema } from "./schema";

async function uploadIfNeeded(folder: string, file: File) {
  const storageRef = ref(storage, folder);
  const existing = await tryCatch(() => getDownloadURL(storageRef));
  if (existing.success) return existing.data;

  const uploadResult = await tryCatch(() => uploadBytes(storageRef, file));
  if (!uploadResult.success) {
    throw new Error(
      getFirebaseErrorMessage(
        uploadResult.error,
        "Couldn't upload the file. Please try again."
      )
    );
  }

  const downloadResult = await tryCatch(() => getDownloadURL(storageRef));
  if (!downloadResult.success) {
    throw new Error(
      getFirebaseErrorMessage(
        downloadResult.error,
        "Couldn't retrieve the uploaded file. Please try again."
      )
    );
  }

  return downloadResult.data;
}

async function hashFile(file: File) {
  if (typeof crypto.subtle !== "undefined") {
    const buffer = await file.arrayBuffer();
    const digest = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(digest));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  return `${file.size}-${file.lastModified}`;
}

async function uploadFile(file: File, path: string) {
  const name = slugCodec.parse(file.name);
  const fingerprint = await hashFile(file);
  const folder = [path, fingerprint, name].join("/");
  return await uploadIfNeeded(folder, file);
}

async function userImage(file: File) {
  const validFile = imageFileSchema.parse(file);
  return await uploadFile(validFile, "passports");
}

async function galleryImage(file: File) {
  const validFile = imageFileSchema.parse(file);
  return await uploadFile(validFile, "gallery");
}

async function document(file: File) {
  const validFile = documentFileSchema.parse(file);
  return await uploadFile(validFile, "documents");
}

export const upload = createBuilder({
  userImage,
  galleryImage,
  document,
});
