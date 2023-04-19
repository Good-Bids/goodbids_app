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

const AuctionDetails = ({ auction }: AuctionDetailsProps) => {
  // can be set automatically AND or local set for UI snappiness
  const [isBidLocked, updateBidLock] = useState(false);

  // Subscription to the Bid Lock table
  // Allows us to listen for insert into the Lock table
  // subscription.lastMessage returns the "Full Monty" from the
  // event.
  const subscription = useMessageBus();

  // gets the Charity data
  const { charity: charityDetails } = useCharityQuery(auction.charity_id);
  const { data: auctionImages } = useStorageItemsQuery(auction.auction_id);
  const imageUrls = auctionImages?.map(
    (item) => `${fileStoragePath}/${auction?.auction_id}/${item.name}`
  );

  // Derived state
  // Required to setup bid amount
  const numberOfBids = Array.isArray(auction.bids) ? auction.bids.length : 1;
  const isInitialBid: boolean = !(numberOfBids > 0);

  // set defaults
  let currentHighBid = 0;
  let nextBidValue = 0;

  if (isInitialBid) {
    // its the initial bid set nextBidValue to opening
    nextBidValue = auction.opening_bid_value ?? nextBidValue;
  } else {
    // the currentBidValue is located in high_bid_value and can be null
    currentHighBid = auction.high_bid_value ?? currentHighBid;
    nextBidValue = currentHighBid + auction.increment;
  }

  // Realtime Supabase DB onChange Subscription listeners
  // TODO: Refactor this. This is a temp useEffect
  useEffect(() => {
    if (!subscription.messageBus.isInitialized) return;

    // Listen for bid lock messages
    if (subscription.messageBus.lastBidLockMessage) {
      if (
        subscription.messageBus.lastBidLockMessage.auctionId ===
        auction.auction_id
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
        auction.auction_id
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
    auction.auction_id,
    subscription.messageBus.isInitialized,
    subscription.messageBus.lastBidLockMessage,
    subscription.messageBus.lastAuctionUpdateMessage,
  ]);

  /*

  Tmp commenting out clock because its triggering 
  re-renders on tick

  const [timeLeft, setTimeLeft] = useState<number>(63);

  const minutesLeft = Math.floor(timeLeft / 60);
  const secondsLeft = timeLeft - minutesLeft * 60;
  const formattedSecondsLeft =
    secondsLeft.toLocaleString().length == 1 ? "0" + secondsLeft : secondsLeft;

  const auctionIsActive = auction.status === "ACTIVE" && timeLeft > 0;

  useInterval(() => setTimeLeft((prior) => (prior -= 1)), 1000);
  */

  // temp this here for now
  const auctionIsActive = auction.status === "ACTIVE";

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

  const charityId: string = auction.charity_id;

  const charityURL = `/charities/${charityId}`;

  return (
    <div className="flex h-full flex-col items-center gap-8 overflow-y-auto lg:flex-row">
      {imageUrls !== undefined && <ImageCarousel sources={imageUrls} />}
      <div
        className="flex w-full flex-col items-start justify-start gap-4 p-2 lg:w-1/3"
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
            {charityDetails?.name}
          </Link>
        </p>
        <p className="text-sm text-neutral-800">
          Auction Status: {auction.status}
        </p>
        {auctionIsActive ? (
          <>
            {/*
            <p className="text-base text-left text-neutral-800">
              {minutesLeft}:{formattedSecondsLeft} left before this auction ends
            </p>
            */}
            <PayPalDialog
              bidValue={nextBidValue}
              auction={auction}
              isBidLocked={isBidLocked}
            />
          </>
        ) : (
          <p className="text-md text-left font-black text-neutral-800">
            Auction has ended. Thanks for playing!
          </p>
        )}
      </div>
    </div>
  );
};

export const AuctionDetailPage = () => {
  const router = useRouter();

  // https://nextjs.org/docs/api-reference/next/router always an object or empty object
  // but they have typed it as string | string[] | undefined
  const auctionId = router.query?.auctionId as string;
  const { queryStatus, auction, hasError } = useAuctionQuery(auctionId);

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
    <div className="flex w-full flex-grow flex-col p-2 lg:p-24">
      <AuctionDetails auction={auction} />
    </div>
  );
};
