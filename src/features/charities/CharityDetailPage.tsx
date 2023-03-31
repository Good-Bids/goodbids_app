import { useCharityQuery } from "../../hooks/useCharity"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

interface CharityDetailPageProps {
  charityId: string
}

export const CharityDetailPage = () => {
  const router = useRouter()
  const [charityId, setCharityId] = useState<string>()

  useEffect(() => {
    if (router.query.charityId) {
      if (!Array.isArray(router.query.charityId))
        setCharityId(router.query.charityId)
    }

  }, [router])

  const { data: charity } = useCharityQuery(charityId)
  if (charity) {
    // const totalRaised = charity.auctions.reduce((prior, current) => prior += current.high_bid_value ?? 0, 0)
    // const memberSinceDate = new Date(charity.created_at ?? '')
    // const formattedMemberSinceDate = `${memberSinceDate.getMonth}/ ${memberSinceDate.getFullYear()}`
    return <>
      <h1 className="text-4xl text-left text-lime-700">{charity.name}</h1>
      {/* <p>{charity.auctions.length} auctions run</p>
      <p>${totalRaised} raised</p> */}
      <p>active since {charity.created_at}</p>
      <h2>Auction history</h2>
      {/* <ol>{charity.auctions.map(auction => (<li key={auction.auction_id}><h4>{auction.name}</h4><p>{auction.created_at}</p></li>))}</ol> */}

    </>
  }
}

