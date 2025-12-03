import { createFileRoute, Link } from "@tanstack/react-router";
import { Button, Skeleton } from "@mantine/core";
import { Share2, Clock, Calendar, Eye, Facebook, Twitter } from "lucide-react";
import { format } from "date-fns";
import {
  useFetchArticleBySlug,
  useFetchRelatedArticles,
} from "@/services/hooks";

export const Route = createFileRoute("/_public/_default/bulletin/$article")({
  component: RouteComponent,
});

function RouteComponent() {
  const { article: articleSlug } = Route.useParams();
  
  const { data: article, isLoading } = useFetchArticleBySlug(articleSlug);
  const { data: relatedArticles = [] } = useFetchRelatedArticles(
    article?.id ?? ""
  );

  const handleShare = async () => {
    const url = window.location.href;
    const title = article?.title ?? "";

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (error) {
        console.log("Share cancelled");
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
              <span className="font-medium">By {article.authorName}</span>
              <span className="text-sage-green">•</span>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-sage-green" />
                <span className="text-sage-green">
                  {format(
                    article.publishedAt ?? article.createdAt,
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
              <div className="prose prose-lg max-w-none text-dark-grey font-display text-xl leading-extra-loose">
                <p>
                  <span
                    className="float-left text-7xl font-bold text-institutional-green mr-3 mt-1"
                    style={{ lineHeight: "0.8" }}
                  >
                    I
                  </span>
                  n the heart of turmoil, where the dust of conflict settles on
                  every surface, a new narrative of human resilience is being
                  written. It’s a story not of grand armies or political chess,
                  but of individuals and communities navigating the labyrinth of
                  crisis. This is a journey through the landscapes of adversity,
                  finding light in the most shadowed corners of our world.
                </p>
                <p>
                  The dawn breaks not with the gentle caress of sunlight, but
                  with the distant echo of a world in flux. We witness this
                  unfolding drama in our daily lives, through the flickering
                  screens that connect us to the far reaches of the globe. From
                  the crowded refugee camps to the silent, abandoned streets of
                  once-thriving cities, the human spirit endures, adapts, and
                  strives for a semblance of normalcy.
                </p>
                <blockquote className="text-center text-3xl italic font-medium text-deep-forest my-12 py-4 border-y-2 border-mist-green">
                  "The scenario in Baghdad, Aleppo and Tripoli..."
                </blockquote>
                <p>
                  It is here, in the crucible of hardship, that the true essence
                  of community is forged. Neighbors share what little they have,
                  strangers offer a helping hand, and the bonds of shared
                  experience create a tapestry of support that defies the chaos.
                  This is not a passive acceptance of fate, but an active,
                  conscious choice to uphold dignity and hope.
                </p>
                <div className="my-10 pl-6 border-l-4 border-sage-green">
                  <p className="italic text-lg text-gray-600">
                    In fields of dust, a seed of hope we sow,
                    <br />
                    Where shadows fall, we learn to let it grow.
                    <br />
                    A whispered prayer, a story softly told,
                    <br />
                    More precious now than silver or than gold.
                  </p>
                </div>
                <p>
                  Understanding this resilience is not merely an academic
                  exercise; it is a moral imperative. It requires us to look
                  beyond the headlines and statistics, to see the faces and hear
                  the voices of those whose lives have been irrevocably altered.
                  It is in their stories that we find the lessons for our own
                  societies, a reminder of the fragility of peace and the
                  enduring power of faith and solidarity.
                </p>
              </div>

              <div className="mt-16 pt-10 border-t border-gray-200">
                <h2 className="text-3xl font-bold text-deep-forest mb-6">
                  Discussion (0)
                </h2>
                <div className="space-y-4">
                  <div className="relative">
                    <textarea
                      className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-vibrant-lime focus:ring-0 sm:text-sm sm:leading-6 transition-all"
                      id="comment"
                      name="comment"
                      placeholder="Add your perspective..."
                      rows={1}
                    ></textarea>
                  </div>
                  <div className="flex justify-end">
                    <button
                      className="rounded-md bg-institutional-green px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-institutional-green"
                      type="button"
                    >
                      Post Comment
                    </button>
                  </div>
                </div>
              </div>
            </article>

            <aside className="hidden lg:block col-span-2 sticky top-32 h-screen">
              <div className="space-y-12 pt-8">
                <div>
                  <h3 className="font-semibold text-deep-forest mb-4">
                    About the Author
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div className="h-14 w-14 rounded-full bg-institutional-green flex items-center justify-center text-white font-bold text-xl">
                      {article.authorName.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-deep-forest mt-3">
                    {article.authorName}
                  </p>
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
                        <span>{related.authorName}</span>
                        <span>•</span>
                        <span>
                          {format(
                            related.publishedAt ?? related.createdAt,
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
