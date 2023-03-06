import { InferGetServerSidePropsType } from "next";

import { getServerSideProps } from "~/pages/charities/[charityId]";
import { AppLayoutWrapper } from "~/shared/components/layout/AppLayoutWrapper";


type CharityDetailPageProps = InferGetServerSidePropsType<typeof getServerSideProps>

export const CharityDetailPage = ({ charity }: CharityDetailPageProps) => {
  if (charity) {
    console.log(charity)
    const totalRaised = charity.auctions.reduce((prior, current) => prior += current.high_bid_value ?? 0, 0)
    const memberSinceDate = new Date(charity.created_at ?? '')
    const formattedMemberSinceDate = `${memberSinceDate.getMonth}/ ${memberSinceDate.getFullYear()}`
    return <>
      <h1 className="text-4xl text-left text-lime-700">{charity.name}</h1>
      <p>{charity.auctions.length} auctions run</p>
      <p>${totalRaised} raised</p>
      <p>active since {charity.created_at}</p>
      <h2>Auction history</h2>
      <ol>{charity.auctions.map(auction => (<li key={auction.id}><h4>{auction.name}</h4><p>{auction.created_at}</p></li>))}</ol>

    </>
  }
}

