import { MouseEvent, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useAuctionQuery, useUpdateAuctionCache } from "~/hooks/useAuction";
import { useMessageBus } from "~/contexts/Subscriptions";

import { useCharityQuery } from "~/hooks/useCharity";
import useInterval from "~/hooks/useInterval";
import { useUserQuery } from "~/hooks/useUser";
import Link from "next/link";
import { T_AuctionModelExtended } from "~/utils/types/auctions";
import { ImageCarousel } from "~/components/ImageCarousel";

/** TS for the paypal project is here importing only Types */
import { PayPalDialog } from "./PayPalDialog";
import { bidHandler } from "../processBid";

/**
 * TODO: move links to backend server into:
 * 1. possibly the db itself so that links are hydrated via the row call
 * 2. env app bootstrap fields
 */
const fileStoragePath: string =
  "https://imjsqwufoypzctthvxmr.supabase.co/storage/v1/object/public/auction-assets";

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

/**
 * AuctionDetails
 *
 * Note: lastUpdate comes from ReactQuery and is a JS Date obj not
 * luxon. It is already localized
 *
 * TODO: defaults for all values
 */
interface AuctionDetailsProps {
  auction: T_AuctionModelExtended;
}

const AuctionDetails = ({ auction }: AuctionDetailsProps) => {
  const router = useRouter();

  // showing error messages or success
  const [isProcessingBid, setProcessingState] = useState(false);

  // can be set automatically AND or local set for UI snappiness
  const [isBidLocked, updateBidLock] = useState(false);

  // gets the auth id from the jwt
  const userJWT = useUserQuery();
  // assuming that the hook will cause re-render and logout automatically
  const isAuthenticated: boolean =
    userJWT.data?.role === "authenticated" ?? false;

  // Subscription to the Bid Lock table
  // Allows us to listen for insert into the Lock table
  // subscription.lastMessage returns the "Full Monty" from the
  // event.
  const subscription = useMessageBus();

  // For manually updating the current Auction Model
  const triggerUpdateAuction = useUpdateAuctionCache();

  // gets the Charity data 
  const { charity: charityDetails } = useCharityQuery(auction.charity_id);

  // Derived state
  // Required to setup bid amount
  const numberOfBids = Array.isArray(auction.bids) ? auction.bids.length : 1;
  const isInitialBid: boolean = numberOfBids > 0 ? false : true;
  const totalBids: number = numberOfBids || 0;

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
  useEffect(() => {
    if (!subscription.mbus.isInitialized) return;
    // Listen for bid lock messages
    if (subscription.mbus.lastBidLockMessage) {
      if (
        subscription.mbus.lastBidLockMessage.auctionId === auction.auction_id
      ) {
        if (subscription.mbus.lastBidLockMessage.eventType === "INSERT") {
          console.log(
            "[Process BID] - Update from bid_state table adding local LOCK"
          );
          updateBidLock(true);
        }
        if (subscription.mbus.lastBidLockMessage.eventType === "DELETE") {
          console.log(
            "[Process BID] - Update from bid_state table removing local LOCK"
          );
          updateBidLock(false);
        }
      }
    }
    // Listen for auction update messages
    if (subscription.mbus.lastAuctionUpdateMessage) {
      if (
        subscription.mbus.lastAuctionUpdateMessage.auctionId ===
        auction.auction_id
      ) {
        if (subscription.mbus.lastAuctionUpdateMessage.eventType === "UPDATE") {
          // TRIGGER AUCTION REFETCH
          // we already get the new auction model but its missing bids
        }
      }
    }
  }, [
    auction.auction_id,
    subscription.mbus.isInitialized,
    subscription.mbus.lastBidLockMessage,
    subscription.mbus.lastAuctionUpdateMessage,
  ]);

  useEffect(() => {
    const processBid = async () => {

      if(userJWT.data?.id === undefined) return;

      const bidResult = await bidHandler(
        userJWT.data?.id,
        auction,
        nextBidValue,
        () => {
          console.log("[Process BID] - START");
        },
        () => {
          console.log("[Process BID] - COMPLETE");
        },
        () => {
          console.log("[Process BID] - ERROR");
        }
      );
      // Check for ERRORS then reset
      console.log("[Process BID] - POST run", bidResult);
      setProcessingState(false);
      triggerUpdateAuction();
    };

    if (isProcessingBid) {
      processBid();
    }
  }, [isProcessingBid]);

  // the auctioned item has a slot for only 1 image
  const imageUrl = `${fileStoragePath}/${auction?.auction_id}/sample-item-1298792.jpg`;

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
  const auctionIsActive = auction.status === "ACTIVE" ? true : false;

  const handleBidClick = () => {
    if (isAuthenticated === true) {
      // Start bid process
      setProcessingState(true);
      // Lock current users page
      // This should happen after the INSERT works
      updateBidLock(true);
    }
  };

  return (
    <div className="flex h-2/4 flex-col gap-8 overflow-y-auto lg:flex-row">
      <ImageCarousel sources={[imageUrl, imageUrl]} />
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
            href={`/charities/${auction.charity_id}`}
            className="decoration-screaminGreen hover:underline"
          >
            {charityDetails?.name}
          </Link>
        </p>
        <p className="text-sm text-neutral-800">
          Auction Status: {auction.status}
        </p>
        <p className="text-sm text-neutral-800">
          is bid in process (locked): {isBidLocked ? "yes" : "no"}
        </p>
        {isBidLocked && (
          <p className="text-sm text-neutral-800">
            there is a bid in process currently "time left component here"
          </p>
        )}
        <p className="text-left text-base text-neutral-800">{numberOfBids}</p>

        <div
          className="block cursor-pointer border p-5"
          onClick={(e) => {
            e.preventDefault();
            handleBidClick();
          }}
        >
          <p>Test a Bid: {nextBidValue}</p>
        </div>

        {auctionIsActive ? (
          <>
            {/*
            <p className="text-base text-left text-neutral-800">
              {minutesLeft}:{formattedSecondsLeft} left before this auction ends
            </p>
            */}
            <PayPalDialog
              bidValue={nextBidValue}
              onClick={handleBidClick}
              auctionId={auction.auction_id}
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
  if (queryStatus.isLoading && queryStatus.isError === false) {
    return <QueryLoadingDisplay />;
  }

  // ReactQuery SubQuery or auctionId Validation -> error
  if (queryStatus.isLoading === false && hasError) {
    return <QueryErrorDisplay />;
  }

  if (auction === undefined) {
    return <QueryErrorDisplay />;
  }

  return (
    <div className="flex w-full flex-grow flex-col p-24">
      <AuctionDetails auction={auction} />
    </div>
  );
};
