import { createFileRoute, Link } from "@tanstack/react-router";
import { Button, Skeleton } from "@mantine/core";
import { Share2, Clock, Calendar, Eye, Facebook, Twitter } from "lucide-react";
import { formatDate } from "@/utils/date";
import { notifications } from "@mantine/notifications";
import { useQuery } from "@tanstack/react-query";
import {
  getArticleBySlugOptions,
  getRelatedArticlesOptions,
} from "@/api/article/options";

export const Route = createFileRoute("/_public/_default/bulletin/$article")({
  head: ({ params }) => ({
    meta: [
      {
        title: `Article - LAUMGA Bulletin`,
      },
      {
        name: "description",
        content:
          "Read the latest article from LAUMGA's bulletin covering news, Islamic teachings, and community updates.",
      },
      {
        property: "og:title",
        content: `Article - LAUMGA Bulletin`,
      },
      {
        property: "og:type",
        content: "article",
      },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { article: articleSlug } = Route.useParams();

  const { data: article, isLoading } = useQuery(
    getArticleBySlugOptions(articleSlug)
  );
  const { data: relatedArticles = [] } = useQuery(
    getRelatedArticlesOptions(article?.id)
  );

  const handleShare = async () => {
    const url = window.location.href;
    const title = article?.title ?? "";

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (error) {
        notifications.show({
          title: "Share Cancelled",
          message: "You cancelled the share action.",
          color: "yellow",
        });
      }
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  if (isLoading) {
    return (
      <div className="relative w-full bg-mist-green font-display">
        <header className="bg-deep-forest text-white py-20">
          <div className="max-w-3xl mx-auto text-center px-4">
            <Skeleton height={24} width={200} mx="auto" mb="md" />
            <Skeleton height={60} mx="auto" mb="lg" />
            <Skeleton height={20} width={300} mx="auto" />
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 py-16">
          <Skeleton height={400} mb="xl" />
          <Skeleton height={200} />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-mist-green flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-serif text-4xl font-bold text-deep-forest mb-4">
            Article Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Button
            component={Link}
            to="/bulletin"
            variant="filled"
            size="lg"
            radius="xl"
          >
            Back to Bulletin
          </Button>
        </div>
      </div>
    );
  }

  const readingTime = Math.ceil(article.content.split(" ").length / 200);
  const progressWidth = 0; // Could be calculated based on scroll position

  return (
    <div className="relative w-full bg-mist-green font-display">
      <div className="fixed top-0 left-0 w-full h-1 z-50">
        <div
          className="h-1 bg-vibrant-lime transition-all duration-300"
          style={{ width: `${progressWidth}%` }}
        />
      </div>

      <div className="relative">
        <header className="bg-deep-forest text-white py-20">
          <div className="max-w-3xl mx-auto text-center px-4">
            <p className="text-vibrant-lime text-sm font-normal leading-normal tracking-widest pb-3 pt-1 uppercase">
              {article.category}
            </p>
            <h1 className="text-white tracking-tight text-5xl lg:text-6xl font-bold leading-tight pb-6">
              {article.title}
            </h1>
            <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-sage-green" />
                <span className="text-sage-green">
                  {formatDate(
                    article.published?.at ?? article.created?.at,
                    "MMM dd, yyyy"
                  )}
                </span>
              </div>
              <span className="text-sage-green">•</span>
              <div className="flex items-center gap-1 text-sage-green">
                <Clock className="h-4 w-4" />
                <span>{readingTime} min read</span>
              </div>
              {article.viewCount > 0 && (
                <>
                  <span className="text-sage-green">•</span>
                  <div className="flex items-center gap-1 text-sage-green">
                    <Eye className="h-4 w-4" />
                    <span>{article.viewCount} views</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {article.coverImageUrl && (
          <div
            className="w-full h-64 md:h-96 bg-center bg-no-repeat bg-cover"
            style={{ backgroundImage: `url('${article.coverImageUrl}')` }}
          />
        )}

        <main className="relative py-16 lg:py-24 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
            <aside className="hidden lg:block col-span-1 sticky top-32 h-screen">
              <div className="flex flex-col items-center space-y-4 pt-8">
                <button
                  onClick={() =>
                    window.open(
                      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
                      "_blank"
                    )
                  }
                  className="group p-2 border border-institutional-green rounded-full hover:bg-vibrant-lime hover:border-vibrant-lime transition-colors duration-300"
                >
                  <Facebook className="h-5 w-5 text-institutional-green group-hover:text-white" />
                </button>
                <button
                  onClick={() =>
                    window.open(
                      `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`,
                      "_blank"
                    )
                  }
                  className="group p-2 border border-institutional-green rounded-full hover:bg-vibrant-lime hover:border-vibrant-lime transition-colors duration-300"
                >
                  <Twitter className="h-5 w-5 text-institutional-green group-hover:text-white" />
                </button>
                <button
                  onClick={handleShare}
                  className="group p-2 border border-institutional-green rounded-full hover:bg-vibrant-lime hover:border-vibrant-lime transition-colors duration-300"
                >
                  <Share2 className="h-5 w-5 text-institutional-green group-hover:text-white" />
                </button>
              </div>
            </aside>

            <article className="col-span-12 lg:col-start-3 lg:col-span-7 bg-white shadow-lg rounded-lg p-8 md:p-12 -mt-48 lg:-mt-64 z-10">
              <div
                className="prose prose-lg max-w-none text-dark-grey font-display text-xl leading-extra-loose"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </article>

            <aside className="hidden lg:block col-span-2 sticky top-32 h-screen">
              <div className="space-y-12 pt-8">
                <div>
                  <h3 className="font-semibold text-deep-forest mb-4">
                    About the Author
                  </h3>
                  {/* <div className="flex items-center space-x-4">
                    <div className="h-14 w-14 rounded-full bg-institutional-green flex items-center justify-center text-white font-bold text-xl">
                      {article.authorName.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-deep-forest mt-3">
                    {article.authorName}
                  </p> */}
                  <p className="text-sm text-gray-600 mt-1">
                    LAUMGA Contributor
                  </p>
                </div>
                {article.tags && article.tags.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-deep-forest mb-4">
                      Article Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-sm font-medium text-institutional-green bg-sage-green/50 px-3 py-1 rounded-full hover:bg-sage-green transition-colors cursor-pointer"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </main>

        <footer className="bg-mist-green pt-16 pb-24">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-deep-forest mb-12">
              Related Articles
            </h2>
            {relatedArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedArticles.slice(0, 3).map((related) => (
                  <Link
                    key={related.id}
                    to="/bulletin/$article"
                    params={{ article: related.slug }}
                    className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-shadow"
                  >
                    {related.coverImageUrl && (
                      <div
                        className="h-48 bg-cover bg-center"
                        style={{
                          backgroundImage: `url('${related.coverImageUrl}')`,
                        }}
                      />
                    )}
                    <div className="p-6">
                      <p className="text-institutional-green text-sm font-semibold uppercase">
                        {related.category}
                      </p>
                      <h3 className="text-xl font-bold text-deep-forest mt-2 mb-3 group-hover:text-institutional-green transition-colors line-clamp-2">
                        {related.title}
                      </h3>
                      {related.excerpt && (
                        <p className="text-gray-600 text-sm line-clamp-3">
                          {related.excerpt}
                        </p>
                      )}
                      <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                        {/* <span>{related.authorName}</span>
                        <span>•</span> */}
                        <span>
                          {formatDate(
                            related.published?.at ?? related.created?.at,
                            "MMM dd"
                          )}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-600">
                <p>No related articles found.</p>
                <Button
                  component={Link}
                  to="/bulletin"
                  variant="outline"
                  size="lg"
                  radius="xl"
                  className="mt-6"
                >
                  Browse All Articles
                </Button>
              </div>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
