import { queryOptions } from "@tanstack/react-query";
import { chapter } from ".";
import type { ListChapterVariables } from "./types";

export const getChapterOptions = (id?: string) => {
  return queryOptions({
    queryKey: chapter.get.$get(id),
    queryFn: () => chapter.$use.get(id!),
    enabled: !!id,
  });
};

export const listChapterOptions = (variables?: ListChapterVariables) => {
  return queryOptions({
    queryKey: chapter.list.$get(variables),
    queryFn: () => chapter.$use.list(variables),
  });
};
