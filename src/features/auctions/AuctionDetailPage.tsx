import React, { useState, useEffect } from "react";

// Routing and links
import { useRouter } from "next/router";
import Link from "next/link";

// React Query hooks
import { useAuctionQuery } from "~/hooks/useAuction";
import { useCharityQuery } from "~/hooks/useCharity";

// Components
import { PayPalDialog } from "./PayPalDialog";
import { ImageCarousel } from "~/components/ImageCarousel";
import { useStorageItemsQuery } from "~/hooks/useStorage";

// Types
import { Auction, type AuctionExtended } from "~/utils/types/auctions";
import useSupabase from "~/hooks/useSupabase";
import { fileStoragePath } from "~/utils/constants";
import { AuctionTimer } from "./AuctionTimer";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { useMessageBus } from "~/contexts/Subscriptions";
interface AuctionDetailsProps {
  auction: Auction;
}

/**
 * QueryLoadingDisplay
 * not implemented
 */
const QueryLoadingDisplay = () => {
  return <p>LOADING</p>;
};

/**
 * QueryErrorDisplay
 * not implemented
 */
const QueryErrorDisplay = () => {
  return <p>ERROR</p>;
};

export const AuctionDetailPage = () => {
  const router = useRouter();
  const subscription = useMessageBus();

  // https://nextjs.org/docs/api-reference/next/router always an object or empty object
  // but they have typed it as string | string[] | undefined
  const auctionId = !Array.isArray(router.query?.auctionId)
    ? router.query?.auctionId ?? ""
    : "";
  const { isLoading, data: auctionData, isError } = useAuctionQuery(auctionId);
  const { charity } = useCharityQuery(auctionData?.charity_id);
  const { data: auctionImages } = useStorageItemsQuery(auctionData?.auction_id);
  const [auctionIsActive, setAuctionIsActive] = useState(true);

  const [isBidLocked, setIsBidLocked] = useState(false);
  const [auction, setAuction] = useState<Auction>();
  const [nextBidValue, setNextBidValue] = useState(0);

  const charityURL = `/charities/${auction?.charity_id}`;
  const imageUrls: string[] | undefined = auctionImages?.map(
    (item) => `${fileStoragePath}/${auction?.auction_id}/${item.name}`
  );

  useEffect(() => {
    if (auctionData && auctionData !== undefined) {
      setAuction(auctionData);
      setNextBidValue(auctionData.high_bid_value + auctionData.increment);
    }
  }, [auctionData]);

  useEffect(() => {
    if (!subscription.messageBus.isInitialized) return;
    // Listen for auction update messages
    if (subscription.messageBus.lastAuctionUpdateMessage) {
      const { auction: updatedAuction, eventType } =
        subscription.messageBus.lastAuctionUpdateMessage;
      if (updatedAuction.auction_id === auction?.auction_id) {
        if (eventType === "UPDATE") {
          setAuction(updatedAuction);
          setNextBidValue(
            updatedAuction.high_bid_value + updatedAuction.increment
          );
        }
      }
    }
  }, [
    auction?.auction_id,
    subscription.messageBus.isInitialized,
    subscription.messageBus.lastAuctionUpdateMessage,
  ]);

  if (auction !== undefined) {
    return (
      <div className="flex w-full flex-grow flex-col p-2">
        <div
          className="mb-4 flex h-full flex-col items-center gap-8 overflow-y-auto md:flex-row"
          id="auction-detailpage-container"
        >
          {imageUrls !== undefined && <ImageCarousel sources={imageUrls} />}
          <div
            className="flex w-full flex-col items-start justify-start gap-4 p-2 md:w-1/3"
            id="auction-info-container"
          >
            <p className="text-3xl font-black text-black">{auction.name}</p>
            <p className="text-left text-base text-neutral-800">
              {auction.description}
            </p>
            <p className="text-xs text-neutral-800">
              {"supports "}
              <Link
                href={charityURL}
                className="decoration-screaminGreen hover:underline"
              >
                {charity?.name}
              </Link>
            </p>
            <AuctionTimer
              auction={auction}
              onTimeUpdate={setAuctionIsActive}
              auctionIsActive={auctionIsActive}
            />
            <PayPalDialog
              bidValue={nextBidValue}
              auction={auction}
              isBidLocked={!auctionIsActive}
            />
          </div>
        </div>
      </div>
    );
  } else {
    if (isLoading && !isError) {
      return <QueryLoadingDisplay />;
    } else {
      return <QueryErrorDisplay />;
    }
  }
};
