import { queryOptions } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { flutterwave } from ".";

export const listFlutterwaveBankOptions = () => {
  const list = useServerFn(flutterwave.$use.bank.list);
  return queryOptions({
    queryKey: flutterwave.bank.list.$use(),
    queryFn: () => list(),
  });
};
