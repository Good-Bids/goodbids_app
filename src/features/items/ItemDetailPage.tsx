import { InferGetServerSidePropsType } from "next";

import { getServerSideProps } from "~/pages/items/[itemId]";


type ItemDetailPageProps = InferGetServerSidePropsType<typeof getServerSideProps>

export const ItemDetailPage = ({ item }: ItemDetailPageProps) => {
  if (item) {
    return (<>
      <h1>{item.name}</h1>
      <h3>{item.id}</h3>
      <p>value: {item.value}</p>
      <p>description: {item.description}</p>
      {item.auction && (
        <p>assigned to  {item.auction.name}</p>
      )}
    </>)
  }
}

