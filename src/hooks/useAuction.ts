import { useMutation, useQuery } from "@tanstack/react-query";
import useSupabase from "./useSupabase";

const supabaseClient = useSupabase();

const getAuction = async (auctionId?: string) => {
  if (auctionId) {
    const { data, error } = await supabaseClient
      .from("auction")
      .select()
      .eq("auction_id", auctionId)
      .limit(1)
      .single();
    if (error) {
      throw error;
    } else {
      return data;
    }
  }
};

const getAuctions = async () => {
  const { data, error } = await supabaseClient.from("auction").select();
  if (error) {
    throw error;
  } else {
    return data;
  }
};

export const useAuctionQuery = (auctionId?: string) => {
  const result = useQuery(["auction", auctionId], () => getAuction(auctionId));
  return result;
};
export const useAuctionsQuery = () => {
  const result = useQuery(["auctions"], () => getAuctions());
  return result;
};
