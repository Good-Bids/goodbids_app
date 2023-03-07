import { InferGetServerSidePropsType } from "next";
import Link from "next/link";

import { getServerSideProps } from "~/pages/auctions";


type AuctionPageProps = InferGetServerSidePropsType<typeof getServerSideProps>

export const AuctionsPage = ({ auctions }: AuctionPageProps) => {
  if (auctions) {
    return <ul>
      {auctions.map((auction) =>
        <li key={auction.auction_id}>
          <Link href={`/auctions/${auction.auction_id}`}>
            <h1>{auction.name}</h1>
            <p>{auction.description}</p>
            <p>{auction.charity_id}</p>
          </Link>
        </li>)}
    </ul>
  }
}

