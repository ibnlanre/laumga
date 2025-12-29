import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { createColumnHelper } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Image,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { Eye, Search, Star, Trash2, Upload } from "lucide-react";
import { z } from "zod";

import { PageLoader } from "@/components/page-loader";
import { DataTable } from "@/components/data-table";
import { ImageUpload } from "@/components/image-upload";
import { useAuth } from "@/contexts/use-auth";
import { listMediaOptions } from "@/api/media/options";
import {
  useCreateMedia,
  useRemoveMedia,
  useUpdateMedia,
} from "@/api/media/hooks";
import type { CreateMediaData, Media } from "@/api/media/types";
import { MEDIA_CATEGORIES, mediaFormSchema } from "@/api/media/schema";
import { upload } from "@/api/upload";
import { formatDate } from "@/utils/date";
import { record } from "@/utils/record";
import type { User } from "@/api/user/types";

const CREATE_MEDIA_MODAL_ID = "create-media-modal";
const MEDIA_DETAILS_MODAL_PREFIX = "media-details-modal";

const MEDIA_STATUS_OPTIONS = [
  { value: "all", label: "All Media" },
  { value: "featured", label: "Featured" },
  { value: "standard", label: "Not Featured" },
];

const CATEGORY_OPTIONS = MEDIA_CATEGORIES.map((category) => ({
  value: category,
  label: formatCategoryLabel(category),
}));

const gallerySearchSchema = z.object({
  status: z.enum(["all", "featured", "standard"]).optional(),
});

type MediaFormValues = z.infer<typeof mediaFormSchema>;
type StatusFilter = (typeof MEDIA_STATUS_OPTIONS)[number]["value"];

const isValidStatusFilter = (value: unknown): value is StatusFilter =>
  typeof value === "string" &&
  MEDIA_STATUS_OPTIONS.some((option) => option.value === value);

export const Route = createFileRoute("/admin/gallery")({
  validateSearch: zodValidator(gallerySearchSchema),
  component: GalleryAdmin,
});

