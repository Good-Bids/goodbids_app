import { useState, useEffect } from "react";

// Routing and links
import { useRouter } from "next/router";
import Link from "next/link";

// listener for db onChange
import { useMessageBus } from "~/contexts/Subscriptions";

// React Query hooks
import { useAuctionQuery, useUpdateAuctionCache } from "~/hooks/useAuction";
import { useCharityQuery } from "~/hooks/useCharity";
import { useUserQuery } from "~/hooks/useUser";

// Components
import { PayPalDialog } from "./PayPalDialog";
import { ImageCarousel } from "~/components/ImageCarousel";
import useInterval from "~/hooks/useInterval";
import Image from "next/image";

import {
  CreateOrderData,
  CreateOrderActions,
  OnApproveData,
  OnApproveActions,
  OnCancelledActions,
} from "@paypal/paypal-js";
import { PayPalButtons } from "@paypal/react-paypal-js";

// Types
import { T_AuctionModelExtended } from "~/utils/types/auctions";
interface AuctionDetailsProps {
  auction: T_AuctionModelExtended;
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

const AuctionDetails = ({ auction }: AuctionDetailsProps) => {
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
            "[MSG bus] - Update from bid_state table adding local LOCK"
          );
          updateBidLock(true);
        }
        if (subscription.mbus.lastBidLockMessage.eventType === "DELETE") {
          console.log(
            "[MSG bus] - Update from bid_state table removing local LOCK"
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
          // Even tho we can trigger an update on an auction change
          // this will also trigger on change of DB auction halfway in the bid
          // process ... but we need it if this is not the bidding client
          // triggerUpdateAuction();
        }
      }
    }
  }, [
    auction.auction_id,
    subscription.mbus.isInitialized,
    subscription.mbus.lastBidLockMessage,
    subscription.mbus.lastAuctionUpdateMessage,
  ]);

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


  // paypal specific method
  const handleCreateOrder = async (
    data: CreateOrderData,
    actions: CreateOrderActions
  ) => {
    // updatePaypalState("CREATE_ORDER");
    return await actions.order?.create({
      purchase_units: [
        {
          amount: {
            value: nextBidValue.toString(10),
          },
        },
      ],
    });
  };

  // paypal specific method
  const handleApprove = async (
    data: OnApproveData,
    actions: OnApproveActions
  ) => {
    // updatePaypalState("COMPLETED");
    const details = await actions.order?.capture();
    // const name = details?.payer?.name?.given_name ?? "an unknown GoodBidder"; // because capture() can be promise | undefined
    console.log("PP: Completed triggered", data, details);
  };

  // paypal specific method
  const handleCancel = async (
    data: Record<string, unknown>,
    actions: OnCancelledActions
  ) => {
    console.log("PP: cancel triggered", data);
  };

  // paypal specific method
  const handleError = async (error: Record<string, unknown>) => {
    console.log("PP: error triggered", error);
  };

  return (
    <div className="flex flex-col gap-8 overflow-y-auto h-2/4 lg:flex-row">
      <ImageCarousel sources={[imageUrl, imageUrl]} />
      <div
        className="flex flex-col items-start justify-start w-full gap-4 p-2 lg:w-1/3"
        id="auction-info-container"
      >
        <p className="text-3xl font-black text-black">{auction.name}</p>
        <p className="text-base text-left text-neutral-800">
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
        <p className="text-base text-left text-neutral-800">{numberOfBids}</p>

        {auctionIsActive ? (
          <>
            {/*
            <p className="text-base text-left text-neutral-800">
              {minutesLeft}:{formattedSecondsLeft} left before this auction ends
            </p>
            <PayPalDialog
              bidValue={nextBidValue}
              auction={auction}
            />
            */}
            <div className="flex flex-col">
              <PayPalButtons
                createOrder={handleCreateOrder}
                onApprove={handleApprove}
                onCancel={handleCancel}
                onError={handleError}
              />
            </div>
          </>
        ) : (
          <p className="font-black text-left text-md text-neutral-800">
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
    <div className="flex flex-col flex-grow w-full p-24">
      <AuctionDetails auction={auction} />
    </div>
  );
};
