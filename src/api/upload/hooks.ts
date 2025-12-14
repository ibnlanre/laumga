import { useMutation } from "@tanstack/react-query";
import { upload } from ".";

export function useUserImageUpload() {
  return useMutation({
    mutationKey: upload.userImage.$get(),
    mutationFn: upload.$use.userImage,
    meta: {
      errorMessage: "Failed to upload image.",
      successMessage: "Image uploaded successfully.",
    },
  });
}

export function useGalleryImageUpload() {
  return useMutation({
    mutationKey: upload.galleryImage.$get(),
    mutationFn: upload.$use.galleryImage,
    meta: {
      errorMessage: "Failed to upload image.",
      successMessage: "Image uploaded successfully.",
    },
  });
}

export function useDocumentUpload() {
  return useMutation({
    mutationKey: upload.document.$get(),
    mutationFn: upload.$use.document,
    meta: {
      errorMessage: "Failed to upload document.",
      successMessage: "Document uploaded successfully.",
    },
  });
}