function GalleryAdmin() {
  const { user } = useAuth();
  const { status } = Route.useSearch();
  const initialStatus: StatusFilter =
    status && isValidStatusFilter(status) ? status : "all";
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(initialStatus);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: mediaItems = [], isLoading } = useQuery(listMediaOptions());
  const createMedia = useCreateMedia();
  const updateMedia = useUpdateMedia();
  const removeMedia = useRemoveMedia();

  const columnHelper = createColumnHelper<Media>();

  const filteredMedia = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return mediaItems.filter((item) => {
      const matchesSearch =
        !normalizedQuery ||
        [item.fileName, item.caption ?? "", item.libraryId ?? ""]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(normalizedQuery));

      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "featured"
            ? item.isFeatured
            : !item.isFeatured;

      return matchesSearch && matchesStatus;
    });
  }, [mediaItems, searchQuery, statusFilter]);

  const featuredCount = useMemo(
    () => mediaItems.filter((item) => item.isFeatured).length,
    [mediaItems]
  );

  const closeModal = (id?: string) => {
    if (id) {
      modals.close(id);
    }
  };

  const handleCreateMedia = async (values: MediaFormValues) => {
    if (!user) return;

    await createMedia.mutateAsync({
      data: {
        user,
        data: buildCreatePayload(values, user),
      },
    });

    closeModal(CREATE_MEDIA_MODAL_ID);
  };

  const handleToggleFeatured = async (media: Media, modalId?: string) => {
    if (!user) return;

    await updateMedia.mutateAsync({
      data: {
        id: media.id,
        data: { isFeatured: !media.isFeatured },
        user,
      },
    });

    closeModal(modalId);
  };

  const handleCategoryChange = async (
    media: Media,
    category: Media["category"] | null
  ) => {
    if (!user) return;

    await updateMedia.mutateAsync({
      data: {
        id: media.id,
        data: { category },
        user,
      },
    });
  };

  const handleDelete = async (media: Media, modalId?: string) => {
    await removeMedia.mutateAsync({ data: media.id });
    closeModal(modalId);
  };

  const confirmDeleteMedia = (media: Media, modalId?: string) => {
    modals.openConfirmModal({
      title: `Delete ${media.fileName}?`,
      children: (
        <Text size="sm">
          This photo will be removed from the gallery and cannot be restored.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red", loading: removeMedia.isPending },
      onConfirm: () => handleDelete(media, modalId),
    });
  };

  const openCreateModal = () => {
    modals.open({
      modalId: CREATE_MEDIA_MODAL_ID,
      title: <Title order={3}>Upload photo</Title>,
      radius: "lg",
      size: "lg",
      children: (
        <MediaForm
          submitting={createMedia.isPending}
          onSubmit={handleCreateMedia}
          onCancel={() => closeModal(CREATE_MEDIA_MODAL_ID)}
        />
      ),
    });
  };

  const openMediaDetails = (media: Media) => {
    const modalId = `${MEDIA_DETAILS_MODAL_PREFIX}-${media.id}`;

    modals.open({
      modalId,
      title: <Title order={3}>{media.caption || media.fileName}</Title>,
      radius: "lg",
      size: "xl",
      children: (
        <MediaDetails
          media={media}
          actionPending={updateMedia.isPending}
          deletePending={removeMedia.isPending}
          onToggleFeatured={() => handleToggleFeatured(media, modalId)}
          onCategoryChange={(category) => handleCategoryChange(media, category)}
          onDelete={() => confirmDeleteMedia(media, modalId)}
        />
      ),
    });
  };

  const columns = [
    columnHelper.display({
      id: "preview",
      header: "Preview",
      cell: (info) => (
        <Image
          src={info.row.original.url}
          alt={info.row.original.caption || info.row.original.fileName}
          radius="md"
          height={60}
          width={60}
          fit="cover"
        />
      ),
    }),
    columnHelper.accessor("caption", {
      header: "Photo",
      cell: (info) => (
        <Stack gap={0} maw={320}>
          <Text size="sm" fw={500} lineClamp={1}>
            {info.getValue() || info.row.original.fileName}
          </Text>
          <Text size="xs" c="dimmed" lineClamp={1}>
            {info.row.original.fileName}
          </Text>
        </Stack>
      ),
    }),
    columnHelper.accessor("category", {
      header: "Category",
      cell: (info) => (
        <Badge size="sm" variant="light">
          {info.getValue()
            ? formatCategoryLabel(info.getValue()!)
            : "Uncategorized"}
        </Badge>
      ),
    }),
    columnHelper.accessor((row) => (row.isFeatured ? "featured" : "standard"), {
      id: "status",
      header: "Status",
      cell: (info) => (
        <Badge
          size="sm"
          color={info.row.original.isFeatured ? "green" : "gray"}
          variant="light"
        >
          {info.row.original.isFeatured ? "Featured" : "Standard"}
        </Badge>
      ),
    }),
    columnHelper.accessor((row) => row.uploaded?.at ?? null, {
      id: "uploaded",
      header: "Uploaded",
      cell: (info) => (
        <Text size="sm">
          {info.getValue()
            ? formatDate(info.getValue() as Date, "MMM dd, yyyy")
            : "—"}
        </Text>
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
              onClick={() => openMediaDetails(info.row.original)}
            >
              <Eye className="size-4" />
            </ActionIcon>
          </Tooltip>
          <Tooltip
            label={
              info.row.original.isFeatured ? "Remove featured" : "Mark featured"
            }
          >
            <ActionIcon
              variant="subtle"
              color={info.row.original.isFeatured ? "orange" : "green"}
              disabled={updateMedia.isPending}
              onClick={() => handleToggleFeatured(info.row.original)}
            >
              <Star
                className="size-4"
                fill={info.row.original.isFeatured ? "currentColor" : "none"}
              />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete">
            <ActionIcon
              variant="subtle"
              color="red"
              disabled={removeMedia.isPending}
              onClick={() => confirmDeleteMedia(info.row.original)}
            >
              <Trash2 className="size-4" />
            </ActionIcon>
          </Tooltip>
        </Group>
      ),
    }),
  ];

  if (isLoading) {
    return <PageLoader message="Loading gallery..." />;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={2} className="text-deep-forest mb-2">
              Gallery Management
            </Title>
            <Text size="sm" c="dimmed">
              Moderate and manage all published media assets
            </Text>
          </div>
          <Group>
            {featuredCount > 0 && (
              <Badge size="lg" color="green" variant="filled">
                {featuredCount} featured
              </Badge>
            )}
            <Button
              leftSection={<Upload className="size-4" />}
              onClick={openCreateModal}
            >
              Upload Photo
            </Button>
          </Group>
        </Group>
      </div>

      <Card withBorder radius="lg" shadow="sm" mb="lg" p="lg">
        <Group gap="md" align="flex-end" wrap="wrap">
          <TextInput
            label="Search"
            placeholder="Search photos..."
            leftSection={<Search className="size-4" />}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.currentTarget.value)}
            style={{ minWidth: 260 }}
          />
          <Select
            label="Status"
            placeholder="Filter by status"
            data={MEDIA_STATUS_OPTIONS}
            value={statusFilter}
            onChange={(value) =>
              setStatusFilter((value as StatusFilter) || "all")
            }
            style={{ width: 220 }}
            clearable
          />
        </Group>
      </Card>

      <DataTable
        columns={columns}
        data={filteredMedia}
        enableSearch={false}
        enableFilters={false}
        enableColumnOrdering
        enablePagination
        pageSize={12}
        loading={isLoading}
        searchPlaceholder="Search media..."
      />
    </div>
  );
}

interface MediaFormProps {
  submitting: boolean;
  onSubmit: (values: MediaFormValues) => Promise<void> | void;
  onCancel: () => void;
}

