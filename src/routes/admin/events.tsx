import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import {
  Title,
  Text,
  Badge,
  Button,
  Group,
  Stack,
  ActionIcon,
  Tooltip,
  Modal,
  Grid,
} from "@mantine/core";
import { DataTable } from "@/components/data-table";
import { Eye, Check, X, Trash2, Calendar } from "lucide-react";
import { formatDate } from "@/utils/date";

import { PageLoader } from "@/components/page-loader";
import {
  useListEvents,
  useRemoveEvent,
  useUpdateEvent,
} from "@/api/event/hooks";
import type { Event, EventStatus } from "@/api/event/types";
import { useAuth } from "@/contexts/use-auth";

export const Route = createFileRoute("/admin/events")({
  validateSearch: (search: Record<string, unknown>) => ({
    status: (search.status as string) || undefined,
  }),
  component: EventsAdmin,
});

function EventsAdmin() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [detailsOpened, setDetailsOpened] = useState(false);

  const { user } = useAuth();
  const { data: events = [], isLoading } = useListEvents();

  const updateEventMutation = useUpdateEvent();
  const deleteEventMutation = useRemoveEvent();

  const columnHelper = createColumnHelper<Event>();

  const columns = [
    columnHelper.accessor("title", {
      header: "Event",
      cell: (info) => (
        <div className="max-w-md">
          <Text size="sm" fw={500}>
            {info.getValue()}
          </Text>
          <Text size="xs" c="dimmed" lineClamp={1}>
            {info.row.original.description}
          </Text>
        </div>
      ),
    }),

    columnHelper.accessor("startDate", {
      header: "Date",
      cell: (info) => (
        <Group gap="xs">
          <Calendar className="size-4 text-gray-400" />
          <Text size="sm">{formatDate(info.getValue(), "MMM dd, yyyy")}</Text>
        </Group>
      ),
    }),

    columnHelper.accessor("location", {
      header: "Location",
      cell: (info) => <Text size="sm">{info.getValue()}</Text>,
    }),

    columnHelper.accessor("category", {
      header: "Category",
      cell: (info) => (
        <Badge size="sm" variant="light">
          {info.getValue()}
        </Badge>
      ),
    }),

    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => (
        <Badge
          size="sm"
          color={getStatusColor(info.getValue())}
          variant="light"
        >
          {info.getValue()}
        </Badge>
      ),
    }),

    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => (
        <Group gap="xs">
          <Tooltip label="View details">
            <ActionIcon
              variant="subtle"
              color="blue"
              onClick={() => viewEventDetails(info.row.original)}
            >
              <Eye className="size-4" />
            </ActionIcon>
          </Tooltip>
          {info.row.original.status === "draft" && (
            <Tooltip label="Publish">
              <ActionIcon
                variant="subtle"
                color="green"
                onClick={() =>
                  handleStatusChange(info.row.original.id, "published")
                }
              >
                <Check className="size-4" />
              </ActionIcon>
            </Tooltip>
          )}
          {info.row.original.status === "published" && (
            <Tooltip label="Cancel">
              <ActionIcon
                variant="subtle"
                color="red"
                onClick={() =>
                  handleStatusChange(info.row.original.id, "cancelled")
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
              onClick={() => handleDelete(info.row.original.id)}
            >
              <Trash2 className="size-4" />
            </ActionIcon>
          </Tooltip>
        </Group>
      ),
    }),
  ] as ColumnDef<Event>[];

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

  const handleStatusChange = async (id: string, newStatus: EventStatus) => {
    if (!user) return;

    await updateEventMutation.mutateAsync({
      id,
      data: { status: newStatus },
      user,
    });

    setDetailsOpened(false);
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    await deleteEventMutation.mutateAsync(eventId);
    setDetailsOpened(false);
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

      <DataTable
        columns={columns}
        data={events}
        enableSearch
        enableFilters
        enableSorting
        enablePagination
        enableColumnOrdering
        filters={[
          {
            key: "status",
            label: "Filter by status",
            options: [
              { value: "all", label: "All Events" },
              { value: "published", label: "Published" },
              { value: "draft", label: "Draft" },
              { value: "cancelled", label: "Cancelled" },
            ],
          },
        ]}
        searchPlaceholder="Search events..."
        pageSize={10}
        loading={isLoading}
      />

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
                  {formatDate(selectedEvent.startDate, "MMMM dd, yyyy")}
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
