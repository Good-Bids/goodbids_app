import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useCharityQuery } from "../../hooks/useCharity"
import { useAuctionsQuery } from "~/hooks/useAuction";
import { I_AuctionRowModel, I_AuctionRowCollection } from "~/utils/types/auctions";
import { I_CharityModel } from "~/utils/types/charities";
import Link from "next/link";

/**
 * QueryLoadingDisplay
 * not implemented
 */
const QueryLoadingDisplay = () => {
  return (
    <p>LOADING</p>
  )
}

/**
 * QueryErrorDisplay
 * not implemented
 */
const QueryErrorDisplay = () => {
  return (
    <p>ERROR</p>
  )
}

/**
 * AuctionListRowView
 * Component container for the AuctionModel display
 * separated for rendering/windowing and isolated updates in
 * the future ( if a row gets expensive can memo it ) 
 */
const AuctionListRowView = ({ auction }: I_AuctionRowModel) => {

  const setSelectedAuction = (auctionId: string) => {
    console.log("Clicked on Auction", auctionId);
  }

  return (
    <li className="bg-neutral-50 p-2 text-neutral-800 border-b">
      <p className="text-base font-medium">{auction.name}</p>
      <p className="text-xs font-regular text-neutral-500">auction is currently in: {auction.status} mode</p>
      <p className="text-sm pt-2 pb-2">{auction.description}</p>
      <div className="inline-block p2 border cursor-pointer" onClick={(e) => setSelectedAuction(auction.auction_id)}>
        <p className="text-sm p-2 select-none">view bids</p>
      </div>
    </li>
  )
}

/**
 * AuctionsMiniListView
 * Auctions Stubbed in with the full Auctions call
 * TODO: will 
 */
const AuctionsMiniListView = ({ auctions }: I_AuctionRowCollection) => {
  return (
    <div className="flex flex-col w-full pt-2">
      <ul className="flex flex-col flex-grow bg-slate-100">
        {auctions.map((auction) =>
          <AuctionListRowView key={auction.auction_id} auction={auction} />
        )}
      </ul>
    </div>
  )
}

/**
 * CharityDetails
 * TODO: defaults for all values
 * 
 * Note, since we do not collect the dateTime that the charity goes "Active", the
 * best we can do is say things like status since { created_at } is ""
 * 
 * TODO: 
 * <p>{charity.auctions.length} auctions run</p>
 * <p>${totalRaised} raised</p>
 * <p>Auction history</p>
 * 
 */
const CharityDetails = ({ charity }: I_CharityModel) => {

  const [auctionQuery, updateAuctionPagination] = useAuctionsQuery();

  const memberSinceDate = new Date(charity.created_at ?? '')
  const formattedMemberSinceDate = `${memberSinceDate.getMonth() + 1}/${memberSinceDate.getFullYear()}`

  let totalRaised = 0;
  let totalAuctions = 0;

  // Skip the loading displays here to show the component prior to auctions request
  // TODO: push down the auctionQuery.queryStatus into the child component to render
  //       loading/error/isEmpty - this would make it look like partials
  if (!auctionQuery.queryStatus.isLoading
    && !auctionQuery.queryStatus.isError
    && auctionQuery.auctions !== undefined) {
    totalRaised = 26000;
    totalAuctions = auctionQuery.auctions.length;
  }

  // Total Raised Math
  // const totalRaised = charity.auctions.reduce((prior, current) => prior += current.high_bid_value ?? 0, 0)

  return (
    <div className="flex flex-col flex-grow bg-slate-50">
      <div className="flex flex-col w-full p-2 border-b">
        <p className="text-3xl text-bottleGreen font-bold leading-none">{charity.name}</p>
        <p className="text-xs text-neutral-800 pt-1">status: {charity.status} since:{formattedMemberSinceDate}</p>
      </div>
      <div className="flex flex-row flex-grow flex-wrap w-full">
        {/* Left col */}
        <div className="flex flex-col flex-shrink-0 flex-grow w-full border-r-none md:w-1/2 md:border-r">
          <div className="p-2 border-b">
            <p className="text-xs text-neutral-800 pt-1">Registered Charity Number (USA): {charity.ein}</p>
            <p className="text-xs text-neutral-800 pt-1">contact: {charity.email}</p>
            <p className="text-xs text-neutral-800 pt-1">Auctions [{totalAuctions}] Raised [${totalRaised}]</p>
          </div>
          <AuctionsMiniListView auctions={auctionQuery.auctions} />
        </div>
        {/* Right col */}
        <div className="flex flex-col flex-shrink-0 flex-grow w-full md:w-1/2 p-2">
          {/* AUCTION BID HISTORY GOES HERE ( possibly )*/}
        </div>
      </div>
    </div>
  )
}

export const CharityDetailPage = () => {

  const router = useRouter()

  // https://nextjs.org/docs/api-reference/next/router always an object or empty object
  // but they have typed it as string | string[] | undefined
  const charityId = router.query?.charityId as string;
  const query = useCharityQuery(charityId);

  // These act as the "page getting data loaders"

  // ReactQuery Status -> loading 
  if (query.queryStatus.isLoading && query.queryStatus.isError === false) {
    return (
      <QueryLoadingDisplay />
    )
  }

  // ReactQuery SubQuery or auctionId Validation -> error
  if (query.queryStatus.isLoading === false && query.hasError) {
    return (
      <QueryErrorDisplay />
    )
  }

  if (query.charity === undefined) {
    return (
      <QueryErrorDisplay />
    )
  }

  return (
    < div className="flex flex-col flex-grow w-full p-24" >
      {/* temp container for testing hook query status and errors */}
      <p className="text-xs text-neutral-800 bg-slate-50 pl-2 pt-2 pb-2 mb-2">query: status: {query.queryStatus.isLoading ? "loading" : "done"}</p>

      {/* temp container for Charity Detail View module */}
      <div className="flex flex-col flex-grow w-full">
        <CharityDetails charity={query.charity} />
      </div>
    </div>
  )
}
