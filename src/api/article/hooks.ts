import { useMutation } from "@tanstack/react-query";
import { article } from "./index";

export function useCreateArticle() {
  return useMutation({
    mutationKey: article.create.$get(),
    mutationFn: article.$use.create,
    meta: {
      errorMessage: "Failed to create article.",
      successMessage: "Article created successfully.",
    },
  });
}

export function useUpdateArticle() {
  return useMutation({
    mutationKey: article.update.$get(),
    mutationFn: article.$use.update,
    meta: {
      errorMessage: "Failed to update article.",
      successMessage: "Article updated successfully.",
    },
  });
}

export function useRemoveArticle() {
  return useMutation({
    mutationKey: article.remove.$get(),
    mutationFn: article.$use.remove,
    meta: {
      errorMessage: "Failed to delete article.",
      successMessage: "Article deleted successfully.",
    },
  });
}

export function usePublishArticle() {
  return useMutation({
    mutationKey: article.publish.$get(),
    mutationFn: article.$use.publish,
    meta: {
      errorMessage: "Failed to publish article.",
      successMessage: "Article published successfully.",
    },
  });
}

export function useArchiveArticle() {
  return useMutation({
    mutationKey: article.archive.$get(),
    mutationFn: article.$use.archive,
    meta: {
      errorMessage: "Failed to archive article.",
      successMessage: "Article archived successfully.",
    },
  });
}
