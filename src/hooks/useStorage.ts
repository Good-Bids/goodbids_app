import { useQuery } from "@tanstack/react-query";
import useSupabase from "./useSupabase";

const supabaseClient = useSupabase();

const getItemsFromStorage = async (auctionId?: string) => {
  try {
    const { data: buckets } = await supabaseClient.storage.listBuckets();
    if (buckets) {
      const assetsBucket = buckets.find(
        (bucket) => bucket.name == "auction-assets"
      );
      if (assetsBucket) {
        const { data } = await supabaseClient.storage
          .from(assetsBucket.id)
          .list(`${auctionId}/`);
        return data;
      } else {
        throw "no storage bucket found";
      }
    }
  } catch (err) {
    if (err instanceof Error) throw err;
  }
};

export const useStorageItemsQuery = (auctionId?: string) => {
  const result = useQuery(
    ["auctionAssets", auctionId],
    async () => getItemsFromStorage(auctionId),
    {
      select: (data) =>
        data?.filter((item) => item.name !== ".emptyFolderPlaceholder"),
      enabled: auctionId !== undefined,
    }
  );
  return result;
};
