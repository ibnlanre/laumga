import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Grid,
  Group,
  MultiSelect,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
  Textarea,
  Title,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { Eye, Check, X, Trash2, Star, Plus } from "lucide-react";

import { PageLoader } from "@/components/page-loader";
import { DataTable } from "@/components/data-table";
import { ImageUpload } from "@/components/image-upload";
import type {
  Article,
  ArticleStatus,
  CreateArticleData,
  ArticleCategory,
} from "@/api/article/types";
import { createArticleSchema } from "@/api/article/schema";
import {
  useArchiveArticle,
  useCreateArticle,
  usePublishArticle,
  useRemoveArticle,
  useUpdateArticle,
} from "@/api/article/hooks";
import { listArticleOptions } from "@/api/article/options";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/use-auth";
import { upload } from "@/api/upload";
import { z } from "zod";
import { record } from "@/utils/record";
import type { User } from "@/api/user/types";

const ARTICLE_CATEGORY_OPTIONS: { value: ArticleCategory; label: string }[] = [
  { value: "news", label: "News" },
  { value: "health", label: "Health" },
  { value: "islamic", label: "Islamic" },
  { value: "campus", label: "Campus" },
  { value: "alumni", label: "Alumni" },
  { value: "community", label: "Community" },
];

const ARTICLE_STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

const CREATE_ARTICLE_MODAL_ID = "create-article-modal";
const ARTICLE_DETAILS_MODAL_PREFIX = "article-details-modal";

const articleFormSchema = createArticleSchema.omit({
  created: true,
  published: true,
  updated: true,
  archived: true,
});

type ArticleFormValues = z.infer<typeof articleFormSchema>;

export const Route = createFileRoute("/admin/articles")({
  validateSearch: z.object({
    status: z.string().optional(),
  }),
  component: ArticlesAdmin,
});

