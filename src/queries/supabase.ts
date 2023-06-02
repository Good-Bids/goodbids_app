import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";

import { env } from "~/env.mjs";
import { Database } from "~/utils/types/supabase";

export const createSupabaseClient = () => {
  return createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_KEY,
    {
      realtime: {
        params: {
          eventsPerSecond: 5,
        },
      },
      auth: {
        persistSession: true,
      },
    }
  );
};
