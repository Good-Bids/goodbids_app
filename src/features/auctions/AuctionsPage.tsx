import Link from "next/link";
import { useAuctionsQuery } from "~/hooks/useAuction";

const LoadingDisplay = () => { }

const ErrorDisplay = () => {}

const AuctionsRowView = ({ auctions }) => {
  return (
    <ul>
      {auctions.map((auction) =>
        <li key={auction.auction_id} className="bg-neutral-50 p-2 text-neutral-800 border-b">
          <Link href={`/auctions/${auction.auction_id}`}>
            <p className="text-base font-medium">{auction.name}</p>
            <p className="text-sm">{auction.description}</p>
            <p className="text-sm text-neutral-400">{auction.charity_id}</p>
          </Link>
        </li>
      )}
    </ul>
  )
}

export const AuctionsPage = () => {

  const [query, updatePagination] = useAuctionsQuery();

  console.log("[PAGE: AuctionsPage.tsx] - ReactQuery Object", query.auctions);

  return (
    <div className="flex flex-col flex-grow w-full p-24">
      <h1 className="text-6xl text-black font-bold pb-4">Auctions</h1>
      <p className="text-xs text-neutral-800 bg-slate-50 pl-2 pt-2 pb-2 mb-2">query: status: {query.queryStatus.isLoading ? "loading" : "done"}</p>
      <div className="text-xs text-neutral-800 bg-slate-50 p-2 mb-2">Page:</div>
      <div className="flex flex-col flex-grow w-full">
        <AuctionsRowView auctions={query.auctions} />
      </div>
    </div>
  )
}

