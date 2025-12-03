import { useState } from "react";
import { Button, Badge, Skeleton, TextInput } from "@mantine/core";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, MapPin, Users, Search } from "lucide-react";
import { format } from "date-fns";

import { useFetchEvents } from "@/services/hooks";
import type { Event } from "@/api";

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
  const [selectedType, setSelectedType] = useState<string>("all");
  const [showUpcoming, setShowUpcoming] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: events, isLoading } = useFetchEvents({
    type: selectedType === "all" ? undefined : (selectedType as Event["type"]),
    upcoming: showUpcoming,
  });

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
                  <span className="material-symbols-outlined text-6xl text-deep-forest/30 mb-4">
                    event_busy
                  </span>
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
  const eventDate = new Date(event.date);
  const isFull = !!(
    event.maxAttendees && event.currentAttendees >= event.maxAttendees
  );

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
            <span>{format(eventDate, "MMMM d, yyyy 'at' h:mm a")}</span>
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

// return (
//   <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-white font-display text-deep-forest">
//     <div className="layout-container flex h-full grow flex-col">
//       <main className="w-full flex-1">
//         <header className="w-full bg-white px-4 py-16 sm:px-6 lg:px-8">
//           <div className="mx-auto max-w-7xl">
//             <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
//               <h1 className="font-serif text-6xl font-bold leading-none text-deep-forest md:text-8xl lg:text-9xl">
//                 Currents &amp;
//                 <br />
//                 Gatherings.
//               </h1>
//               <p className="max-w-xs text-sm text-deep-forest/80 md:text-right">
//                 The pulse of the association. Stay informed on recent
//                 developments and upcoming milestones.
//               </p>
//             </div>
//           </div>
//         </header>
//         <div className="sticky top-0 z-20 w-full bg-white/80 py-6 backdrop-blur-md">
//           <div className="mx-auto max-w-7xl overflow-x-auto px-4 sm:px-6 lg:px-8">
//             <div className="relative w-full py-8">
//               <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-sage-green"></div>
//               <div
//                 className="relative flex items-end justify-start gap-12"
//                 style={{ minWidth: "1200px" }}
//               >
//                 <div className="flex items-center gap-2">
//                   <div className="text-center">
//                     <span className="font-serif text-5xl font-bold text-deep-forest">
//                       28
//                     </span>
//                   </div>
//                   <span
//                     className="text-sm font-semibold uppercase text-deep-forest"
//                     style={{ writingMode: "vertical-rl" }}
//                   >
//                     APR
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="relative text-center">
//                     <span className="font-serif text-5xl font-bold text-deep-forest">
//                       10
//                     </span>
//                     <div className="animate-pulse-lime absolute -right-4 top-2 h-3 w-3 rounded-full bg-vibrant-lime"></div>
//                   </div>
//                   <span
//                     className="text-sm font-semibold uppercase text-deep-forest"
//                     style={{ writingMode: "vertical-rl" }}
//                   >
//                     MAY
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="text-center">
//                     <span className="font-serif text-5xl font-bold text-deep-forest">
//                       15
//                     </span>
//                   </div>
//                   <span
//                     className="text-sm font-semibold uppercase text-deep-forest"
//                     style={{ writingMode: "vertical-rl" }}
//                   >
//                     JUN
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="text-center">
//                     <span className="font-serif text-5xl font-bold text-deep-forest">
//                       05
//                     </span>
//                   </div>
//                   <span
//                     className="text-sm font-semibold uppercase text-deep-forest"
//                     style={{ writingMode: "vertical-rl" }}
//                   >
//                     JUL
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="text-center">
//                     <span className="font-serif text-5xl font-bold text-deep-forest">
//                       21
//                     </span>
//                   </div>
//                   <span
//                     className="text-sm font-semibold uppercase text-deep-forest"
//                     style={{ writingMode: "vertical-rl" }}
//                   >
//                     AUG
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="text-center">
//                     <span className="font-serif text-5xl font-bold text-deep-forest">
//                       30
//                     </span>
//                   </div>
//                   <span
//                     className="text-sm font-semibold uppercase text-deep-forest"
//                     style={{ writingMode: "vertical-rl" }}
//                   >
//                     SEP
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="bg-white">
//           <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
//             <section className="flex min-h-[80vh] flex-col md:flex-row">
//               <div className="w-full md:w-1/2">
//                 <div
//                   className="h-full min-h-[400px] w-full bg-cover bg-center"
//                   data-alt="Muslim graduates volunteering at a hospital."
//                   style={{
//                     backgroundImage:
//                       "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBZFiFJm0--oQ-U52SpQXGDsdCe-wIYll1AGANryQ-dJVY5JfMFxHs7FkdGk1POYjQ6yeFZDXTKncJPpjuyQse5pY4WhIAEzNShkjsN6DAFP4roTpsWYLthrmV3H5q1dw5nJX5i8gPdwKeRFrO1JLcn4tVJQ6HHKIqUulDvNjG_LxkQv-6Z0QSQ0b-ptLhd4flitHq-KhWL5PLYwGwss9NawQCU1A9VnVY1YWU1pQbvcR-QH0Y3eMuseAOClrrVUDNOY4pH20nb7jo')",
//                   }}
//                 ></div>
//               </div>
//               <div className="flex w-full items-center bg-white p-8 md:w-1/2 md:p-12 lg:p-20">
//                 <div className="flex flex-col items-start">
//                   <span className="mb-4 text-sm font-bold uppercase tracking-widest text-vibrant-lime">
//                     COMMUNITY IMPACT
//                   </span>
//                   <h2 className="mb-6 font-serif text-4xl font-bold leading-tight text-deep-forest lg:text-5xl">
//                     Healing Hands at Ede Muslim Hospital.
//                   </h2>
//                   <p className="drop-cap mb-8 max-w-prose text-base leading-relaxed text-deep-forest/80">
//                     Members of the association's humanitarian wing recently
//                     concluded a three-day medical outreach at the Ede Muslim
//                     Hospital, providing free consultations, essential
//                     medications, and surgical procedures to over 500
//                     residents. The initiative, funded by alumni donations,
//                     underscores our commitment to community welfare and
//                     service in the spirit of our shared faith.
//                   </p>
//                   <a
//                     className="group font-bold text-deep-forest hover:text-vibrant-lime"
//                     href="#"
//                   >
//                     Read Full Report
//                     <span className="inline-block transition-transform group-hover:translate-x-1">
//                       →
//                     </span>
//                   </a>
//                 </div>
//               </div>
//             </section>
//             <section className="mt-24">
//               <div className="border-t border-sage-green">
//                 <div className="hover-reveal-item group relative">
//                   <a
//                     className="flex items-center justify-between border-b border-sage-green px-2 py-6 text-deep-forest transition-colors hover:bg-mist-green"
//                     href="#"
//                   >
//                     <div className="flex items-center gap-4 sm:gap-8">
//                       <span className="text-sm text-deep-forest/50">
//                         25 APR 2024
//                       </span>
//                       <h3 className="flex-1 text-lg font-medium group-hover:font-bold">
//                         Annual Scholarship Fund benefits 50 Students
//                       </h3>
//                     </div>
//                     <div className="hidden items-center gap-4 sm:flex">
//                       <span className="rounded-full bg-sage-green px-3 py-1 text-xs font-semibold text-deep-forest">
//                         ACADEMICS
//                       </span>
//                       <span className="material-symbols-outlined text-deep-forest transition-transform group-hover:translate-x-1">
//                         arrow_forward
//                       </span>
//                     </div>
//                   </a>
//                   <img
//                     alt="Students studying"
//                     className="hover-reveal-image h-48 w-64 object-cover"
//                     src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6ZfZyLpMkabMh8ev1WcBEUAYB8vXa-53OXaE2D-Vam1G4DzqRC-y3b2U3EPCfw25_U7n6ZfPK23xFi4zkEsc582Dbnn88v2RpIMAnK3pa_FYNULDESwumVJF38g6fBpCDXSPIuK_4_VRk9gD5A4dfDX65vH2Ksa-fGALnrzw_1JBP0OC8nRVYL9yLhnJknJNaOOqNmUzqwBWX1YWzvqWhy0S0_N1lfilttZQTXOs-LDBLmKhwcTZENRr5own5Y4ATjSdNH5xq0kU"
//                   />
//                 </div>
//                 <div className="hover-reveal-item group relative">
//                   <a
//                     className="flex items-center justify-between border-b border-sage-green px-2 py-6 text-deep-forest transition-colors hover:bg-mist-green"
//                     href="#"
//                   >
//                     <div className="flex items-center gap-4 sm:gap-8">
//                       <span className="text-sm text-deep-forest/50">
//                         18 APR 2024
//                       </span>
//                       <h3 className="flex-1 text-lg font-medium group-hover:font-bold">
//                         President Announces New Diaspora Chapter
//                       </h3>
//                     </div>
//                     <div className="hidden items-center gap-4 sm:flex">
//                       <span className="rounded-full bg-sage-green px-3 py-1 text-xs font-semibold text-deep-forest">
//                         ASSOCIATION
//                       </span>
//                       <span className="material-symbols-outlined text-deep-forest transition-transform group-hover:translate-x-1">
//                         arrow_forward
//                       </span>
//                     </div>
//                   </a>
//                   <img
//                     alt="Global map"
//                     className="hover-reveal-image h-48 w-64 object-cover"
//                     src="https://lh3.googleusercontent.com/aida-public/AB6AXuBz1gH34iSAiyHzIamldCuYrzKqsvlqy0g5oZfjcf2xsHkBSQXMvb4V3RLh1LM9uYdEU5-WHDRI-H5dHCd3bX45u7BsFXqhIvTB_sdFpe7YMyadFPcoA3BazfJxwMp_Zf_Y_pF9ctI4InT5CiN9wXQEf5TMWidTvxOZ2LSHZqX8l_vi01aFJwCkCx6SARqODjZWfwi3PevWMex5kMG_-9l1--cTEG4NeDxMos8AA1Ta3zQuU9bV8RFnrTKk0jpyCTmOtxZ6CqMIZK4"
//                   />
//                 </div>
//                 <div className="hover-reveal-item group relative">
//                   <a
//                     className="flex items-center justify-between border-b border-sage-green px-2 py-6 text-deep-forest transition-colors hover:bg-mist-green"
//                     href="#"
//                   >
//                     <div className="flex items-center gap-4 sm:gap-8">
//                       <span className="text-sm text-deep-forest/50">
//                         12 APR 2024
//                       </span>
//                       <h3 className="flex-1 text-lg font-medium group-hover:font-bold">
//                         Alumni Donation Funds New Tech Hub for Students
//                       </h3>
//                     </div>
//                     <div className="hidden items-center gap-4 sm:flex">
//                       <span className="rounded-full bg-sage-green px-3 py-1 text-xs font-semibold text-deep-forest">
//                         CAMPUS
//                       </span>
//                       <span className="material-symbols-outlined text-deep-forest transition-transform group-hover:translate-x-1">
//                         arrow_forward
//                       </span>
//                     </div>
//                   </a>
//                   <img
//                     alt="Technology hub"
//                     className="hover-reveal-image h-48 w-64 object-cover"
//                     src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWqh0bJXVcLBNz5s7A0vzM3DllMcDhWVvmKDJZghCQDqQDtw1RLunS4nqtQE_jWvp3jh8j4ZRC7aUepJq03NbMsIQXB0fxM-r-kjiWBdgzziEnkLXqAkaroDfHHQSBa7t7L0F2ICouHP__yrQkAsy4V5UJqBMZZwWBYQthxzyx9soOBplr9wPH3Av4Q1uu7ipmT31GR66tINiGNGuoVxCbeyF_eSsslDyPb1-uVJIlnrw-JFYSosu4nnpIsBPaOhNEniOThUF7Wb0"
//                   />
//                 </div>
//               </div>
//               <script
//                 dangerouslySetInnerHTML={{
//                   __html: `document.addEventListener("DOMContentLoaded", function () {
//                   const items =
//                     document.querySelectorAll(".hover-reveal-item");

