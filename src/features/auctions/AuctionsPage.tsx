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
import { useAuctionsQuery } from "~/hooks/useAuction";
import { I_AuctionRowCollection, I_AuctionRowModel } from "~/utils/types/auctions";
import Link from "next/link";

/**
 * QueryLoadingDisplay
 * not implemented
 */
const QueryLoadingDisplay = () => { }

/**
 * QueryErrorDisplay
 * not implemented
 */
const QueryErrorDisplay = () => { }

/**
 * AuctionListRowView
 * Component container for the AuctionModel display
 * separated for rendering/windowing and isolated updates in
 * the future ( if a row gets expensive can memo it ) 
 */
const AuctionListRowView = ({ auction }: I_AuctionRowModel) => {
  return (
    <li className="bg-neutral-50 p-2 text-neutral-800 border-b">
      <Link href={`/auctions/${auction.auction_id}`}>
        <p className="text-base font-medium">{auction.name}</p>
        <p className="text-sm">{auction.description}</p>
        <p className="text-sm text-neutral-400">{auction.charity_id}</p>
      </Link>
    </li>
  )
}

/**
 * AuctionsListView
 * Container for a List view of Auctions available
 * ie: another one would be tileView or maybe a cardView
 */
const AuctionsListView = ({ auctions }: I_AuctionRowCollection) => {
  return (
    <ul className="flex flex-col flex-grow bg-slate-100">
      {auctions.map((auction) =>
        <AuctionListRowView key={auction.auction_id} auction={auction} />
      )}
    </ul>
  )
}

/**
 * AuctionPage
 * Main functional component responsible for rendering layout
 */
export const AuctionsPage = () => {

  const [query, updatePagination] = useAuctionsQuery();

  return (
    <div className="flex flex-col flex-grow w-full p-24">
      <h1 className="text-6xl text-black font-bold pb-4">Auctions</h1>

      {/* temp container for testing hook query status and errors */}
      <p className="text-xs text-neutral-800 bg-slate-50 pl-2 pt-2 pb-2 mb-2">query: status: {query.queryStatus.isLoading ? "loading" : "done"}</p>

      {/* temp container for testing pagination windows via the ui + hook */}
      <div className="text-xs text-neutral-800 bg-slate-50 p-2 mb-2">Page:</div>

      {/* temp container for Auctions View module */}
      <div className="flex flex-col flex-grow w-full">
        <AuctionsListView auctions={query.auctions} />
      </div>

    </div>
  )
}

