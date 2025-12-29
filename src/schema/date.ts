import * as Firebase from "firebase/firestore";
import * as Admin from "firebase-admin/firestore";

import { z } from "zod";
import { createIsomorphicFn } from "@tanstack/react-start";

const schema = z.object({
  by: z.string().nullable().default(null),
  name: z.string().nullable().default(null),
  photoUrl: z.string().nullable().default(null),
});

const decode = createIsomorphicFn()
  .server((timestamp: unknown) => {
    if (timestamp instanceof Date) return timestamp;
    if (timestamp instanceof Admin.Timestamp) return timestamp.toDate();
    return timestamp as Date;
  })
  .client((timestamp: unknown) => {
    if (timestamp instanceof Date) return timestamp;
    if (timestamp instanceof Firebase.Timestamp) return timestamp.toDate();
    return timestamp as Date;
  });

const encode = createIsomorphicFn()
  .server((date: Date) => Admin.Timestamp.fromDate(date))
  .client((date: Date) => Firebase.Timestamp.fromDate(date));

export const timestampCodec = z.codec(
  z.union([z.unknown(), z.date()]),
  z.date(),
  { encode, decode }
);

export const dateSchema = schema
  .extend({ at: timestampCodec.nullable().default(null) })
  .nullable()
  .default(null);

const isFieldValue = createIsomorphicFn()
  .server((val: unknown) => {
    return val instanceof Admin.FieldValue;
  })
  .client((val: unknown) => {
    return val instanceof Firebase.FieldValue;
  });

export const fieldValueCodec = z.custom<Firebase.FieldValue>(isFieldValue);

export const fieldValueSchema = schema
  .extend({
    at: fieldValueCodec.nullable().default(null),
  })
  .nullable()
  .default(null);

export type LogEntryWithDate = z.infer<typeof dateSchema>;
export type LogEntryWithFieldValue = z.infer<typeof fieldValueSchema>;

export const isoDateTimeString = z.string();
