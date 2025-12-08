import { useMutation } from "@tanstack/react-query";
import { upload } from ".";

export function useDocumentUpload() {
  return useMutation({
    mutationKey: upload.document.$get(),
    mutationFn: upload.$use.document,
    meta: {
      errorMessage: "Failed to upload document.",
      successMessage: "Document uploaded successfully.",
    },
  })
}

export function useImageUpload() {
  return useMutation({
    mutationKey: upload.image.$get(),
    mutationFn: upload.$use.image,
    meta: {
      errorMessage: "Failed to upload image.",
      successMessage: "Image uploaded successfully.",
    },
  })
}