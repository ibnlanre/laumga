import { queryOptions } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { chapter } from ".";
import type { ListChapterVariables, ChapterRegion } from "./types";

export const getChapterOptions = (id?: string) => {
  const get = useServerFn(chapter.$use.get);
  return queryOptions({
    queryKey: chapter.get.$get(id),
    queryFn: () => get({ data: id! }),
    enabled: !!id,
  });
};

export const listChapterOptions = (variables?: ListChapterVariables) => {
  const list = useServerFn(chapter.$use.list);
  return queryOptions({
    queryKey: chapter.list.$get(variables),
    queryFn: () => list({ data: variables }),
  });
};

export const getChapterByStateOptions = (state?: string) => {
  const list = useServerFn(chapter.$use.list);
  return queryOptions({
    queryKey: chapter.list.$get({ data: { state } }),
    queryFn: () =>
      list({
        data: {
          filterBy: [{ field: "state", operator: "==", value: state }],
          sortBy: [{ field: "name", direction: "asc" }],
        },
      }),
    enabled: !!state,
    select: (data) => data[0],
  });
};

export const listChaptersByRegionOptions = (region?: ChapterRegion) => {
  const list = useServerFn(chapter.$use.list);
  return queryOptions({
    queryKey: chapter.list.$get({ data: { region } }),
    queryFn: () =>
      list({
        data: {
          filterBy: [{ field: "region", operator: "==", value: region }],
          sortBy: [{ field: "name", direction: "asc" }],
        },
      }),
    enabled: !!region,
  });
};
