import { useQuery } from "@tanstack/react-query";
import { createSupabaseClient } from "~/queries/supabase";

const supabase = createSupabaseClient();

const getUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw error;
  } else {
    return data.user;
  }
};

export const useUserQuery = () => {
  const result = useQuery(["userData"], () => getUser());
  return result;
};
