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
  const list = useServerFn(flutterwave.$use.transaction.list);
  const { customer_email, page, status } = variables;
  return queryOptions({
    queryKey: flutterwave.transaction.list.$get(variables),
    queryFn: () => {
      return list({
        data: {
          customer_email: customer_email!,
          status,
          page,
        },
      });
    },
    enabled: !!customer_email,
  });
};