function ArticlesAdmin() {
  const { user } = useAuth();

  const { data: articles = [], isLoading } = useQuery(listArticleOptions());
  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();
  const deleteArticle = useRemoveArticle();
  const publishArticle = usePublishArticle();
  const archiveArticle = useArchiveArticle();

  const columnHelper = createColumnHelper<Article>();

  const closeModal = (id?: string) => {
    if (id) {
      modals.close(id);
    }
  };

  const handleCreateArticle = async (values: ArticleFormValues) => {
    if (!user) return;

    await createArticle.mutateAsync({
      data: {
        user,
        data: buildCreatePayload(values, user),
      },
    });

    closeModal(CREATE_ARTICLE_MODAL_ID);
  };

  const handleToggleFeatured = async (article: Article, modalId?: string) => {
    if (!user) return;

    await updateArticle.mutateAsync({
      data: {
        id: article.id,
        data: { featured: !article.featured },
        user,
      },
    });

    closeModal(modalId);
  };

  const handlePublish = async (articleId: string, modalId?: string) => {
    if (!user) return;

    await publishArticle.mutateAsync({
      data: {
        id: articleId,
        user,
      },
    });

    closeModal(modalId);
  };

  const handleArchive = async (articleId: string, modalId?: string) => {
    if (!user) return;

    await archiveArticle.mutateAsync({
      data: {
        id: articleId,
        user,
      },
    });

    closeModal(modalId);
  };

  const handleDelete = async (articleId: string, modalId?: string) => {
    await deleteArticle.mutateAsync({ data: articleId });
    closeModal(modalId);
  };

  const confirmDeleteArticle = (article: Article, modalId?: string) => {
    modals.openConfirmModal({
      title: `Delete ${article.title}?`,
      children: (
        <Text size="sm">
          This action is permanent. The article will be removed from the
          bulletin and cannot be recovered.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red", loading: deleteArticle.isPending },
      onConfirm: () => handleDelete(article.id, modalId),
    });
  };

  const openCreateModal = () => {
    modals.open({
      modalId: CREATE_ARTICLE_MODAL_ID,
      title: <Title order={3}>Create article</Title>,
      radius: "lg",
      size: "xl",
      children: (
        <ArticleForm
          initialValues={getDefaultArticleFormValues()}
          submitting={createArticle.isPending}
          onSubmit={handleCreateArticle}
          onCancel={() => closeModal(CREATE_ARTICLE_MODAL_ID)}
        />
      ),
    });
  };

  const openArticleDetails = (article: Article) => {
    const modalId = `${ARTICLE_DETAILS_MODAL_PREFIX}-${article.id}`;

    modals.open({
      modalId,
      title: <Title order={3}>{article.title}</Title>,
      radius: "lg",
      size: "xl",
      children: (
        <ArticleDetails
          article={article}
          actionPending={
            updateArticle.isPending ||
            publishArticle.isPending ||
            archiveArticle.isPending
          }
          deletePending={deleteArticle.isPending}
          onToggleFeatured={() => handleToggleFeatured(article, modalId)}
          onPublish={() => handlePublish(article.id, modalId)}
          onArchive={() => handleArchive(article.id, modalId)}
          onRepublish={() => handlePublish(article.id, modalId)}
          onDelete={() => confirmDeleteArticle(article, modalId)}
        />
      ),
    });
  };

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
          onChange={() => handleToggleFeatured(info.row.original)}
          size="sm"
          color="yellow"
          disabled={updateArticle.isPending}
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
              onClick={() => openArticleDetails(info.row.original)}
            >
              <Eye className="size-4" />
            </ActionIcon>
          </Tooltip>
          {info.row.original.status === "draft" && (
            <Tooltip label="Publish">
              <ActionIcon
                variant="subtle"
                color="green"
                disabled={publishArticle.isPending}
                onClick={() => handlePublish(info.row.original.id)}
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
                disabled={archiveArticle.isPending}
                onClick={() => handleArchive(info.row.original.id)}
              >
                <X className="size-4" />
              </ActionIcon>
            </Tooltip>
          )}
          <Tooltip label="Delete">
            <ActionIcon
              variant="subtle"
              color="red"
              disabled={deleteArticle.isPending}
              onClick={() => confirmDeleteArticle(info.row.original)}
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
          <Group>
            {pendingCount > 0 && (
              <Badge size="lg" color="orange" variant="filled">
                {pendingCount} drafts pending
              </Badge>
            )}
            <Button
              leftSection={<Plus className="size-4" />}
              onClick={openCreateModal}
            >
              Create Article
            </Button>
          </Group>
        </Group>
      </div>

      <DataTable
        columns={columns}
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
    </div>
  );
}

interface ArticleFormProps {
  initialValues: ArticleFormValues;
  submitting: boolean;
  onSubmit: (values: ArticleFormValues) => Promise<void> | void;
  onCancel: () => void;
}

