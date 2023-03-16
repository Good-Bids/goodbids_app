import { useMemo } from "react";
import { createSupabaseClient } from "~/queries/supabase";

export const useSupabase = () => {
  return createSupabaseClient();
};

export default useSupabase;
