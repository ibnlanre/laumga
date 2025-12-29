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

export const listTransactionOptions = (variables: {
  customer_email?: string;
  page?: number;
  status?: string;
}) => {
  const { customer_email, ...properties } = variables;
  const list = useServerFn(flutterwave.$use.transaction.list);

  return queryOptions({
    queryKey: flutterwave.transaction.list.$get(variables),
    queryFn: () => {
      return list({
        data: {
          customer_email: customer_email!,
          ...properties,
        },
      });
    },
    enabled: !!customer_email,
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
  customer_email?: string;
  status?: string;
  page?: number;
  from?: string;
  to?: string;
}) => {
  const { customer_email, ...properties } = { ...variables };
  const list = useServerFn(flutterwave.$use.subscription.list);

  return queryOptions({
    queryKey: flutterwave.subscription.list.$get(variables),
    queryFn: () => {
      return list({
        data: {
          ...properties,
          customer_email: customer_email!,
        },
      });
    },
    enabled: !!variables?.customer_email,
  });
};
