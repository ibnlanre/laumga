import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { clsx } from "clsx";

import { useGetFeaturedMedia, useListMedia } from "@/api/media/hooks";
import { MEDIA_CATEGORIES } from "@/api/media/schema";
import { PageLoader } from "@/components/page-loader";

type Category = "all" | (typeof MEDIA_CATEGORIES)[number];

const CATEGORY_LABELS: Record<(typeof MEDIA_CATEGORIES)[number], string> = {
  humanitarian: "Humanitarian",
  conventions: "Conventions",
  "campus-life": "Campus Life",
};

export const Route = createFileRoute("/_auth/gallery")({
  component: GalleryPage,
});

function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const { data: mediaItems = [], isLoading } = useListMedia();
  const { data: featuredMedia = [] } = useGetFeaturedMedia();

  const filteredMedia =
    activeCategory === "all"
      ? mediaItems
      : mediaItems.filter((item) => item.category === activeCategory);

  const heroImage = featuredMedia[0] || mediaItems[0];

  if (isLoading) {
    return <PageLoader message="Loading gallery..." />;
  }

  return (
    <main className="flex flex-1 justify-center pt-24">
      <div className="layout-content-container flex flex-col w-full max-w-7xl px-4 md:px-10 lg:px-20">
        <section className="py-16 md:py-24">
          <div
            className={clsx(
              "flex flex-col gap-10 md:gap-20",
              heroImage ? "md:flex-row md:items-center" : "md:items-center"
            )}
          >
            <div
              className={clsx(
                "flex flex-col gap-4",
                heroImage ? "text-left md:w-1/2" : "text-center w-full"
              )}
            >
              <h1 className="text-deep-forest font-display text-6xl font-black leading-tight tracking-[-0.033em] md:text-7xl lg:text-8xl">
                The Archive.
              </h1>
              <p
                className={clsx(
                  "text-deep-forest text-base font-normal leading-relaxed md:text-lg max-w-md mx-auto",
                  heroImage ? "md:mx-0" : ""
                )}
              >
                Exploring our history through the lens, one moment at a time.
                This is a visual journey through our shared experiences.
              </p>
            </div>
            {heroImage && (
              <div className="w-full md:w-1/2">
                <div
                  className="w-full bg-center bg-no-repeat aspect-video bg-cover"
                  data-alt={heroImage.caption || heroImage.fileName}
                  style={{
                    backgroundImage: `url('${heroImage.url}')`,
                  }}
                />
              </div>
            )}
          </div>
        </section>

        <section className="pb-16 md:pb-24">
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
            <CategoryButton
              active={activeCategory === "all"}
              onClick={() => setActiveCategory("all")}
              label="All"
            />
            {MEDIA_CATEGORIES.map((category) => (
              <CategoryButton
                key={category}
                active={activeCategory === category}
                onClick={() => setActiveCategory(category)}
                label={CATEGORY_LABELS[category]}
              />
            ))}
          </div>
        </section>

        {filteredMedia.length === 0 ? (
          <section className="text-center py-12">
            <p className="text-deep-forest/70 text-base">
              No photos found in this category.
            </p>
          </section>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 md:gap-x-10 md:gap-y-16 lg:gap-x-16 lg:gap-y-20">
            {filteredMedia.map((item) => (
              <GalleryItem key={item.id} item={item} />
            ))}
          </section>
        )}

        {featuredMedia.length > 0 && (
          <section className="my-16 md:my-24 -mx-4 md:-mx-10 lg:-mx-20">
            <div className="bg-mist-green py-16 px-4 md:px-10 lg:px-20">
              <div className="flex flex-col md:flex-row items-center justify-between gap-12 max-w-7xl mx-auto">
                <div className="flex flex-col gap-4 flex-[1_1_0px] max-w-lg">
                  <h3 className="text-deep-forest font-display text-4xl md:text-5xl font-bold leading-tight">
                    Featured Moments
                  </h3>
                  <p className="text-deep-forest text-base leading-relaxed">
                    A selection of our most memorable and impactful moments that
                    define our community and mission.
                  </p>
                </div>
                <div className="flex-[1.5_1.5_0px] w-full overflow-hidden">
                  <div className="flex items-center gap-4">
                    <button className="text-deep-forest/50 hover:text-deep-forest">
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {featuredMedia.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          className="w-full bg-center bg-no-repeat aspect-square bg-cover"
                          style={{ backgroundImage: `url('${item.url}')` }}
                        />
                      ))}
                    </div>
                    <button className="text-deep-forest/50 hover:text-deep-forest">
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <footer className="text-center py-24 md:py-32">
          <p className="font-display text-2xl md:text-3xl font-medium text-deep-forest max-w-md mx-auto">
            Were you there? Help us grow our collection and preserve our shared
            memories.
          </p>
        </footer>
      </div>
    </main>
  );
}

interface CategoryButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
}

function CategoryButton({ active, onClick, label }: CategoryButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 transition-opacity duration-200 ${
        active ? "text-deep-forest" : "text-deep-forest/70"
      }`}
    >
      <p className="text-base font-bold leading-normal tracking-[0.015em]">
        {label}
      </p>
      <div
        className={`w-1.5 h-1.5 rounded-full ${
          active ? "bg-institutional-green" : "bg-transparent"
        }`}
      />
    </button>
  );
}

interface GalleryItemProps {
  item: {
    id: string;
    url: string;
    caption?: string | null;
    fileName: string;
    uploaded: { at: Date | null } | null;
  };
}

function GalleryItem({ item }: GalleryItemProps) {
  const year = item.uploaded?.at ? format(item.uploaded.at, "yyyy") : "—";

  return (
    <div className="flex flex-col gap-3">
      <div
        className="w-full bg-center bg-no-repeat aspect-4/3 bg-cover rounded-lg"
        style={{ backgroundImage: `url('${item.url}')` }}
        role="img"
        aria-label={item.caption || item.fileName}
      />
      <div>
        <p className="text-deep-forest text-base font-bold leading-normal">
          {item.caption || item.fileName}
        </p>
        <p className="text-gray-500 text-sm font-normal leading-normal">
          {year}
        </p>
      </div>
    </div>
  );
}
