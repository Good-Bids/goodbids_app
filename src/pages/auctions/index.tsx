import { AuctionsPage } from "~/features/auctions/AuctionsPage";
import { supabase } from "~/server/api/supabase";

export async function getServerSideProps() {
  const {data} = await supabase.from('auction').select()
  
  return {
    props: {
      auctions: data
    },
  }
}
export default AuctionsPage;