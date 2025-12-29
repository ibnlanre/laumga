import { useMutation, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { newsletter } from "./index";

export function useCreateNewsletterIssue() {
  return useMutation({
    mutationKey: newsletter.create.$get(),
    mutationFn: useServerFn(newsletter.$use.create),
    meta: {
      errorMessage: "Failed to create issue.",
      successMessage: "Newsletter issue created successfully.",
    },
  });
}

export function useUpdateNewsletterIssue() {
  return useMutation({
    mutationKey: newsletter.update.$get(),
    mutationFn: useServerFn(newsletter.$use.update),
    meta: {
      errorMessage: "Failed to update issue.",
      successMessage: "Newsletter issue updated successfully.",
    },
  });
}

export function useRemoveNewsletterIssue() {
  return useMutation({
    mutationKey: newsletter.remove.$get(),
    mutationFn: useServerFn(newsletter.$use.remove),
    meta: {
      errorMessage: "Failed to delete issue.",
      successMessage: "Newsletter issue deleted successfully.",
    },
  });
}

export function useGetNewsletterIssue(id: string) {
  return useQuery({
    queryKey: newsletter.get.$use({ data: id }),
    queryFn: () => newsletter.$use.get({ data: id }),
    enabled: !!id,
  });
}

export function useDownloadNewsletterIssue() {
  return useMutation({
    mutationKey: newsletter.download.$get(),
    mutationFn: useServerFn(newsletter.$use.download),
    meta: {
      errorMessage: "Failed to download issue.",
      successMessage: "Newsletter issue downloaded successfully.",
    },
  });
}

export function usePublishNewsletterIssue() {
  return useMutation({
    mutationKey: newsletter.publish.$get(),
    mutationFn: useServerFn(newsletter.$use.publish),
    meta: {
      errorMessage: "Failed to publish issue.",
      successMessage: "Newsletter issue published successfully.",
    },
  });
}

export function useArchiveNewsletterIssue() {
  return useMutation({
    mutationKey: newsletter.archive.$get(),
    mutationFn: useServerFn(newsletter.$use.archive),
    meta: {
      errorMessage: "Failed to archive issue.",
      successMessage: "Newsletter issue archived successfully.",
    },
  });
}
