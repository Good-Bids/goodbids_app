import { useRouter } from "next/router";
import { useAuctionQuery } from "~/hooks/useAuction";
import { I_AuctionRowModel } from "~/utils/types/auctions";
import Image from 'next/image'
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
const fileStoragePath: string = "https://imjsqwufoypzctthvxmr.supabase.co/storage/v1/object/public/auction-assets";

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
 * AuctionDetails
 * TODO: defaults for all values
 */
const AuctionDetails = ({ auction }: I_AuctionRowModel) => {

  const currentHighBid = auction.high_bid_value ?? 0
  const nextBidValue = currentHighBid + auction.increment
  const imageUrl = `${fileStoragePath}/${auction?.auction_id}/sample-item-1298792.jpg`

  return (
    <div className="flex flex-col flex-grow bg-slate-50">
      <div className="flex flex-col w-full p-2 border-b">
        <p className="text-3xl text-black font-bold">{auction.name}</p>
        <p className="text-xs text-neutral-800">charity name and link {'-> '}
          <Link href={`/charities/${auction.charity_id}`} className="hover:underline decoration-screaminGreen">
            {auction.charity_id}
          </Link>
        </p>
      </div>
      <div className="flex flex-row flex-grow">
        <div className="flex flex-col w-96">
          <p className="text-sm text-neutral-800 pl-2 pt-2 pb-1">status: {auction.status}</p>
          <div className="overflow-hidden p-2">
            <Image className="w-full" src={imageUrl} alt={'item to be won'} priority={true} width={240} height={240} />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-3/4 p-2">
          <p className="text-3xl text-black font-bold">Current High Bid: ${currentHighBid}</p>
          <p className="text-base text-center text-neutral-800">{auction.description}</p>
          <PayPalDialog bidValue={nextBidValue} />
        </div>
      </div>
    </div>
  )
}

export const AuctionDetailPage = () => {

  const router = useRouter()

  // https://nextjs.org/docs/api-reference/next/router always an object or empty object
  // but they have typed it as string | string[] | undefined
  const auctionId = router.query?.auctionId as string;
  const query = useAuctionQuery(auctionId);

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

  if (query.auction === undefined) {
    return (
      <QueryErrorDisplay />
    )
  }

  return (
    < div className="flex flex-col flex-grow w-full p-24" >
      {/* temp container for testing hook query status and errors */}
      <p className="text-xs text-neutral-800 bg-slate-50 pl-2 pt-2 pb-2 mb-2">query: status: {query.queryStatus.isLoading ? "loading" : "done"}</p>

      {/* temp container for Auction Detail View module */}
      <div className="flex flex-col flex-grow w-full">
        <AuctionDetails auction={query.auction} />
      </div>

    </div>
  )
}