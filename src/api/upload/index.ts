import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { storage } from "@/services/firebase";
import { slugCodec, imageFileSchema, documentFileSchema } from "./schema";
import { createBuilder } from "@ibnlanre/builder";

async function uploadIfNeeded(folder: string, file: File) {
  const storageRef = ref(storage, folder);
  try {
    return await getDownloadURL(storageRef);
  } catch {
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }
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

async function image(file: File) {
  const validFile = imageFileSchema.parse(file);
  return await uploadFile(validFile, "images");
}

async function document(file: File) {
  const validFile = documentFileSchema.parse(file);
  return await uploadFile(validFile, "documents");
}

export const upload = createBuilder({
  image,
  document,
});
