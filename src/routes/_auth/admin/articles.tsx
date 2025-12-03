import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
  Switch,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Search, Eye, Check, X, Trash2, Star } from "lucide-react";
import { format } from "date-fns";

import {
  useFetchArticles,
  useUpdateArticle,
  useDeleteArticle,
} from "@/services/hooks";
import type { Article } from "@/api/article";
import { PageLoader } from "@/components/page-loader";

export const Route = createFileRoute("/_auth/admin/articles")({
  validateSearch: (search: Record<string, unknown>) => ({
    status: (search.status as string) || undefined,
  }),
  component: ArticlesAdmin,
});

function ArticlesAdmin() {
  const { status } = Route.useSearch();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(status || "all");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [detailsOpened, setDetailsOpened] = useState(false);

  const { data: articles = [], isLoading } = useFetchArticles();
  const updateArticleMutation = useUpdateArticle();
  const deleteArticleMutation = useDeleteArticle();

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.authorName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || article.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "green";
      case "draft":
        return "yellow";
      case "archived":
        return "gray";
      default:
        return "blue";
    }
  };

  const viewArticleDetails = (article: Article) => {
    setSelectedArticle(article);
    setDetailsOpened(true);
  };

  const handleStatusChange = async (articleId: string, newStatus: string) => {
    try {
      await updateArticleMutation.mutateAsync({
        id: articleId,
        data: { status: newStatus },
      });

      notifications.show({
        title: "Status updated",
        message: `Article status changed to ${newStatus}`,
        color: "green",
        autoClose: 5000,
      });

      setDetailsOpened(false);
    } catch (error: any) {
      notifications.show({
        title: "Update failed",
        message: error?.message || "Failed to update article status",
        color: "red",
        autoClose: 7000,
      });
    }
  };

  const handleToggleFeatured = async (
    articleId: string,
    isFeatured: boolean
  ) => {
    try {
      await updateArticleMutation.mutateAsync({
        id: articleId,
        data: { featured: !isFeatured },
      });

      notifications.show({
        title: "Article updated",
        message: `Article ${!isFeatured ? "marked as" : "removed from"} featured`,
        color: "green",
        autoClose: 5000,
      });
    } catch (error: any) {
      notifications.show({
        title: "Update failed",
        message: error?.message || "Failed to update article",
        color: "red",
        autoClose: 7000,
      });
    }
  };

  const handleDelete = async (articleId: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;

    try {
      await deleteArticleMutation.mutateAsync(articleId);

      notifications.show({
        title: "Article deleted",
        message: "Article has been successfully deleted",
        color: "green",
        autoClose: 5000,
      });

      setDetailsOpened(false);
    } catch (error: any) {
      notifications.show({
        title: "Delete failed",
        message: error?.message || "Failed to delete article",
        color: "red",
        autoClose: 7000,
      });
    }
  };

  const pendingCount = articles.filter((a) => a.status === "draft").length;

  if (isLoading) {
    return <PageLoader message="Loading articles..." />;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Group justify="space-between">
          <div>
            <Title order={2} className="text-deep-forest mb-2">
              Bulletin Articles Management
            </Title>
            <Text size="sm" c="dimmed">
              Manage and moderate bulletin articles
            </Text>
          </div>
          {pendingCount > 0 && (
            <Badge size="lg" color="orange" variant="filled">
              {pendingCount} drafts pending
            </Badge>
          )}
        </Group>
      </div>

      <Card shadow="sm" p="lg" radius="md" withBorder className="mb-6">
        <Group justify="space-between" mb="md">
          <TextInput
            placeholder="Search articles..."
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
              { value: "all", label: "All Articles" },
              { value: "published", label: "Published" },
              { value: "draft", label: "Draft" },
              { value: "archived", label: "Archived" },
            ]}
            style={{ width: 200 }}
          />
        </Group>

        <Table.ScrollContainer minWidth={800}>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Article</Table.Th>
                <Table.Th>Author</Table.Th>
                <Table.Th>Category</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Featured</Table.Th>
                <Table.Th>Published</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredArticles.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={7} className="text-center py-8">
                    <Text c="dimmed">No articles found</Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                filteredArticles.map((article) => (
                  <Table.Tr key={article.id}>
                    <Table.Td>
                      <div className="max-w-md">
                        <Group gap="xs">
                          {article.featured && (
                            <Star className="size-4 text-yellow-500 fill-yellow-500" />
                          )}
                          <Text size="sm" fw={500}>
                            {article.title}
                          </Text>
                        </Group>
                        <Text size="xs" c="dimmed" lineClamp={1}>
                          {article.content}
                        </Text>
                      </div>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{article.authorName}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge size="sm" variant="light">
                        {article.category}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        size="sm"
                        color={getStatusColor(article.status)}
                        variant="light"
                      >
                        {article.status}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Switch
                        checked={article.featured}
                        onChange={() =>
                          handleToggleFeatured(article.id, article.featured)
                        }
                        size="sm"
                        color="yellow"
                      />
                    </Table.Td>
                    <Table.Td>
                      <Text size="xs" c="dimmed">
                        {article.publishedAt
                          ? format(
                              new Date(article.publishedAt),
                              "MMM dd, yyyy"
                            )
                          : "Not published"}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Tooltip label="View details">
                          <ActionIcon
                            variant="subtle"
                            color="blue"
                            onClick={() => viewArticleDetails(article)}
                          >
                            <Eye className="size-4" />
                          </ActionIcon>
                        </Tooltip>
                        {article.status === "draft" && (
                          <Tooltip label="Publish">
                            <ActionIcon
                              variant="subtle"
                              color="green"
                              onClick={() =>
                                handleStatusChange(article.id, "published")
                              }
                            >
                              <Check className="size-4" />
                            </ActionIcon>
                          </Tooltip>
                        )}
                        {article.status === "published" && (
                          <Tooltip label="Archive">
                            <ActionIcon
                              variant="subtle"
                              color="gray"
                              onClick={() =>
                                handleStatusChange(article.id, "archived")
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
                            onClick={() => handleDelete(article.id)}
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

      {/* Article Details Modal */}
      <Modal
        opened={detailsOpened}
        onClose={() => setDetailsOpened(false)}
        title="Article Details"
        size="xl"
      >
        {selectedArticle && (
          <Stack gap="md">
            <div>
              <Group justify="space-between" mb="md">
                <Group gap="xs">
                  {selectedArticle.featured && (
                    <Star className="size-5 text-yellow-500 fill-yellow-500" />
                  )}
                  <Title order={3}>{selectedArticle.title}</Title>
                </Group>
                <Badge
                  size="lg"
                  color={getStatusColor(selectedArticle.status)}
                  variant="light"
                >
                  {selectedArticle.status}
                </Badge>
              </Group>
            </div>

            {selectedArticle.coverImageUrl && (
              <Card shadow="sm" padding="xs" radius="md" withBorder>
                <Card.Section>
                  <img
                    src={selectedArticle.coverImageUrl}
                    alt={selectedArticle.title}
                    className="w-full max-h-96 object-cover"
                  />
                </Card.Section>
              </Card>
            )}

            <Grid>
              <Grid.Col span={6}>
                <Text size="sm" fw={500} c="dimmed">
                  Author
                </Text>
                <Text size="sm">{selectedArticle.authorName}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" fw={500} c="dimmed">
                  Category
                </Text>
                <Badge variant="light">{selectedArticle.category}</Badge>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" fw={500} c="dimmed">
                  Published Date
                </Text>
                <Text size="sm">
                  {selectedArticle.publishedAt
                    ? format(
                        new Date(selectedArticle.publishedAt),
                        "MMMM dd, yyyy 'at' hh:mm a"
                      )
                    : "Not published yet"}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" fw={500} c="dimmed">
                  Featured Article
                </Text>
                <Switch
                  checked={selectedArticle.featured}
                  onChange={() =>
                    handleToggleFeatured(
                      selectedArticle.id,
                      selectedArticle.featured
                    )
                  }
                  label={selectedArticle.featured ? "Yes" : "No"}
                  color="yellow"
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <Text size="sm" fw={500} c="dimmed" mb="xs">
                  Content
                </Text>
                <Card withBorder padding="md" className="bg-gray-50">
                  <Text size="sm" style={{ whiteSpace: "pre-wrap" }}>
                    {selectedArticle.content}
                  </Text>
                </Card>
              </Grid.Col>
              <Grid.Col span={12}>
                <Text size="sm" fw={500} c="dimmed">
                  Tags
                </Text>
                <Group gap="xs" mt="xs">
                  {selectedArticle.tags.length > 0 ? (
                    selectedArticle.tags.map((tag) => (
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
                {selectedArticle.status === "draft" && (
                  <Button
                    leftSection={<Check className="size-4" />}
                    color="green"
                    onClick={() =>
                      handleStatusChange(selectedArticle.id, "published")
                    }
                    loading={updateArticleMutation.isPending}
                  >
                    Publish Article
                  </Button>
                )}
                {selectedArticle.status === "published" && (
                  <Button
                    leftSection={<X className="size-4" />}
                    color="gray"
                    variant="outline"
                    onClick={() =>
                      handleStatusChange(selectedArticle.id, "archived")
                    }
                    loading={updateArticleMutation.isPending}
                  >
                    Archive Article
                  </Button>
                )}
                {selectedArticle.status === "archived" && (
                  <Button
                    leftSection={<Check className="size-4" />}
                    color="green"
                    onClick={() =>
                      handleStatusChange(selectedArticle.id, "published")
                    }
                    loading={updateArticleMutation.isPending}
                  >
                    Republish Article
                  </Button>
                )}
                <Button
                  leftSection={<Trash2 className="size-4" />}
                  color="red"
                  variant="outline"
                  onClick={() => handleDelete(selectedArticle.id)}
                  loading={deleteArticleMutation.isPending}
                >
                  Delete Article
                </Button>
              </Group>
            </div>
          </Stack>
        )}
      </Modal>
    </div>
  );
}
