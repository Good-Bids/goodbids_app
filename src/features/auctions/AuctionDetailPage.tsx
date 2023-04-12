import { MouseEvent, useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  preflightValidateBidAmount, // note: not a hook Supabase call no RQ
  useAuctionQuery,
  useAddBidToAuctionTable,
  useAddBidToBidTable,
  useBidStatus,
} from "~/hooks/useAuction";
import { useUserQuery } from "~/hooks/useUser";
import Image from "next/image";
import Link from "next/link";

/** TS for the paypal project is here importing only Types */
import { PayPalDialog } from "./PayPalDialog";
import { T_AuctionModelExtended } from "~/utils/types/auctions";

// can also use the react-libs types
// import { OrderResponseBody } from "@paypal/paypal-js/types/apis/orders";
// import { CreateOrderActions } from "@paypal/paypal-js/types/components/buttons";

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

  // gets the auth id from the jwt
  const userJWT = useUserQuery();
  // assuming that the hook will cause re-render and logout automatically
  const isAuthenticated: boolean =
    userJWT.data?.role === "authenticated" ?? false;

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

  return (
    <div className="flex flex-grow flex-col bg-slate-50">
      <div className="flex w-full flex-col border-b p-2">
        <p className="text-3xl font-bold text-black">{auction.name}</p>
        <p className="text-xs text-neutral-800">
          charity name and link {"-> "}
          <Link
            href={`/charities/${auction.charity_id}`}
            className="decoration-screaminGreen hover:underline"
          >
            {auction.charity_id}
          </Link>
        </p>
      </div>
      <div className="flex flex-grow flex-row">
        <div className="flex w-96 flex-col">
          <p className="pb-1 pl-2 pt-2 text-sm text-neutral-800">
            status: {auction.status}
          </p>
          <div className="overflow-hidden p-2">
            <Image
              className="w-full"
              src={imageUrl}
              alt={"item to be won"}
              priority={true}
              width={240}
              height={240}
            />
          </div>
        </div>
        <div className="flex w-3/4 flex-col items-center justify-center p-2">
          <p className="text-3xl font-bold text-black">
            Current High Bid: ${currentHighBid}
          </p>
          <p className="text-center text-base text-neutral-800">
            {auction.description}
          </p>
          <div
            className="mb-4 mt-8 inline-block cursor-pointer border p-2 opacity-50"
            onClick={(e) => {
              handleProcessBidClick(e);
            }}
          >
            <p className="select-none text-sm text-neutral-400">
              temp bid button
            </p>
          </div>
          <PayPalDialog bidValue={nextBidValue} />
        </div>
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
      {/* temp container for testing hook query status and errors */}
      <p className="mb-2 bg-slate-50 pb-2 pl-2 pt-2 text-xs text-neutral-800">
        query: status: {queryStatus.isLoading ? "loading" : "done"}
      </p>

      {/* temp container for Auction Detail View module */}
      <div className="flex w-full flex-grow flex-col">
        <AuctionDetails auction={auction} />
      </div>
    </div>
  );
};
