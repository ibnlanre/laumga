import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  serverTimestamp,
  type DocumentReference,
  deleteDoc,
  increment,
} from "firebase/firestore";
import { db } from "@/services/firebase";
import { buildQuery, getQueryDoc, getQueryDocs } from "@/client/core-query";
import {
  createArticleSchema,
  updateArticleSchema,
  ARTICLES_COLLECTION,
  articleSchema,
} from "@/api/article/schema";
import type {
  CreateArticleVariables,
  CreateArticleData,
  UpdateArticleData,
  UpstreamArticleCollection,
  UpstreamArticleDocument,
  Article,
  UpdateArticleVariables,
  DownstreamArticleCollection,
  DownstreamArticleDocument,
  ListArticleVariables,
  PublishArticleVariables,
  ArchiveArticleVariables,
} from "./types";
import { createBuilder } from "@ibnlanre/builder";
import { record } from "@/utils/record";

async function create(variables: CreateArticleVariables) {
  const { user, data } = variables;

  const validated = createArticleSchema.parse(data);
  const articlesRef = collection(
    db,
    ARTICLES_COLLECTION
  ) as UpstreamArticleCollection;

  const existingQuery = query(articlesRef, where("slug", "==", validated.slug));
  const existingSnapshot = await getDocs(existingQuery);

  if (!existingSnapshot.empty) {
    throw new Error("An article with this slug already exists");
  }

  const articleData: CreateArticleData = {
    ...validated,
    created: record(user),
  };

  if (validated.status === "published") {
    articleData.published = record(user);
  }

  await addDoc(articlesRef, articleData);
}

async function update(variables: UpdateArticleVariables) {
  const { id, data, user } = variables;
  const validated = updateArticleSchema.parse(data);

  const articleRef = doc(
    db,
    ARTICLES_COLLECTION,
    id
  ) as UpstreamArticleDocument;

  const updateData: UpdateArticleData = {
    ...validated,
    updated: {
      at: serverTimestamp(),
      by: user.id,
      name: user.fullName,
      photoUrl: user.photoUrl,
    },
  };

  if (validated.status === "published" && !validated.published) {
    updateData.published = record(user);
  }

  if (validated.status === "archived" && !validated.archived) {
    updateData.archived = record(user);
  }

  await updateDoc(articleRef, updateData);
}

async function list(variables?: ListArticleVariables) {
  const articlesRef = collection(
    db,
    ARTICLES_COLLECTION
  ) as DownstreamArticleCollection;
  const articlesQuery = buildQuery(articlesRef, variables);
  return await getQueryDocs(articlesQuery, articleSchema);
}

async function get(id: string) {
  const articleRef = doc(
    db,
    ARTICLES_COLLECTION,
    id
  ) as DownstreamArticleDocument;
  return await getQueryDoc(articleRef, articleSchema);
}

async function remove(id: string) {
  const articleRef = doc(
    db,
    ARTICLES_COLLECTION,
    id
  ) as DocumentReference<Article>;
  await deleteDoc(articleRef);
}

async function publish(variables: PublishArticleVariables) {
  const { id, user } = variables;

  const articleRef = doc(
    db,
    ARTICLES_COLLECTION,
    id
  ) as UpstreamArticleDocument;

  await updateDoc(articleRef, {
    status: "published",
    published: record(user),
    updated: record(user),
  });
}

async function archive(variables: ArchiveArticleVariables) {
  const { id, user } = variables;

  const articleRef = doc(
    db,
    ARTICLES_COLLECTION,
    id
  ) as UpstreamArticleDocument;

  await updateDoc(articleRef, {
    status: "archived",
    archived: record(user),
    updated: record(user),
  });
}

async function related(articleId: string) {
  const articlesRef = collection(
    db,
    ARTICLES_COLLECTION
  ) as DownstreamArticleCollection;

  const relatedArticlesQuery = query(articlesRef, where("id", "!=", articleId));

  return await getQueryDocs(relatedArticlesQuery, articleSchema);
}

async function getArticleBySlug(slug: string) {
  const articlesRef = collection(
    db,
    ARTICLES_COLLECTION
  ) as DownstreamArticleCollection;

  const slugQuery = query(articlesRef, where("slug", "==", slug));

  return await getQueryDocs(slugQuery, articleSchema).then((articles) =>
    articles.length > 0 ? articles[0] : null
  );
}

async function incrementViewCount(articleId: string) {
  const articleRef = doc(
    db,
    ARTICLES_COLLECTION,
    articleId
  ) as UpstreamArticleDocument;

  const article = await get(articleId);
  if (!article) {
    throw new Error("Article not found");
  }

  await updateDoc(articleRef, {
    viewCount: increment(1),
  });
}

export const article = createBuilder({
  incrementViewCount,
  getArticleBySlug,
  related,
  archive,
  publish,
  remove,
  create,
  update,
  list,
  get,
});
