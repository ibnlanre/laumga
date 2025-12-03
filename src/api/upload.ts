import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

import { storage } from "@/services/firebase";

async function uploadFile(file: File, folder: string) {
  const storageRef = ref(storage, `${folder}/${uuidv4()}_${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

async function uploadImage(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("File is not an image");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Image size exceeds 5MB limit");
  }

  return uploadFile(file, "images");
}

async function uploadDocument(file: File) {
  if (!file.type.startsWith("application/")) {
    throw new Error("File is not a document");
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Document size exceeds 10MB limit");
  }

  return uploadFile(file, "documents");
}

export const upload = {
  image: uploadImage,
  document: uploadDocument,
};
