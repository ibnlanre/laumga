import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  Title,
  Text,
  Badge,
  Button,
  Group,
  Stack,
  TextInput,
  Select,
  Table,
  ActionIcon,
  Tooltip,
  Modal,
  Grid,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Search, Eye, Check, X, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";

import {
  useFetchEvents,
  useUpdateEvent,
  useDeleteEvent,
} from "@/services/hooks";
import type { Event } from "@/api/event";
import { PageLoader } from "@/components/page-loader";

export const Route = createFileRoute("/_auth/admin/events")({
  validateSearch: (search: Record<string, unknown>) => ({
    status: (search.status as string) || undefined,
  }),
  component: EventsAdmin,
});

function EventsAdmin() {
  const { status } = Route.useSearch();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(status || "all");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [detailsOpened, setDetailsOpened] = useState(false);

  const { data: events = [], isLoading } = useFetchEvents();
  const updateEventMutation = useUpdateEvent();
  const deleteEventMutation = useDeleteEvent();

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || event.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "green";
      case "draft":
        return "yellow";
      case "cancelled":
        return "red";
      default:
        return "gray";
    }
  };

  const viewEventDetails = (event: Event) => {
    setSelectedEvent(event);
    setDetailsOpened(true);
  };

  const handleStatusChange = async (eventId: string, newStatus: string) => {
    try {
      await updateEventMutation.mutateAsync({
        eventId: eventId,
        updates: { status: newStatus },
      });

      notifications.show({
        title: "Status updated",
        message: `Event status changed to ${newStatus}`,
        color: "green",
        autoClose: 5000,
      });

      setDetailsOpened(false);
    } catch (error: any) {
      notifications.show({
        title: "Update failed",
        message: error?.message || "Failed to update event status",
        color: "red",
        autoClose: 7000,
      });
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      await deleteEventMutation.mutateAsync(eventId);

      notifications.show({
        title: "Event deleted",
        message: "Event has been successfully deleted",
        color: "green",
        autoClose: 5000,
      });

      setDetailsOpened(false);
    } catch (error: any) {
      notifications.show({
        title: "Delete failed",
        message: error?.message || "Failed to delete event",
        color: "red",
        autoClose: 7000,
      });
    }
  };

  if (isLoading) {
    return <PageLoader message="Loading events..." />;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Title order={2} className="text-deep-forest mb-2">
          Events Management
        </Title>
        <Text size="sm" c="dimmed">
          Manage and moderate all event submissions
        </Text>
      </div>

      <Card shadow="sm" p="lg" radius="md" withBorder className="mb-6">
        <Group justify="space-between" mb="md">
          <TextInput
            placeholder="Search events..."
            leftSection={<Search className="size-4" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            style={{ flex: 1, maxWidth: 400 }}
          />
          <Select
            placeholder="Filter by status"
            value={statusFilter}
            onChange={(value) => setStatusFilter(value || "all")}
            data={[
              { value: "all", label: "All Events" },
              { value: "published", label: "Published" },
              { value: "draft", label: "Draft" },
              { value: "cancelled", label: "Cancelled" },
            ]}
            style={{ width: 200 }}
          />
        </Group>

        <Table.ScrollContainer minWidth={800}>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Event</Table.Th>
                <Table.Th>Date</Table.Th>
                <Table.Th>Location</Table.Th>
                <Table.Th>Category</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Created</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredEvents.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={7} className="text-center py-8">
                    <Text c="dimmed">No events found</Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                filteredEvents.map((event) => (
                  <Table.Tr key={event.id}>
                    <Table.Td>
                      <div>
                        <Text size="sm" fw={500}>
                          {event.title}
                        </Text>
                        <Text size="xs" c="dimmed" lineClamp={1}>
                          {event.description}
                        </Text>
                      </div>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Calendar className="size-4 text-gray-400" />
                        <Text size="sm">
                          {format(new Date(event.date), "MMM dd, yyyy")}
                        </Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{event.location}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge size="sm" variant="light">
                        {event.category}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        size="sm"
                        color={getStatusColor(event.status)}
                        variant="light"
                      >
                        {event.status}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="xs" c="dimmed">
                        {format(new Date(event.createdAt), "MMM dd, yyyy")}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Tooltip label="View details">
                          <ActionIcon
                            variant="subtle"
                            color="blue"
                            onClick={() => viewEventDetails(event)}
                          >
                            <Eye className="size-4" />
                          </ActionIcon>
                        </Tooltip>
                        {event.status === "draft" && (
                          <Tooltip label="Publish">
                            <ActionIcon
                              variant="subtle"
                              color="green"
                              onClick={() =>
                                handleStatusChange(event.id, "published")
                              }
                            >
                              <Check className="size-4" />
                            </ActionIcon>
                          </Tooltip>
                        )}
                        {event.status === "published" && (
                          <Tooltip label="Cancel">
                            <ActionIcon
                              variant="subtle"
                              color="red"
                              onClick={() =>
                                handleStatusChange(event.id, "cancelled")
                              }
                            >
                              <X className="size-4" />
                            </ActionIcon>
                          </Tooltip>
                        )}
                        <Tooltip label="Delete">
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            onClick={() => handleDelete(event.id)}
                          >
                            <Trash2 className="size-4" />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Card>

      {/* Event Details Modal */}
      <Modal
        opened={detailsOpened}
        onClose={() => setDetailsOpened(false)}
        title="Event Details"
        size="lg"
      >
        {selectedEvent && (
          <Stack gap="md">
            <div>
              <Group justify="space-between" mb="md">
                <Title order={3}>{selectedEvent.title}</Title>
                <Badge
                  size="lg"
                  color={getStatusColor(selectedEvent.status)}
                  variant="light"
                >
                  {selectedEvent.status}
                </Badge>
              </Group>
            </div>

            <Grid>
              <Grid.Col span={6}>
                <Text size="sm" fw={500} c="dimmed">
                  Date
                </Text>
                <Text size="sm">
                  {format(new Date(selectedEvent.date), "MMMM dd, yyyy")}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" fw={500} c="dimmed">
                  Time
                </Text>
                <Text size="sm">{selectedEvent.time}</Text>
              </Grid.Col>
              <Grid.Col span={12}>
                <Text size="sm" fw={500} c="dimmed">
                  Location
                </Text>
                <Text size="sm">{selectedEvent.location}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" fw={500} c="dimmed">
                  Category
                </Text>
                <Badge variant="light">{selectedEvent.category}</Badge>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" fw={500} c="dimmed">
                  Organizer
                </Text>
                <Text size="sm">{selectedEvent.organizer}</Text>
              </Grid.Col>
              <Grid.Col span={12}>
                <Text size="sm" fw={500} c="dimmed">
                  Description
                </Text>
                <Text size="sm">{selectedEvent.description}</Text>
              </Grid.Col>
              <Grid.Col span={12}>
                <Text size="sm" fw={500} c="dimmed">
                  Registration Link
                </Text>
                <Text size="sm" c="blue" style={{ wordBreak: "break-all" }}>
                  {selectedEvent.registrationLink || "N/A"}
                </Text>
              </Grid.Col>
            </Grid>

            <div className="mt-4 pt-4 border-t">
              <Group justify="flex-end" gap="sm">
                {selectedEvent.status === "draft" && (
                  <Button
                    leftSection={<Check className="size-4" />}
                    color="green"
                    onClick={() =>
                      handleStatusChange(selectedEvent.id, "published")
                    }
                    loading={updateEventMutation.isPending}
                  >
                    Publish Event
                  </Button>
                )}
                {selectedEvent.status === "published" && (
                  <Button
                    leftSection={<X className="size-4" />}
                    color="orange"
                    variant="outline"
                    onClick={() =>
                      handleStatusChange(selectedEvent.id, "cancelled")
                    }
                    loading={updateEventMutation.isPending}
                  >
                    Cancel Event
                  </Button>
                )}
                {selectedEvent.status === "cancelled" && (
                  <Button
                    leftSection={<Check className="size-4" />}
                    color="green"
                    onClick={() =>
                      handleStatusChange(selectedEvent.id, "published")
                    }
                    loading={updateEventMutation.isPending}
                  >
                    Republish Event
                  </Button>
                )}
                <Button
                  leftSection={<Trash2 className="size-4" />}
                  color="red"
                  variant="outline"
                  onClick={() => handleDelete(selectedEvent.id)}
                  loading={deleteEventMutation.isPending}
                >
                  Delete Event
                </Button>
              </Group>
            </div>
          </Stack>
        )}
      </Modal>
    </div>
  );
}
