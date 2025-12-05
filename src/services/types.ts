export type WithId<T> = T & { id: string };
export type Prettify<T> = { [K in keyof T]: T[K] } & {};
export type Dictionary = Record<string, any>;

export type Nullable<T> = { [K in keyof T]: null | T[K] };
export type NullableExcept<T, K extends keyof T> = Prettify<
  Nullable<Omit<T, K>> & Pick<T, K>
>;

export type LogEntry = {
  at: any; // Relaxed to allow string (ISO) or Firestore Timestamp
  by: string;
  name: string | null;
  photoUrl: string | null;
};
