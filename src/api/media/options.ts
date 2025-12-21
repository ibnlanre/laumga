import { queryOptions } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { media } from ".";
import type { ListMediaVariables } from "./types";

export const getMediaOptions = (id?: string) => {
  const get = useServerFn(media.$use.get);
  return queryOptions({
    queryKey: media.get.$use({ data: id! }),
    queryFn: () => get({ data: id! }),
    enabled: !!id,
  });
};

export const getFeaturedMediaOptions = () => {
  const getFeaturedMedia = useServerFn(media.$use.getFeaturedMedia);
  return queryOptions({
    queryKey: media.getFeaturedMedia.$get(),
    queryFn: () => getFeaturedMedia(),
  });
};

export const listMediaOptions = (variables?: ListMediaVariables) => {
  const list = useServerFn(media.$use.list);
  return queryOptions({
    queryKey: media.list.$use({ data: variables }),
    queryFn: () => list({ data: variables }),
  });
};
