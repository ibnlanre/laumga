import { z } from "zod";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

import { storage } from "@/services/firebase";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10MB

const imageFileSchema = z
  .instanceof(File)
  .refine((file) => file.type.startsWith("image/"), {
    message: "File is not an image",
  })
  .refine((file) => file.size <= MAX_IMAGE_SIZE, {
    message: "Image size exceeds 5MB limit",
  });

const documentFileSchema = z
  .instanceof(File)
  .refine((file) => file.type.startsWith("application/"), {
    message: "File is not a document",
  })
  .refine((file) => file.size <= MAX_DOCUMENT_SIZE, {
    message: "Document size exceeds 10MB limit",
  });

async function uploadFile(file: File, folder: string) {
  const storageRef = ref(storage, `${folder}/${uuidv4()}_${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

async function uploadImage(file: File) {
  const validFile = imageFileSchema.parse(file);
  return uploadFile(validFile, "images");
}

async function uploadDocument(file: File) {
  const validFile = documentFileSchema.parse(file);
  return uploadFile(validFile, "documents");
}

export const upload = {
  image: uploadImage,
  document: uploadDocument,
};
