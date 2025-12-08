import { z } from "zod";
import { fieldValueCodec, timestampCodec } from "@/schema/date";

export const feedDataSchema = z.object({
  id: z.string(),
  location: z.string(),
  timestamp: timestampCodec,
  amount: z.number().nullable(),
  gender: z.enum(["male", "female"]),
  userId: z.string().nullable(),
  type: z.enum(["donation", "role_change"]),  // New: Distinguishes event types
  role: z.enum(["Supporter", "Builder", "Guardian"]).optional(),  // New: For role-change events
});

export const feedSchema = feedDataSchema.extend({
  id: z.string(),
});

export const createFeedSchema = feedDataSchema.extend({
  timestamp: fieldValueCodec,
});

export const updateFeedSchema = createFeedSchema.partial();

export const FEED_COLLECTION = "feed";

// "A brother from Lagos just became a Supporter!"
// "A sister from Abuja just became a Builder!"
// "A brother from Kano just became a Guardian!"
// "A brother from Lagos just donated #5,000"