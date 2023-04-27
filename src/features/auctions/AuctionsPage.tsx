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
import React, { useState } from "react";
import { DateTime } from "luxon"; // TODO: move this into utils/date or something like that
import { useAuctionsQuery, useBidsByAuction } from "~/hooks/useAuction";
import { type Bid, type Auction } from "~/utils/types/auctions";
import Link from "next/link";
import { AuctionTimer } from "./AuctionTimer";

/**
 * QueryLoadingDisplay
 * not implemented
 */
// const QueryLoadingDisplay = () => {};

/**
 * QueryErrorDisplay
 * not implemented
 */
// const QueryErrorDisplay = () => {};

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
const getLatestBid = (bids: Bid[]): Bid | undefined => {
  if (bids !== null) {
    if (Array.isArray(bids)) {
      const clonedBids = structuredClone(bids) as any;
      clonedBids.sort((objA: Bid, objB: Bid) => {
        const dateA = DateTime.fromISO(objA.created_at);
        const dateB = DateTime.fromISO(objB.created_at);
        if (dateA > dateB) return -1;
        if (dateA < dateB) return 1;
        return 0;
      });
      return clonedBids[0];
    } else return bids;
  } else return undefined;
};

/**
 * AuctionListRowView
 * Component container for the AuctionModel display
 * separated for rendering/windowing and isolated updates in
 * the future ( if a row gets expensive can memo it )
 *
 */

interface AuctionListRowViewProps {
  auction: Auction;
}

export const AuctionListRowView = ({ auction }: AuctionListRowViewProps) => {
  const { data: bids } = useBidsByAuction(auction.auction_id);
  console.log(bids);
  const lastBid = bids ? getLatestBid(bids) : undefined;

  // by default
  let timeDiffAsSeconds: number = 0;

  // note: top_bid_duration can be null - from ts
  // auction.top_bid_duration > Date.now() - most recent bid
  if (lastBid !== undefined) {
    const currentWallClock = DateTime.local();
    const lastBidDateTime = DateTime.fromISO(lastBid.created_at);
    const timeDiff = currentWallClock.diff(lastBidDateTime, "seconds");
    timeDiffAsSeconds = timeDiff.toObject().seconds ?? 0;
  }

  const auctionId: string = auction.auction_id;

  const [auctionIsActive, setAuctionIsActive] = useState(false);

  return (
    <Link
      className="w-full self-start border p-2"
      href={`/auctions/${auctionId}`}
    >
      <li className="flex flex-row justify-between border-b bg-neutral-50 text-neutral-800">
        <div className="flex flex-col justify-start p-2">
          <p className="pb-2 text-base font-medium">{auction.name}</p>
          <p className="pb-2 text-sm">{auction.description}</p>
        </div>
        <div className="flex w-64 flex-shrink-0 flex-col items-center justify-center bg-slate-50 p-4">
          <AuctionTimer
            auction={auction}
            auctionIsActive={auctionIsActive}
            onTimeUpdate={setAuctionIsActive}
          />
        </div>
      </li>
    </Link>
  );
};

/**
 * AuctionsListView
 * Container for a List view of Auctions available
 * ie: another one would be tileView or maybe a cardView
 */
const AuctionsListView = ({ auctions }: { auctions: Auction[] }) => {
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
  const { data: auctions } = useAuctionsQuery({
    auctionStatus: "ACTIVE",
    windowStart: 0,
    windowLength: 25,
  });

  return (
    <div className="flex w-full flex-grow flex-col p-24">
      <h1 className="pb-4 text-6xl font-bold text-black">Auctions</h1>
      <div className="flex w-full flex-grow flex-col">
        {auctions && <AuctionsListView auctions={auctions} />}
      </div>
    </div>
  );
};
