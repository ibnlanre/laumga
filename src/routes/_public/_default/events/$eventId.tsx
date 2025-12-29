import { Button, Badge, Skeleton, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Calendar,
  MapPin,
  Users,
  Share2,
  ArrowLeft,
  CalendarOff,
} from "lucide-react";
import { formatDate, formatTime } from "@/utils/date";

import { useAuth } from "@/contexts/use-auth";
import { isPast } from "date-fns";
import { useCreateEventRegistration } from "@/api/event-registration/hooks";
import { checkUserRegistrationOptions } from "@/api/event-registration/options";
import { getEventOptions } from "@/api/event/options";
import { useQuery } from "@tanstack/react-query";
import { Section } from "@/components/section";
import {
  showErrorNotification,
  showInfoNotification,
  showSuccessNotification,
} from "@/components/notifications";

export const Route = createFileRoute("/_public/_default/events/$eventId")({
  component: EventDetailPage,
});

function EventDetailPage() {
  const navigate = useNavigate();
  const registerMutation = useCreateEventRegistration();

  const [opened, { open, close }] = useDisclosure(false);

  const { eventId } = Route.useParams();
  const { user } = useAuth();

  const { data: event, isLoading } = useQuery(getEventOptions(eventId));
  const { data: isRegistered } = useQuery(
    checkUserRegistrationOptions(eventId, user?.id)
  );

  if (isLoading) {
    return (
      <Section className="py-16">
        <Skeleton height={400} radius="lg" mb="xl" />
        <Skeleton height={200} radius="lg" />
      </Section>
    );
  }

  if (!event) {
    return (
      <Section className="py-16 text-center">
        <CalendarOff className="h-24 w-24 text-deep-forest/30 mb-4 mx-auto" />
        <h1 className="text-3xl font-bold text-deep-forest mb-4">
          Event Not Found
        </h1>
        <Button onClick={() => navigate({ to: "/events" })}>
          Back to Events
        </Button>
      </Section>
    );
  }

  const eventDate = formatDate(event.startDate);
  const isFull =
    event.maxAttendees && event.currentAttendees >= event.maxAttendees;
  const isPastEvent = isPast(eventDate);

  const handleRegister = async () => {
    if (!user) {
      showInfoNotification({
        title: "Login Required",
        message: "Please login to register for this event",
      });

      navigate({ to: "/login" });
      return;
    }

    await registerMutation.mutateAsync({
      data: {
        user,
        data: {
          eventId: event.id,
          email: user.email,
          attending: "yes",
          registered: null,
          updated: null,
        },
      },
    });

    close();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        });
      } catch (err) {
        showErrorNotification({
          title: "Share Failed",
          message: "Unable to share the event at this time.",
        });
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      showSuccessNotification({
        title: "Link Copied",
        message: "Event link copied to clipboard",
      });
    }
  };

  return (
    <main>
      {/* Hero Image */}
      <section
        className="relative h-96 bg-cover bg-center"
        style={{ backgroundImage: `url(${event.imageUrl})` }}
      >
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
        <Section className="relative h-full flex items-end pb-8">
          <div>
            <Button
              variant="white"
              leftSection={<ArrowLeft className="size-4" />}
              onClick={() => navigate({ to: "/events" })}
              className="mb-4"
            >
              Back to Events
            </Button>
            <Badge
              color="vibrant-lime"
              size="lg"
              variant="filled"
              className="mb-4"
            >
              {event.type}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white font-serif">
              {event.title}
            </h1>
          </div>
        </Section>
      </section>

      {/* Event Details */}
      <section className="bg-mist-green py-16">
        <Section>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-deep-forest mb-4">
                  About This Event
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>

                {event.organizer && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="font-bold text-deep-forest mb-2">
                      Organized by
                    </h3>
                    <p className="text-gray-600">{event.organizer}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Calendar className="size-5 text-institutional-green mt-0.5" />
                    <div>
                      <p className="font-semibold text-deep-forest">
                        {formatDate(eventDate, "MMMM d, yyyy")}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatTime(eventDate)}
                        {event.endDate && ` - ${formatTime(event.endDate)}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="size-5 text-institutional-green mt-0.5" />
                    <div>
                      <p className="font-semibold text-deep-forest">Location</p>
                      <p className="text-sm text-gray-600">{event.location}</p>
                    </div>
                  </div>

                  {event.maxAttendees && (
                    <div className="flex items-start gap-3">
                      <Users className="size-5 text-institutional-green mt-0.5" />
                      <div>
                        <p className="font-semibold text-deep-forest">
                          Capacity
                        </p>
                        <p className="text-sm text-gray-600">
                          {event.currentAttendees} / {event.maxAttendees}{" "}
                          registered
                        </p>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-vibrant-lime h-2 rounded-full"
                            style={{
                              width: `${Math.min(
                                (event.currentAttendees / event.maxAttendees) *
                                  100,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {isRegistered ? (
                  <Button fullWidth variant="outline" color="green" disabled>
                    ✓ You're Registered
                  </Button>
                ) : isPastEvent ? (
                  <Button fullWidth variant="outline" disabled>
                    Event Ended
                  </Button>
                ) : isFull ? (
                  <Button fullWidth variant="outline" disabled>
                    Event Full
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    variant="filled"
                    color="vibrant-lime"
                    size="lg"
                    onClick={open}
                  >
                    Register Now
                  </Button>
                )}

                <Button
                  fullWidth
                  variant="subtle"
                  leftSection={<Share2 className="size-4" />}
                  onClick={handleShare}
                  className="mt-2"
                >
                  Share Event
                </Button>
              </div>
            </div>
          </div>
        </Section>
      </section>

      {/* Registration Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title="Confirm Registration"
        centered
      >
        <p className="mb-4">
          Are you sure you want to register for <strong>{event.title}</strong>?
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={close} fullWidth>
            Cancel
          </Button>
          <Button
            variant="filled"
            color="vibrant-lime"
            onClick={handleRegister}
            loading={registerMutation.isPending}
            fullWidth
          >
            Confirm
          </Button>
        </div>
      </Modal>
    </main>
  );
}
