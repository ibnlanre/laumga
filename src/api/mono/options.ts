import { queryOptions } from "@tanstack/react-query";
import { mono } from ".";

export const listMonoBankOptions = () => {
  return queryOptions({
    queryKey: mono.bank.list.$use(),
    queryFn: () => mono.$use.bank.list(),
  });
};
