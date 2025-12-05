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
import { format } from "date-fns";

import {
  useFetchEvent,
  useRegisterForEvent,
  useCheckEventRegistration,
} from "@/services/hooks";
import { useAuth } from "@/contexts/auth";
import { notifications } from "@mantine/notifications";

export const Route = createFileRoute("/_public/_default/events/$eventId")({
  component: EventDetailPage,
});

function EventDetailPage() {
  const { eventId } = Route.useParams();
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  const [opened, { open, close }] = useDisclosure(false);

  const { data: event, isLoading } = useFetchEvent(eventId);
  const { data: isRegistered } = useCheckEventRegistration(
    eventId,
    currentUser?.uid || ""
  );
  const registerMutation = useRegisterForEvent();

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 lg:px-6 py-16">
        <Skeleton height={400} radius="lg" mb="xl" />
        <Skeleton height={200} radius="lg" />
      </main>
    );
  }

  if (!event) {
    return (
      <main className="container mx-auto px-4 lg:px-6 py-16 text-center">
        <CalendarOff className="h-24 w-24 text-deep-forest/30 mb-4 mx-auto" />
        <h1 className="text-3xl font-bold text-deep-forest mb-4">
          Event Not Found
        </h1>
        <Button onClick={() => navigate({ to: "/events" })}>
          Back to Events
        </Button>
      </main>
    );
  }

  const eventDate = new Date(event.date);
  const isFull =
    event.maxAttendees && event.currentAttendees >= event.maxAttendees;
  const isPast = eventDate < new Date();

  const handleRegister = async () => {
    if (!currentUser || !userData) {
      notifications.show({
        title: "Login Required",
        message: "Please login to register for this event",
        color: "red",
      });
      navigate({ to: "/login" });
      return;
    }

    try {
      await registerMutation.mutateAsync({
        eventId: event.id,
        userId: currentUser.uid,
        userData: {
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
        },
      });
      notifications.show({
        title: "Success!",
        message: "You've been registered for this event",
        color: "green",
      });
      close();
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error.message || "Failed to register",
        color: "red",
      });
    }
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
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      notifications.show({
        title: "Link Copied",
        message: "Event link copied to clipboard",
        color: "green",
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
        <div className="relative container mx-auto px-4 lg:px-6 h-full flex items-end pb-8">
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
        </div>
      </section>

      {/* Event Details */}
      <section className="bg-mist-green py-16">
        <div className="container mx-auto px-4 lg:px-6">
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
                        {format(eventDate, "MMMM d, yyyy")}
                      </p>
                      <p className="text-sm text-gray-600">
                        {format(eventDate, "h:mm a")}
                        {event.endDate &&
                          ` - ${format(new Date(event.endDate), "h:mm a")}`}
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
                ) : isPast ? (
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
        </div>
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
