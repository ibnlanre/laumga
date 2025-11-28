import type { NullableExcept, LogEntry } from "@/services/types";
import type { CollectionReference } from "firebase/firestore";

export type ArticleCategory = "news" | "health" | "islamic" | "campus";

export type Article = NullableExcept<
  {
    title: string;
    slug: string; // For pretty URLs
    excerpt: string;
    content: string; // HTML/Rich Text
    coverImageUrl: string;
    authorName: string;
    category: ArticleCategory;

    tags: string[];
    isPublished: boolean;
    publishedAt: string;

    created: LogEntry;
    modified: LogEntry;
  },
  "title" | "content" | "isPublished"
>;

export type ArticleCollection = CollectionReference<Article>;

export const article = {};