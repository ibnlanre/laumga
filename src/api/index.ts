
import { createBuilder } from "@ibnlanre/builder";

import { user } from "./user";
import { mandate } from "./mandate";
import { newsletter } from "./newsletter";
import { feed } from "./feed";
import { event } from "./event";
import { gallery } from "./gallery";
import { article } from "./article";
import { executive } from "./executive";
import { chapter } from "./chapter";

export const api = createBuilder({
  user,
  mandate,
  newsletter,
  feed,
  event,
  gallery,
  article,
  executive,
  chapter,
});
