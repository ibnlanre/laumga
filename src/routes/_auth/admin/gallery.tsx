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
import { notifications } from "@mantine/notifications";
import { Search, Eye, Check, X, Trash2, ImageIcon } from "lucide-react";
import { format } from "date-fns";

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
      statusFilter === "all" || item.status === statusFilter;

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

  const handleStatusChange = async (itemId: string, newStatus: string) => {
    try {
      await updateItemMutation.mutateAsync({
        id: itemId,
        data: { status: newStatus },
      });

      notifications.show({
        title: "Status updated",
        message: `Photo status changed to ${newStatus}`,
        color: "green",
        autoClose: 5000,
      });

      setDetailsOpened(false);
    } catch (error: any) {
      notifications.show({
        title: "Update failed",
        message: error?.message || "Failed to update photo status",
        color: "red",
        autoClose: 7000,
      });
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;

    try {
      await deleteItemMutation.mutateAsync(itemId);

      notifications.show({
        title: "Photo deleted",
        message: "Photo has been successfully deleted",
        color: "green",
        autoClose: 5000,
      });

      setDetailsOpened(false);
    } catch (error: any) {
      notifications.show({
        title: "Delete failed",
        message: error?.message || "Failed to delete photo",
        color: "red",
        autoClose: 7000,
      });
    }
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
                      src={item.imageUrl}
                      alt={item.title}
                      fit="cover"
                      className="w-full h-full"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge
                        size="sm"
                        color={getStatusColor(item.status)}
                        variant="filled"
                      >
                        {item.status}
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
                      {item.status === "pending" && (
                        <>
                          <Tooltip label="Approve">
                            <ActionIcon
                              variant="filled"
                              color="green"
                              size="lg"
                              onClick={() =>
                                handleStatusChange(item.id, "approved")
                              }
                            >
                              <Check className="size-4" />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label="Reject">
                            <ActionIcon
                              variant="filled"
                              color="red"
                              size="lg"
                              onClick={() =>
                                handleStatusChange(item.id, "rejected")
                              }
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
                    {item.album}
                  </Text>
                  <Text size="xs" c="dimmed" mt={4}>
                    {format(new Date(item.uploadedAt), "MMM dd, yyyy")}
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
                  color={getStatusColor(selectedItem.status)}
                  variant="light"
                >
                  {selectedItem.status}
                </Badge>
              </Group>
            </div>

            <Card shadow="sm" padding="xs" radius="md" withBorder>
              <Card.Section>
                <Image
                  src={selectedItem.imageUrl}
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
                <Badge variant="light">{selectedItem.album}</Badge>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" fw={500} c="dimmed">
                  Uploaded By
                </Text>
                <Text size="sm">{selectedItem.uploadedBy}</Text>
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
                  {format(
                    new Date(selectedItem.uploadedAt),
                    "MMMM dd, yyyy 'at' hh:mm a"
                  )}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" fw={500} c="dimmed">
                  Tags
                </Text>
                <Group gap="xs">
                  {selectedItem.tags && selectedItem.tags.length > 0 ? (
                    selectedItem.tags.map((tag: string) => (
                      <Badge key={tag} size="sm" variant="outline">
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <Text size="sm" c="dimmed">
                      No tags
                    </Text>
                  )}
                </Group>
              </Grid.Col>
            </Grid>

            <div className="mt-4 pt-4 border-t">
              <Group justify="flex-end" gap="sm">
                {selectedItem.status === "pending" && (
                  <>
                    <Button
                      leftSection={<X className="size-4" />}
                      color="red"
                      variant="outline"
                      onClick={() =>
                        handleStatusChange(selectedItem.id, "rejected")
                      }
                      loading={updateItemMutation.isPending}
                    >
                      Reject
                    </Button>
                    <Button
                      leftSection={<Check className="size-4" />}
                      color="green"
                      onClick={() =>
                        handleStatusChange(selectedItem.id, "approved")
                      }
                      loading={updateItemMutation.isPending}
                    >
                      Approve
                    </Button>
                  </>
                )}
                {selectedItem.status === "approved" && (
                  <Button
                    leftSection={<X className="size-4" />}
                    color="orange"
                    variant="outline"
                    onClick={() =>
                      handleStatusChange(selectedItem.id, "rejected")
                    }
                    loading={updateItemMutation.isPending}
                  >
                    Reject Photo
                  </Button>
                )}
                {selectedItem.status === "rejected" && (
                  <Button
                    leftSection={<Check className="size-4" />}
                    color="green"
                    onClick={() =>
                      handleStatusChange(selectedItem.id, "approved")
                    }
                    loading={updateItemMutation.isPending}
                  >
                    Approve Photo
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
