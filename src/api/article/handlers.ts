import { useQuery } from "@tanstack/react-query";
import { article } from ".";

export function useGetArticleBySlug(slug?: string) {
  return useQuery({
    queryKey: article.getArticleBySlug.$get(slug),
    queryFn: () => article.$use.getArticleBySlug(slug!),
    enabled: !!slug,
  });
}

export function useGetRelatedArticles(articleId?: string) {
  return useQuery({
    queryKey: article.related.$get(articleId),
    queryFn: () => article.$use.related(articleId!),
    enabled: !!articleId,
  });
}

// export function useIncrementArticleViewCount(articleId: string) {
//   return useQuery({
//     queryKey: article.incrementViewCount.$get(articleId),
//     queryFn: () => article.$use.incrementViewCount(articleId),
//     enabled: !!articleId,
//   });
// }
