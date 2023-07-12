import { useMutation, useQuery } from "@tanstack/react-query";
import useSupabase from "./useSupabase";

const supabaseClient = useSupabase();

const createReferralId = async (userId: string) => {
  try {
    const result = await supabaseClient
      .from("user_referrals")
      .insert({ referrer_id: userId })
      .select("*")
      .single();
    return result;
  } catch (err) {
    throw err;
  }
};

const getReferralId = async (userId: string) => {
  try {
    const result = await supabaseClient
      .from("user_referrals")
      .select("referral_id")
      .eq("referrer_id", userId)
      .single();
    if (result.data) {
      return result.data.referral_id;
    } else console.error(result);
  } catch (err) {
    throw err;
  }
};

const getReferrerId = async (referralId: string) => {
  try {
    const result = await supabaseClient
      .from("user_referrals")
      .select("referrer_id")
      .eq("referral_id", referralId)
      .single();
    if (result.data) {
      return result.data.referrer_id;
    } else console.error(result);
  } catch (err) {
    throw err;
  }
};

const insertNewReferredUser = async (args: {
  userEmail: string;
  referralId: string;
  referrerId: string;
}) => {
  try {
    return await supabaseClient
      .from("new_user_referrals")
      .insert({
        referral_id: args.referralId,
        user_email: args.userEmail,
        referrer_id: args.referrerId,
      })
      .select("*")
      .single();
  } catch (err) {
    throw err;
  }
};

export const updateReferredUser = async (userEmail: string) => {
  try {
    return await supabaseClient
      .from("new_user_referrals")
      .update({ has_placed_bid: true })
      .eq("user_email", userEmail)
      .eq("has_placed_bid", "false")
      .select("*")
      .single();
  } catch (err) {
    throw err;
  }
};

export const useCreateReferralIdMutation = (args: { userId: string }) => {
  return useMutation({
    mutationKey: ["createReferralId", args.userId],
    mutationFn: async () => await createReferralId(args.userId),
  });
};

export const useInsertNewUserMutation = (args: {
  userEmail: string;
  referralId: string;
}) => {
  return useMutation({
    mutationKey: ["insertNewUser", args.userEmail],
    mutationFn: async () => {
      const referrerId = await getReferrerId(args.referralId);
      if (referrerId !== undefined) {
        return await insertNewReferredUser({
          ...args,
          referrerId: referrerId,
        });
      }
    },
  });
};

export const useReferralIdQuery = (userId: string) => {
  return useQuery({
    queryKey: ["getShareLink", userId],
    queryFn: async () => await getReferralId(userId),
  });
};

export const useReferrerIdQuery = (referralId: string) => {
  return useQuery({
    queryKey: ["getReferrerId", referralId],
    queryFn: async () => await getReferrerId(referralId),
  });
};
