import { InferGetServerSidePropsType } from "next";

import { getServerSideProps } from "~/pages/auctions/[auctionId]";
import { AppLayoutWrapper } from "~/shared/components/layout/AppLayoutWrapper";


type AuctionDetailPageProps = InferGetServerSidePropsType<typeof getServerSideProps>

export const AuctionDetailPage = ({ auction }: AuctionDetailPageProps) => {
  if (auction) {
    return <>
      <h1>{auction.name}</h1>
      <p>status: {auction.status}</p>
      <p>{auction.bids.length} bids</p>
      <p>current High Bid:{auction.high_bid_value}</p>
      <p>{auction.description}</p>
    </>
  }
}

