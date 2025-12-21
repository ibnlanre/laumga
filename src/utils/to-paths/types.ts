type Primitive = string | number | boolean | bigint | symbol | null | undefined;
type Except = Primitive | unknown[] | Date | Function | RegExp | Set<any> | Map<any, any>;
type IsObject<T> = T extends Except ? 0 : T extends object ? 1 : 0

export type Paths<T> = T extends object
  ? {
      [K in keyof T & string]: IsObject<NonNullable<T[K]>> extends 1
        ? `${K}` | `${K}.${Paths<NonNullable<T[K]>>}`
        : `${K}`;
    }[keyof T & string]
  : never;

