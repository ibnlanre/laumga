import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Fragment, useState } from "react";
import { Search, ArrowRight, Loader2, BookOpen } from "lucide-react";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { type Variables } from "@/client/core-query";
import { useDebouncedValue } from "@mantine/hooks";
import { formatDate } from "@/utils/date";
import { EmptyState } from "@/components/empty-state";
import type { ArticleData } from "@/api/article/types";
import { useListArticles } from "@/api/article/hooks";
import { Section } from "@/components/section";

const bulletinSearchSchema = z.object({
  category: z
    .enum(["news", "health", "islamic", "campus", "alumni", "community"])
    .optional(),
  search: z.string().optional(),
});

export const Route = createFileRoute("/_public/_default/bulletin/")({
  validateSearch: zodValidator(bulletinSearchSchema),
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate({ from: Route.fullPath });
  const { category, search } = Route.useSearch();

  const [searchInput, setSearchInput] = useState(search || "");
  const [debouncedSearch] = useDebouncedValue(searchInput, 500);

  // Update URL when debounced search changes
  if (debouncedSearch !== search) {
    navigate({
      search: (prev) => ({ ...prev, search: debouncedSearch || undefined }),
      replace: true,
    });
  }

  const [limit, setLimit] = useState(10);

  const articleVariables: Variables<ArticleData> = {
    filterBy: [
      {
        field: "status",
        operator: "==",
        value: "published",
      },
    ],
  };

  if (category) {
    articleVariables.filterBy!.push({
      field: "category",
      operator: "==",
      value: category,
    });
  }

  const { data: articles, isLoading: isLoadingArticles } =
    useListArticles(articleVariables);

  const displayArticles = articles?.slice(0, limit);
  const isLoading = isLoadingArticles;
  const featuredArticle = displayArticles?.[0];
  const gridArticles = displayArticles?.slice(1);
  const hasMore = (articles?.length || 0) > (displayArticles?.length || 0);

  const handleLoadMore = () => {
    setLimit((prev) => prev + 9);
  };

  const handleCategoryChange = (
    newCategory?:
      | "news"
      | "health"
      | "islamic"
      | "campus"
      | "alumni"
      | "community"
  ) => {
    navigate({
      search: (prev) => ({ ...prev, category: newCategory }),
    });
  };

  return (
    <Fragment>
      <section className="relative bg-deep-forest text-white py-24 md:py-32 islamic-pattern">
        <Section className="relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-display font-medium leading-tight tracking-tighter">
              The LAUMGA Bulletin
            </h1>
            <p className="mt-4 text-lg md:text-xl font-body text-white/80">
              Perspectives on Faith, Science, and Society.
            </p>
          </div>
        </Section>
        
        <div className="absolute -bottom-6 left-1/2 w-full max-w-4xl -translate-x-1/2 px-6 z-20">
          <div className="flex gap-2 p-2 justify-start md:justify-center rounded-full bg-white/20 backdrop-blur-lg shadow-lg border border-white/20 overflow-x-auto no-scrollbar">
            <button
              onClick={() => handleCategoryChange(undefined)}
              className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 text-sm font-medium transition ${
                !category
                  ? "bg-vibrant-lime text-deep-forest font-bold"
                  : "text-white hover:bg-white/10"
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleCategoryChange("news")}
              className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 text-sm font-medium transition ${
                category === "news"
                  ? "bg-vibrant-lime text-deep-forest font-bold"
                  : "text-white hover:bg-white/10"
              }`}
            >
              News
            </button>
            <button
              onClick={() => handleCategoryChange("health")}
              className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 text-sm font-medium transition ${
                category === "health"
                  ? "bg-vibrant-lime text-deep-forest font-bold"
                  : "text-white hover:bg-white/10"
              }`}
            >
              Health
            </button>
            <button
              onClick={() => handleCategoryChange("islamic")}
              className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 text-sm font-medium transition ${
                category === "islamic"
                  ? "bg-vibrant-lime text-deep-forest font-bold"
                  : "text-white hover:bg-white/10"
              }`}
            >
              Islamic
            </button>
            <button
              onClick={() => handleCategoryChange("campus")}
              className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 text-sm font-medium transition ${
                category === "campus"
                  ? "bg-vibrant-lime text-deep-forest font-bold"
                  : "text-white hover:bg-white/10"
              }`}
            >
              Campus
            </button>
            <button
              onClick={() => handleCategoryChange("alumni")}
              className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 text-sm font-medium transition ${
                category === "alumni"
                  ? "bg-vibrant-lime text-deep-forest font-bold"
                  : "text-white hover:bg-white/10"
              }`}
            >
              Alumni
            </button>
            <button
              onClick={() => handleCategoryChange("community")}
              className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 text-sm font-medium transition ${
                category === "community"
                  ? "bg-vibrant-lime text-deep-forest font-bold"
                  : "text-white hover:bg-white/10"
              }`}
            >
              Community
            </button>
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="py-32 flex justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-vibrant-lime" />
        </div>
      ) : (
        <Fragment>
          {featuredArticle && !debouncedSearch && (
 
              <Section className="py-16 md:py-24">
                <div className="flex flex-col lg:flex-row items-stretch justify-between gap-8 lg:gap-12 bg-white p-6 rounded-lg shadow-sm">
                  <div
                    className="w-full lg:w-1/2 aspect-video bg-cover bg-center rounded-lg flex-1"
                    role="img"
                    aria-label={featuredArticle.title}
                    style={{
                      backgroundImage: `url('${featuredArticle.coverImageUrl || "https://placehold.co/600x400"}')`,
                    }}
                  />
                  <div className="flex lg:w-1/2 flex-col justify-center gap-4 py-4">
                    <p className="text-sm font-bold uppercase tracking-widest text-sage-green">
                      EDITOR'S PICK
                    </p>
                    <h2 className="text-4xl font-display font-medium leading-tight text-deep-forest">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-base font-normal leading-relaxed text-deep-forest/70 line-clamp-3">
                      {featuredArticle.excerpt || featuredArticle.content}
                    </p>
                    {/* <p className="text-sm font-medium text-institutional-green">
                      By {featuredArticle.authorName || "Unknown Author"} •{" "}
                      {formatDate(
                        featuredArticle.publishedAt || featuredArticle.createdAt
                      )}
                    </p> */}
                    <div className="mt-4">
                      <Link
                        to="/bulletin/$article"
                        params={{ article: featuredArticle.slug }}
                        className="inline-block text-base font-bold text-deep-forest underline-expand"
                      >
                        Read Full Article
                      </Link>
                    </div>
                  </div>
                </div>
              </Section>
          )}

          <Section className="py-24">
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="w-full lg:w-2/3 xl:w-3/4">
                {displayArticles?.length === 0 ? (
                  <EmptyState
                    icon={BookOpen}
                    title="No articles found"
                    message={
                      search
                        ? "Try adjusting your search or browse all articles"
                        : "No articles are available at the moment. Please check back later."
                    }
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {(debouncedSearch ? displayArticles : gridArticles)?.map(
                      (article: any) => (
                        <Link
                          key={article.id}
                          to="/bulletin/$article"
                          params={{ article: article.slug }}
                          className="flex flex-col bg-white rounded-lg shadow-sm overflow-hidden card-hover"
                        >
                          <div className="w-full h-48 bg-center bg-no-repeat bg-cover overflow-hidden">
                            <div
                              className="w-full h-full bg-center bg-no-repeat bg-cover card-image-zoom"
                              role="img"
                              aria-label={article.title}
                              style={{
                                backgroundImage: `url('${article.coverImageUrl || "https://placehold.co/600x400"}')`,
                              }}
                            />
                          </div>
                          <div className="p-5 flex flex-col grow">
                            <p className="text-xs font-bold uppercase tracking-wider bg-mist-green text-institutional-green rounded-full px-3 py-1 self-start mb-3">
                              {article.category}
                            </p>
                            <h3 className="font-display text-xl font-medium text-deep-forest grow line-clamp-2">
                              {article.title}
                            </h3>
                            <p className="text-sm text-gray-500 mt-2">
                              {formatDate(
                                article.publishedAt || article.createdAt
                              )}
                            </p>
                          </div>
                        </Link>
                      )
                    )}
                  </div>
                )}
              </div>
              <aside className="w-full lg:w-1/3 xl:w-1/4">
                <div className="sticky top-28 space-y-8">
                  <div className="relative">
                    <input
                      className="w-full h-12 pl-4 pr-12 bg-white border border-gray-200 shadow-sm rounded-full focus:ring-2 focus:ring-vibrant-lime focus:border-transparent transition"
                      placeholder="Search articles..."
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                      <Search className="h-5 w-5 text-vibrant-lime" />
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h4 className="font-display text-lg font-medium text-deep-forest mb-4">
                      Trending Now
                    </h4>
                    <ul className="space-y-4">
                      {/* Placeholder for trending - could be fetched or just static for now if no API */}
                      {articles && articles.length > 0 ? (
                        articles
                          ?.slice(0, 3)
                          .map((article: any, index: number) => (
                            <li
                              key={article.id}
                              className="flex items-start gap-4"
                            >
                              <span className="font-display text-4xl font-bold text-vibrant-lime leading-none">
                                {index + 1}
                              </span>
                              <p className="font-body text-sm font-medium leading-tight text-deep-forest/80 hover:text-deep-forest transition cursor-pointer line-clamp-2">
                                {article.title}
                              </p>
                            </li>
                          ))
                      ) : (
                        <p className="text-sm text-gray-500">
                          No trending articles yet.
                        </p>
                      )}
                    </ul>
                  </div>
                  <div className="bg-deep-forest text-white p-6 rounded-lg text-center">
                    <h4 className="font-display text-lg font-medium mb-3">
                      Get the bulletin in your inbox
                    </h4>
                    <div className="flex items-center mt-4">
                      <input
                        className="w-full h-10 px-4 bg-white/10 text-white placeholder-white/60 border-0 rounded-l-full focus:ring-2 focus:ring-vibrant-lime"
                        placeholder="Your email address"
                        type="email"
                      />
                      <button className="shrink-0 h-10 w-12 flex items-center justify-center bg-vibrant-lime rounded-r-full text-deep-forest">
                        <ArrowRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
            {hasMore && !debouncedSearch && (
              <div className="mt-16 text-center">
                <button
                  onClick={handleLoadMore}
                  className="w-full md:w-auto bg-institutional-green text-white font-bold py-3 px-12 rounded-full text-base transition hover:opacity-90"
                >
                  Load More Articles
                </button>
              </div>
            )}
          </Section>
        </Fragment>
      )}
    </Fragment>
  );
}
