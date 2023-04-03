import { createClient } from "@supabase/supabase-js";

import { env } from "~/env.mjs";
import { Database } from "~/utils/types/supabase";

export const supabase = createClient<Database>(
  env.SUPABASE_URL,
  env.SUPABASE_KEY
);
