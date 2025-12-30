import { queryOptions } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { flutterwave } from ".";

export const listFlutterwaveBankOptions = () => {
  const list = useServerFn(flutterwave.$use.bank.list);
  return queryOptions({
    queryKey: flutterwave.bank.list.$get(),
    queryFn: () => list(),
  });
};

export const listFlutterwaveTransactionOptions = (variables: {
  customer_email?: string;
  tx_ref?: string | null
  from?: string;
  to?: string;
  currency?: string;
  status?: string;
  customer_fullname?: string;
  page?: number;
} = {}) => {
  const list = useServerFn(flutterwave.$use.transaction.list);

  return queryOptions({
    queryKey: flutterwave.transaction.list.$get(variables),
    queryFn: () => list({ data: variables })
  });
};

export const listFlutterwavePaymentPlanOptions = (variables?: {
  page?: number;
  status?: string;
  interval?: string;
  amount?: number;
  currency?: string;
}) => {
  const list = useServerFn(flutterwave.$use.paymentPlan.list);
  return queryOptions({
    queryKey: flutterwave.paymentPlan.list.$get(variables),
    queryFn: () => list({ data: variables }),
    enabled: !!variables,
  });
};

export const listFlutterwaveSubscriptionOptions = (variables?: {
  email?: string;
  transaction_id?: number;
  plan?: string;
  subscribed_from?: string;
  subscribed_to?: string;
  next_due_from?: string;
  next_due_to?: string;
  status?: string;
  page?: number;
}) => {
  const { email, ...properties } = { ...variables };
  const list = useServerFn(flutterwave.$use.subscription.list);

  return queryOptions({
    queryKey: flutterwave.subscription.list.$get(variables),
    queryFn: () => {
      return list({
        data: {
          ...properties,
          email: email!,
        },
      });
    },
    enabled: !!variables?.email,
  });
};
