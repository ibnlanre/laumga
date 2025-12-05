import { createBuilder } from "@ibnlanre/builder";

import { user } from "./user";
import { mandate } from "./mandate";
import { paymentPartner } from "./payment-partner";
import { newsletter } from "./newsletter";
import { feed } from "./feed";
import { event } from "./event";
import { gallery } from "./gallery";
import { article } from "./article";
import { executive } from "./executive";
import { chapter } from "./chapter";
import { upload } from "./upload";
import { mono } from "./mono";

export const api = createBuilder({
  user,
  mandate,
  paymentPartner,
  newsletter,
  feed,
  event,
  gallery,
  article,
  executive,
  chapter,
  upload,
  mono,
});
