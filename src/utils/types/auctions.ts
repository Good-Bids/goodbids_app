/**
 * File contains: 
 * 
 * Types and Interface implementations that cover usage
 * of the data layer <==> display layer
 * 
 */
import { Database, Json } from "./supabase"

/** Convenience wrapper - from supabase.ts */
export type T_AuctionModel = Database['public']['Tables']['auction']['Row'];
export type T_AuctionBid = Database['public']['Tables']['bid']['Row'];

/** 
 * Nested Types from Supabase require over rides in the return ( a cast ) 
 * or make a new model manually. Probably the commented out cast in the useAuction
 * getAuctions is possible, but regardless the auctions need to be manually edited
 * to contain bids[]
 */
interface T_AuctionModelExtended extends T_AuctionModel {
    bids: I_BidsCollection
}

export interface I_AuctionModel {
    auction: T_AuctionModelExtended
}

export interface I_AuctionCollection {
    auctions: T_AuctionModelExtended[] | []
}

export interface I_BidsCollection {
    bids: T_AuctionBid[] | undefined
}