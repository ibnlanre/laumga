import { z } from "zod";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  type WithFieldValue,
  type CollectionReference,
  type DocumentReference,
} from "firebase/firestore";
import { db } from "@/services/firebase";
import { buildQuery, getQueryDoc, getQueryDocs, type Variables } from "@/client/core-query";

export const articleSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  coverImageUrl: z.url("Invalid cover image URL"),
  authorName: z.string().min(1, "Author name is required"),
  authorId: z.string().optional(),
  category: z.enum([
    "news",
    "health",
    "islamic",
    "campus",
    "alumni",
    "community",
  ]),
  tags: z.array(z.string()),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  featured: z.boolean().default(false),
  isPublished: z.boolean().default(false),
  publishedAt: z.instanceof(Timestamp).optional(),
  viewCount: z.number().default(0),
  createdAt: z.instanceof(Timestamp),
  createdBy: z.string().min(1, "Created by is required"),
  updatedAt: z.instanceof(Timestamp),
  updatedBy: z.string().min(1, "Updated by is required"),
});

export const createArticleSchema = articleSchema.omit({
  viewCount: true,
  createdAt: true,
  updatedAt: true,
  publishedAt: true,
});

export const updateArticleSchema = createArticleSchema.partial();

export type Article = z.infer<typeof articleSchema>;
export type CreateArticleData = z.infer<typeof createArticleSchema>;
export type UpdateArticleData = z.infer<typeof updateArticleSchema>;
export type ArticleCategory = z.infer<typeof articleSchema.shape.category>;

export type ArticleData = Omit<Article, "id">;
export type ArticleCollection = CollectionReference<ArticleData>;
export type ArticleDocumentReference = DocumentReference<ArticleData>;

const ARTICLES_COLLECTION = "articles";

/**
 * Create a new article
 */
async function create(data: CreateArticleData) {
  const validated = createArticleSchema.parse(data);

  // Generate slug if not provided or ensure uniqueness
  let slug = validated.slug || z.string().slugify().parse(validated.title);

  const articlesRef = collection(db, ARTICLES_COLLECTION) as ArticleCollection;

  // Check for existing slug
  const existingQuery = query(articlesRef, where("slug", "==", slug));
  const existingSnapshot = await getDocs(existingQuery);

  if (!existingSnapshot.empty) {
    slug = `${slug}-${Date.now()}`;
  }

  const articleData = {
    ...validated,
    slug,
    viewCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  } satisfies WithFieldValue<Article> as unknown as Article;

  if (validated.isPublished) {
    articleData.publishedAt = serverTimestamp() as unknown as Timestamp;
  }

  const docRef = await addDoc(articlesRef, articleData);
  return await getQueryDoc(docRef);
}

/**
 * Update an article
 */
async function update(id: string, data: UpdateArticleData) {
  const validated = updateArticleSchema.parse(data);
  const articleRef = doc(
    db,
    ARTICLES_COLLECTION,
    id
  ) as ArticleDocumentReference;

  const updateData: any = {
    ...validated,
    updatedAt: serverTimestamp(),
  };

  if (validated.isPublished === true) {
    updateData.publishedAt = serverTimestamp();
  }

  await updateDoc(articleRef, updateData);

  return fetchById(id);
}

// {
//   category?: Article["category"];
//   isPublished?: boolean;
//   tag?: string;
//   limit?: number;
// }

// export interface QueryFilters<DocumentType> {
//   queryFilter?: Array<{
//     field: keyof DocumentType;
//     operator: WhereFilterOp;
//     value: any;
//   }>;
//   queryLimit?: number;
//   queryOrder?: Array<{
//     field: keyof DocumentType;
//     value: OrderByDirection;
//   }>;
// }

// const filtersDefault: QueryFilters<Article> = {
//   queryFilter: [
//     {
//       field: "isPublished",
//       operator: "==",
//       value: true,
//     },
//     {
//       field: "category",
//       operator: "==",
//       value: "news",
//     },
//     {
//       field: "tags",
//       operator: "array-contains",
//       value: "general",
//     }
//   ],
// };

async function fetchAll(variables?: Variables<ArticleData>) {
  const articlesRef = collection(db, ARTICLES_COLLECTION) as ArticleCollection;
  const articlesQuery = buildQuery(articlesRef, variables);
  return getQueryDocs(articlesQuery);
}

/**
 * Fetch article by ID
 */
async function fetchById(id: string) {
  const articleRef = doc(
    db,
    ARTICLES_COLLECTION,
    id
  ) as ArticleDocumentReference;
  const articleDoc = await getDoc(articleRef);

  if (!articleDoc.exists()) {
    return null;
  }

  const article = {
    id: articleDoc.id,
    ...articleDoc.data(),
  };

  return article;
}

/**
 * Fetch article by slug
 */
async function fetchBySlug(slug: string) {
  const articlesRef = collection(db, ARTICLES_COLLECTION) as ArticleCollection;
  const articleQuery = query(articlesRef, where("slug", "==", slug));
  const snapshot = await getDocs(articleQuery);

  if (snapshot.empty) {
    return null;
  }

  const articleDoc = snapshot.docs[0];
  const article = {
    id: articleDoc.id,
    ...articleDoc.data(),
  };

  return article;
}

/**
 * Fetch related articles
 */
async function fetchRelated(id: string, maxResults: number = 3) {
  const currentArticle = await fetchById(id);
  if (!currentArticle) {
    return [];
  }

  // Find articles in the same category
  const articlesRef = collection(db, ARTICLES_COLLECTION) as ArticleCollection;
  const relatedQuery = query(
    articlesRef,
    where("category", "==", currentArticle.category),
    where("isPublished", "==", true),
    orderBy("createdAt", "desc"),
    limit(maxResults + 1)
  );

  const snapshot = await getDocs(relatedQuery);
  const articles = snapshot.docs
    .filter((doc) => doc.id !== id) // Exclude current article
    .slice(0, maxResults)
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

  return articles;
}

/**
 * Search articles
 */
async function search(searchQuery: string) {
  const articles = await fetchAll({
    filterBy: [{ field: "isPublished", operator: "==", value: true }],
  });

  const searchLower = searchQuery.toLowerCase();
  return articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchLower) ||
      article.excerpt.toLowerCase().includes(searchLower) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchLower))
  );
}

/**
 * Increment view count
 */
async function incrementViewCount(id: string): Promise<void> {
  const articleRef = doc(
    db,
    ARTICLES_COLLECTION,
    id
  ) as DocumentReference<Article>;
  const articleDoc = await getDoc(articleRef);

  if (!articleDoc.exists()) {
    throw new Error("Article not found");
  }

  const currentCount = articleDoc.data().viewCount || 0;
  await updateDoc(articleRef, {
    viewCount: currentCount + 1,
  });
}

/**
 * Delete an article
 */
async function deleteArticle(id: string): Promise<void> {
  const articleRef = doc(
    db,
    ARTICLES_COLLECTION,
    id
  ) as DocumentReference<Article>;
  await updateDoc(articleRef, { status: "archived" });
}

export const article = {
  create,
  update,
  fetchAll,
  fetchById,
  fetchBySlug,
  fetchRelated,
  search,
  incrementViewCount,
  delete: deleteArticle,
};
