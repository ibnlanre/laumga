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
  type WithFieldValue,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/services/firebase";

export const articleSchema = z.object({
  title: z.string(),
  slug: z.string(),
  excerpt: z.string(),
  content: z.string(),
  coverImageUrl: z.url(),
  authorName: z.string(),
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
  publishedAt: z.any().optional(),
  viewCount: z.number().default(0),
  createdAt: z.any(),
  createdBy: z.string(),
  updatedAt: z.any(),
  updatedBy: z.string(),
});

export const articleDataSchema = articleSchema.extend({
  id: z.string(),
});

export const createArticleSchema = articleDataSchema.omit({
  viewCount: true,
  createdAt: true,
  updatedAt: true,
});

export const updateArticleSchema = createArticleSchema.partial();

export type Article = z.infer<typeof articleSchema>;
export type ArticleData = z.infer<typeof articleDataSchema>;
export type CreateArticleData = z.infer<typeof createArticleSchema>;
export type UpdateArticleData = z.infer<typeof updateArticleSchema>;

const ARTICLES_COLLECTION = "articles";

/**
 * Create a new article
 */
async function create(data: CreateArticleData) {
  const validated = createArticleSchema.parse(data);

  // Generate slug if not provided or ensure uniqueness
  let slug = validated.slug || z.string().slugify().parse(validated.title);

  // Check for existing slug
  const articlesRef = collection(db, ARTICLES_COLLECTION);
  const existingQuery = query(articlesRef, where("slug", "==", slug));
  const existingSnapshot = await getDocs(existingQuery);

  if (!existingSnapshot.empty) {
    slug = `${slug}-${Date.now()}`;
  }

  const articleData: WithFieldValue<Article> = {
    ...validated,
    slug,
    viewCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (validated.isPublished && !articleData.publishedAt) {
    articleData.publishedAt = serverTimestamp();
  }

  const docRef = await addDoc(articlesRef, articleData);

  return { id: docRef.id, ...articleData };
}

/**
 * Update an article
 */
async function update(id: string, data: UpdateArticleData) {
  const validated = updateArticleSchema.parse(data);
  const articleRef = doc(db, ARTICLES_COLLECTION, id);

  // If publishing for the first time, set publishedAt
  const updateData = {
    ...validated,
    updatedAt: Date.now(),
  };

  if (validated.isPublished && !validated.publishedAt) {
    updateData.publishedAt = serverTimestamp();
  }

  await updateDoc(articleRef, updateData);

  const updated = await fetchById(id);
  if (!updated) {
    throw new Error("Article not found after update");
  }

  return updated;
}

/**
 * Fetch all articles
 */
async function fetchAll(filters?: {
  category?: Article["category"];
  isPublished?: boolean;
  tag?: string;
  limit?: number;
}) {
  const articlesRef = collection(db, ARTICLES_COLLECTION);
  let articlesQuery = query(articlesRef, orderBy("createdAt", "desc"));

  // Filter by published status
  if (filters?.isPublished !== undefined) {
    articlesQuery = query(
      articlesQuery,
      where("isPublished", "==", filters.isPublished)
    );
  }

  // Filter by category
  if (filters?.category) {
    articlesQuery = query(
      articlesQuery,
      where("category", "==", filters.category)
    );
  }

  // Filter by tag
  if (filters?.tag) {
    articlesQuery = query(
      articlesQuery,
      where("tags", "array-contains", filters.tag)
    );
  }

  // Apply limit
  if (filters?.limit) {
    articlesQuery = query(articlesQuery, limit(filters.limit));
  }

  const snapshot = await getDocs(articlesQuery);
  const articles = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return articleDataSchema.array().parse(articles);
}

/**
 * Fetch article by ID
 */
async function fetchById(id: string): Promise<Article | null> {
  const articleRef = doc(db, ARTICLES_COLLECTION, id);
  const articleDoc = await getDoc(articleRef);

  if (!articleDoc.exists()) {
    return null;
  }

  const article = {
    id: articleDoc.id,
    ...articleDoc.data(),
  };

  return articleDataSchema.parse(article);
}

/**
 * Fetch article by slug
 */
async function fetchBySlug(slug: string) {
  const articlesRef = collection(db, ARTICLES_COLLECTION);
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

  return articleDataSchema.parse(article);
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
  const articlesRef = collection(db, ARTICLES_COLLECTION);
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

  return articleDataSchema.array().parse(articles);
}

/**
 * Search articles
 */
async function search(searchQuery: string) {
  // Note: Firestore doesn't support full-text search natively
  // This is a simple implementation that filters on the client side
  // For production, consider using Algolia or similar service
  const articles = await fetchAll({ isPublished: true });

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
  const articleRef = doc(db, ARTICLES_COLLECTION, id);
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
  const articleRef = doc(db, ARTICLES_COLLECTION, id);
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
