import { queryOptions } from "@tanstack/react-query";
import { feed } from ".";
import type { ListFeedVariables } from "./types";

export const listFeedOptions = (variables?: ListFeedVariables) => {
  return queryOptions({
    queryKey: feed.list.$use(variables),
    queryFn: () => feed.$use.list(variables),
  });
};
