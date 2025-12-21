import { queryOptions } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { mono } from ".";

export const listMonoBankOptions = () => {
  const list = useServerFn(mono.$use.bank.list);
  return queryOptions({
    queryKey: mono.bank.list.$use(),
    queryFn: () => list(),
  });
};
