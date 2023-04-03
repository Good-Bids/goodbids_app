import { useMutation, useQuery } from "@tanstack/react-query";
import { updateCharityAdmin } from "./useCharityAdmin";
import useSupabase from "./useSupabase";

const supabaseClient = useSupabase();

const getCharity = async (charityId?: string) => {
  const { data, error } = await supabaseClient
    .from("charity")
    .select()
    .eq("charity_id", charityId)
    .limit(1)
    .single();
  if (error) {
    throw error;
  } else {
    return data;
  }
};

interface NewCharity {
  email: string;
  ein: string;
  name: string;
  adminId: string;
}

const createCharity = async (data: NewCharity) => {
  const { data: charityData, error } = await supabaseClient
    .from("charity")
    .insert({ email: data.email, ein: data.ein, name: data.name })
    .select()
    .limit(1)
    .single();

  if (error) {
    throw error;
  } else {
    return charityData;
  }
};

export const useCharityQuery = (charityId?: string) => {
  const result = useQuery(["charity", charityId], () => getCharity(charityId), {
    enabled: Boolean(charityId),
  });
  return result;
};

export const useCreateCharity = (data: NewCharity) => {
  return useMutation(() => createCharity(data), {
    onSuccess: async (charityData) => {
      const updateData = updateCharityAdmin(
        charityData.charity_id,
        data.adminId
      );
      return updateData;
    },
  });
};
