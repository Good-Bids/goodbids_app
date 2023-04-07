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
export type T_AuctionModelExtended = {
    allowed_free_bids: string[] | null
    auction_id: string
    bid_currency: string | null
    charity_id: string
    created_at: string | null
    description: string
    high_bid_value: number | null
    increment: number
    item_id: string | null
    minimum_bids: number | null
    name: string
    opening_bid_value: number
    over_bid_good_time_active: boolean | null
    over_bid_good_time_early_fee: number | null
    over_bid_good_time_late_fee: number | null
    over_bid_good_time_often_fee: number | null
    over_bid_good_time_threshold_field: Json | null
    status: string
    top_bid_duration: number | null
    type: string
    bids?: I_BidsCollection
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