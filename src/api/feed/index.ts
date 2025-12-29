import { createServerFn } from "@tanstack/react-start";
import { createBuilder } from "@ibnlanre/builder";

import {
  buildServerQuery,
  getServerQueryDocs,
  serverCollection,
} from "@/client/core-query/server";
import { createFeedSchema, FEED_COLLECTION, feedSchema } from "./schema";
import type { CreateFeedData, FeedData } from "./types";
import { createVariablesSchema } from "@/client/schema";

const list = createServerFn({ method: "GET" })
  .inputValidator(createVariablesSchema(feedSchema))
  .handler(async ({ data: variables }) => {
    const feedRef = serverCollection<FeedData>(FEED_COLLECTION);
    const feedQuery = buildServerQuery(feedRef, variables);
    return await getServerQueryDocs(feedQuery, feedSchema);
  });

const create = createServerFn({ method: "POST" })
  .inputValidator(createFeedSchema)
  .handler(async ({ data }) => {
    const feedRef = serverCollection<CreateFeedData>(FEED_COLLECTION);
    await feedRef.add(data);
  });

export const feed = createBuilder(
  {
    list,
    create,
  },
  { prefix: [FEED_COLLECTION] }
);
