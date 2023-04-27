/**
 * MyAuctionPage.tsx
 *
 * Next JS page/route
 * Displays the public list view of Auctions A user administers
 * in the Supabase postgres DB
 *
 * note: sub components should not be in this file - they are temp for testing the
 * backend integrations
 *
 */
import { useMyAuctionsQuery } from "~/hooks/useMyAuctions";
import { useUserQuery } from "~/hooks/useUser";
import Link from "next/link";
import { Auction } from "~/utils/types/auctions";

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
  return (
    <li className="flex flex-row border-b bg-neutral-50 text-neutral-800">
      <div className="flex flex-col justify-start p-2">
        <p className="pb-2 text-base font-medium">{auction.name}</p>
        <p className="pb-2 text-sm">{auction.description}</p>
        <Link
          className="self-start border p-2"
          href={`/auctions/admin/${auction.auction_id}`}
        >
          <p className="text-sm text-neutral-400">edit auction details</p>
        </Link>
      </div>
    </li>
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
export const MyAuctionsPage = () => {
  const userJWT = useUserQuery();
  const userId = userJWT.data?.id;

  if (userId === undefined) {
    return <QueryErrorDisplay />;
  }

  const [myAuctions, setMyAuctionQueryParameters] = useMyAuctionsQuery(
    userId,
    0,
    25
  );

  // ReactQuery Status -> loading
  if (myAuctions.queryStatus.isLoading && myAuctions.hasError === false) {
    return <QueryLoadingDisplay />;
  }

  // ReactQuery SubQuery or auctionId Validation -> error
  if (myAuctions.queryStatus.isLoading === false && myAuctions.hasError) {
    return <QueryErrorDisplay />;
  }

  if (myAuctions.auctions === undefined) {
    return <QueryErrorDisplay />;
  }

  return (
    <div className="flex w-full flex-grow flex-col p-24">
      <h1 className="pb-4 text-6xl font-bold text-black">Auctions</h1>

      {/* temp container for testing pagination windows via the ui + hook */}
      <div className="mb-2 bg-slate-50 p-2 text-xs text-neutral-800">Page:</div>

      {/* temp container for Auctions View module */}
      <div className="flex w-full flex-grow flex-col">
        <AuctionsListView auctions={myAuctions.auctions} />
      </div>
    </div>
  );
};
