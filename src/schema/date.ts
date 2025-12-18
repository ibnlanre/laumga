import { FieldValue, Timestamp } from "firebase/firestore";
import { z } from "zod";

const schema = z.object({
  by: z.string().nullable().default(null),
  name: z.string().nullable().default(null),
  photoUrl: z.string().nullable().default(null),
});

export const timestampCodec = z
  .codec(z.instanceof(Timestamp), z.date(), {
    encode: (date) => Timestamp.fromDate(date),
    decode: (timestamp) => timestamp.toDate(),
  })

export const dateSchema = schema
  .extend({ at: timestampCodec })
  .nullable()
  .default(null);

export type LogEntryWithDate = z.infer<typeof dateSchema>;

const isFieldValue = (val: unknown): val is FieldValue => {
  return val instanceof FieldValue;
};

export const fieldValueCodec = z
  .custom<FieldValue>(isFieldValue)

export const fieldValueSchema = schema
  .extend({ at: fieldValueCodec })
  .nullable()
  .default(null);

export type LogEntryWithFieldValue = z.infer<typeof fieldValueSchema>;

export const isoDateTimeString = z.string();