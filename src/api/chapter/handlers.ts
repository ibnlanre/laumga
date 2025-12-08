import { useQuery } from "@tanstack/react-query";
import { chapter } from "./index";
import type { ChapterRegion } from "./types";

export function useChapterByState(state?: string) {
  return useQuery({
    queryKey: chapter.list.$get(state),
    queryFn: () => {
      return chapter.$use.list({
        filterBy: [{ field: "state", operator: "==", value: state }],
        sortBy: [{ field: "name", value: "asc" }],
      });
    },
    enabled: !!state,
    select: (data) => data[0],
  });
}

export function useChaptersByRegion(region?: ChapterRegion) {
  return useQuery({
    queryKey: chapter.list.$get(region),
    queryFn: () => {
      return chapter.$use.list({
        filterBy: [{ field: "region", operator: "==", value: region }],
        sortBy: [{ field: "name", value: "asc" }],
      });
    },
    enabled: !!region,
  });
}
