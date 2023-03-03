import { BidderDetailPage } from "~/features/bidders/BidderDetailPage";
import { supabase } from "~/server/api/supabase";

export async function getServerSideProps({bidderId}:{bidderId:string}) {
  
  const {data:bidderData} = await supabase.from('bidder').select().eq('id',bidderId)
  const interactionIds = bidderData?.[0]?.interactions
  const bidIds = bidderData?.[0]?.bids
  
  const {data:interactionData} = await supabase.from('bidder_interaction').select().eq('id',interactionIds)
  const {data:bidData} = await supabase.from('bid').select().eq('id',bidIds)
  
  const bidder = {...bidderData,bids:bidData ?? [],interactions:interactionData ?? []}

  return {
    props: {
      bidder
    },
  }
}
export default BidderDetailPage;