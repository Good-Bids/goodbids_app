import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";

import { env } from "~/env.mjs";
import { Database } from "~/utils/types/supabase";

export const createSupabaseClient = () => {
  return createBrowserSupabaseClient<Database>({
    supabaseUrl: env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: env.NEXT_PUBLIC_SUPABASE_KEY,
  });
};
