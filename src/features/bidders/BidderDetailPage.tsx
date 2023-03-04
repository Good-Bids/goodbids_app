import { InferGetServerSidePropsType } from "next";

import { getServerSideProps } from "~/pages/bidders/[bidderId]";


type BidderDetailPageProps = InferGetServerSidePropsType<typeof getServerSideProps>

export const BidderDetailPage = ({ bidder }: BidderDetailPageProps) => {
  if (bidder) {
    const activity = [...bidder.bids, ...bidder.interactions].sort((a, b) => Number(new Date(b.created_at ?? '')) - Number(new Date(a.created_at ?? '')))

    const memberSinceDate = new Date(bidder.created_at ?? '')
    const formattedMemberSinceDate = `${memberSinceDate.getMonth}/ ${memberSinceDate.getFullYear()}`
    return <>
      <h1>Hi, {bidder.name}!</h1>
      <p>{bidder.bids.length} lifetime bids</p>
      <p>member since {formattedMemberSinceDate}</p>
      <h2>Recent Activity</h2>
      <ol>{activity.map(item => (<li><h4>{item.id}</h4></li>))}</ol>

    </>
  }
}

