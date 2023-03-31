import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuctionQuery } from "~/hooks/useAuction";

export const AuctionDetailPage = () => {
  const router = useRouter()
  const [auctionId, setAuctionId] = useState<string>()

  useEffect(() => {
    if (router.query.auctionId) {
      if (!Array.isArray(router.query.auctionId))
        setAuctionId(router.query.auctionId)
    }
  }, [router])

  const { data: auction } = useAuctionQuery(auctionId)


  if (auction) {
    const nextBidValue = (auction.high_bid_value ?? 0) + auction.increment
    return (<>
      <h1>{auction.name}</h1>
      <p>status: {auction.status}</p>
      <p>current High Bid:{auction.high_bid_value}</p>
      <p>{auction.description}</p>
      <Link href={`/charities/${auction.charity_id}`}>
        <p>supports {auction.charity_id}</p>
      </Link>
      <button>
        Bid ${nextBidValue} now
      </button>
    </>)
  }
}

