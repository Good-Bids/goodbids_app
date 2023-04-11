/**
 * AuctionP{age.tsx
 *
 * Next JS page/route
 * Displays the public list view of Auctions available
 * in the Supabase postgres DB
 *
 * If the user has Authenticated the bid buttons should be enabled
 * as well as having the ability to soft( realtime update values for bids )
 * Public should get static page
 *
 * Features req:
 * - Pagination controller
 * - Link to Auction detail page via NextJS + Auction Id
 * - Bid now button disabled/active depending on user Auth+Session
 * - Bid values ( stored in the auctions table ) potentially soft realtime
 *
 * note: sub components should not be in this file - they are temp for testing the
 * backend integrations
 *
 */
import { DateTime } from "luxon"; // TODO: move this into utils/date or something like that
import { useAuctionsQuery } from "~/hooks/useAuction";
import {
  I_AuctionCollection,
  T_AuctionBid,
  T_AuctionModel,
  T_AuctionModelExtended,
} from "~/utils/types/auctions";
import { PayPalDialog } from "./PayPalDialog";
import Link from "next/link";

/**
 * QueryLoadingDisplay
 * not implemented
 */
const QueryLoadingDisplay = () => {};

/**
 * QueryErrorDisplay
 * not implemented
 */
const QueryErrorDisplay = () => {};

/**
 * Bids Utilities
 * In case of a hydrated Auction model the bids are returned by auction_id
 * but not sorted ( all bids against this auction id are returned )
 *
 * Note: sorting with Luxon objects, not the best way to do this
 * best way for non-db sort would be timestamps (utc) saved in the db in an extra
 * field along with full DateTime if needed.
 *
 */
const getLatestBid = (
  bids: T_AuctionBid | T_AuctionBid[] | null
): T_AuctionBid | undefined => {
  if (bids !== null) {
    if (Array.isArray(bids)) {
      let clonedBids = structuredClone(bids) as any;
      clonedBids.sort((objA: T_AuctionBid, objB: T_AuctionBid) => {
        let dateA = DateTime.fromISO(objA.created_at);
        let dateB = DateTime.fromISO(objB.created_at);
        if (dateA > dateB) return -1;
        if (dateA < dateB) return 1;
        return 0;
      });
      return clonedBids[0];
    } else return bids;
  } else return undefined;
};

/**
 * Tmp bid is disabled button
 */
const DisabledBidButton = () => {
  return (
    <div className="inline-block border p-2 opacity-50">
      <p className="select-none text-sm text-neutral-400">bidding is n/a</p>
    </div>
  );
};

/**
 * AuctionListRowView
 * Component container for the AuctionModel display
 * separated for rendering/windowing and isolated updates in
 * the future ( if a row gets expensive can memo it )
 *
 */

interface AuctionListRowViewProps {
  auction: T_AuctionModelExtended;
}

export const AuctionListRowView = ({ auction }: AuctionListRowViewProps) => {
  const currentHighBid: number = auction.high_bid_value ?? 0;
  const nextBidValue: number = currentHighBid + auction.increment;
  const lastBid = getLatestBid(auction.bids);

  // by default
  let isBiddingAvailable: boolean = false;
  let timeDiffAsSeconds: number = 0;

  // note: top_bid_duration can be null - from ts
  // auction.top_bid_duration > Date.now() - most recent bid
  if (lastBid !== undefined) {
    let topBidDuration = auction.top_bid_duration ?? 0;
    let currentWallClock = DateTime.local();
    let lastBidDateTime = DateTime.fromISO(lastBid.created_at);
    let timeDiff = currentWallClock.diff(lastBidDateTime, "seconds");
    timeDiffAsSeconds = timeDiff.toObject().seconds ?? 0;

    if (topBidDuration > timeDiffAsSeconds) {
      isBiddingAvailable = true;
    }
  }

  return (
    <li className="flex flex-row border-b bg-neutral-50 text-neutral-800">
      <div className="flex flex-col justify-start p-2">
        <p className="pb-2 text-base font-medium">{auction.name}</p>
        <p className="pb-2 text-sm">{auction.description}</p>
        <Link
          className="self-start border p-2"
          href={`/auctions/${auction.auction_id}`}
        >
          <p className="text-sm text-neutral-400">view auction details</p>
        </Link>
      </div>
      <div className="flex w-64 flex-shrink-0 flex-col items-center justify-center bg-slate-50 p-4">
        {isBiddingAvailable ? (
          <PayPalDialog bidValue={nextBidValue} />
        ) : (
          <DisabledBidButton />
        )}
        <p className="pt-2 text-xs text-neutral-400">
          t-diff: {timeDiffAsSeconds << 0}
        </p>
      </div>
    </li>
  );
};

/**
 * AuctionsListView
 * Container for a List view of Auctions available
 * ie: another one would be tileView or maybe a cardView
 */
const AuctionsListView = ({ auctions }: I_AuctionCollection) => {
  return (
    <ul className="flex flex-grow flex-col bg-slate-100">
      {auctions.map((auction) => (
        <AuctionListRowView key={auction.auction_id} auction={auction} />
      ))}
    </ul>
  );
};

/**
 * AuctionPage
 * Main functional component responsible for rendering layout
 */
export const AuctionsPage = () => {
  const [query, setQueryParameters] = useAuctionsQuery("ACTIVE", 0, 25);

  return (
    <div className="flex w-full flex-grow flex-col p-24">
      <h1 className="pb-4 text-6xl font-bold text-black">Auctions</h1>

      {/* temp container for testing hook query status and errors */}
      <p className="mb-2 bg-slate-50 pb-2 pl-2 pt-2 text-xs text-neutral-800">
        query: status: {query.queryStatus.isLoading ? "loading" : "done"}
      </p>

      {/* temp container for testing pagination windows via the ui + hook */}
      <div className="mb-2 bg-slate-50 p-2 text-xs text-neutral-800">Page:</div>

      {/* temp container for Auctions View module */}
      <div className="flex w-full flex-grow flex-col">
        <AuctionsListView auctions={query.auctions} />
      </div>
    </div>
  );
};
