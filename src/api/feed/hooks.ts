import { useMutation } from "@tanstack/react-query";
import { feed } from "./index";

export function useCreateFeed() {
  return useMutation({
    mutationKey: feed.create.$get(),
    mutationFn: feed.$use.create,
  });
}
