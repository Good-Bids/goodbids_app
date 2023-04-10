import { MouseEvent } from 'react';
import { useRouter } from "next/router";
import { useAuctionQuery } from "~/hooks/useAuction";
import { I_AuctionModel } from "~/utils/types/auctions";
import Image from "next/image";
import Link from "next/link";

/** TS for the paypal project is here importing only Types */
import { PayPalDialog } from "./PayPalDialog";

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

const handleBid = (e: MouseEvent, currentHighBid: number) => {
  e.preventDefault();
  console.log("bid for auction", currentHighBid);
};

/**
 * AuctionDetails
 * TODO: defaults for all values
 */
const AuctionDetails = ({ auction }: I_AuctionModel) => {

  // set defaults
  let isInitialBid = false;
  let currentHighBid = 0;
  let nextBidValue = 0;

  // the nextBidValue depends on if its the initial bid or not
  if(auction.bids !== undefined) {
    isInitialBid = auction.bids.length > 0 ? true : false;
  }

  if(isInitialBid) {
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
            className="inline-block p-2 border opacity-50"
            onClick={(e) => {
              handleBid(e, currentHighBid);
            }}
          >
            <p className="text-sm select-none text-neutral-400">
              bidding is n/a
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
        <AuctionDetails auction={query.auction} />
      </div>
    </div>
  );
};
