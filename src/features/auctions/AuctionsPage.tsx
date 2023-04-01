import Link from "next/link";
import { useAuctionsQuery } from "~/hooks/useAuction";



export const AuctionsPage = () => {

  const { data: auctions } = useAuctionsQuery()

  if (auctions) {
    return (<>
      <h1 className="text-6xl text-black font-bold">Auctions</h1>
      <div>
        <ul>
          {auctions.map((auction) =>
            <li key={auction.auction_id}>
              <div className="border-solid">
                <Link href={`/auctions/${auction.auction_id}`}>
                  <h1>{auction.name}</h1>
                  <p>{auction.description}</p>
                  <p>{auction.charity_id}</p>
                </Link>
              </div>
            </li>)}
        </ul>
      </div>
    </>
    )
  }
}

