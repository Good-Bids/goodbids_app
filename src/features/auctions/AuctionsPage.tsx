
interface Auction {id:string; name:string;description:string}

interface AuctionPageProps {auctions: Auction[]}

export const AuctionsPage = (data:AuctionPageProps) => {
  const {auctions}= data
  return <ul>{auctions.map((item)=><li key={item.id}><h1>{item.name}</h1><p>{item.description}</p></li>)}</ul>
}

