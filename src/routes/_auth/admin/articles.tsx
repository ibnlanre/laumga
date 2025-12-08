import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import {
  Card,
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
  Switch,
} from "@mantine/core";
import { Eye, Check, X, Trash2, Star } from "lucide-react";

import { PageLoader } from "@/components/page-loader";
import { DataTable } from "@/components/data-table";
import type { Article, ArticleStatus } from "@/api/article/types";
import {
  useListArticles,
  useRemoveArticle,
  useUpdateArticle,
} from "@/api/article/hooks";
import { useAuth } from "@/contexts/use-auth";

export const Route = createFileRoute("/_auth/admin/articles")({
  validateSearch: (search: Record<string, unknown>) => ({
    status: (search.status as string) || undefined,
  }),
  component: ArticlesAdmin,
});

function ArticlesAdmin() {
  const { user } = useAuth();

  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [detailsOpened, setDetailsOpened] = useState(false);

  const { data: articles = [], isLoading } = useListArticles();
  const updateArticleMutation = useUpdateArticle();
  const deleteArticleMutation = useRemoveArticle();

  const columnHelper = createColumnHelper<Article>();

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

  const handleStatusChange = async (
    articleId: string,
    newStatus: ArticleStatus
  ) => {
    if (!user) return;

    await updateArticleMutation.mutateAsync({
      id: articleId,
      data: { status: newStatus },
      user,
    });

    setDetailsOpened(false);
  };

  const handleToggleFeatured = async (
    articleId: string,
    isFeatured: boolean
  ) => {
    if (!user) return;

    await updateArticleMutation.mutateAsync({
      id: articleId,
      data: { featured: !isFeatured },
      user,
    });
  };

  const handleDelete = async (articleId: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;

    await deleteArticleMutation.mutateAsync(articleId);
    setDetailsOpened(false);
  };

  // Define columns for DataTable
  const columns = [
    columnHelper.accessor("title", {
      header: "Article",
      cell: (info) => (
        <div className="max-w-md">
          <Group gap="xs">
            {info.row.original.featured && (
              <Star className="size-4 text-yellow-500 fill-yellow-500" />
            )}
            <Text size="sm" fw={500}>
              {info.getValue()}
            </Text>
          </Group>
          <Text size="xs" c="dimmed" lineClamp={1}>
            {info.row.original.content}
          </Text>
        </div>
      ),
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

    columnHelper.accessor("featured", {
      header: "Featured",
      cell: (info) => (
        <Switch
          checked={info.getValue()}
          onChange={() =>
            handleToggleFeatured(info.row.original.id, info.getValue())
          }
          size="sm"
          color="yellow"
        />
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
              onClick={() => viewArticleDetails(info.row.original)}
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
            <Tooltip label="Archive">
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={() =>
                  handleStatusChange(info.row.original.id, "archived")
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
  ];

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

      <DataTable
        columns={columns as ColumnDef<Article>[]}
        data={articles}
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
              { label: "All Articles", value: "all" },
              { label: "Published", value: "published" },
              { label: "Draft", value: "draft" },
              { label: "Archived", value: "archived" },
            ],
          },
        ]}
        searchPlaceholder="Search articles..."
        pageSize={10}
        loading={isLoading}
      />

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
                  Category
                </Text>
                <Badge variant="light">{selectedArticle.category}</Badge>
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
