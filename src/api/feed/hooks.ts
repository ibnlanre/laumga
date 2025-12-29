import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { feed } from "./index";

export function useCreateFeed() {
  return useMutation({
    mutationKey: feed.create.$get(),
    mutationFn: useServerFn(feed.$use.create),
  });
}
