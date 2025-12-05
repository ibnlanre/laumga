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
  SimpleGrid,
  ActionIcon,
  Tooltip,
  Modal,
  Image,
  Grid,
} from "@mantine/core";

import { Search, Eye, Check, X, Trash2, ImageIcon } from "lucide-react";
import { formatDate } from "@/utils/date";

import {
  useFetchGalleryCollections,
  useUpdateGallery,
  useDeleteGallery,
} from "@/services/hooks";
import type { Gallery } from "@/api/gallery";
import { PageLoader } from "@/components/page-loader";

export const Route = createFileRoute("/_auth/admin/gallery")({
  validateSearch: (search: Record<string, unknown>) => ({
    status: (search.status as string) || undefined,
  }),
  component: GalleryAdmin,
});

function GalleryAdmin() {
  const { status } = Route.useSearch();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(status || "all");
  const [selectedItem, setSelectedItem] = useState<Gallery | null>(null);
  const [detailsOpened, setDetailsOpened] = useState(false);

  const { data: items = [], isLoading } = useFetchGalleryCollections();
  const updateItemMutation = useUpdateGallery();
  const deleteItemMutation = useDeleteGallery();

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "featured"
        ? item.isFeatured === true
        : item.isFeatured === false);

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "green";
      case "pending":
        return "yellow";
      case "rejected":
        return "red";
      default:
        return "gray";
    }
  };

  const viewItemDetails = (item: Gallery) => {
    setSelectedItem(item);
    setDetailsOpened(true);
  };

  const handleStatusChange = async (itemId: string, makeFeatured: boolean) => {
    await updateItemMutation.mutateAsync({
      id: itemId,
      data: { isFeatured: makeFeatured },
    });

    setDetailsOpened(false);
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;

    await deleteItemMutation.mutateAsync(itemId);

    setDetailsOpened(false);
  };

  const pendingCount = items.filter(
    (item: Gallery) => item.isFeatured === false
  ).length;

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
          {pendingCount > 0 && (
            <Badge size="lg" color="orange" variant="filled">
              {pendingCount} pending approval
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
            placeholder="Filter by status"
            value={statusFilter}
            onChange={(value) => setStatusFilter(value || "all")}
            data={[
              { value: "all", label: "All Photos" },
              { value: "pending", label: "Pending" },
              { value: "approved", label: "Approved" },
              { value: "rejected", label: "Rejected" },
            ]}
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
                      src={item.coverImageUrl}
                      alt={item.title}
                      fit="cover"
                      className="w-full h-full"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge
                        size="sm"
                        color={getStatusColor(
                          item.isFeatured ? "featured" : "not-featured"
                        )}
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
                      {!item.isFeatured && (
                        <>
                          <Tooltip label="Mark featured">
                            <ActionIcon
                              variant="filled"
                              color="green"
                              size="lg"
                              onClick={() => handleStatusChange(item.id, true)}
                            >
                              <Check className="size-4" />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label="Un-feature">
                            <ActionIcon
                              variant="filled"
                              color="red"
                              size="lg"
                              onClick={() => handleStatusChange(item.id, false)}
                            >
                              <X className="size-4" />
                            </ActionIcon>
                          </Tooltip>
                        </>
                      )}
                      <Tooltip label="Delete">
                        <ActionIcon
                          variant="filled"
                          color="red"
                          size="lg"
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
                    {item.title}
                  </Text>
                  <Text size="xs" c="dimmed" lineClamp={1}>
                    {item.category} • {item.year}
                  </Text>
                  <Text size="xs" c="dimmed" mt={4}>
                    {formatDate(item.createdAt, "MMM dd, yyyy")}
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
                <Title order={3}>{selectedItem.title}</Title>
                <Badge
                  size="lg"
                  color={getStatusColor(
                    selectedItem.isFeatured ? "featured" : "not-featured"
                  )}
                  variant="light"
                >
                  {selectedItem.isFeatured ? "Featured" : "Not Featured"}
                </Badge>
              </Group>
            </div>

            <Card shadow="sm" padding="xs" radius="md" withBorder>
              <Card.Section>
                <Image
                  src={selectedItem.coverImageUrl}
                  alt={selectedItem.title}
                  fit="contain"
                  className="max-h-96"
                />
              </Card.Section>
            </Card>

            <Grid>
              <Grid.Col span={6}>
                <Text size="sm" fw={500} c="dimmed">
                  Album
                </Text>
                <Badge variant="light">{selectedItem.category}</Badge>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" fw={500} c="dimmed">
                  Uploaded By
                </Text>
                <Text size="sm">{selectedItem.mediaCount}</Text>
              </Grid.Col>
              <Grid.Col span={12}>
                <Text size="sm" fw={500} c="dimmed">
                  Description
                </Text>
                <Text size="sm">
                  {selectedItem.description || "No description provided"}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" fw={500} c="dimmed">
                  Upload Date
                </Text>
                <Text size="sm">
                  {formatDate(
                    selectedItem.createdAt,
                    "MMMM dd, yyyy 'at' hh:mm a"
                  )}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" fw={500} c="dimmed">
                  Description
                </Text>
                <Text size="sm">
                  {selectedItem.description || "No description provided"}
                </Text>
              </Grid.Col>
            </Grid>

            <div className="mt-4 pt-4 border-t">
              <Group justify="flex-end" gap="sm">
                {!selectedItem.isFeatured && (
                  <Button
                    leftSection={<Check className="size-4" />}
                    color="green"
                    onClick={() => handleStatusChange(selectedItem.id, true)}
                    loading={updateItemMutation.isPending}
                  >
                    Mark Featured
                  </Button>
                )}
                {selectedItem.isFeatured && (
                  <Button
                    leftSection={<X className="size-4" />}
                    color="orange"
                    variant="outline"
                    onClick={() => handleStatusChange(selectedItem.id, false)}
                    loading={updateItemMutation.isPending}
                  >
                    Remove Featured
                  </Button>
                )}
                <Button
                  leftSection={<Trash2 className="size-4" />}
                  color="red"
                  variant="outline"
                  onClick={() => handleDelete(selectedItem.id)}
                  loading={deleteItemMutation.isPending}
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
