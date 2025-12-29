import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createBuilder } from "@ibnlanre/builder";
import { FieldValue } from "firebase-admin/firestore";

import { serverRecord } from "@/utils/server-record";
import {
  buildServerQuery,
  getServerQueryDoc,
  getServerQueryDocs,
  serverCollection,
} from "@/client/core-query/server";
import { createVariablesSchema } from "@/client/schema";

import {
  ARTICLES_COLLECTION,
  articleSchema,
  createArticleSchema,
  updateArticleSchema,
} from "./schema";
import type {
  ArticleData,
  CreateArticleData,
  UpdateArticleData,
} from "./types";
import { userSchema } from "../user/schema";

const list = createServerFn({ method: "GET" })
  .inputValidator(createVariablesSchema(articleSchema))
  .handler(async ({ data: variables }) => {
    const articlesRef = serverCollection<ArticleData>(ARTICLES_COLLECTION);
    const query = buildServerQuery(articlesRef, variables);
    return getServerQueryDocs(query, articleSchema);
  });

const get = createServerFn({ method: "GET" })
  .inputValidator(z.string())
  .handler(async ({ data: id }) => {
    const articleRef =
      serverCollection<ArticleData>(ARTICLES_COLLECTION).doc(id);
    return getServerQueryDoc(articleRef, articleSchema);
  });

const create = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      user: userSchema,
      data: createArticleSchema,
    })
  )
  .handler(async ({ data: { user, data } }) => {
    const articlesRef = serverCollection<ArticleData>(ARTICLES_COLLECTION);

    const existingSnapshot = await articlesRef
      .where("slug", "==", data.slug)
      .get();

    if (!existingSnapshot.empty) {
      throw new Error("An article with this slug already exists");
    }

    const articleData: CreateArticleData = {
      ...data,
      created: serverRecord(user),
    };

    if (data.status === "published") {
      articleData.published = serverRecord(user);
    }

    await articlesRef.add(articleData);
  });

const update = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      id: z.string(),
      user: userSchema,
      data: updateArticleSchema,
    })
  )
  .handler(async ({ data: { id, data, user } }) => {
    const articleRef =
      serverCollection<ArticleData>(ARTICLES_COLLECTION).doc(id);

    const updateData: UpdateArticleData = {
      ...data,
      updated: serverRecord(user),
    };

    if (data.status === "published" && !data.published) {
      updateData.published = serverRecord(user);
    }

    if (data.status === "archived" && !data.archived) {
      updateData.archived = serverRecord(user);
    }

    await articleRef.update(updateData);
  });

const remove = createServerFn({ method: "POST" })
  .inputValidator(z.string())
  .handler(async ({ data: id }) => {
    const articleRef =
      serverCollection<ArticleData>(ARTICLES_COLLECTION).doc(id);
    await articleRef.delete();
  });

const publish = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      id: z.string(),
      user: userSchema,
    })
  )
  .handler(async ({ data: { id, user } }) => {
    const articleRef =
      serverCollection<ArticleData>(ARTICLES_COLLECTION).doc(id);

    await articleRef.update({
      status: "published",
      published: serverRecord(user),
      updated: serverRecord(user),
    });
  });

const archive = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      id: z.string(),
      user: userSchema,
    })
  )
  .handler(async ({ data: { id, user } }) => {
    const articleRef =
      serverCollection<ArticleData>(ARTICLES_COLLECTION).doc(id);

    await articleRef.update({
      status: "archived",
      archived: serverRecord(user),
      updated: serverRecord(user),
    });
  });

const related = createServerFn({ method: "GET" })
  .inputValidator(z.string())
  .handler(async ({ data: articleId }) => {
    const articlesRef = serverCollection<ArticleData>(ARTICLES_COLLECTION);
    const query = articlesRef.where("id", "!=", articleId);
    return getServerQueryDocs(query, articleSchema);
  });

const getArticleBySlug = createServerFn({ method: "GET" })
  .inputValidator(z.string())
  .handler(async ({ data: slug }) => {
    const articlesRef = serverCollection<ArticleData>(ARTICLES_COLLECTION);
    const query = articlesRef.where("slug", "==", slug);
    const articles = await getServerQueryDocs(query, articleSchema);
    return articles.length > 0 ? articles[0] : null;
  });

const incrementViewCount = createServerFn({ method: "POST" })
  .inputValidator(z.string())
  .handler(async ({ data: articleId }) => {
    const articleRef =
      serverCollection<ArticleData>(ARTICLES_COLLECTION).doc(articleId);

    const article = await articleRef.get();
    if (!article.exists) {
      throw new Error("Article not found");
    }

    await articleRef.update({
      viewCount: FieldValue.increment(1),
    });
  });

export const article = createBuilder(
  {
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
  },
  { prefix: [ARTICLES_COLLECTION] }
);
