import { queryOptions } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { newsletter } from ".";
import type { ListIssueVariables } from "./types";

export const listNewsletterIssueOptions = (variables?: ListIssueVariables) => {
  const list = useServerFn(newsletter.$use.list);
  return queryOptions({
    queryKey: newsletter.list.$use({ data: variables }),
    queryFn: () => list({ data: variables }),
  });
};

export const getNewsletterIssueOptions = (id?: string) => {
  const get = useServerFn(newsletter.$use.get);
  return queryOptions({
    queryKey: newsletter.get.$get(id),
    queryFn: () => get({ data: id! }),
    enabled: !!id,
  });
};