function ArticleForm({
  initialValues,
  submitting,
  onSubmit,
  onCancel,
}: ArticleFormProps) {
  const form = useForm<ArticleFormValues>({
    initialValues,
    validate: zod4Resolver(articleFormSchema),
  });

  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (file: File | null) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await upload.$use.galleryImage(file);
      form.setFieldValue("coverImageUrl", url);
    } catch (error) {
      console.error("Failed to upload image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form
      onSubmit={form.onSubmit(async (values) => {
        await onSubmit(values);
      })}
    >
      <Stack gap="md">
        <TextInput
          label="Title"
          placeholder="Article title"
          withAsterisk
          {...form.getInputProps("title")}
        />

        <TextInput
          label="Slug"
          placeholder="article-slug"
          withAsterisk
          {...form.getInputProps("slug")}
        />

        <Select
          label="Category"
          placeholder="Select category"
          data={ARTICLE_CATEGORY_OPTIONS}
          withAsterisk
          {...form.getInputProps("category")}
        />

        <Textarea
          label="Excerpt"
          placeholder="Short summary"
          minRows={2}
          withAsterisk
          {...form.getInputProps("excerpt")}
        />

        <Textarea
          label="Content"
          placeholder="Full article content"
          minRows={8}
          withAsterisk
          {...form.getInputProps("content")}
        />

        <MultiSelect
          label="Tags"
          placeholder="Add tags"
          data={form.values.tags.map((tag) => ({ value: tag, label: tag }))}
          searchable
          {...form.getInputProps("tags")}
        />

        <ImageUpload
          label="Cover Image"
          value={form.values.coverImageUrl}
          onChange={handleImageUpload}
        />

        <Group justify="space-between">
          <Switch
            label="Featured Article"
            {...form.getInputProps("featured", { type: "checkbox" })}
          />
          <Select
            label="Status"
            data={ARTICLE_STATUS_OPTIONS}
            withAsterisk
            {...form.getInputProps("status")}
          />
        </Group>

        <Group justify="flex-end" mt="md">
          <Button
            type="button"
            variant="default"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button type="submit" loading={submitting} disabled={isUploading}>
            Create Article
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

interface ArticleDetailsProps {
  article: Article;
  actionPending: boolean;
  deletePending: boolean;
  onToggleFeatured: () => void;
  onPublish: () => void;
  onArchive: () => void;
  onRepublish: () => void;
  onDelete: () => void;
}

function ArticleDetails({
  article,
  actionPending,
  deletePending,
  onToggleFeatured,
  onPublish,
  onArchive,
  onRepublish,
  onDelete,
}: ArticleDetailsProps) {
  return (
    <Stack gap="md">
      <Group justify="space-between" mb="sm">
        <Group gap="xs">
          {article.featured && (
            <Star className="size-5 text-yellow-500 fill-yellow-500" />
          )}
          <Title order={3}>{article.title}</Title>
        </Group>
        <Badge size="lg" color={getStatusColor(article.status)} variant="light">
          {article.status}
        </Badge>
      </Group>

      {article.coverImageUrl && (
        <Card shadow="sm" padding="xs" radius="md" withBorder>
          <Card.Section>
            <img
              src={article.coverImageUrl}
              alt={article.title}
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
          <Badge variant="light">{article.category}</Badge>
        </Grid.Col>
        <Grid.Col span={6}>
          <Text size="sm" fw={500} c="dimmed">
            Featured Article
          </Text>
          <Switch
            checked={article.featured}
            onChange={() => onToggleFeatured()}
            label={article.featured ? "Yes" : "No"}
            color="yellow"
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Text size="sm" fw={500} c="dimmed" mb="xs">
            Content
          </Text>
          <Card withBorder padding="md" className="bg-gray-50">
            <Text size="sm" style={{ whiteSpace: "pre-wrap" }}>
              {article.content}
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={12}>
          <Text size="sm" fw={500} c="dimmed">
            Tags
          </Text>
          <Group gap="xs" mt="xs">
            {article.tags.length > 0 ? (
              article.tags.map((tag) => (
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
          {article.status === "draft" && (
            <Button
              leftSection={<Check className="size-4" />}
              color="green"
              onClick={onPublish}
              loading={actionPending}
            >
              Publish Article
            </Button>
          )}
          {article.status === "published" && (
            <Button
              leftSection={<X className="size-4" />}
              color="gray"
              variant="outline"
              onClick={onArchive}
              loading={actionPending}
            >
              Archive Article
            </Button>
          )}
          {article.status === "archived" && (
            <Button
              leftSection={<Check className="size-4" />}
              color="green"
              onClick={onRepublish}
              loading={actionPending}
            >
              Republish Article
            </Button>
          )}
          <Button
            leftSection={<Trash2 className="size-4" />}
            color="red"
            variant="outline"
            onClick={onDelete}
            loading={deletePending}
          >
            Delete Article
          </Button>
        </Group>
      </div>
    </Stack>
  );
}

function getStatusColor(status: ArticleStatus) {
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
}

function getDefaultArticleFormValues(): ArticleFormValues {
  const values: ArticleFormValues = {
    title: "",
    slug: "",
    category: "news",
    excerpt: "",
    content: "",
    tags: [],
    coverImageUrl: "",
    featured: false,
    status: "draft",
    viewCount: 0,
    authorId: undefined,
  };
  return values;
}

function buildCreatePayload(
  values: ArticleFormValues,
  user: Pick<User, "id" | "fullName" | "photoUrl">
): CreateArticleData {
  const payload: CreateArticleData = {
    ...values,
    created: record(user),
    updated: record(user),
    published: values.status === "published" ? record(user) : null,
    archived: values.status === "archived" ? record(user) : null,
  };
  return payload;
}
