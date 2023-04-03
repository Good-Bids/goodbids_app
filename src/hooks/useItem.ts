import { useQuery } from "@tanstack/react-query";
import useSupabase from "./useSupabase";

const supabaseClient = useSupabase();

const getItem = async (itemId?: string) => {
  const { data, error } = await supabaseClient
    .from("item")
    .select()
    .eq("item_id", itemId)
    .limit(1)
    .single();
  if (error) {
    throw error;
  } else {
    return data;
  }
};

export const useItemQuery = (itemId?: string) => {
  const result = useQuery(["item", itemId], () => getItem(itemId), {
    enabled: Boolean(itemId),
  });
  return result;
};
