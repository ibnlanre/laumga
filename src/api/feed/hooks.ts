import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import type { Options } from "@/client/options";
import { feed } from "./index";
import type { ListFeedVariables } from "./types";

export function useFeed(
  variables?: ListFeedVariables,
  options: Options<typeof query> = {},
  query = queryOptions({
    queryKey: feed.list.$use(variables),
    queryFn: () => feed.$use.list(variables),
  })
) {
  return useQuery({ ...query, ...options });
}

export function useCreateFeed() {
  return useMutation({
    mutationKey: feed.create.$get(),
    mutationFn: feed.$use.create,
  })
}