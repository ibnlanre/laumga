import { useState } from "react";
import { Button, Badge, Skeleton, TextInput } from "@mantine/core";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, MapPin, Users, Search, CalendarOff } from "lucide-react";
import { formatDate } from "@/utils/date";

import { useFetchEvents } from "@/services/hooks";
import { FilterOperator, type Variables } from "@/client/core-query";
import type { EventData } from "@/api/event";
import type { Event, EventType } from "@/api/event";

export const Route = createFileRoute("/_public/_default/events")({
  component: EventsPage,
});

const eventTypes = [
  { value: "all", label: "All Events" },
  { value: "convention", label: "Conventions" },
  { value: "seminar", label: "Seminars" },
  { value: "iftar", label: "Iftar" },
  { value: "sports", label: "Sports" },
  { value: "dawah", label: "Da'wah" },
  { value: "other", label: "Other" },
] as const;

function EventsPage() {
  const [selectedType, setSelectedType] = useState<EventType | "all">("all");
  const [showUpcoming, setShowUpcoming] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const eventVariables: Variables<EventData> = {
    filterBy: [],
    sortBy: [{ field: "date", value: "asc" }],
  };

  if (selectedType !== "all") {
    eventVariables.filterBy!.push({
      field: "type",
      operator: FilterOperator.EqualTo,
      value: selectedType,
    });
  }

  if (showUpcoming) {
    eventVariables.filterBy!.push({
      field: "date",
      operator: FilterOperator.GreaterThanOrEqualTo,
      value: new Date(),
    });
  }

  const { data: events, isLoading } = useFetchEvents(eventVariables);

  const filteredEvents = events?.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-white font-display text-deep-forest">
      <div className="layout-container flex h-full grow flex-col">
        <main className="w-full flex-1">
          {/* Hero Header */}
          <header className="w-full bg-white px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
                <h1 className="font-serif text-6xl font-bold leading-none text-deep-forest md:text-8xl lg:text-9xl">
                  Community
                  <br />
                  Events.
                </h1>
                <p className="max-w-xs text-sm text-deep-forest/80 md:text-right">
                  Join us for spiritual growth, professional development, and
                  community building through meaningful gatherings.
                </p>
              </div>
            </div>
          </header>

          {/* Filters */}
          <div className="sticky top-0 z-20 w-full bg-white/80 py-6 backdrop-blur-md border-b border-sage-green">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Search */}
                <TextInput
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftSection={<Search className="size-4" />}
                  className="w-full md:w-64"
                />

                {/* Type Filter */}
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                  {eventTypes.map((type) => (
                    <Button
                      key={type.value}
                      variant={
                        selectedType === type.value ? "filled" : "outline"
                      }
                      color="vibrant-lime"
                      size="sm"
                      onClick={() => setSelectedType(type.value)}
                      className="whitespace-nowrap"
                    >
                      {type.label}
                    </Button>
                  ))}
                </div>

                {/* Upcoming Toggle */}
                <Button
                  variant={showUpcoming ? "filled" : "outline"}
                  size="sm"
                  onClick={() => setShowUpcoming(!showUpcoming)}
                >
                  {showUpcoming ? "Upcoming Only" : "All Events"}
                </Button>
              </div>
            </div>
          </div>

          {/* Events Grid */}
          <div className="bg-mist-green">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} height={400} radius="lg" />
                  ))}
                </div>
              ) : filteredEvents && filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <CalendarOff className="h-16 w-16 text-deep-forest/30 mb-4 mx-auto" />
                  <h3 className="text-2xl font-bold text-deep-forest mb-2">
                    No Events Found
                  </h3>
                  <p className="text-deep-forest/60">
                    Try adjusting your filters or check back later
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Footer CTA */}
        <footer className="w-full bg-deep-forest px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-6 text-center">
            <p className="text-3xl font-medium text-white">
              Want to organize an event?
            </p>
            <p className="text-white/80 max-w-2xl">
              Reach out to the events team to propose your idea and bring the
              community together
            </p>
            <Button
              component={Link}
              to="/contact-us"
              size="lg"
              variant="white"
              radius="xl"
            >
              Contact Events Team
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}

function EventCard({ event }: { event: Event }) {
  const isFull = event.currentAttendees >= (event.maxAttendees || 0);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
      <div
        className="h-48 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${event.imageUrl})` }}
      >
        <div className="absolute top-4 right-4">
          <Badge
            color={getEventTypeColor(event.type)}
            size="lg"
            variant="filled"
          >
            {event.type}
          </Badge>
        </div>
      </div>

      <div className="p-6">
        <h3 className="font-bold text-xl text-deep-forest mb-3 line-clamp-2">
          {event.title}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-deep-forest/70">
            <Calendar className="size-4 text-institutional-green" />
            <span>{formatDate(event.date, "MMMM d, yyyy 'at' h:mm a")}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-deep-forest/70">
            <MapPin className="size-4 text-institutional-green" />
            <span className="line-clamp-1">{event.location}</span>
          </div>

          {event.maxAttendees && (
            <div className="flex items-center gap-2 text-sm text-deep-forest/70">
              <Users className="size-4 text-institutional-green" />
              <span>
                {event.currentAttendees} / {event.maxAttendees} registered
              </span>
            </div>
          )}
        </div>

        <p className="text-deep-forest/60 text-sm mb-4 line-clamp-3">
          {event.excerpt || event.description}
        </p>

        <Button
          component={Link}
          to={`/events/${event.id}`}
          fullWidth
          variant={isFull ? "outline" : "filled"}
          color="vibrant-lime"
          disabled={isFull}
        >
          {isFull ? "Event Full" : "View Details"}
        </Button>
      </div>
    </div>
  );
}

function getEventTypeColor(type: Event["type"]): string {
  const colors: Record<Event["type"], string> = {
    convention: "vibrant-lime",
    seminar: "institutional-green",
    iftar: "sage-green",
    sports: "deep-forest",
    dawah: "institutional-green",
    other: "gray",
  };
  return colors[type];
}
