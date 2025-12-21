import { queryOptions } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { article } from ".";
import type { ListArticleVariables } from "./types";

export const getArticleOptions = (id?: string) => {
  const get = useServerFn(article.$use.get);
  return queryOptions({
    queryKey: article.get.$get(id),
    queryFn: () => get({ data: id! }),
    enabled: !!id,
  });
};

export const listArticleOptions = (variables?: ListArticleVariables) => {
  const list = useServerFn(article.$use.list);
  return queryOptions({
    queryKey: article.list.$get(variables),
    queryFn: () => list({ data: variables }),
  });
};

export const getArticleBySlugOptions = (slug?: string) => {
  const getArticleBySlug = useServerFn(article.$use.getArticleBySlug);
  return queryOptions({
    queryKey: article.getArticleBySlug.$get(slug),
    queryFn: () => getArticleBySlug({ data: slug! }),
    enabled: !!slug,
  });
};

export const getRelatedArticlesOptions = (articleId?: string) => {
  const related = useServerFn(article.$use.related);
  return queryOptions({
    queryKey: article.related.$get(articleId),
    queryFn: () => related({ data: articleId! }),
    enabled: !!articleId,
  });
};

export const incrementArticleViewCountOptions = (articleId: string) => {
  const incrementViewCount = useServerFn(article.$use.incrementViewCount);
  return queryOptions({
    queryKey: article.incrementViewCount.$get(articleId),
    queryFn: () => incrementViewCount({ data: articleId }),
    enabled: !!articleId,
  });
};
