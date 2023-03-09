import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "~/utils/types/supabase";

export const checkForAdmin = async (
  supabaseClient: SupabaseClient<Database>
) => {
  const { data } = await supabaseClient
    .from("charity_admin")
    .select("is_charity_admin,charity_id")
    .limit(1);

  if (data?.[0]) {
    const { is_charity_admin, charity_id } = data[0];
    return {
      isCharityAdmin: is_charity_admin ?? false,
      charityId: charity_id,
    };
  } else return { isCharityAdmin: false, charityId: null };
};
