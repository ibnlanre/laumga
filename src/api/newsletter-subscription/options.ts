import { queryOptions } from "@tanstack/react-query";
import { newsletterSubscription } from "./index";

export const listNewsletterSubscriptionOptions = queryOptions({
  queryKey: newsletterSubscription.list.$use(),
  queryFn: () => newsletterSubscription.$use.list(),
});