//                   items.forEach((item) => {
//                     const image = item.querySelector(".hover-reveal-image");
//                     if (image) {
//                       item.addEventListener("mousemove", function (e) {
//                         image.style.left = e.clientX + 15 + "px";
//                         image.style.top = e.clientY + 15 + "px";
//                       });
//                     }
//                   });
//                 });`,
//                 }}
//               />
//             </section>
//           </div>
//         </div>
//       </main>
//       <footer className="w-full bg-deep-forest px-4 py-16 sm:px-6 lg:px-8">
//         <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
//           <p className="text-3xl font-medium text-white">
//             Never miss an update.
//           </p>
//           <form className="flex w-full max-w-sm items-center gap-2">
//             <label className="sr-only" htmlFor="email-subscribe">
//               Email address
//             </label>
//             <input
//               className="h-12 grow appearance-none border-0 border-b-2 border-white bg-transparent text-white placeholder-white/50 focus:border-vibrant-lime focus:outline-none focus:ring-0"
//               id="email-subscribe"
//               placeholder="Enter your email"
//               type="email"
//             />
//             <button
//               className="shrink-0 text-lg font-bold text-vibrant-lime transition-transform hover:scale-105"
//               type="submit"
//             >
//               Subscribe
//             </button>
//           </form>
//         </div>
//       </footer>
//     </div>
//   </div>
// );
