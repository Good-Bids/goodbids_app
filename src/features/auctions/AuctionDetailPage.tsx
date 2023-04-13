import { MouseEvent, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import {
  checkIsBidLocked, // note: async Supabase call not a hook
  addBidLock, // note: async Supabase call not a hook
  preflightValidateBidAmount, // note: not a hook Supabase call no RQ
  useAddBidToAuctionTable,
  useAddBidToBidTable,
  useAuctionQuery,
  useBidStatus,
} from "~/hooks/useAuction";
import { useMessageBus } from "~/contexts/Subscriptions";

import { useCharityQuery } from "~/hooks/useCharity";
import useInterval from "~/hooks/useInterval";
import { useUserQuery } from "~/hooks/useUser";
import Link from "next/link";
import { T_AuctionModelExtended } from "~/utils/types/auctions";
import { ImageCarousel } from "~/components/ImageCarousel";

/** TS for the paypal project is here importing only Types */
import { PayPalDialog } from "./PayPalDialog";

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
  // trigger component level state for processing a bid
  // can extend this to { isProcessingBid, bidStatus } for
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

  // Hooks for adding a bid to Good bids
  // -----------------------------------

  // 1. insert on bid table
  const [bidUpdateStatus, updateBidTable] = useAddBidToBidTable();
  // 2. update auction table with current values
  const [auctionUpdateStatus, updateAuctionTable] = useAddBidToAuctionTable();
  // 3. update bid table to "COMPLETED"
  const [bidStatusComplete, updateBidStatus] = useBidStatus();
  // END Bid hooks

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

  // Subscription listeners
  // Updates on if the Channel has been init or a new message returns
  // should apply isAuthenticated here
  useEffect(() => {
    if (!subscription.mbus.isInitialized) return;

    if (subscription.mbus.lastBidLockMessage) {
      let eventTriggered = subscription.mbus.lastBidLockMessage?.eventType;
      let filterOnAuctionId = "n/a";

      if (eventTriggered === "INSERT") {
        filterOnAuctionId =
          subscription.mbus.lastBidLockMessage?.new.auction_id;
      }
      if (eventTriggered === "DELETE") {
        filterOnAuctionId =
          subscription.mbus.lastBidLockMessage?.old.auction_id;
      }

      if (filterOnAuctionId === auction.auction_id) {
        let dateTime = subscription.mbus.lastBidLockMessage?.commit_timestamp;
        let errors = subscription.mbus.lastBidLockMessage?.errors;
        let ttl = subscription.mbus.lastBidLockMessage?.new.ttl;

        // Inserts
        if (subscription.mbus.lastBidLockMessage?.eventType === "INSERT") {
          console.log(
            "[Bid Lock] - A bid lock has been registered",
            dateTime,
            " ttl(sec):" + ttl,
            errors
          );
        }

        // Deletes
        if (subscription.mbus.lastBidLockMessage?.eventType === "DELETE") {
          console.log(
            "[Bid Lock] - A bid lock has been removed",
            dateTime,
            errors
          );
          updateBidLock((prev) => {
            return false;
          });
        }
      }
    }
  }, [
    auction.auction_id,
    subscription.mbus.isInitialized,
    subscription.mbus.lastBidLockMessage,
  ]);

  // should apply isAuthenticated here
  useEffect(() => {
    const checkForLock = async () => {
      const hasLockResult = await checkIsBidLocked(auction.auction_id);
      const hasLock = hasLockResult.bidStatus.length > 0 ? true : false;
      console.log(
        "[Bid Lock] - Checking on page load for locks",
        hasLockResult,
        hasLock
      );

      if (hasLock === true) {
        updateBidLock(true);
      }
    };

    checkForLock();
    return () => {};
  }, [auction.auction_id]);

  // Note for now I wrapped these in a useEffect
  // Its just as easy to remove the guts of it
  // keeping the skeleton in the useEffect so its a single call
  // moving the faux state machine outside the component
  useEffect(() => {
    const processBid = async () => {
      // Check preflight
      const preFlightCheckResult = await preflightValidateBidAmount(
        auction.auction_id,
        auction.increment,
        nextBidValue
      );
      console.log("[Process BID] - PreFlight Bid Check ", preFlightCheckResult);

      // check error
      // If not valid then there was a race condition and the bid needs to refresh
      // the bid value - this will be hit a lot on active auctions
      // Show Sorry -> Missed your window, would you like to update your bid

      // Start the process
      const updateBidTableResults = await updateBidTable({
        auctionId: auction.auction_id,
        charityId: auction.charity_id,
        userId: userJWT.data?.id ?? "", // <- should not ever be undefined after auth
        amount: nextBidValue,
      });
      console.log(
        "[Process BID] - Add bid to bid table as PENDING ",
        updateBidTableResults
      );

      // check error
      // If there was a insert to bid table in DB the error it will manifest here
      // stop processing bid and reset component state
      // Show Sorry -> Network / System error

      // Update new bid value in auction table
      const updateAuctionResults = await updateAuctionTable({
        auctionId: auction.auction_id,
        newBidValue: nextBidValue,
      });
      console.log(
        "[Process BID] - Update the auction table ",
        updateAuctionResults
      );

      // check error
      // If there was a update to auction table in DB the error it will manifest here
      // stop processing bid and reset component state - can not RollBack in the db
      // there will be orphaned "PENDING" bids in the DB
      // Show Sorry -> Network / System error

      // Update bid table to Complete status
      const bidCompletedResults = await updateBidStatus({
        bidId: updateBidTableResults.bid[0].bid_id,
      });
      console.log(
        "[Process BID] - Update the auction table ",
        bidCompletedResults
      );

      // check error
      // If there was a update to bid table in DB error it will manifest here
      // this call is at the end of the bid, it changes the bid table status to
      // COMPLETE instead of PENDING - What to do in this situation -
      // the bid is added and the auction table has a new current bid value
      // already reflected in the component and for everyone.
      // It could be the result of a network error. Perhaps there is way to
      // signal the site admin of failure and re-connect the bid status manually

      // Finally re-enable the component state
      setProcessingState(false);
      // Show Happy face -> Bid was completed
    };

    if (isProcessingBid) {
      processBid();
    }

    return () => {
      // See if Supabase support cancel request so we can clean up
    };
  }, [isProcessingBid]);

  // the auctioned item has a slot for only 1 image
  const imageUrl = `${fileStoragePath}/${auction?.auction_id}/sample-item-1298792.jpg`;

  const handleProcessBidClick = (e: MouseEvent) => {
    e.preventDefault();
    if (isAuthenticated === true) {
      setProcessingState(true);
    } else {
      // redirect to login
    }
  };

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

  const { charity: charityDetails } = useCharityQuery(auction.charity_id);

  // temp this here for now
  const auctionIsActive = auction.status === "ACTIVE" ? true : false;

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
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
            if (isAuthenticated === true) {
              // Send insert msg to Bid Lock table
              // Which in turn also broadcasts the change to everyone else
              addBidLock(auction.auction_id);
              // Lock current users page
              // This should happen after the INSERT works
              updateBidLock(true);
            }
          }}
        >
          <p>test lock</p>
        </div>

        {auctionIsActive ? (
          <>
            {/*
            <p className="text-base text-left text-neutral-800">
              {minutesLeft}:{formattedSecondsLeft} left before this auction ends
            </p>
            */}
            <PayPalDialog bidValue={nextBidValue} />
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
