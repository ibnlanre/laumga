import { queryOptions } from "@tanstack/react-query";
import { media } from ".";
import type { ListMediaVariables } from "./types";

export const getMediaOptions = (id?: string) => {
  return queryOptions({
    queryKey: media.get.$get(id),
    queryFn: () => media.$use.get(id!),
    enabled: !!id,
  });
};

export const getFeaturedMediaOptions = () => {
  return queryOptions({
    queryKey: media.getFeaturedMedia.$get(),
    queryFn: () => media.$use.getFeaturedMedia(),
  });
};

export const listMediaOptions = (variables?: ListMediaVariables) => {
  return queryOptions({
    queryKey: media.list.$use(variables),
    queryFn: () => media.$use.list(variables),
  });
};
