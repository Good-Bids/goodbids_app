import React, { useState, useEffect } from "react";

// Routing and links
import { useRouter } from "next/router";
import Link from "next/link";

// React Query hooks
import { useAuctionQuery } from "~/hooks/useAuction";
import { useCharityQuery } from "~/hooks/useCharity";
import { useMessageBus } from "~/contexts/Subscriptions";

// Components
import { AuctionTimer } from "./AuctionTimer";
import { PayPalDialog } from "./PayPalDialog";
import { ImageCarousel } from "~/components/ImageCarousel";
import { useStorageItemsQuery } from "~/hooks/useStorage";

// Types & constants
import { Auction } from "~/utils/types/auctions";
import { fileStoragePath } from "~/utils/constants";

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

  const auctionId = !Array.isArray(router.query?.auctionId)
    ? router.query?.auctionId ?? ""
    : "";
  const { isLoading, data: auction, isError } = useAuctionQuery(auctionId);
  const { charity } = useCharityQuery(auction?.charity_id);
  const { data: auctionImages } = useStorageItemsQuery(auction?.auction_id);
  const [auctionIsActive, setAuctionIsActive] = useState(true);

  const [nextBidValue, setNextBidValue] = useState(0);

  const charityURL = `/charities/${auction?.charity_id}`;
  const imageUrls: string[] | undefined = auctionImages?.map(
    (item) => `${fileStoragePath}/${auction?.auction_id}/${item.name}`
  );
  const [displayAuction,setDisplayAuction] = useState(auction)

  useEffect(() => {
    if (displayAuction) {
      if (displayAuction.high_bid_value && displayAuction.increment) {
        setNextBidValue(displayAuction.high_bid_value + displayAuction.increment);
      }
    }
  }, [displayAuction]);

  useEffect(() => {
    if (auction){
      setDisplayAuction(auction)
    }
    if (!subscription.messageBus.isInitialized) return;
    // Listen for auction update messages
    if (subscription.messageBus.lastAuctionUpdateMessage) {
      const { auction: updatedAuction, eventType } =
        subscription.messageBus.lastAuctionUpdateMessage;
        if (updatedAuction.auction_id === auction?.auction_id) {
          if (eventType === "UPDATE") {
            setDisplayAuction(updatedAuction)
        }
      }
    }
  }, [
    auction?.auction_id,
    subscription.messageBus.isInitialized,
    subscription.messageBus.lastAuctionUpdateMessage,
  ]);

  if (displayAuction) {
    const displayText = displayAuction.description.split('<br/>')
    return (
      <div className="flex w-full flex-grow flex-col p-0 h-[calc(100%_-_40em)]">
        <div
          className="mb-4 flex h-full flex-col items-center gap-8 overflow-y-auto md:flex-row md:h-full"
          id="auction-detailPage-container"
        >
          {imageUrls !== undefined && <ImageCarousel sources={imageUrls} />}
          <div
            className="flex w-full flex-col items-start justify-start gap-4 p-2 md:w-1/3 md:h-full"
            id="auction-info-container"
          >
            <div className="flex w-full h-4/6 flex-col gap-2 overflow-y-auto">
            <p className="text-3xl font-black text-black">{displayAuction.name}</p>
            {displayText.map(item=>
            <p className="text-left text-base text-neutral-800 my-2" key={item}>
              {item}
            </p>
              )}
              </div>
              <div className="h-2/6 flex flex-col">
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
              auction={displayAuction}
              onTimeUpdate={setAuctionIsActive}
              auctionIsActive={auctionIsActive}
            />
            <PayPalDialog
              bidValue={nextBidValue}
              auction={displayAuction}
              isBidLocked={!auctionIsActive}
            />
            </div>
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
