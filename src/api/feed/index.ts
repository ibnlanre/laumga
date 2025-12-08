import { addDoc, collection } from "firebase/firestore";
import { createBuilder } from "@ibnlanre/builder";

import { db } from "@/services/firebase";
import { buildQuery, getQueryDocs } from "@/client/core-query";
import { createFeedSchema, FEED_COLLECTION, feedSchema } from "./schema";
import type {
  CreateFeedVariables,
  DownstreamFeedCollection,
  ListFeedVariables,
  UpstreamFeedCollection,
} from "./types";

async function list(variables?: ListFeedVariables) {
  const feedRef = collection(db, FEED_COLLECTION) as DownstreamFeedCollection;
  const feedQuery = buildQuery(feedRef, variables);
  return await getQueryDocs(feedQuery, feedSchema);
}

async function create({ data }: CreateFeedVariables) {
  const validated = createFeedSchema.parse(data);
  const feedRef = collection(db, FEED_COLLECTION) as UpstreamFeedCollection;
  await addDoc(feedRef, validated);
}

export const feed = createBuilder({
  list,
  create,
});
