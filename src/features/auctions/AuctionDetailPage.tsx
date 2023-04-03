import Image from 'next/image'
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "~/components/Button";
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

  const imageUrl = `https://imjsqwufoypzctthvxmr.supabase.co/storage/v1/object/public/auction-assets/${auction?.auction_id}/sample-item-1298792.jpg`



  if (auction) {
    const currentHighBid = auction.high_bid_value ?? 0
    const nextBidValue = currentHighBid + auction.increment
    return (<>
      <h1 className="text-6xl text-black font-bold">{auction.name}</h1>
      <Image src={imageUrl} alt={'item to be won'} width={240} height={240} />
      <p>status: {auction.status}</p>
      <p>current High Bid: ${currentHighBid}</p>
      <p>{auction.description}</p>
      <p >supports{' '}
        <Link href={`/charities/${auction.charity_id}`} className="hover:underline decoration-screaminGreen">
          {auction.charity_id}
        </Link>
      </p>
      <Button
        text={`Bid $${nextBidValue} now`}
        color='bottleGreen'
        textColor='screaminGreen'
        onClick={() => console.log('bid!')} />
    </>)
  }
}

