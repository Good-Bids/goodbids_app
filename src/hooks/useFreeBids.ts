import { useQuery } from "@tanstack/react-query";
import useSupabase from "./useSupabase";

const supabaseClient = useSupabase();

const getFreeBids = async (args: { auctionId: string; userId: string }) => {
  try {
    const { auctionId, userId } = args;
    const result = await supabaseClient
      .from("free_bids")
      .select("*")
      .eq("auction_id", auctionId)
      .eq("bidder_id", userId);

    return result.data;
  } catch (err) {
    throw err;
  }
};

export const useFreeBids = (args: { userId: string; auctionId: string }) => {
  const result = useQuery({
    queryKey: ["checkFreeBids", args.auctionId + "_" + args.userId],
    queryFn: () => getFreeBids(args),
  });
  return result;
};
