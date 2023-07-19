import {
  Metadata,
  ResolvingMetadata,
} from "next/dist/lib/metadata/types/metadata-interface";
import { BuildOn } from "~/features/auctions/buildOn";
import { getItemsFromStorage } from "src/hooks/useStorage";
import { buildOnAuctionIds, fileStoragePath } from "~/utils/constants";

type Props = {
  params: { prize: "watch" | "trek" };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent?: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const { prize } = params;

  const auctionId = buildOnAuctionIds[prize];

  // fetch data
  const auctionImages = await getItemsFromStorage(auctionId);

  const imageUrls: string[] | undefined = auctionImages?.map(
    (item) => `${fileStoragePath}/${auctionId}/${item.name}`
  );

  return {
    title: `GoodBids | ${prize} auction`,
    openGraph: {
      images: imageUrls,
    },
  };
}

export default function Watch({ params, searchParams }: Props) {
  generateMetadata({ params: { prize: "watch" }, searchParams });
  return <BuildOn prize="watch" />;
}
