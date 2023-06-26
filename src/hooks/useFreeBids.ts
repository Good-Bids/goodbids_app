import { useMutation, useQuery } from "@tanstack/react-query";
import useSupabase from "./useSupabase";

const supabaseClient = useSupabase();

export type FreeBidType = "bid_early" | "bid_often" | "tell_your_friends";

const getFreeBids = async (args: { auctionId: string; userId: string }) => {
  try {
    const { auctionId, userId } = args;
    const result = await supabaseClient
      .from("free_bids")
      .select("*")
      .eq("auction_id", auctionId)
      .eq("bidder_id", userId)
      .eq("status", "ACTIVE");

    return result.data;
  } catch (err) {
    throw err;
  }
};
const updateFreeBids = async (args: {
  auctionId: string;
  userId: string;
  type?: FreeBidType;
  action: "redeem" | "earn";
}) => {
  try {
    const {
      auctionId: auction_id,
      userId: bidder_id,
      type: free_bid_type,
      action,
    } = args;
    switch (action) {
      case "earn": {
        const result = await supabaseClient
          .from("free_bids")
          .insert({ auction_id, bidder_id, free_bid_type, status: "ACTIVE" });
        return result;
      }
      case "redeem": {
        const result = await supabaseClient
          .from("free_bids")
          .update({ auction_id, bidder_id });
        return result;
      }
    }
  } catch (err) {
    throw err;
  }
};

export const useFreeBidsQuery = (args: {
  userId: string;
  auctionId: string;
}) => {
  const result = useQuery({
    queryKey: ["checkFreeBids", args.auctionId + "_" + args.userId],
    queryFn: () => getFreeBids(args),
  });
  return result;
};

export const useFreeBidsMutation = (args: {
  userId: string;
  auctionId: string;
  action: "redeem" | "earn";
  type: FreeBidType;
}) => {
  const mutation = useMutation({
    mutationKey: ["updateFreeBids", args.auctionId + "_" + args.userId],
    mutationFn: async () => await updateFreeBids(args),
  });
  return mutation;
};
