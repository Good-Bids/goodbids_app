import { useQuery } from "@tanstack/react-query";
import useSupabase from "./useSupabase";

const supabaseClient = useSupabase();

export const checkForAdmin = async () => {
  const { data, error } = await supabaseClient
    .from("charity_admin")
    .select("is_charity_admin,charity_id")
    .limit(1)
    .single();

  if (error) {
    throw error;
  } else {
    return data;
  }
};

export const useAdminCheckQuery = (userId?: string) => {
  const result = useQuery<
    { is_charity_admin: boolean | null; charity_id: string | null },
    unknown,
    { isCharityAdmin: boolean; charityId?: string }
  >(["adminCheck"], () => checkForAdmin(), {
    select: (data) => ({
      isCharityAdmin: data.is_charity_admin ?? false,
      charityId: data.charity_id ?? undefined,
    }),
    enabled: Boolean(userId),
  });
  return result;
};

export const updateCharityAdmin = async (charityId: string, userId: string) => {
  const { data, error } = await supabaseClient
    .from("charity_admin")
    .update({ charity_id: charityId })
    .eq("user_id", userId)
    .select()
    .limit(1)
    .single();
  if (error) {
    throw error;
  } else {
    return data;
  }
};
