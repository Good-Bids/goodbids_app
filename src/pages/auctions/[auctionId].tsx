import { AuctionDetailPage } from "~/features/auctions/AuctionDetailPage";
import { supabase } from "~/server/api/supabase";

export async function getServerSideProps({auctionId}:{auctionId:string}) {
  
  const {data:auctionData} = await supabase.from('auction').select().eq('id',auctionId)
  
  const bidIds = auctionData?.[0]?.bids
  const {data:bidData} = await supabase.from('bids').select().eq('id',bidIds)

  return {
    props: {
      auction: auctionData?.[0],
      bids: bidData?.[0]
    },
  }
}
export default AuctionDetailPage;