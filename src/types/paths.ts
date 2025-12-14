import type { User } from "@/api/user/types";
type Primitive = string | number | boolean | bigint | symbol | null | undefined;

type IsPlainObject<T> = T extends Primitive
  ? false
  : T extends readonly unknown[]
    ? false
    : T extends Date
      ? false
      : T extends Function
        ? false
        : T extends object
          ? true
          : false;

type Normalize<T> = NonNullable<T>;

export type Paths<T> = T extends object
  ? {
      [K in keyof T & string]: IsPlainObject<Normalize<T[K]>> extends true
        ? `${K}` | `${K}.${Paths<Normalize<T[K]>>}`
        : `${K}`;
    }[keyof T & string]
  : never;

type TestRegister = Paths<User>;
