import React, { useState, useEffect } from "react";

// Routing and links
import { useRouter } from "next/router";
import Link from "next/link";

// listener for db onChange
import { useMessageBus } from "~/contexts/Subscriptions";

// React Query hooks
import { useAuctionQuery } from "~/hooks/useAuction";
import { useCharityQuery } from "~/hooks/useCharity";

// Components
import { PayPalDialog } from "./PayPalDialog";
import { ImageCarousel } from "~/components/ImageCarousel";
import { useStorageItemsQuery } from "~/hooks/useStorage";

// Types
import { type AuctionExtended } from "~/utils/types/auctions";
import useSupabase from "~/hooks/useSupabase";
import { fileStoragePath } from "~/utils/constants";
import { useInterval } from "usehooks-ts";
import { AuctionTimer } from "./AuctionTimer";
interface AuctionDetailsProps {
  auction: AuctionExtended;
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

  // https://nextjs.org/docs/api-reference/next/router always an object or empty object
  // but they have typed it as string | string[] | undefined
  const auctionId = router.query?.auctionId as string;
  const { queryStatus, auction, hasError } = useAuctionQuery(auctionId);
  const { charity } = useCharityQuery(auction?.charity_id);
  const { data: auctionImages } = useStorageItemsQuery(auction?.auction_id);
  const [auctionIsActive, setAuctionIsActive] = useState(true);

  // can be set automatically AND or local set for UI snappiness
  const [isBidLocked, updateBidLock] = useState(false);

  // Subscription to the Bid Lock table
  // Allows us to listen for insert into the Lock table
  // subscription.lastMessage returns the "Full Monty" from the
  // event.
  const subscription = useMessageBus();

  const imageUrls: string[] | undefined = auctionImages?.map(
    (item) => `${fileStoragePath}/${auction?.auction_id}/${item.name}`
  );

  // Derived state
  // Required to setup bid amount
  const numberOfBids =
    (Array.isArray(auction?.bids) ? auction?.bids.length : 1) ?? 0;
  const isInitialBid: boolean = !(numberOfBids > 0);

  // set defaults
  let currentHighBid = 0;
  let nextBidValue = 0;

  if (isInitialBid) {
    // its the initial bid set nextBidValue to opening
    nextBidValue = auction?.opening_bid_value ?? nextBidValue;
  } else {
    // the currentBidValue is located in high_bid_value and can be null
    currentHighBid = auction?.high_bid_value ?? currentHighBid;
    nextBidValue = currentHighBid + (auction?.increment ?? 0);
  }

  // Realtime Supabase DB onChange Subscription listeners
  // TODO: Refactor this. This is a temp useEffect
  useEffect(() => {
    if (!subscription.messageBus.isInitialized) return;

    // Listen for bid lock messages
    if (subscription.messageBus.lastBidLockMessage) {
      if (
        subscription.messageBus.lastBidLockMessage.auctionId ===
        auction?.auction_id
      ) {
        if (subscription.messageBus.lastBidLockMessage.eventType === "INSERT") {
          updateBidLock(true);
        }
        if (subscription.messageBus.lastBidLockMessage.eventType === "DELETE") {
          updateBidLock(false);
        }
      }
    }
    // Listen for auction update messages
    if (subscription.messageBus.lastAuctionUpdateMessage) {
      if (
        subscription.messageBus.lastAuctionUpdateMessage.auctionId ===
        auction?.auction_id
      ) {
        if (
          subscription.messageBus.lastAuctionUpdateMessage.eventType ===
          "UPDATE"
        ) {
          // TRIGGER AUCTION REFETCH
          // we already get the new auction model but its missing bids
          // Even tho we can trigger an update on an auction change
          // this will also trigger on change of DB auction halfway in the bid
          // process ... but we need it if this is not the bidding client
          // triggerUpdateAuction();
        }
      }
    }
  }, [
    auction?.auction_id,
    subscription.messageBus.isInitialized,
    subscription.messageBus.lastBidLockMessage,
    subscription.messageBus.lastAuctionUpdateMessage,
  ]);

  const supabaseClient = useSupabase();

  supabaseClient
    .channel("custom-all-channel")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "auction" },
      (payload) => {
        console.log("Change received!", payload);
      }
    )
    .subscribe();
  supabaseClient
    .channel("custom-all-channel")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "bids" },
      (payload) => {
        console.log("Change received on bids!", payload);
      }
    )
    .subscribe();

  const charityURL = `/charities/${auction?.charity_id}`;

  // ReactQuery Status -> loading
  if (queryStatus.isLoading && !queryStatus.isError) {
    return <QueryLoadingDisplay />;
  }

  // ReactQuery SubQuery or auctionId Validation -> error
  if (!queryStatus.isLoading && hasError) {
    return <QueryErrorDisplay />;
  }

  if (auction === undefined) {
    return <QueryErrorDisplay />;
  }

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
          {auctionIsActive && (
            <>
              <PayPalDialog
                bidValue={nextBidValue}
                auction={auction}
                isBidLocked={isBidLocked}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
