import { CharityDetailPage } from "~/features/charities/CharityDetailPage";
import { supabase } from "~/server/api/supabase";

export async function getServerSideProps({ charityId }: { charityId: string }) {

  const { data: charityData } = await supabase.from('charity').select().eq('id', 1)

  const auctionIds = (charityData?.[0]?.events ?? []).map(item => Number(item))
  const bidderIds = (charityData?.[0]?.bidders ?? []).map(item => Number(item))
  const itemIds = charityData?.[0]?.items ?? []

  const { data: auctionData } = await supabase.from('auction').select().in('id', auctionIds)
  const { data: bidderData } = await supabase.from('bidder').select().in('id', bidderIds)
  const { data: itemData } = await supabase.from('item').select().in('id', itemIds)

  const charity = { ...charityData?.[0], auctions: auctionData ?? [], bidders: bidderData, items: itemData, auctionIds, charityData }

  return {
    props: {
      charity
    },
  }
}
export default CharityDetailPage;