import { useMutation, useQuery } from "@tanstack/react-query";
import { Database } from "~/utils/types/supabase";
import useSupabase from "./useSupabase";

const supabaseClient = useSupabase();

type AuctionComment = Database["public"]["Tables"]["auction_comment"]["Row"];

export const getComments = async (auctionId: string) => {
  const { data, error } = await supabaseClient
    .from("auction_comment")
    .select("*")
    .eq("auction", auctionId);

  if (error) {
    throw error;
  } else return data;
};

export const updateComment = async (args: {
  auctionId: AuctionComment["auction"];
  user: AuctionComment["user"];
  text: AuctionComment["text"];
  user_name: AuctionComment["user_name"];
}) => {
  const { auctionId, user, text, user_name } = args;
  try {
    const result = await supabaseClient
      .from("auction_comment")
      .upsert({ text, user, user_name, auction: auctionId });
  } catch (error) {
    return error;
  }
};
export const useCommentsMutation = (args: {
  auctionId: AuctionComment["auction"];
  user: AuctionComment["user"];
  text: AuctionComment["text"];
  user_name: AuctionComment["user_name"];
}) => {
  const commentMutation = useMutation({
    mutationKey: ["updateComment", args.auctionId + args.user_name + args.text],
    mutationFn: async () => await updateComment(args),
  });
  return commentMutation;
};

export const useCommentsQuery = (auctionId: string) => {
  const result = useQuery({
    queryKey: ["auctionComments", auctionId],
    queryFn: async () => await getComments(auctionId),
  });
  return { ...result, data: result.data };
};
