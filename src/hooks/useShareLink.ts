import { useMutation, useQuery } from "@tanstack/react-query";
import useSupabase from "./useSupabase";

const supabaseClient = useSupabase();

const createShareLink = async (userId: string) => {
  try {
    const result = await supabaseClient
      .from("user_referrals")
      .insert({ referrer_id: userId })
      .select("*");
    return result;
  } catch (err) {
    throw err;
  }
};

const getShareLink = async (userId: string) => {
  try {
    const result = await supabaseClient
      .from("user_referrals")
      .select("referral_id")
      .eq("referrer_id", userId)
      .single();
    if (result.data) {
      return result.data.referral_id;
    }
  } catch (err) {
    throw err;
  }
};

const updateShareLinkUsage = async (args: {
  userId: string;
  referralId: string;
}) => {
  try {
    if (args.referralId) {
      return await supabaseClient
        .from("user_referrals")
        .update({ new_user_id: args.userId, referral_id: args.referralId });
    }
  } catch (err) {
    throw err;
  }
};

export const useCreateShareLinkMutation = (args: { userId: string }) => {
  return useMutation({
    mutationKey: ["createShareLink", args.userId],
    mutationFn: async () => await createShareLink(args.userId),
  });
};

export const useUpdateShareLinkMutation = (args: {
  userId: string;
  referralId: string;
}) => {
  return useMutation({
    mutationKey: ["updateShareLink", args.userId],
    mutationFn: async () => await updateShareLinkUsage(args),
  });
};

export const useShareLinkQuery = (userId: string) => {
  return useQuery({
    queryKey: ["getShareLink", userId],
    queryFn: async () => await getShareLink(userId),
  });
};
