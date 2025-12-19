import { queryOptions } from "@tanstack/react-query";
import { flutterwave } from ".";

export const listFlutterwaveBankOptions = () => {
  return queryOptions({
    queryKey: flutterwave.bank.list.$use(),
    queryFn: () => flutterwave.$use.bank.list,
  });
};
