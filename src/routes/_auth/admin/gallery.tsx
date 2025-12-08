import { useMemo, useState } from "react";
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
  SimpleGrid,
  ActionIcon,
  Tooltip,
  Modal,
  Image,
  Grid,
} from "@mantine/core";

import { Search, Eye, Check, X, Trash2, ImageIcon } from "lucide-react";
import { formatDate } from "@/utils/date";

import { PageLoader } from "@/components/page-loader";
import { useAuth } from "@/contexts/use-auth";
import type { Media } from "@/api/media/types";
import {
  useListMedia,
  useRemoveMedia,
  useUpdateMedia,
} from "@/api/media/hooks";

const statusOptions = [
  { value: "all", label: "All Media" },
  { value: "featured", label: "Featured" },
  { value: "standard", label: "Not Featured" },
] as const;

type StatusFilter = (typeof statusOptions)[number]["value"];

const getFeatureBadgeColor = (isFeatured: boolean) =>
  isFeatured ? "green" : "gray";

const isValidStatusFilter = (value: unknown): value is StatusFilter =>
  statusOptions.some((option) => option.value === value);

export const Route = createFileRoute("/_auth/admin/gallery")({
  validateSearch: (search: Record<string, unknown>) => ({
    status: isValidStatusFilter(search.status) ? search.status : undefined,
  }),
  component: GalleryAdmin,
});

