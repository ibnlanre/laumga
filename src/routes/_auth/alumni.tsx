import { Badge, Loader, ScrollArea, Skeleton, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import { useListExecutives } from "@/api/executive/hooks";
import type { Executive, ExecutiveTier } from "@/api/executive/types";
import { useListExecutiveTenures } from "@/api/executive-tenure/hooks";
import { SearchCheckIcon, MapPin, Sparkles, User } from "lucide-react";

export const Route = createFileRoute("/_auth/alumni")({
  component: RouteComponent,
});

type ExecutiveTierSlug = "presidential" | "council" | "directorate";

const EXECUTIVE_TIER_BUCKET: Record<ExecutiveTier, ExecutiveTierSlug> = {
  "0": "presidential",
  "1": "council",
  "2": "directorate",
};

const EXECUTIVE_TIER_LABEL: Record<ExecutiveTierSlug, string> = {
  presidential: "Presidential",
  council: "Council",
  directorate: "Directorate",
};

function RouteComponent() {
  const form = useForm({
    initialValues: {
      search: "",
    },
  });

  const [activeTenureId, setActiveTenureId] = useState<string | null>(null);

  const { data: tenures = [], isLoading: isTenuresLoading } =
    useListExecutiveTenures({
      sortBy: [{ field: "year", value: "desc" }],
    });

  useEffect(() => {
    if (!tenures.length) return;

    setActiveTenureId((current) => {
      if (current && tenures.some((tenure) => tenure.id === current)) {
        return current;
      }

      const active = tenures.find((tenure) => tenure.isActive);
      return (active ?? tenures[0]).id;
    });
  }, [tenures]);

  const selectedTenure = useMemo(() => {
    return tenures.find((tenure) => tenure.id === activeTenureId) ?? null;
  }, [tenures, activeTenureId]);

  const { data: executives = [], isLoading: isExecutivesLoading } =
    useListExecutives(
      {
        filterBy: [
          { field: "tenureId", operator: "==", value: activeTenureId },
        ],
        sortBy: [
          { field: "tier", value: "asc" },
          { field: "role", value: "asc" },
        ],
      },
      {
        enabled: !!activeTenureId,
      }
    );

  const groupedExecutives = useMemo(() => {
    const base = executives ?? [];
    const term = form.values.search.trim().toLowerCase();

    const filtered = term
      ? base.filter((executive) =>
          [
            executive.displayName,
            executive.role,
            executive.portfolio ?? "",
            executive.quote ?? "",
            executive.email ?? "",
          ]
            .join(" ")
            .toLowerCase()
            .includes(term)
        )
      : base;

    const buckets: Record<ExecutiveTierSlug, Executive[]> = {
      presidential: [],
      council: [],
      directorate: [],
    };

    filtered.forEach((executive) => {
      const bucket = EXECUTIVE_TIER_BUCKET[executive.tier];
      buckets[bucket].push(executive);
    });

    return {
      ...buckets,
      total: filtered.length,
    };
  }, [executives, form.values.search]);

  const featuredLeader = groupedExecutives.presidential[0];
  const isSearching = form.values.search.trim().length > 0;
  const executivesLoading = isExecutivesLoading && !!activeTenureId;

  return (
    <main className="flex-1">
      <div className="relative flex min-h-[480px] flex-col items-center justify-center gap-8 bg-deep-forest p-4 text-center">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCPDU_i4H_2CliyxSqDv6nzjlqCc2yvzz9DxDqagyAMNREC5W9j2SqMkM5XHfxYgO44vgmLHL3lpmSD3NLeuS4OMUARL3TvNIkuufys2CJKUnHASqdcfvbG6FV-luG0-Jm9Y4FHqkQe-JUmxrtojpqavVwwjfVIQxDz9SZ20UahTm-WrdofWvaGwixhcm7IaH8PKw-rP1r0d_N-leeQhv_gLI8TuhvpIZDelvIvHdAScp97OQ6GFCvc3653Hmb_fg3-heVqaBnLk54')",
          }}
        ></div>
        <div className="relative z-10 flex flex-col gap-4">
          <h1 className="font-display text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl md:text-7xl">
            Stewards of the Vision
          </h1>
          <h2 className="max-w-2xl text-base font-normal leading-normal text-stone-300">
            Meet the dedicated men and women serving the association, past and
            present.
          </h2>
          {selectedTenure ? (
            <div className="flex flex-wrap items-center justify-center gap-3 text-white/80">
              <Badge
                color="lime"
                radius="sm"
                className="uppercase tracking-wide"
              >
                {selectedTenure.label} • {selectedTenure.year}
              </Badge>
              {selectedTenure.theme && (
                <Badge color="dark" radius="sm" className="bg-black/30">
                  {selectedTenure.theme}
                </Badge>
              )}
            </div>
          ) : (
            <p className="text-sm text-white/70">
              Choose a tenure to explore the leadership directory.
            </p>
          )}
        </div>

        <TextInput
          {...form.getInputProps("search")}
          radius="lg"
          c="white"
          classNames={{
            input: "bg-white/20 backdrop-blur-sm text-white",
          }}
          className="mt-8 max-w-lg w-full shadow-lg"
          placeholder="Search the alumni directory..."
          size="xl"
          rightSection={<SearchCheckIcon className="text-white/70" />}
        />

        <div className="relative z-10 flex flex-wrap gap-6 text-white/80">
          <div>
            <p className="text-4xl font-bold text-white">
              {groupedExecutives.total}
            </p>
            <p className="text-sm uppercase tracking-wide">
              Leaders catalogued
            </p>
          </div>
          <div>
            <p className="text-4xl font-bold text-white">
              {groupedExecutives.presidential.length}
            </p>
            <p className="text-sm uppercase tracking-wide">Presidential team</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-white">
              {groupedExecutives.council.length}
            </p>
            <p className="text-sm uppercase tracking-wide">Council members</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-stone-900/80 backdrop-blur-sm shadow-md">
        <div className="mx-auto max-w-7xl">
          <ScrollArea type="never" className="w-full">
            <div className="flex gap-2 sm:gap-3 p-3 min-w-full">
              {isTenuresLoading &&
                Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton
                    key={`tenure-skeleton-${index}`}
                    height={40}
                    width={110}
                    radius="lg"
                    className="shrink-0"
                  />
                ))}
              {!isTenuresLoading && tenures.length === 0 && (
                <p className="px-4 text-sm text-stone-500">
                  No executive tenures have been recorded yet.
                </p>
              )}
              {!isTenuresLoading &&
                tenures.map((tenure) => {
                  const isActive = tenure.id === activeTenureId;
                  return (
                    <button
                      key={tenure.id}
                      type="button"
                      onClick={() => setActiveTenureId(tenure.id)}
                      className={`flex h-10 shrink-0 items-center justify-center rounded-full border px-4 text-sm font-semibold transition-colors ${
                        isActive
                          ? "border-vibrant-lime bg-vibrant-lime/20 text-deep-forest"
                          : "border-stone-200 bg-white text-stone-600 hover:border-deep-forest/40"
                      }`}
                    >
                      {tenure.year}
                    </button>
                  );
                })}
            </div>
          </ScrollArea>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <section>
          {executivesLoading && (
            <div className="flex items-center justify-center py-16">
              <Loader color="green" size="lg" />
            </div>
          )}
          {!executivesLoading && groupedExecutives.total === 0 && (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center dark:border-stone-800 dark:bg-stone-900/60">
              <Sparkles className="h-10 w-10 text-vibrant-lime" />
              <p className="text-lg font-semibold text-deep-forest dark:text-white">
                {isSearching
                  ? "No leaders match your search."
                  : "No executives recorded for this tenure yet."}
              </p>
              <p className="max-w-2xl text-sm text-stone-500 dark:text-stone-400">
                Try another tenure, clear your filters, or contact the
                secretariat if you believe records are missing.
              </p>
            </div>
          )}

          {!executivesLoading && groupedExecutives.total > 0 && (
            <div className="space-y-16">
              {featuredLeader && (
                <FeaturedExecutiveCard executive={featuredLeader} />
              )}

              {groupedExecutives.council.length > 0 && (
                <section>
                  <div className="flex items-center justify-between px-1 pb-6">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-institutional-green">
                        Executive Council
                      </p>
                      <h3 className="font-display text-3xl font-bold text-deep-forest dark:text-white">
                        Strategic leadership team
                      </h3>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {groupedExecutives.council.map((executive) => (
                      <CouncilExecutiveCard
                        key={executive.id}
                        executive={executive}
                      />
                    ))}
                  </div>
                </section>
              )}

              {groupedExecutives.directorate.length > 0 && (
                <section>
                  <div className="flex items-center justify-between px-1 pb-6">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-institutional-green">
                        Directorate
                      </p>
                      <h3 className="font-display text-3xl font-bold text-deep-forest dark:text-white">
                        Operational leadership nodes
                      </h3>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {groupedExecutives.directorate.map((executive) => (
                      <DirectorateExecutiveRow
                        key={executive.id}
                        executive={executive}
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </section>

        <footer className="mt-20 text-center">
          <p className="text-stone-600 dark:text-stone-400">
            Looking for data prior to 2010?{" "}
            <Link
              className="font-semibold text-vibrant-lime hover:underline"
              to="/contact-us"
            >
              Visit the Historical Archives.
            </Link>
          </p>
        </footer>
      </div>
    </main>
  );
}

interface ExecutiveCardProps {
  executive: Executive;
}

function FeaturedExecutiveCard({ executive }: ExecutiveCardProps) {
  return (
    <div className="flex flex-col gap-8 rounded-3xl border border-deep-forest/10 bg-gradient-to-r from-deep-forest to-emerald-950 p-6 text-white md:flex-row md:items-center md:p-10">
      <div className="h-48 w-48 shrink-0 overflow-hidden rounded-full border-4 border-vibrant-lime/70">
        <img
          className="h-full w-full object-cover"
          alt={executive.displayName}
          src={executive.photoUrl}
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 text-center md:text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-vibrant-lime">
          {executive.role}
        </p>
        <h2 className="font-display text-4xl font-bold">
          {executive.displayName}
        </h2>
        {executive.portfolio && (
          <div className="flex items-center justify-center gap-2 text-sage-green md:justify-start">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{executive.portfolio}</span>
          </div>
        )}
        {executive.quote && (
          <p className="mt-2 text-lg italic text-white/80">
            “{executive.quote}”
          </p>
        )}
      </div>
    </div>
  );
}

function CouncilExecutiveCard({ executive }: ExecutiveCardProps) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-stone-100 bg-white p-6 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-stone-800 dark:bg-stone-900">
      <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-sage-green">
        <img
          className="h-full w-full object-cover"
          alt={executive.displayName}
          src={executive.photoUrl}
        />
        <Badge
          className="absolute -bottom-2 left-1/2 -translate-x-1/2"
          color="green"
          radius="md"
        >
          {EXECUTIVE_TIER_LABEL.council}
        </Badge>
      </div>
      <div className="mt-6 space-y-2">
        <p className="text-xl font-bold text-deep-forest dark:text-white">
          {executive.displayName}
        </p>
        <p className="text-sm font-semibold text-institutional-green dark:text-sage-green">
          {executive.role}
        </p>
        {executive.portfolio && (
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {executive.portfolio}
          </p>
        )}
      </div>
    </div>
  );
}

function DirectorateExecutiveRow({ executive }: ExecutiveCardProps) {
  return (
    <div className="group flex items-center gap-4 rounded-2xl border border-stone-100 bg-white p-4 shadow-sm transition hover:border-vibrant-lime hover:shadow-md dark:border-stone-800 dark:bg-stone-900">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-green text-institutional-green dark:bg-vibrant-lime/30 dark:text-vibrant-lime">
        <User className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-deep-forest dark:text-white">
          {executive.displayName}
        </p>
        <p className="text-sm text-stone-500 dark:text-stone-300">
          {executive.role}
        </p>
        {executive.portfolio && (
          <p className="text-xs text-stone-400 dark:text-stone-500">
            {executive.portfolio}
          </p>
        )}
      </div>
      <Badge variant="light" color="lime" radius="sm">
        {EXECUTIVE_TIER_LABEL.directorate}
      </Badge>
    </div>
  );
}
