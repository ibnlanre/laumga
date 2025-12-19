import { queryOptions } from "@tanstack/react-query";
import { newsletter } from ".";
import type { ListIssueVariables } from "./types";

export const listNewsletterIssueOptions = (variables?: ListIssueVariables) => {
  return queryOptions({
    queryKey: newsletter.list.$use(variables),
    queryFn: () => newsletter.$use.list(variables),
  });
};

export const getNewsletterIssueOptions = (id?: string) => {
  return queryOptions({
    queryKey: newsletter.get.$get(id),
    queryFn: () => newsletter.$use.get(id!),
    enabled: !!id,
  });
};