function MediaForm({ submitting, onSubmit, onCancel }: MediaFormProps) {
  const form = useForm<MediaFormValues>({
    initialValues: getDefaultMediaFormValues(),
    validate: zod4Resolver(mediaFormSchema),
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (file: File | null) => {
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await upload.$use.galleryImage(file);
      form.setFieldValue("url", url);
      form.setFieldValue("fileName", file.name);
      form.setFieldValue("size", file.size.toString());
    } catch (error) {
      console.error("Failed to upload file", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    onCancel();
  };

  return (
    <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
      <Stack gap="md">
        <ImageUpload
          label="Select photo"
          value={form.values.url}
          onChange={handleFileSelect}
        />

        <TextInput
          label="Caption"
          placeholder="Enter caption"
          {...form.getInputProps("caption")}
        />

        <Select
          label="Category"
          placeholder="Select category"
          data={CATEGORY_OPTIONS}
          clearable
          {...form.getInputProps("category")}
        />

        <TextInput
          label="Library ID (optional)"
          placeholder="Reference ID"
          {...form.getInputProps("libraryId")}
        />

        <Switch
          label="Mark as featured"
          {...form.getInputProps("isFeatured", { type: "checkbox" })}
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
          <Button
            type="submit"
            loading={submitting || isUploading}
            disabled={isUploading}
          >
            Upload Photo
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

interface MediaDetailsProps {
  media: Media;
  actionPending: boolean;
  deletePending: boolean;
  onToggleFeatured: () => void;
  onCategoryChange: (category: Media["category"] | null) => void;
  onDelete: () => void;
}

function MediaDetails({
  media,
  actionPending,
  deletePending,
  onToggleFeatured,
  onCategoryChange,
  onDelete,
}: MediaDetailsProps) {
  const [category, setCategory] = useState<Media["category"] | null>(
    media.category ?? null
  );
  useEffect(() => {
    setCategory(media.category ?? null);
  }, [media]);

  return (
    <Stack gap="lg">
      <Card withBorder radius="lg" p="sm">
        <Card.Section>
          <Image
            src={media.url}
            alt={media.caption || media.fileName}
            fit="contain"
            height={360}
          />
        </Card.Section>
      </Card>

      <Stack gap="sm">
        <Group justify="space-between">
          <div>
            <Text size="lg" fw={600}>
              {media.caption || media.fileName}
            </Text>
            <Text size="sm" c="dimmed">
              {media.fileName}
            </Text>
          </div>
          <Badge
            size="lg"
            color={media.isFeatured ? "green" : "gray"}
            variant="light"
          >
            {media.isFeatured ? "Featured" : "Standard"}
          </Badge>
        </Group>

        <Select
          label="Category"
          placeholder="Select category"
          data={CATEGORY_OPTIONS}
          clearable
          value={category}
          onChange={(value) => {
            const nextCategory = (value as Media["category"]) || null;
            setCategory(nextCategory);
            onCategoryChange(nextCategory);
          }}
          disabled={actionPending}
        />

        <Stack gap={4}>
          <Text size="sm" fw={500} c="dimmed">
            Library Reference
          </Text>
          <Text size="sm">{media.libraryId || "—"}</Text>
        </Stack>

        <Stack gap={4}>
          <Text size="sm" fw={500} c="dimmed">
            Uploaded
          </Text>
          <Text size="sm">
            {media.uploaded?.at
              ? formatDate(media.uploaded.at, "MMMM dd, yyyy 'at' hh:mm a")
              : "—"}
          </Text>
        </Stack>

        <Stack gap={4}>
          <Text size="sm" fw={500} c="dimmed">
            Uploaded By
          </Text>
          <Text size="sm">{media.uploaded?.name || "Unknown"}</Text>
        </Stack>

        <Stack gap={4}>
          <Text size="sm" fw={500} c="dimmed">
            File Size
          </Text>
          <Text size="sm">{media.size || "—"}</Text>
        </Stack>
      </Stack>

      <Group justify="flex-end" gap="sm">
        <Button
          leftSection={<Star className="size-4" />}
          color={media.isFeatured ? "orange" : "green"}
          variant={media.isFeatured ? "outline" : "filled"}
          onClick={onToggleFeatured}
          loading={actionPending}
        >
          {media.isFeatured ? "Remove Featured" : "Mark Featured"}
        </Button>
        <Button
          leftSection={<Trash2 className="size-4" />}
          color="red"
          variant="outline"
          onClick={onDelete}
          loading={deletePending}
        >
          Delete Photo
        </Button>
      </Group>
    </Stack>
  );
}

function getDefaultMediaFormValues(): MediaFormValues {
  return {
    libraryId: "",
    url: "",
    caption: "",
    category: null,
    fileName: "",
    size: "0",
    isFeatured: false,
  };
}

function buildCreatePayload(
  values: MediaFormValues,
  user: Pick<User, "id" | "fullName" | "photoUrl">
): CreateMediaData {
  return {
    url: values.url,
    fileName: values.fileName,
    caption: values.caption?.trim() || undefined,
    category: values.category,
    libraryId: values.libraryId?.trim() || undefined,
    size: values.size || "0",
    isFeatured: values.isFeatured,
    uploaded: record(user),
  };
}

function formatCategoryLabel(value: (typeof MEDIA_CATEGORIES)[number]) {
  return value
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}
