import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { author } from "./index";

export function useCreateAuthor() {
  return useMutation({
    mutationKey: author.create.$get(),
    mutationFn: useServerFn(author.$use.create),
    meta: {
      errorMessage: "Failed to create author.",
      successMessage: "Author created successfully.",
    },
  });
}

export function useUpdateAuthor() {
  return useMutation({
    mutationKey: author.update.$get(),
    mutationFn: useServerFn(author.$use.update),
    meta: {
      errorMessage: "Failed to update author.",
      successMessage: "Author updated successfully.",
    },
  });
}

export function useRemoveAuthor() {
  return useMutation({
    mutationKey: author.remove.$get(),
    mutationFn: useServerFn(author.$use.remove),
    meta: {
      errorMessage: "Failed to delete author.",
      successMessage: "Author deleted successfully.",
    },
  });
}
