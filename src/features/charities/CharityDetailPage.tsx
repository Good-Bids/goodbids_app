import { useRouter } from "next/router";
import { useCharityQuery } from "../../hooks/useCharity"
import { I_CharityModel } from "~/utils/types/charities";

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
 * AuctionsListView
 * Will update this method after the auction hooks file gets commited
 */
const AuctionsListView = ({ charityId }: string) => {

  {/* <ol>{charity.auctions.map(auction => (<li key={auction.auction_id}><h4>{auction.name}</h4><p>{auction.created_at}</p></li>))}</ol> */ }

  return (
    <div className="flex flex-col w-full pt-2">
      <p className="text-xs text-neutral-800 pt-1">TMP AUCTIONS COLLECTION HERE</p>
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

  // const totalRaised = charity.auctions.reduce((prior, current) => prior += current.high_bid_value ?? 0, 0)

  const memberSinceDate = new Date(charity.created_at ?? '')
  const formattedMemberSinceDate = `${memberSinceDate.getMonth() + 1}/${memberSinceDate.getFullYear()}`

  return (
    <div className="flex flex-col flex-grow bg-slate-50">
      <div className="flex flex-col w-full p-2 border-b">
        <p className="text-3xl text-bottleGreen font-bold leading-none">{charity.name}</p>
        <p className="text-xs text-neutral-800 pt-1">status: {charity.status} since:{formattedMemberSinceDate}</p>
      </div>
      <div className="flex flex-row flex-grow flex-wrap w-full">
        {/* Left col */}
        <div className="flex flex-col flex-shrink-0 flex-grow w-full border-r-none md:w-1/2 md:border-r p-2">
          <p className="text-xs text-neutral-800 pt-1">Registered Charity Number (USA): {charity.ein}</p>
          <p className="text-xs text-neutral-800 pt-1">contact: {charity.email}</p>
          <p className="text-xs text-neutral-800 pt-1">Auctions [1]</p>
          <AuctionsListView charityId={charity.charity_id} />
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
