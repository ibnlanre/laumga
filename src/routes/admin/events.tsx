import { createFileRoute } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { zodValidator } from "@tanstack/zod-adapter";
import {
  ActionIcon,
  Badge,
  Button,
  Grid,
  Group,
  NumberInput,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
  Textarea,
  Title,
  Tooltip,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { Calendar, Check, Edit, Eye, Plus, Trash2, X } from "lucide-react";
import { z } from "zod";

import { DataTable } from "@/components/data-table";
import { PageLoader } from "@/components/page-loader";
import {
  useCreateEvent,
  useRemoveEvent,
  useUpdateEvent,
} from "@/api/event/hooks";
import { listEventOptions } from "@/api/event/options";
import type { CreateEventData, Event, EventStatus } from "@/api/event/types";
import { createEventSchema } from "@/api/event/schema";
import { useAuth } from "@/contexts/use-auth";
import { formatDate } from "@/utils/date";
import { record } from "@/utils/record";
import type { User } from "@/api/user/types";

const CREATE_EVENT_MODAL_ID = "create-event-modal";
const EDIT_EVENT_MODAL_PREFIX = "edit-event-modal";
const EVENT_DETAILS_MODAL_PREFIX = "event-details-modal";

const EVENT_TYPE_OPTIONS = [
  { value: "convention", label: "Convention" },
  { value: "seminar", label: "Seminar" },
  { value: "iftar", label: "Iftar" },
  { value: "sports", label: "Sports" },
  { value: "dawah", label: "Dawah" },
  { value: "other", label: "Other" },
];

const EVENT_STATUS_FILTERS = [
  { value: "all", label: "All Events" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "cancelled", label: "Cancelled" },
];

const eventFormSchema = createEventSchema.omit({
  created: true,
  updated: true,
});

type EventFormValues = z.infer<typeof eventFormSchema>;

export const Route = createFileRoute("/admin/events")({
  validateSearch: zodValidator(
    z.object({
      status: z.string().optional(),
    })
  ),
  component: EventsAdmin,
});

function EventsAdmin() {
  const { user } = useAuth();
  const { data: events = [], isLoading } = useQuery(listEventOptions());

  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useRemoveEvent();

  const columnHelper = createColumnHelper<Event>();

  const closeModal = (id?: string) => {
    if (id) {
      modals.close(id);
    }
  };

  const handleCreateEvent = async (values: EventFormValues) => {
    if (!user) return;

    await createEvent.mutateAsync({
      data: {
        user,
        data: buildCreatePayload(values, user),
      },
    });

    closeModal(CREATE_EVENT_MODAL_ID);
  };

  const handleUpdateEvent = async (
    eventId: string,
    values: EventFormValues,
    modalId?: string
  ) => {
    if (!user) return;

    await updateEvent.mutateAsync({
      data: {
        id: eventId,
        data: values,
        user,
      },
    });

    closeModal(modalId);
  };

  const handleStatusChange = async (
    eventId: string,
    status: EventStatus,
    modalId?: string
  ) => {
    if (!user) return;

    await updateEvent.mutateAsync({
      data: {
        id: eventId,
        data: { status },
        user,
      },
    });

    closeModal(modalId);
  };

  const handleDeleteEvent = async (eventId: string, modalId?: string) => {
    await deleteEvent.mutateAsync({ data: eventId });
    closeModal(modalId);
  };

  const confirmDeleteEvent = (event: Event, modalId?: string) => {
    modals.openConfirmModal({
      title: `Delete ${event.title}?`,
      children: (
        <Text size="sm">
          This event will be removed from the bulletin and cannot be restored.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red", loading: deleteEvent.isPending },
      onConfirm: () => handleDeleteEvent(event.id, modalId),
    });
  };

  const openCreateModal = () => {
    modals.open({
      modalId: CREATE_EVENT_MODAL_ID,
      title: <Title order={3}>Create event</Title>,
      radius: "lg",
      size: "lg",
      children: (
        <EventForm
          mode="create"
          initialValues={getDefaultEventFormValues()}
          submitting={createEvent.isPending}
          onSubmit={handleCreateEvent}
          onCancel={() => closeModal(CREATE_EVENT_MODAL_ID)}
        />
      ),
    });
  };

  const openEditModal = (event: Event) => {
    const modalId = `${EDIT_EVENT_MODAL_PREFIX}-${event.id}`;

    modals.open({
      modalId,
      title: <Title order={3}>Edit {event.title}</Title>,
      radius: "lg",
      size: "lg",
      children: (
        <EventForm
          mode="edit"
          initialValues={eventToFormValues(event)}
          submitting={updateEvent.isPending}
          onSubmit={(values) => handleUpdateEvent(event.id, values, modalId)}
          onCancel={() => closeModal(modalId)}
        />
      ),
    });
  };

  const openEventDetails = (event: Event) => {
    const modalId = `${EVENT_DETAILS_MODAL_PREFIX}-${event.id}`;

    modals.open({
      modalId,
      title: <Title order={3}>{event.title}</Title>,
      radius: "lg",
      size: "lg",
      children: (
        <EventDetails
          event={event}
          actionPending={updateEvent.isPending}
          deletePending={deleteEvent.isPending}
          onPublish={() => handleStatusChange(event.id, "published", modalId)}
          onCancelEvent={() =>
            handleStatusChange(event.id, "cancelled", modalId)
          }
          onRepublish={() => handleStatusChange(event.id, "published", modalId)}
          onDelete={() => confirmDeleteEvent(event, modalId)}
        />
      ),
    });
  };

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
          {info.getValue() || "Uncategorized"}
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
              onClick={() => openEventDetails(info.row.original)}
            >
              <Eye className="size-4" />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Edit">
            <ActionIcon
              variant="subtle"
              color="orange"
              onClick={() => openEditModal(info.row.original)}
            >
              <Edit className="size-4" />
            </ActionIcon>
          </Tooltip>
          {info.row.original.status === "draft" && (
            <Tooltip label="Publish">
              <ActionIcon
                variant="subtle"
                color="green"
                disabled={updateEvent.isPending}
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
                disabled={updateEvent.isPending}
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
              disabled={deleteEvent.isPending}
              onClick={() => confirmDeleteEvent(info.row.original)}
            >
              <Trash2 className="size-4" />
            </ActionIcon>
          </Tooltip>
        </Group>
      ),
    }),
  ];

  if (isLoading) {
    return <PageLoader message="Loading events..." />;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Group justify="space-between">
          <div>
            <Title order={2} className="text-deep-forest mb-2">
              Events Management
            </Title>
            <Text size="sm" c="dimmed">
              Manage and moderate all event submissions
            </Text>
          </div>
          <Button
            leftSection={<Plus className="size-4" />}
            onClick={openCreateModal}
          >
            Create Event
          </Button>
        </Group>
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
            options: EVENT_STATUS_FILTERS,
          },
        ]}
        searchPlaceholder="Search events..."
        pageSize={10}
        loading={isLoading}
      />
    </div>
  );
}

