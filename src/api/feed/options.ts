import { queryOptions } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { feed } from ".";
import type { ListFeedVariables } from "./types";

export const listFeedOptions = (variables?: ListFeedVariables) => {
  const list = useServerFn(feed.$use.list);
  return queryOptions({
    queryKey: feed.list.$use({ data: variables }),
    queryFn: () => list({ data: variables }),
  });
};

export const getUserFeedOptions = (userId: string | null | undefined) => {
  const options = listFeedOptions({
    filterBy: [
      { field: "type", operator: "==", value: "user" },
      { field: "userId", operator: "==", value: userId },
    ],
    sortBy: [{ field: "timestamp", value: "desc" }],
  });

  return {
    ...options,
    enabled: !!userId,
  };
};
