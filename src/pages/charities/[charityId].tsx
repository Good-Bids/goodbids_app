import { CharityDetailPage } from "~/features/charities/CharityDetailPage";
import { supabase } from "~/server/api/supabase";

export async function getServerSideProps({charityId}:{charityId:string}) {
  
  const {data:charityData} = await supabase.from('charity').select().eq('id',charityId)
  
  const auctionIds = charityData?.[0]?.events
  const bidderIds = charityData?.[0]?.bidders
  const itemIds = charityData?.[0]?.items
  
  const {data:auctionData} = await supabase.from('auction').select().eq('id',auctionIds)
  const {data:bidderData} = await supabase.from('bidder').select().eq('id',bidderIds)
  const {data:itemData} = await supabase.from('item').select().eq('id',itemIds)
  
  const charity = {...charityData, auctions:auctionData?? [], bidders:bidderData, items:itemData}

  return {
    props: {
      charity
    },
  }
}
export default CharityDetailPage;