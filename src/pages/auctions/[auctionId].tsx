import { AuctionDetailPage } from "~/features/auctions/AuctionDetailPage";
import { supabase } from "~/server/api/supabase";

export async function getServerSideProps({ auctionId }: { auctionId: string }) {

  const numericalId = new Number(auctionId)

  const { data: auctionData } = await supabase.from('auction').select().eq('id', 3)

  const bidIds = auctionData?.[0]?.bids ?? [null]
  const charityId = auctionData?.[0]?.charity ?? null
  const { data: bidData } = await supabase.from('bids').select().in('id', bidIds)
  const { data: charityData } = await supabase.from('charity').select().eq('id', charityId)

  return {
    props: {
      auction: {
        ...auctionData?.[0],
        // bids: bidData?.[0],
        charity: charityData?.[0]
      }
    },
  }
}
export default AuctionDetailPage;