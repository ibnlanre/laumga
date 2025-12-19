import { queryOptions } from "@tanstack/react-query";
import { article } from ".";
import type { ListArticleVariables } from "./types";

export const getArticleOptions = (id?: string) => {
  return queryOptions({
    queryKey: article.get.$get(id),
    queryFn: () => article.$use.get(id!),
    enabled: !!id,
  });
};

export const listArticleOptions = (variables?: ListArticleVariables) => {
  return queryOptions({
    queryKey: article.list.$get(variables),
    queryFn: () => article.$use.list(variables),
  });
};