function GalleryAdmin() {
  const { status } = Route.useSearch();
  const [searchQuery, setSearchQuery] = useState("");
  const initialStatus: StatusFilter =
    status && isValidStatusFilter(status) ? status : "all";
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(initialStatus);
  const [selectedItem, setSelectedItem] = useState<Media | null>(null);
  const [detailsOpened, setDetailsOpened] = useState(false);

  const { user } = useAuth();
  const actor = user;

  const { data: items = [], isLoading } = useListMedia();
  const { mutateAsync: updateMedia, isPending: isUpdatingMedia } =
    useUpdateMedia();
  const { mutateAsync: removeMedia, isPending: isRemovingMedia } =
    useRemoveMedia();

  const filteredItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return items.filter((item) => {
      const matchesSearch =
        !normalizedQuery ||
        [item.fileName, item.caption ?? "", item.libraryId ?? ""].some(
          (field) => field.toLowerCase().includes(normalizedQuery)
        );

      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "featured"
            ? item.isFeatured
            : !item.isFeatured;

      return matchesSearch && matchesStatus;
    });
  }, [items, searchQuery, statusFilter]);

  const featuredCount = useMemo(
    () => items.filter((item) => item.isFeatured).length,
    [items]
  );

  const viewItemDetails = (item: Media) => {
    setSelectedItem(item);
    setDetailsOpened(true);
  };

  const handleStatusChange = async (itemId: string, makeFeatured: boolean) => {
    if (!actor) {
      return;
    }

    await updateMedia({
      id: itemId,
      data: { isFeatured: makeFeatured },
      user: actor,
    });

    setDetailsOpened(false);
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;
    if (!actor) return;

    await removeMedia(itemId);

    setDetailsOpened(false);
  };

  const toggleStatusLabel = (isFeatured: boolean) =>
    isFeatured ? "Remove featured" : "Mark featured";

  if (isLoading) {
    return <PageLoader message="Loading gallery..." />;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Group justify="space-between">
          <div>
            <Title order={2} className="text-deep-forest mb-2">
              Gallery Management
            </Title>
            <Text size="sm" c="dimmed">
              Moderate and manage photo submissions
            </Text>
          </div>
          {featuredCount > 0 && (
            <Badge size="lg" color="green" variant="filled">
              {featuredCount} featured
            </Badge>
          )}
        </Group>
      </div>

      <Card shadow="sm" p="lg" radius="md" withBorder className="mb-6">
        <Group justify="space-between" mb="md">
          <TextInput
            placeholder="Search photos..."
            leftSection={<Search className="size-4" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            style={{ flex: 1, maxWidth: 400 }}
          />

          <Select
            clearable
            searchable
            placeholder="Filter by featured state"
            value={statusFilter}
            onChange={(value) =>
              setStatusFilter((value as StatusFilter) || "all")
            }
            data={statusOptions}
            style={{ width: 200 }}
          />
        </Group>

        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="size-12 mx-auto mb-4 text-gray-300" />
            <Text c="dimmed">No photos found</Text>
          </div>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="md">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                shadow="sm"
                padding="xs"
                radius="md"
                withBorder
                className="relative group cursor-pointer hover:shadow-lg transition-shadow"
              >
                <Card.Section>
                  <div className="relative aspect-square">
                    <Image
                      src={item.url}
                      alt={item.caption || item.fileName}
                      fit="cover"
                      className="w-full h-full"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge
                        size="sm"
                        color={getFeatureBadgeColor(item.isFeatured)}
                        variant="filled"
                      >
                        {item.isFeatured ? "Featured" : "Not Featured"}
                      </Badge>
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Tooltip label="View details">
                        <ActionIcon
                          variant="filled"
                          color="blue"
                          size="lg"
                          onClick={() => viewItemDetails(item)}
                        >
                          <Eye className="size-4" />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label={toggleStatusLabel(item.isFeatured)}>
                        <ActionIcon
                          variant="filled"
                          color={item.isFeatured ? "orange" : "green"}
                          size="lg"
                          disabled={!actor || isUpdatingMedia}
                          onClick={() =>
                            handleStatusChange(item.id, !item.isFeatured)
                          }
                        >
                          {item.isFeatured ? (
                            <X className="size-4" />
                          ) : (
                            <Check className="size-4" />
                          )}
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Delete">
                        <ActionIcon
                          variant="filled"
                          color="red"
                          size="lg"
                          disabled={!actor || isRemovingMedia}
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="size-4" />
                        </ActionIcon>
                      </Tooltip>
                    </div>
                  </div>
                </Card.Section>

                <div className="p-2">
                  <Text size="sm" fw={500} lineClamp={1}>
                    {item.caption || item.fileName}
                  </Text>
                  <Text size="xs" c="dimmed" lineClamp={1}>
                    {item.fileName}
                  </Text>
                  <Text size="xs" c="dimmed" mt={4}>
                    {formatDate(item.uploaded?.at, "MMM dd, yyyy") || "—"}
                  </Text>
                </div>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </Card>

      {/* Photo Details Modal */}
      <Modal
        opened={detailsOpened}
        onClose={() => setDetailsOpened(false)}
        title="Photo Details"
        size="lg"
      >
        {selectedItem && (
          <Stack gap="md">
            <div>
              <Group justify="space-between" mb="md">
                <Title order={3}>
                  {selectedItem.caption || selectedItem.fileName}
                </Title>
                <Badge
                  size="lg"
                  color={getFeatureBadgeColor(selectedItem.isFeatured)}
                  variant="light"
                >
                  {selectedItem.isFeatured ? "Featured" : "Not Featured"}
                </Badge>
              </Group>
            </div>

            <Card shadow="sm" padding="xs" radius="md" withBorder>
              <Card.Section>
                <Image
                  src={selectedItem.url}
                  alt={selectedItem.caption || selectedItem.fileName}
                  fit="contain"
                  className="max-h-96"
                />
              </Card.Section>
            </Card>

            <Grid>
              <Grid.Col span={6}>
                <Text size="sm" fw={500} c="dimmed">
                  Library Reference
                </Text>
                <Text size="sm">{selectedItem.libraryId || "—"}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" fw={500} c="dimmed">
                  Upload Date
                </Text>
                <Text size="sm">
                  {formatDate(
                    selectedItem.uploaded?.at,
                    "MMMM dd, yyyy 'at' hh:mm a"
                  ) || "—"}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" fw={500} c="dimmed">
                  Uploaded By
                </Text>
                <Text size="sm">
                  {selectedItem.uploaded?.name || "Unknown"}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" fw={500} c="dimmed">
                  File Size
                </Text>
                <Text size="sm">{selectedItem.size}</Text>
              </Grid.Col>
              <Grid.Col span={12}>
                <Text size="sm" fw={500} c="dimmed">
                  Caption
                </Text>
                <Text size="sm">
                  {selectedItem.caption || "No caption provided"}
                </Text>
              </Grid.Col>
            </Grid>

            <div className="mt-4 pt-4 border-t">
              <Group justify="flex-end" gap="sm">
                <Button
                  leftSection={
                    selectedItem.isFeatured ? (
                      <X className="size-4" />
                    ) : (
                      <Check className="size-4" />
                    )
                  }
                  color={selectedItem.isFeatured ? "orange" : "green"}
                  variant={selectedItem.isFeatured ? "outline" : "filled"}
                  onClick={() =>
                    handleStatusChange(
                      selectedItem.id,
                      !selectedItem.isFeatured
                    )
                  }
                  loading={isUpdatingMedia}
                  disabled={!actor}
                >
                  {selectedItem.isFeatured
                    ? "Remove Featured"
                    : "Mark Featured"}
                </Button>
                <Button
                  leftSection={<Trash2 className="size-4" />}
                  color="red"
                  variant="outline"
                  onClick={() => handleDelete(selectedItem.id)}
                  loading={isRemovingMedia}
                  disabled={!actor}
                >
                  Delete
                </Button>
              </Group>
            </div>
          </Stack>
        )}
      </Modal>
    </div>
  );
}
