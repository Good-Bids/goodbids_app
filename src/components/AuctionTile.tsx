import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Url } from "url";
import { useBidsByAuction } from "~/hooks/useAuction";
import { useAuctionTimer } from "~/hooks/useAuctionTimer";

import { useStorageItemsQuery } from "~/hooks/useStorage";
import { fileStoragePath } from "~/utils/constants";
import { Auction } from "~/utils/types/auctions";

export const AuctionTile = (props: { auction: Auction }) => {
  const { auction } = props;
  const { data: images } = useStorageItemsQuery(auction.auction_id);
  const { data: bids } = useBidsByAuction(auction.auction_id);

  const [heroImage, setHeroImage] = useState<string>();

  useEffect(() => {
    if (images) {
      const heroImageName = images[0]?.name ?? "";
      const heroImageSrc = `${fileStoragePath}/${auction.auction_id}/${heroImageName}`;
      setHeroImage(heroImageSrc);
    }
  }, [images]);

  const { string: timeLeft } = useAuctionTimer({
    auction,
    onTimeUpdate: () => {
      return;
    },
  });

  return (
    <Link href={`/auctions/${auction.auction_id}`}>
      <div
        className="flex h-fit w-80 cursor-pointer flex-col gap-4"
        id={`auction-${auction.auction_id}-tile`}
      >
        <div className="relative aspect-video w-full overflow-clip rounded-xl">
          {heroImage && (
            <Image
              src={heroImage}
              alt={`main photo for auction with name ${auction.name}`}
              priority={true}
              fill
              style={{ objectFit: "cover" }}
            />
          )}
        </div>
        <h3 className="text-xl font-bold ">{auction.name}</h3>
        <div className="flex w-full flex-row justify-between gap-1">
          <p className="text-s font-bold">
            ${auction.high_bid_value.toLocaleString()}
          </p>
          <p className="text-s">{timeLeft} left</p>
          <p className="text-s font-bold">{bids?.length} bids</p>
        </div>
      </div>
    </Link>
  );
};