interface EventFormProps {
  mode: "create" | "edit";
  initialValues: EventFormValues;
  submitting: boolean;
  onSubmit: (values: EventFormValues) => Promise<void> | void;
  onCancel: () => void;
}

function EventForm({
  mode,
  initialValues,
  submitting,
  onSubmit,
  onCancel,
}: EventFormProps) {
  const form = useForm<EventFormValues>({
    initialValues,
    validate: zod4Resolver(eventFormSchema),
  });

  const handleCancel = () => {
    form.reset();
    onCancel();
  };

  return (
    <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
      <Stack gap="md">
        <TextInput
          label="Title"
          placeholder="Event title"
          withAsterisk
          {...form.getInputProps("title")}
        />

        <Textarea
          label="Description"
          placeholder="Full event description"
          minRows={3}
          withAsterisk
          {...form.getInputProps("description")}
        />

        <Textarea
          label="Excerpt"
          placeholder="Short summary"
          minRows={2}
          {...form.getInputProps("excerpt")}
        />

        <Group grow>
          <DateTimePicker
            label="Start Date & Time"
            placeholder="Pick date and time"
            withAsterisk
            {...form.getInputProps("startDate")}
          />
          <DateTimePicker
            label="End Date & Time"
            placeholder="Pick date and time"
            {...form.getInputProps("endDate")}
          />
        </Group>

        <Group grow>
          <TextInput
            label="Time (Display)"
            placeholder="e.g. 10:00 AM - 2:00 PM"
            {...form.getInputProps("time")}
          />
          <TextInput
            label="Location"
            placeholder="Event venue"
            withAsterisk
            {...form.getInputProps("location")}
          />
        </Group>

        <Group grow>
          <Select
            label="Type"
            placeholder="Select type"
            data={EVENT_TYPE_OPTIONS}
            withAsterisk
            {...form.getInputProps("type")}
          />
          <TextInput
            label="Category"
            placeholder="e.g. Social, Educational"
            {...form.getInputProps("category")}
          />
        </Group>

        <TextInput
          label="Image URL"
          placeholder="https://..."
          withAsterisk
          {...form.getInputProps("imageUrl")}
        />

        <TextInput
          label="Registration Link"
          placeholder="https://..."
          {...form.getInputProps("registrationLink")}
        />

        <Group grow>
          <TextInput
            label="Organizer"
            placeholder="Event organizer"
            withAsterisk
            {...form.getInputProps("organizer")}
          />
          <NumberInput
            label="Max Attendees"
            placeholder="Leave empty for unlimited"
            {...form.getInputProps("maxAttendees")}
          />
        </Group>

        <Switch
          label="Public Event"
          {...form.getInputProps("isPublic", { type: "checkbox" })}
        />

        <Group justify="flex-end" mt="md">
          <Button
            type="button"
            variant="default"
            onClick={handleCancel}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            {mode === "edit" ? "Save Changes" : "Create Event"}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

interface EventDetailsProps {
  event: Event;
  actionPending: boolean;
  deletePending: boolean;
  onPublish: () => void;
  onCancelEvent: () => void;
  onRepublish: () => void;
  onDelete: () => void;
}

function EventDetails({
  event,
  actionPending,
  deletePending,
  onPublish,
  onCancelEvent,
  onRepublish,
  onDelete,
}: EventDetailsProps) {
  return (
    <Stack gap="md">
      <Group justify="space-between" mb="md">
        <Title order={3}>{event.title}</Title>
        <Badge size="lg" color={getStatusColor(event.status)} variant="light">
          {event.status}
        </Badge>
      </Group>

      <Grid>
        <Grid.Col span={6}>
          <Text size="sm" fw={500} c="dimmed">
            Date
          </Text>
          <Text size="sm">{formatDate(event.startDate, "MMMM dd, yyyy")}</Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <Text size="sm" fw={500} c="dimmed">
            Time
          </Text>
          <Text size="sm">{event.time || "—"}</Text>
        </Grid.Col>
        <Grid.Col span={12}>
          <Text size="sm" fw={500} c="dimmed">
            Location
          </Text>
          <Text size="sm">{event.location}</Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <Text size="sm" fw={500} c="dimmed">
            Category
          </Text>
          <Badge variant="light">{event.category || "Uncategorized"}</Badge>
        </Grid.Col>
        <Grid.Col span={6}>
          <Text size="sm" fw={500} c="dimmed">
            Organizer
          </Text>
          <Text size="sm">{event.organizer}</Text>
        </Grid.Col>
        <Grid.Col span={12}>
          <Text size="sm" fw={500} c="dimmed">
            Description
          </Text>
          <Text size="sm">{event.description}</Text>
        </Grid.Col>
        <Grid.Col span={12}>
          <Text size="sm" fw={500} c="dimmed">
            Registration Link
          </Text>
          <Text size="sm" c="blue" style={{ wordBreak: "break-all" }}>
            {event.registrationLink || "N/A"}
          </Text>
        </Grid.Col>
      </Grid>

      <div className="mt-4 pt-4 border-t">
        <Group justify="flex-end" gap="sm">
          {event.status === "draft" && (
            <Button
              leftSection={<Check className="size-4" />}
              color="green"
              onClick={onPublish}
              loading={actionPending}
            >
              Publish Event
            </Button>
          )}
          {event.status === "published" && (
            <Button
              leftSection={<X className="size-4" />}
              color="orange"
              variant="outline"
              onClick={onCancelEvent}
              loading={actionPending}
            >
              Cancel Event
            </Button>
          )}
          {event.status === "cancelled" && (
            <Button
              leftSection={<Check className="size-4" />}
              color="green"
              onClick={onRepublish}
              loading={actionPending}
            >
              Republish Event
            </Button>
          )}
          <Button
            leftSection={<Trash2 className="size-4" />}
            color="red"
            variant="outline"
            onClick={onDelete}
            loading={deletePending}
          >
            Delete Event
          </Button>
        </Group>
      </div>
    </Stack>
  );
}

function getStatusColor(status: string) {
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
}

function getDefaultEventFormValues(): EventFormValues {
  return {
    title: "",
    description: "",
    excerpt: "",
    startDate: new Date(),
    endDate: undefined,
    time: "",
    location: "",
    type: "other",
    category: "",
    status: "draft",
    imageUrl: "",
    registrationLink: "",
    maxAttendees: undefined,
    currentAttendees: 0,
    organizer: "",
    isPublic: true,
  };
}

function eventToFormValues(event: Event): EventFormValues {
  return {
    title: event.title,
    description: event.description,
    excerpt: event.excerpt || "",
    startDate: event.startDate,
    endDate: event.endDate || undefined,
    time: event.time || "",
    location: event.location,
    type: event.type,
    category: event.category || "",
    status: event.status,
    imageUrl: event.imageUrl,
    registrationLink: event.registrationLink || "",
    maxAttendees: event.maxAttendees || undefined,
    currentAttendees: event.currentAttendees,
    organizer: event.organizer,
    isPublic: event.isPublic,
  };
}

function buildCreatePayload(
  values: EventFormValues,
  user: Pick<User, "id" | "fullName" | "photoUrl">
): CreateEventData {
  return {
    ...values,
    created: record(user),
    updated: record(user),
  };
}
