import { MouseEvent, useState } from "react";
import { useRouter } from "next/router";
import {
  useAuctionQuery,
  preflightValidateBidAmount,
  useAddBidToAuctionTable,
  useAddBidToBidTable,
  useBidStatus
} from "~/hooks/useAuction";
import { useUserQuery } from "~/hooks/useUser";
import { I_AuctionModel } from "~/utils/types/auctions";
import Image from "next/image";
import Link from "next/link";
import { DateTime } from "luxon";

/** TS for the paypal project is here importing only Types */
import { PayPalDialog } from "./PayPalDialog";

// can also use the react-libs types
// import { OrderResponseBody } from "@paypal/paypal-js/types/apis/orders";
// import { CreateOrderActions } from "@paypal/paypal-js/types/components/buttons";

interface I_AuctionDetails extends I_AuctionModel {
  lastUpdate: Date | null;
}

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

const handleBid = async (
  e: MouseEvent,
  auction: I_AuctionModel,
  userId: string,
  nextBidValue: number,
  updateBidTable: Function,
  updateAuctionTable: Function,
  updateBidStatus: Function
) => {
  e.preventDefault();

  // 1. preflight check
  const preFlightCheckResult = await preflightValidateBidAmount(
    auction.auction_id,
    auction.increment,
    nextBidValue
  );
  console.log(
    "[Handle Bid] PREFLIGHT isValidAmount: ",
    preFlightCheckResult.bidAmountValid
  );

  if (preFlightCheckResult.bidAmountValid === true) {
    // 2. update Bid table with data and set
    //    to "PENDING"
    const updateBidTableResults = await updateBidTable({
      auctionId: auction.auction_id,
      charityId: auction.charity_id,
      userId: userId,
      amount: nextBidValue,
    });
    console.log("[Handle Bid] UPDATE Bid Table: ", updateBidTableResults);

    // 3. update the Auction table with correct current bid
    const updateAuctionResults = await updateAuctionTable({
      auctionId: auction.auction_id,
      newBidValue: nextBidValue,
    });
    console.log("[Handle Bid] UPDATE Auction Table: ", updateAuctionResults);

    // 4. Update bid table with COMPLETED state
    const bidCompletedResults = await updateBidStatus({
      bidId: updateBidTableResults.bid[0].bid_id
    })
    console.log("[Handle Bid] UPDATE Bid Table Status: ", updateBidTableResults.bid, updateBidTableResults.bid[0].bid_id, bidCompletedResults);
  } else {
    // Race condition met: the current Bid is less than whats expected
    console.log(
      "[Handle Bid] PREFLIGHT isValidAmount: ",
      preFlightCheckResult.bidAmountValid
    );
  }
};

/**
 * AuctionDetails
 *
 * Note: lastUpdate comes from ReactQuery and is a JS Date obj not
 * luxon. It is already localized
 *
 * TODO: defaults for all values
 */
const AuctionDetails = ({ auction, lastUpdate }: I_AuctionDetails) => {

  // trigger component level state for processing a bid
  const [isProcessingBid, setProcessingState] = useState(false);

  // gets the auth id from the jwt
  const userJWT = useUserQuery();
  // assuming that the hook will cause re-render and logout automatically
  const isAuthenticated: boolean = userJWT.data?.role === "authenticated" ?? false;

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
  const isInitialBid: boolean = ( auction?.bids?.length > 0 ) ? false : true;
  const totalBids: number = auction?.bids?.length || 0;

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

  // the auctioned item has a slot for only 1 image
  const imageUrl = `${fileStoragePath}/${auction?.auction_id}/sample-item-1298792.jpg`;

  return (
    <div className="flex flex-col flex-grow bg-slate-50">
      <div className="flex flex-col w-full p-2 border-b">
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
      <div className="flex flex-row flex-grow">
        <div className="flex flex-col w-96">
          <p className="pt-2 pb-1 pl-2 text-sm text-neutral-800">
            status: {auction.status}
          </p>
          <div className="p-2 overflow-hidden">
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
        <div className="flex flex-col items-center justify-center w-3/4 p-2">
          <p className="text-3xl font-bold text-black">
            Current High Bid: ${currentHighBid}
          </p>
          <p className="text-base text-center text-neutral-800">
            {auction.description}
          </p>
          <div
            className="inline-block p-2 mt-8 mb-4 border opacity-50 cursor-pointer"
            onClick={async (e) => {
              if (isAuthenticated === true) {
                handleBid(
                  e,
                  auction,
                  userJWT.data?.id,
                  nextBidValue,
                  updateBidTable,
                  updateAuctionTable,
                  updateBidStatus
                );
              } else {
                // Do redirect
                // Requires to also pass along the auctionId so that 
                // on Login the redirect can happen to where the user left 
                // off
              }
            }}
          >
            <p className="text-sm select-none text-neutral-400">
              temp bid button
            </p>
          </div>
          <p className="mb-8 text-xs text-center text-neutral-400">
            opening bid {auction.opening_bid_value} · increment by{" "}
            {auction.increment} · current bid {currentHighBid} · next bid{" "}
            {currentHighBid + auction.increment} · total bids {totalBids}
          </p>

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
  const query = useAuctionQuery(auctionId);

  // ReactQuery Status -> loading
  if (query.queryStatus.isLoading && query.queryStatus.isError === false) {
    return <QueryLoadingDisplay />;
  }

  // ReactQuery SubQuery or auctionId Validation -> error
  if (query.queryStatus.isLoading === false && query.hasError) {
    return <QueryErrorDisplay />;
  }

  if (query.auction === undefined) {
    return <QueryErrorDisplay />;
  }

  return (
    <div className="flex flex-col flex-grow w-full p-24">
      {/* temp container for testing hook query status and errors */}
      <p className="pt-2 pb-2 pl-2 mb-2 text-xs bg-slate-50 text-neutral-800">
        query: status: {query.queryStatus.isLoading ? "loading" : "done"}
      </p>

      {/* temp container for Auction Detail View module */}
      <div className="flex flex-col flex-grow w-full">
        <AuctionDetails
          auction={query.auction}
          lastUpdate={query.queryStatus.updatedAt}
        />
      </div>
    </div>
  );
};
