import { queryOptions } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { newsletterSubscription } from "./index";

export const listNewsletterSubscriptionOptions = () => {
  const list = useServerFn(newsletterSubscription.$use.list);
  return queryOptions({
    queryKey: newsletterSubscription.list.$use(),
    queryFn: () => list(),
  });
};
