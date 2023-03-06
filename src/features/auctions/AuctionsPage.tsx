import { InferGetServerSidePropsType } from "next";

import { getServerSideProps } from "~/pages/auctions";
import { AppLayoutWrapper } from "~/shared/components/layout/AppLayoutWrapper";


type AuctionPageProps = InferGetServerSidePropsType<typeof getServerSideProps>

export const AuctionsPage = ({ auctions }: AuctionPageProps) => {
  if (auctions) {
    return <ul>
      {auctions.map((item) =>
        <li key={item.id}>
          <h1>{item.name}</h1>
          <p>{item.description}</p>
        </li>)}
    </ul>
  }
}

