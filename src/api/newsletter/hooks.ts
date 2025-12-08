import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";

import type { Options } from "@/client/options";

import { newsletter } from "./index";
import type { ListIssueVariables } from "./types";

export function useCreateNewsletterIssue() {
  return useMutation({
    mutationKey: newsletter.create.$get(),
    mutationFn: newsletter.$use.create,
    meta: {
      errorMessage: "Failed to create issue.",
      successMessage: "Newsletter issue created successfully.",
    },
  });
}

export function useUpdateNewsletterIssue() {
  return useMutation({
    mutationKey: newsletter.update.$get(),
    mutationFn: newsletter.$use.update,
    meta: {
      errorMessage: "Failed to update issue.",
      successMessage: "Newsletter issue updated successfully.",
    },
  });
}

export function useRemoveNewsletterIssue() {
  return useMutation({
    mutationKey: newsletter.remove.$get(),
    mutationFn: newsletter.$use.remove,
    meta: {
      errorMessage: "Failed to delete issue.",
      successMessage: "Newsletter issue deleted successfully.",
    },
  });
}

export function useListNewsletterIssues(
  variables?: ListIssueVariables,
  options: Options<typeof query> = {},
  query = queryOptions({
    queryKey: newsletter.list.$use(variables),
    queryFn: () => newsletter.$use.list(variables),
  })
) {
  return useQuery({ ...query, ...options });
}

export function useGetNewsletterIssue(id: string) {
  return useQuery({
    queryKey: newsletter.get.$use(id),
    queryFn: () => newsletter.$use.get(id),
    enabled: !!id,
  });
}

export function useDownloadNewsletterIssue() {
  return useMutation({
    mutationKey: newsletter.download.$get(),
    mutationFn: newsletter.$use.download,
    meta: {
      errorMessage: "Failed to download issue.",
      successMessage: "Newsletter issue downloaded successfully.",
    },
  });
}
